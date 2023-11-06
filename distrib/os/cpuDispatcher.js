/* ------------
cpuDispatcher.ts

CPU Dispatcher
The CPU Dispatcher handles context switches from the CPU Scheduler.
------------  */
var TSOS;
(function (TSOS) {
    class CpuDispatcher {
        constructor() {
        }
        contextSwitch() {
            if (_MemoryManager.readyQueue.getSize() > 0 && _CPU.currentPCB === null) {
                var nextProcess = _MemoryManager.readyQueue.dequeue();
                _CpuScheduler.executingPCB = nextProcess;
                _CPU.loadNewProcess(_CpuScheduler.executingPCB);
            }
            else if (_MemoryManager.readyQueue.getSize() > 0) {
                // if process is executing, put it in the ready queue and change state to ready
                _CpuScheduler.executingPCB.processState = "ready";
                _CpuScheduler.executingPCB.LastSleepCycle = _OSclock;
                _MemoryManager.readyQueue.enqueue(_CpuScheduler.executingPCB);
                TSOS.Control.updatePcbDisplay(false, _CpuScheduler.executingPCB);
                // get next process and update current process
                var nextProcess = _MemoryManager.readyQueue.dequeue();
                nextProcess.waitTime += _OSclock - nextProcess._OSClock;
                _CpuScheduler.executingPCB = nextProcess;
                _CPU.loadNewProcess(_CpuScheduler.executingPCB);
            }
            else {
                alert("Ready queue is empty.");
            }
        }
    }
    TSOS.CpuDispatcher = CpuDispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuDispatcher.js.map