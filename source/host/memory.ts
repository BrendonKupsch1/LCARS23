//<reference path="../globals.ts" />

/*
 Using GitHub Copilot to help write this code.
 https://copilot.github.com/ 

 Copilot notes:
 Copilot will begin brackets but rarely predicts closing brackets, leading to some annoying formatting problems that need to be manually fixed. 
 Copilot is extremely helpful for commenting code. It does a very good job at reading your code and creating a comment very close to what I would write myself.
 After using GitHub Copilot for some time, it is worth the price of admission for commenting alone. I save so much time not having to write comments myself. (Coding is easier than commenting)

 Copilot does not write the code for you line for line, but is very good at finishing half a line I've already written.
 Copilot is also very good at basic functions like the operational codes. I think this is becasue it has a large database of OS students who wrote very similar code.
 

 My brother Evan Kupsch helped me with memeory and pcb implementation, and with difficult errors that I was having trouble with.
 */
 

module TSOS {

    export class Memory {

        public memory;

        // 768 bytes of memory (0 - 767)
        constructor(length: number) {
            this.memory = new Array(length);
        }

        public init() {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
        }

        // Read and write to memory
        public getByte(address: number) {
            return this.memory[address];
        }

        public setByte(address: number, data: string) {
            if (data.length == 1) {
                data = "0" + data;
            }
            this.memory[address] = data;
        }


        public getSize() {
            return this.memory.length;
        }

        // used for clear shell command
        public clearMemory() {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
        }

        // used when a process is terminated
        public clearRange(base: number, limit: number): void {
            for (var i = 0; i < (limit - base); i++) {
                this.memory[i + base] = "00";
            }
        }
    }
}