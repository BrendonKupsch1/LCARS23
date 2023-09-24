var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        priotrity;
        programCounter;
        acc; // accumulator
        XRegister;
        YRegister;
        ZFlag;
        processID;
        processState; // new, ready, waiting, running, terminated
        baseRegister;
        limitRegister;
        isInMemory;
        static currentProcessID = 0;
        constructor(priority) {
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
        update(pc, acc, XReg, YReg, ZFlag) {
            this.programCounter = pc;
            this.acc = acc;
            this.XRegister = XReg;
            this.YRegister = YReg;
            this.ZFlag = ZFlag;
        }
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map