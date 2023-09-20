/* 
memoryManager.ts
Memory Manager is for managing memory
*/

module TSOS {

    export class MemoryManager {

        private allocated;

        constructor() {
        }

        public load(program: Array<string>, priority: number): number {
            var pcb = new ProcessControlBlock(priority);
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
                }

            }

        }

    }
}