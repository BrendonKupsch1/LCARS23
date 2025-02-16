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

        public static singleStep: boolean;

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public instruction: string = "N/A",
                    public currentPCB: TSOS.ProcessControlBlock = null) {
            TSOS.Cpu.singleStep = false;

        }

        public init(): void {
        }

        // new load process for context switching
        public loadNewProcess(pcb: TSOS.ProcessControlBlock): void {
            if (pcb.processState !== "Terminated") {
                this.currentPCB = pcb;
                this.PC = this.currentPCB.programCounter;
                this.Acc = this.currentPCB.acc;
                this.Xreg = this.currentPCB.XRegister;
                this.Yreg = this.currentPCB.YRegister;
                this.Zflag = this.currentPCB.ZFlag;
                this.runNewProcess();
            }
        }

        // new run process for contezxt switching
        public runNewProcess() {
            this.currentPCB.processState = "Executing";
            TSOS.Control.updatePcbDisplay(false, this.currentPCB);
            this.isExecuting = true;
        }


        // used by shell command shellRun to start executing a program
        public runProcess(pid: number): void {
            // first load the process info into the CPU's registers
            this.currentPCB = _MemoryManager.residentList[pid];
            // then run it
            this.currentPCB.processState = "Executing";
            TSOS.Control.updatePcbDisplay(false, this.currentPCB);
            this.isExecuting = true;
        }

        public runAllProcesses(): void {
            for (var i = 0; i < _MemoryManager.residentList.length; i++) {
                var pcb = _MemoryManager.residentList[i];
                pcb.processState = "Ready";
                TSOS.Control.updatePcbDisplay(false, pcb);
                _MemoryManager.readyQueue.enqueue(pcb);
            }
            this.isExecuting = true;
        }

        public cycle(): void {
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            if (this.currentPCB !== null && this.isExecuting) {
                _Kernel.krnTrace('CPU cycle');
                this.instruction = _MemoryAccessor.read(this.currentPCB, this.PC);

                _CpuScheduler.incrementCounter();

                // kept getting a null error with regards to the currentPCB, so I made a copy of it to hold its value (this is not great, but it works)
                var Hold_currentPCB = this.currentPCB;

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

            if (this.PC > 256) {
                this.PC = this.PC % 256;
            }


            this.currentPCB = Hold_currentPCB;
            this.currentPCB.update(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);

            // stop executing if single step is true
            if (TSOS.Cpu.singleStep) {
                this.isExecuting = false;
            }
            
            TSOS.Control.updateCpuDisplay(this.currentPCB, this.instruction);
            TSOS.Control.updatePcbDisplay(false, this.currentPCB, this.instruction);
        }


        private loadAccWithConstant() {
            this.PC++;
            this.Acc = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
        }

        private loadAccFromMemory() {
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Acc = parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16);
            this.PC++;
        }

        private storeAccInMemory() {
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            _MemoryAccessor.write(this.currentPCB, addr, this.Acc.toString(16));
            this.PC++;
        }

        private addWithCarry() {
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Acc += parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16);
            this.PC++;
        }

        private loadXRegWithConstant() {
            this.PC++;
            this.Xreg = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
        }

        private loadXRegFromMemory() {
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Xreg = parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16);
            this.PC++;
        }

        private loadYRegWithConstant() {
            this.PC++;
            this.Yreg = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
        }

        private loadYRegFromMemory() {
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Yreg = parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16);
            this.PC++;
        }

        private breakSystemCall() {
            this.currentPCB.processState = "Terminated";
            this.currentPCB.turnAroundTime = _OSclock - this.currentPCB.loadCycle;
            TSOS.Control.updatePcbDisplay(false, this.currentPCB);
            _MemoryManager.deallocateMemory(this.currentPCB);
            TSOS.Control.updateMemoryDisplay();
            _CpuScheduler.setExecutingPCB(this.currentPCB);
            _CpuScheduler.resetCounter();
            this.currentPCB = null;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            if (!(_MemoryManager.readyQueue.getSize() > 0)) {
                this.isExecuting = false;
            }
        }

        private compareMemToXReg() {
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            // if the values are equal, set the Z flag to 1, if the values are not equal, set the Z flag to 0
            this.Zflag = (this.Xreg === parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16)) ? 1 : 0;
            this.PC++;
        }

        private branch() {
            this.PC++;
            if (this.Zflag === 0) {
                var branch = _MemoryAccessor.read(this.currentPCB, this.PC);
                this.PC++;
                var branchDistance = parseInt(branch, 16);
                this.PC += branchDistance;
            }
            else {
                this.PC++;
            }
        }

        private incrementValue() {
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            var value = parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16);
            value++;
            _MemoryAccessor.write(this.currentPCB, addr, value.toString(16));
            this.PC++;
        }

        private systemCall() {
            if (this.Xreg === 1) {
                _StdOut.putText(this.Yreg.toString());
                this.PC++;
            }
            else if (this.Xreg === 2) {
                var output = '';
                var addr = this.Yreg;
                var data = _MemoryAccessor.read(this.currentPCB, addr);
                while (data !== '00') {
                    var letter = String.fromCharCode(parseInt(data, 16));
                    output += letter;
                    addr++;
                    var data = _MemoryAccessor.read(this.currentPCB, addr);
                }
                _StdOut.putText(output + ' ');
                this.PC++;
            }
        }


    }
}
