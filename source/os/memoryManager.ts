/* 
memoryManager.ts
Memory Manager is for managing memory
*/

module TSOS {

    const numPrograms = 3;

    export class MemoryManager {


        public residentList: TSOS.ProcessControlBlock[];

        public readyQueue: TSOS.Queue;

        private allocated;

        constructor() {
            this.residentList = [];
            this.readyQueue = new Queue();
            this.allocated = new Array(numPrograms);
            for (var i = 0; i < this.allocated.length; i++) {
                this.allocated[i] = -1;
            }

        }

        public load(program: Array<string>, priority: number): number {
            var pcb = new ProcessControlBlock(priority);
            this.residentList[pcb.processID] = pcb;
            pcb.processState = "Resident";
            this.allocateMemory(pcb, program);
            TSOS.Control.updatePcbDisplay(true, pcb);
            return pcb.processID;
        }

        
        public allocateMemory(pcb: TSOS.ProcessControlBlock, program: Array<string>): void {
            for (var i = 0; i < this.allocated.length; i++) {
                if (this.allocated[i] === -1) {
                    this.allocated[i] = pcb.processID;
                    pcb.baseRegister = i * 256;
                    pcb.limitRegister = pcb.baseRegister + 255;
                    pcb.isInMemory = true;
                    break;
                }
            }
            // if there is no available memory
            if (!pcb.isInMemory) {
                pcb.isInMemory = false;
                var programStr = "";
                for (var i = 0; i < program.length; i++) {
                    programStr += program[i] + " ";
                }
            }
            // puts the program into memory
            else {
                for (var i = 0; i < 256; i++) {
                    var code = program[i];
                    if (code === undefined) {
                        code = "00";
                    }
                    _Memory.setByte(pcb.baseRegister + i, code);
                }

            }
            TSOS.Control.updateMemoryDisplay();

        }

        public deallocateMemory(pcb: TSOS.ProcessControlBlock): void {
            for (var i = 0; i < this.allocated.length; i++) {
                if (this.allocated[i] === pcb.processID) {
                    this.allocated[i] = -1;
                    _Memory.clearRange(pcb.baseRegister, pcb.limitRegister);
                    break;
                }
            }
        }

        public doesProcessExist(pid: number): boolean {
            if (this.residentList[pid] !== undefined) {
                return true;
            }
            return false;
        }

        public getAllRunningProcesses(): TSOS.ProcessControlBlock[] {
            var processes: TSOS.ProcessControlBlock[] = [];
            for (var i = 0; i < this.residentList.length; i++) {
                var pcb = this.residentList[i];
                if (pcb.processState === "Running" || pcb.processState === "Ready" || pcb.processState === "Resident") {
                    processes.push(pcb);
                }
            }
            return processes;
        }


    }
}