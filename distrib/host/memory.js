//<reference path="../globals.ts" />
/*
 Using GitHub Copilot to help write this code.
 https://copilot.github.com/

 Copilot notes:
 Copilot will begin brackets but rarely predicts closing brackets, leading to some annoying formatting problems that need to be manually fixed.
 Copilot is extremely helpful for commenting code. It does a very good job at reading your code and creating a comment very close to what I would write myself.
 Copilot does not write the code for you line for line, but is very good at finishing half a line I've already written.

 My brother Evan Kupsch also helped me with the memory implemenation. He was equally as helpful as Copilot but hes not $10 a month.
 */
var TSOS;
(function (TSOS) {
    class Memory {
        memory;
        // 768 bytes of memory (0 - 767)
        constructor(length) {
            this.memory = new Array(length);
        }
        init() {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
        }
        // Read and write to memory
        getByte(address) {
            return this.memory[address];
        }
        setByte(address, data) {
            if (data.length == 1) {
                data = "0" + data;
            }
            this.memory[address] = data;
        }
        getSize() {
            return this.memory.length;
        }
        // used for clear shell command
        clearMemory() {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
        }
        // used when a process is terminated
        clearRange(base, limit) {
            for (var i = 0; i < (limit - base); i++) {
                this.memory[i + base] = "00";
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map