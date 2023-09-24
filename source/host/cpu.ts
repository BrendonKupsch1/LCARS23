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
                    public instruction: string = "N/A",
                    public currentPCB: TSOS.ProcessControlBlock = null) {

        }

        public init(): void {
        }

        public cycle(): void {
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            if (this.currentPCB !== null && this.isExecuting) {
                _Kernel.krnTrace('CPU cycle');
                this.instruction = _MemoryAccessor.read(this.currentPCB, this.PC);

                switch(this.instruction) {
                    case 'A9': // load the accumulator with a constant
                        this.loadAccWithConstant();
                        break;
                    case 'AD': // load the accumulator from memory
                        this.loadAccFromMemory();
                        break;
                    case '8D': // store the accumulator in memory
                        this.storeAccInMemory();
                        break;
                    case '6D': // add with carry
                        this.addWithCarry();
                        break;
                    case 'A2': // load the X register with a constant
                        this.loadXRegWithConstant();
                        break;
                    case 'AE': // load the X register from memory
                        this.loadXRegFromMemory();
                        break;
                    case 'A0': // load the Y register with a constant
                        this.loadYRegWithConstant();
                        break;
                    case 'AC': // load the Y register from memory
                        this.loadYRegFromMemory();
                        break;
                    case 'EA': // no operation
                        this.PC++;
                        break;
                    case '00': // break (which is really a system call)
                        this.breakSystemCall();
                        break;
                    case 'EC': // compare a byte in memory to the X reg
                        this.compareMemToXReg();
                        break;
                    case 'D0': // branch N bytes if Z flag = 0
                        this.branch();
                        break;
                    case 'EE': // increment the value of a byte
                        this.incrementValue();
                        break;
                    case 'FF': // system call
                        this.systemCall();
                        break;
                    default:
                        alert("Invalid opcode instruction " + this.instruction + " from " + this.currentPCB.processID);
                        this.isExecuting = false;
                        break;
            }
        }


    }
}
