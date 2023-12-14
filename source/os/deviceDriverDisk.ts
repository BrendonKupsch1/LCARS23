/* -----------------
    deviceDriverDisk.ts

    Device Driver Disk
----------------- */

module TSOS {

    export class DeviceDriverDisk extends DeviceDriver {

        constructor() {
            super();
            this.driverEntry = this.krnDiskDriverEntry;
        }

        public krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
        }

        public format() {
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

        public createBlock(): string[] {
            // creates block with array size of 64
            let block = new Array(64);

            return block;
        }

        public createFile(fileName: string): boolean {
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

        public createSwapFile(pid: number, fileData: string): boolean {
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

        public nextDirectoryEntry(): string {
            // finds next directory entry to store filename that is being created
            for (var i = 0; i < _Disk.numSectors; i++) {
                for (var j = 0; j < _Disk.numTracks; j++) {
                    var data = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    if (data[0] == "0") {
                        return "0," + i + "," + j;
                    }
                }
            }
            return null;
        }

        public nextDataEntry(): string {
            // finds next data entry to store file data
            for (var i = 1; i < _Disk.numSectors; i++) {
                for (var j = 0; j < _Disk.numTracks; j++) {
                    var data = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    if (data[0] == "0") {
                        return "0," + i + "," + j;
                    }
                }
            }
        }
        
        public readFile(fileName: string, fileLoc: string, fileData: string, hexFile: boolean): string {
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

        public writeFile(fileName: string, fileData: string, hexFile?: boolean, nextDataTSB?: string): boolean {
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

        public getFileDataTSB(fileName: string): string {
            // takes fileName and returns the t,s,b of where the data in the file is stored

        }

        public getFileTSB(fileName: string): string {
            // takes fileName and returns the t,s,b of where the file is stored

        }

        public deleteFile(fileName: string): boolean {
            // delete file from disk

        }

        public deleteFileData(fileName: string): boolean {
            // delete file data from data block

        }
        
        public deleteFileDirectory(fileName: string): boolean {
            // delete file directory

        }

        public copyFile(fileName: string, newFileName: string): boolean {
            // create new file then write existing file contents to new file

        }

        public renameFile(fileName: string, newFileName: string): boolean {
            // write over existing file name with new file name

        }

        public listFiles(): string[] {
            // list all files on disk
            var fileList = [];


            return fileList;
        }

        public decimalToHex(decimal: number): string {
            return decimal.toString(16);
        }

        public hexToDecimal(hex: string): number {
            return parseInt(hex, 16);
        }
    }
}