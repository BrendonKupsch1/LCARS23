//<reference path="../globals.ts" />
/* MemoryAccessor
Memory Accessor is for reading and writing to memory */
var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
        }
        // Read and write to memory
        read(pcb, addr) {
            if (addr >= 0) {
                return _Memory.getByte(pcb.baseRegister + addr);
            }
            else {
                alert('Memory Access Violation: Negative Address');
            }
        }
        write(pcb, addr, data) {
            if (addr >= 0 && addr < 256) {
                if (parseInt(data, 16) > 255) {
                    alert('Memory Access Violation: Data out of bounds');
                }
                else {
                    _Memory.setByte(pcb.baseRegister + addr, data);
                }
            }
            else {
                alert('Memory Access Violation: Address out of bounds');
            }
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map