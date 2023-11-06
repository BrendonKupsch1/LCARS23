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
        processState; // new, ready, resident, executing, terminated
        baseRegister;
        limitRegister;
        isInMemory;
        memSegment; // if in memory, hold segment of 0, 1, or 2
        waitTime;
        turnAroundTime;
        LastSleepCycle;
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
            this.memSegment = -1;
            this.waitTime = 0;
            this.turnAroundTime = 0;
        }
        // used by CPU to update the PCB
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