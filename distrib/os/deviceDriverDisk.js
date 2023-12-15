/* -----------------
    deviceDriverDisk.ts

    Device Driver Disk
----------------- */
var TSOS;
(function (TSOS) {
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor() {
            super();
            this.driverEntry = this.krnDiskDriverEntry;
        }
        krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
        }
        format() {
            // format the disk
            _Kernel.krnTrace("Formatting disk.");
            var block = this.createBlock();
            for (var i = 0; i < _Disk.numTracks; i++) {
                for (var j = 0; j < _Disk.numSectors; j++) {
                    for (var k = 0; k < _Disk.numBlocks; k++) {
                        // check for master boot record
                        if ((i == 0) && (j == 0) && (k == 0)) {
                            block[0] = "1";
                            sessionStorage.setItem(i + "," + j + "," + k, block.join(" "));
                            block[0] = "0";
                        }
                        else {
                            sessionStorage.setItem(i + "," + j + "," + k, block.join(" "));
                        }
                    }
                }
            }
            _Kernel.krnTrace("Disk formatted.");
            TSOS.Control.updateDiskDisplay();
        }
        createBlock() {
            // creates block with array size of 64
            let block = new Array(64);
            for (var i = 0; i < 4; i++) {
                block[i] = "0";
            }
            for (var j = 0; j < block.length; j++) {
                block[j] = "-";
            }
            return block;
        }
        createFile(fileName) {
            // create a file starting at directory block 001
            var fileTSB = this.getFileTSB(fileName);
            if (fileTSB != null) {
                return false;
            }
            else {
                var directoryEntry = this.nextDirectoryEntry();
                var dataEntry = this.nextDataEntry();
                var directoryEntryData = this.createBlock();
                var dataEntryData = this.createBlock();
                directoryEntryData[0] = "1";
                dataEntryData[0] = "1";
                var dataEntrySplit = dataEntry.split(",");
                directoryEntryData[1] = dataEntrySplit[0];
                directoryEntryData[2] = dataEntrySplit[1];
                directoryEntryData[3] = dataEntrySplit[2];
                for (var i = 0; i < fileName.length; i++) {
                    directoryEntryData[i + 4] = this.decimalToHex(fileName.charCodeAt(i));
                }
                sessionStorage.setItem(directoryEntry, directoryEntryData.join(" "));
                sessionStorage.setItem(dataEntry, dataEntryData.join(" "));
                return true;
            }
        }
        createSwapFile(pid, fileData) {
            var fileName = "@swap" + pid;
            if (this.createFile(fileName)) {
                if (this.writeFile(fileName, fileData, true)) {
                    alert("Swap file " + fileName + " created.");
                }
                else {
                    alert("Writing to file " + fileName + " failed.");
                    return false;
                }
            }
            else {
                alert("Creating file " + fileName + " failed.");
                return false;
            }
            return true;
        }
        nextDirectoryEntry() {
            // finds next directory entry to store filename that is being created
            for (var i = 0; i < _Disk.numSectors; i++) {
                for (var j = 0; j < _Disk.numTracks; j++) {
                    var data = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    if (data[0] === "0") {
                        return "0," + i + "," + j;
                    }
                }
            }
            return null;
        }
        nextDataEntry() {
            // finds next data entry to store file data
            for (var i = 1; i < _Disk.numTracks; i++) {
                for (var j = 0; j < _Disk.numSectors; j++) {
                    for (var k = 0; k < _Disk.numBlocks; k++) {
                        var data = sessionStorage.getItem(i + "," + j + "," + k);
                        if (data[0] === "0") {
                            return i + "," + j + "," + k;
                        }
                    }
                }
            }
            return null;
        }
        readFile(fileName, fileLoc, fileData, hexFile) {
            // read file data from data block
            if (hexFile == undefined) {
                hexFile = false;
            }
            if (fileData == undefined) {
                fileData = "";
            }
            var fileDataTSB;
            if (fileName == undefined && fileLoc != undefined) {
                fileDataTSB = fileLoc;
            }
            else {
                fileDataTSB = this.getFileDataTSB(fileName);
            }
            if (fileDataTSB != null) {
                var fileDataArr = sessionStorage.getItem(fileDataTSB);
                let splitFileDataArr = fileDataArr.split(" ");
                for (var i = 4; i < splitFileDataArr.length; i++) {
                    if (hexFile) {
                        fileData += splitFileDataArr[i];
                    }
                    else {
                        fileData += String.fromCharCode(parseInt(splitFileDataArr[i], 16));
                    }
                }
                if (splitFileDataArr[1] != "-") {
                    var nextLoc = splitFileDataArr[1] + "," + splitFileDataArr[2] + "," + splitFileDataArr[3];
                    return this.readFile(undefined, nextLoc, fileData, hexFile);
                }
                return fileData;
            }
            else {
                return null;
            }
        }
        writeFile(fileName, fileData, hexFile, nextDataTSB) {
            // write file data to data block
            // find tsb of directory entry with file name
            // go into tsb to get just the fileName
            // write that data to the data tsb
            var fileDataTSB = this.getFileDataTSB(fileName);
            if (fileDataTSB != null) {
                var dataBlock = this.createBlock();
                if (fileData.length <= 60) {
                    for (var i = 0; i < fileData.length; i++) {
                        if (hexFile) {
                            dataBlock[i + 4] = fileData.charAt(i);
                        }
                        else {
                            dataBlock[i + 4] = this.decimalToHex(fileData.charCodeAt(i));
                        }
                    }
                    dataBlock[0] = "1";
                    var newDataLoc;
                    if (nextDataTSB != undefined) {
                        newDataLoc = nextDataTSB;
                    }
                    else {
                        newDataLoc = fileDataTSB;
                    }
                    sessionStorage.setItem(newDataLoc, dataBlock.join(" "));
                }
                else {
                    var newDataBlock = this.createBlock();
                    for (var j = 0; j < 60; j++) {
                        if (hexFile) {
                            newDataBlock[j + 4] = fileData.charAt(j);
                        }
                        else {
                            newDataBlock[j + 4] = this.decimalToHex(fileData.charCodeAt(j));
                        }
                    }
                    newDataBlock[0] = "1";
                    var newDataLoc;
                    if (nextDataTSB != undefined) {
                        newDataLoc = nextDataTSB;
                    }
                    else {
                        newDataLoc = fileDataTSB;
                    }
                    sessionStorage.setItem(newDataLoc, newDataBlock.join(" "));
                    var nextDataTSB = this.nextDataEntry();
                    var nextSplit = nextDataTSB.split(",");
                    var tempStorage = sessionStorage.getItem(newDataLoc).split(" ");
                    tempStorage[1] = nextSplit[0];
                    tempStorage[2] = nextSplit[1];
                    tempStorage[3] = nextSplit[2];
                    sessionStorage.setItem(newDataLoc, tempStorage.join(" "));
                    var dataStillLeft = fileData.substring(60, fileData.length);
                    return this.writeFile(fileName, dataStillLeft, hexFile, nextDataTSB);
                }
                return true;
            }
            else {
                return false;
            }
        }
        getFileDataTSB(fileName) {
            // takes fileName and returns the t,s,b of where the data in the file is stored
            let tsbFile = this.getFileTSB(fileName);
            if (tsbFile != null) {
                let tsbFileData = sessionStorage.getItem(tsbFile);
                return tsbFileData[1] + "," + tsbFileData[2] + "," + tsbFileData[3];
            }
            else {
                return null;
            }
        }
        getFileTSB(fileName) {
            // takes fileName and returns the t,s,b of where the file is stored
            for (let i = 0; i < _Disk.numSectors; i++) {
                for (let j = 0; j < _Disk.numBlocks; j++) {
                    let data = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    let usedBit = data[0];
                    let thisFileName = this.getFileName(data);
                    if (thisFileName == fileName) {
                        if (usedBit == "1") {
                            return "0," + i + "," + j;
                        }
                    }
                    else if (usedBit == "0") {
                        return null;
                    }
                }
            }
            return null;
        }
        getFileName(data) {
            // takes in block of data and returns filename
            let fileName = "";
            for (let i = 4; i < data.length; i++) {
                if (data[i] === "-") {
                    return fileName;
                }
                else {
                    fileName += String.fromCharCode(this.hexToDecimal(data[i]));
                }
            }
            return fileName;
        }
        deleteFile(fileName) {
            // delete file from disk
            var dataTSBtoDelete = this.getFileDataTSB(fileName);
            if (this.deleteFileDirectory(fileName) && this.deleteFileData(dataTSBtoDelete)) {
                return true;
            }
            else {
                return false;
            }
        }
        deleteFileData(dataTSBtoDelete) {
            // delete file data from data block
            if (dataTSBtoDelete != null) {
                var dataToDelete = sessionStorage.getItem(dataTSBtoDelete).split(" ");
                dataToDelete[0] = "0";
                if (dataToDelete[1] != "-") {
                    var nextDataTSB = dataToDelete[1] + "," + dataToDelete[2] + "," + dataToDelete[3];
                    dataToDelete[1] = "-";
                    dataToDelete[2] = "-";
                    dataToDelete[3] = "-";
                    for (var i = 4; i < 85; i++) {
                        dataToDelete[i] = "-";
                    }
                    sessionStorage.setItem(dataTSBtoDelete, dataToDelete.join(" "));
                    this.deleteFileData(nextDataTSB);
                }
                else {
                    for (var i = 4; i < 64; i++) {
                        dataToDelete[i] = "-";
                    }
                    sessionStorage.setItem(dataTSBtoDelete, dataToDelete.join(" "));
                    return true;
                }
            }
            else {
                return false;
            }
        }
        deleteFileDirectory(fileName) {
            // delete file directory
            var fileTSB = this.getFileTSB(fileName);
            if (fileTSB != null) {
                var dataToDelete = sessionStorage.getItem(fileTSB).split(" ");
                dataToDelete[0] = "0";
                dataToDelete[1] = "-";
                dataToDelete[2] = "-";
                dataToDelete[3] = "-";
                for (var i = 0; i < fileName.length; i++) {
                    dataToDelete[i + 4] = "-";
                }
                sessionStorage.setItem(fileTSB, dataToDelete.join(" "));
                return true;
            }
            else {
                return false;
            }
        }
        copyFile(fileName, newFileName) {
            // create new file then write existing file contents to new file
            var fileTSB = this.getFileTSB(fileName);
            var newTSB = this.getFileTSB(newFileName);
            if (fileTSB != null) {
                if (newTSB != null) {
                    this.createFile(newFileName);
                    this.writeFile(newFileName, this.readFile(fileName, undefined, undefined, undefined));
                    return true;
                }
                else {
                    alert("File " + newFileName + " already exists.");
                    return false;
                }
            }
            else {
                alert("File " + fileName + " does not exist.");
                return false;
            }
        }
        renameFile(fileName, newFileName) {
            // write over existing file name with new file name
            var fileTSB = this.getFileTSB(fileName);
            var oldFileTSB = this.getFileDataTSB(fileName);
            if (fileTSB != null) {
                var dataBlock = this.createBlock();
                for (var i = 0; i < newFileName.length; i++) {
                    dataBlock[i + 4] = this.decimalToHex(newFileName.charCodeAt(i));
                }
                dataBlock[0] = "1";
                var oldFileDataTSBSplit = oldFileTSB.split(",");
                dataBlock[1] = oldFileDataTSBSplit[0];
                dataBlock[2] = oldFileDataTSBSplit[1];
                dataBlock[3] = oldFileDataTSBSplit[2];
                sessionStorage.setItem(fileTSB, dataBlock.join(" "));
                return true;
            }
            else {
                return false;
            }
        }
        listFiles() {
            // list all files on disk
            var fileList = [];
            for (var i = 0; i < _Disk.numSectors; i++) {
                for (var j = 0; j < _Disk.numBlocks; j++) {
                    var data = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    // ignore master boot record
                    if (!((i == 0) && (j == 0))) {
                        if (data[0] == "1") {
                            var fileName = this.getFileName(data);
                            fileList[fileList.length] = fileName;
                        }
                    }
                }
            }
            return fileList;
        }
        decimalToHex(decimal) {
            return decimal.toString(16);
        }
        hexToDecimal(hex) {
            return parseInt(hex, 16);
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map