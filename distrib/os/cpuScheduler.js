/* ------------
cpuSCheduler.ts

CPU Scheduler
Schedules proccesses and send them to the CPU Dispatcher for context swtiches.
------------ */
var TSOS;
(function (TSOS) {
    class CpuScheduler {
        quantum; // Quantum set to 6 for Project 3 RR
        scheduleMode; // Round Robin, first come first serve (FCFS)
        executingPCB;
        counter;
        constructor() {
            this.quantum = 6;
            this.scheduleMode = "rr";
            this.executingPCB = null;
            this.counter = 1;
        }
        getQuantum(q) {
            this.quantum = q;
        }
        setQuantum() {
            return this.quantum;
        }
        schedule() {
            switch (this.scheduleMode) {
                case "rr":
                    this.scheduleRoundRobin();
                    break;
                case "fcfs":
                    this.scheduleFCFS();
                    break;
            }
        }
        scheduleRoundRobin() {
            if (this.executingPCB === null && _MemoryManager.readyQueue.getSize() > 0) {
                this.executingPCB = _MemoryManager.readyQueue.dequeue();
                _CPU.loadNewProcess(this.executingPCB);
            }
            // check for another rocess running  and if quantum time is up
            else if (_MemoryManager.readyQueue.getSize() > 0) {
                if (this.counter === this.quantum) {
                    this.counter = 1;
                    _Kernel.krnInterruptHandler(CONTEXT_SWITCH_IRQ);
                }
            }
        }
        scheduleFCFS() {
            // FCFS uses Round Robin scheduling with quantum set to max
            this.quantum = Number.MAX_VALUE;
            this.scheduleRoundRobin();
        }
        incrementCounter() {
            this.counter++;
        }
        resetCounter() {
            this.counter = 1;
        }
        setExecutingPCB(pcb) {
            this.executingPCB = pcb;
        }
        getScheduleMode() {
            if (this.scheduleMode == "rr") {
                return "Round Robin";
            }
            else if (this.scheduleMode == "fcfs") {
                return "First Come First Serve";
            }
        }
        setScheduleMode(mode) {
            this.scheduleMode = mode;
        }
    }
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map