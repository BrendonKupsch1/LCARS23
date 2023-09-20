//<reference path="../globals.ts" />
/* MemoryAccessor
Memory Accessor is for reading and writing to memory */

module TSOS {

    export class MemoryAccessor {

        constructor() {

        }

        // Read and write to memory
        public read(pcb: TSOS.ProcessControlBlock, addr: number) {
            if (addr >= 0) {
                return _Memory.getByte(pcb.baseRegister + addr);
            }
            else {
                alert('Memory Access Violation: Negative Address');
            }
        }

        public write(pcb: TSOS.ProcessControlBlock, addr: number, data: string) {
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
}