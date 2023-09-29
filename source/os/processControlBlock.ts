module TSOS {

     export class ProcessControlBlock {

        public priotrity : number;
        public programCounter : number;
        public acc : number; // accumulator
        public XRegister : number;
        public YRegister : number;
        public ZFlag : number;
        public processID : number;
        public processState : string; // new, ready, resident, executing, terminated
        public baseRegister : number;
        public limitRegister : number;
        public isInMemory : boolean;


        static currentProcessID : number = 0;

        constructor(priority : number) {
            this.priotrity = priority;
            this.programCounter = 0;
            this.acc = 0;
            this.XRegister = 0;
            this.YRegister = 0;
            this.ZFlag = 0;
            this.processID = ProcessControlBlock.currentProcessID++;
            this.processState = "new";
            this.baseRegister = -1;
            this.limitRegister = -1;
            this.isInMemory = false;
        }

        public update(pc: number, acc: number, XReg: number, YReg: number, ZFlag: number) {
            this.programCounter = pc;
            this.acc = acc;
            this.XRegister = XReg;
            this.YRegister = YReg;
            this.ZFlag = ZFlag;
        }
    }
}
