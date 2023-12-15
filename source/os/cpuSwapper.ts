/* ---------------
    cpuSwapper.ts

    CPU Swapper
    The swapper works with the CPU schelduer and CPU dispatcher to swap processes in and out of memory
    ------------ */

    module TSOS {

        export class CpuSwapper {
            public rollOutData: string;
            public rollInData: string;
    
            constructor() {
                this.rollOutData = "";
                this.rollInData = "";
            }
    
            public rollIn(diskPCB: ProcessControlBlock, segment: number) {
                // roll in process from disk
                this.rollInData = _krnDiskDriver.readFile("@swap" + diskPCB.processID, undefined, undefined, undefined);
                var writeByte = "";
                var addressCount = 0;
                if (segment == 0) {
                    diskPCB.baseRegister = 0;
                    diskPCB.limitRegister = 255;
                    diskPCB.memSegment = segment;
                }
                else if (segment == 1) {
                    diskPCB.baseRegister = 256;
                    diskPCB.limitRegister = 511;
                    diskPCB.memSegment = segment;
                }
                else if (segment == 2) {
                    diskPCB.baseRegister = 512;
                    diskPCB.limitRegister = 767;
                    diskPCB.memSegment = segment;
                }
                _Memory.clearRange(diskPCB.baseRegister, diskPCB.limitRegister);
                for (var i = 0; i < ((diskPCB.limitRegister - diskPCB.baseRegister) * 2); i += 2) {
                    if (this.rollInData && i < (this.rollInData.length - 2)) {
                        if (i < (this.rollInData.length - 2)) {
                            writeByte = this.rollInData.charAt(i) + this.rollInData.charAt(i + 1);
                            if (!((writeByte.charCodeAt(0) == 0) && (writeByte.charCodeAt(1) == 0))) {
                                _MemoryAccessor.write(diskPCB, addressCount, writeByte);
                                addressCount++;
                            }
                        }
                    }
                }
                diskPCB.isInMemory = true;
                var fileName = "@swap" + diskPCB.processID;
                if (_krnDiskDriver.deleteFile(fileName)) {
                    alert("File " + fileName + " deleted.");
                }
                TSOS.Control.updateMemoryDisplay();
                TSOS.Control.updateDiskDisplay();
            }
    
            public rollOut(memoryPCB: ProcessControlBlock) {
                // roll out process to disk
                for (var i = 0; i < (memoryPCB.limitRegister - memoryPCB.baseRegister); i++) {
                    this.rollOutData += _MemoryAccessor.read(memoryPCB, i) + " ";
                }
                this.rollOutData.trim();
                _Memory.clearRange(memoryPCB.baseRegister, memoryPCB.limitRegister);
                memoryPCB.memSegment = -1;
                memoryPCB.baseRegister = -1;
                memoryPCB.limitRegister = -1;
                _krnDiskDriver.createSwapFile(memoryPCB.processID, this.rollOutData);
                this.rollOutData = "";
                TSOS.Control.updateDiskDisplay();
            }
        }
    }