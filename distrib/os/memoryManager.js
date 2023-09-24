/*
memoryManager.ts
Memory Manager is for managing memory
*/
var TSOS;
(function (TSOS) {
    const numPrograms = 3;
    class MemoryManager {
        residentList;
        readyQueue;
        allocated;
        constructor() {
            this.residentList = [];
            this.readyQueue = new TSOS.Queue();
            this.allocated = new Array(numPrograms);
            for (var i = 0; i < this.allocated.length; i++) {
                this.allocated[i] = -1;
            }
        }
        load(program, priority) {
            var pcb = new TSOS.ProcessControlBlock(priority);
            this.allocateMemory(pcb, program);
            return pcb.processID;
        }
        allocateMemory(pcb, program) {
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
        deallocateMemory(pcb) {
            for (var i = 0; i < this.allocated.length; i++) {
                if (this.allocated[i] === pcb.processID) {
                    this.allocated[i] = -1;
                    _Memory.clearRange(pcb.baseRegister, pcb.limitRegister);
                    break;
                }
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map