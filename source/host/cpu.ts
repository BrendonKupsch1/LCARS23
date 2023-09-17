/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public thisPCB:any = null) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.thisPCB = null;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }


        // cases for 6502a opcodes
        // my brother Evan Kupsch helped me with this part of the project
        public cpuCycle(): void {
            
            var command;
            var i;
            var str;
            var x;
            var y;
            var z;
            var hold;
            command = _Memory.mem[this.PC];
            if (_Scheduler.tab < _Scheduler.quantum) {
                switch (command) {
                    case "00":
                    case "0":
                        this.Operation = "00"; // BRK
                        if (_ReadyQueue.isEmpty() == false) {
                            this.thisPCB.state = "Complete";
                            this.thisPCB.PC = this.PC;
                            this.thisPCB.Acc = this.Acc;
                            this.thisPCB.Xreg = this.Xreg;
                            this.thisPCB.Yreg = this.Yreg;
                            this.thisPCB.Zflag = this.Zflag;
                            Control.runPCBTb1();
                            _KernalInterruptQueue.enqueue(new Interrupt(CPU_REPLACE_IRQ, 0));
                        }
                        else {
                            this.killProcess();
                        }
                        break;
                    case "A9":
                        this.Operation = "A9"; // LDA
                        this.PC++;
                        this.Acc = parseInt(_Memory.mem[this.PC], 16);
                        this.PC++;
                        break;
                    case "AD":
                        this.Operation = "AD"; // LDA
                        i = this.atMemory();
                        this.Acc = parseInt(_Memory.mem[i], 16);
                        this.PC++;
                        break;
                    case "8D":
                        this.Operation = "8D"; // STA
                        i = this.atMemory();
                        hold = this.Acc.toString(16);
                        if (hold.length<2) {
                            hold = "0" + hold;
                        }
                        _Memory.mem[i] = hold;
                        _Kernal.krnTrace("Strong " +hold+ " to memory");
                        this.PC++;
                        break;
                    case "6D":
                        this.Operation = "6D"; // ADC
                        i = this.atMemory();
                        x = this.parseConst(_Memory.mem[i]);
                        y = this.Acc;
                        z = x + y;
                        this.Acc
                        this.PC++;
                        break;
                    case "A2":
                        this.Operation = "A2"; // LDX
                        this.PC++;
                        this.Xreg = parseInt(_Memory.mem[this.PC], 16);
                        this.PC++;
                        break;
                    case "AE":
                        this.Operation = "AE"; // LDX
                        i = this.atMemory();
                        this.Xreg = parseInt(_Memory.mem[i], 16);
                        this.PC++;
                        break;
                    case "A0":
                        this.Operation = "A0"; // LDY
                        this.PC++;
                        this.Yreg = parseInt(_Memory.mem[this.PC], 16);
                        this.PC++;
                        break;
                    case "AC":
                        this.Operation = "AC"; // LDY
                        i = this.atMemory();
                        this.Yreg = parseInt(_Memory.mem[i], 16);
                        this.PC++;
                        break;
                    case "EA":
                        this.Operation = "EA"; // NOP
                        this.PC++;
                        break;
                    case "EC":
                        this.Operation = "EC"; // CPX
                        i = this.atMemory();
                        x = this.parseConst(_Memory.mem[i]);
                        y = this.Xreg;
                        if (x == y) {
                            this.Zflag = 1;
                        }
                        else {
                            this.Zflag = 0;
                        }
                        this.PC++;
                        break;
                    case "D0":
                        this.Operation = "D0"; // BNE
                        ++this.PC;
                        var branch = this.PC + this.parseConst(_Memeory.mem[this.PC]);
                        if (this.Zflag == 0) {
                            this.PC = branch + 1;
                            if (this.PC > 255 + this.thisPCB.base) {
                                this.PC -= 256;
                            }
                        }
                        else {
                            this.PC++;
                        }
                        break;
                    case "EE":
                        this.Operation = "EE"; // INC
                        i = this.atMemory();
                        x = this.parseInt(_Memory.mem[i]);
                        x = x + 1;
                        hold = x.toString(16);
                        


            }
    }
}
