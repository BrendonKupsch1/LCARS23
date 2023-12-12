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


        }

        public createBlock(): string[] {
            // creates block with array size of 64
            let block = new Array(64);

            return block;
        }

        public createFile(fileName: string): boolean {
            // create a file starting at directory block 001
            
        }

        public createSwapFile(pid: number, fileData: string): boolean {
            var fileName = "@swap" + pid;

            
        }

        public nextDirectoryEntry(): string {
            // finds next directory entry to store filename that is being created

        }

        public nextDataEntry(): string {
            // finds next data entry to store file data

        }
        
        public readFile(): string {
            // read file data from data block

        }

        public writeFile(): boolean {
            // write file data to data block

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

        

    }





}