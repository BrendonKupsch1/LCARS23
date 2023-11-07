/* ------------
cpuDispatcher.ts

CPU Dispatcher
The CPU Dispatcher handles context switches from the CPU Scheduler.
------------  */

module TSOS {

    export class CpuDispatcher {

        constructor() {
        }

        public contextSwitch() {
            if (_MemoryManager.readyQueue.getSize() > 0 && _CPU.currentPCB === null) {
                var nextProcess = _MemoryManager.readyQueue.dequeue();
                _CpuScheduler.executingPCB = nextProcess;
                _CPU.loadNewProcess(_CpuScheduler.executingPCB);
            }
            else if (_MemoryManager.readyQueue.getSize() > 0) {
                // if process is executing, put it in the ready queue and change state to ready
                _CpuScheduler.executingPCB.processState = "Ready";
                // the line below is for wait and turnaround time
                _CpuScheduler.executingPCB.lastSleepCycle = _OSclock;
                _MemoryManager.readyQueue.enqueue(_CpuScheduler.executingPCB);
                
                TSOS.Control.updatePcbDisplay(false, _CpuScheduler.executingPCB);
                // get next process and update current process
                var nextProcess = _MemoryManager.readyQueue.dequeue();
                // the line below is for wait and turnaround time
                nextProcess.waitTime += (_OSclock - nextProcess.lastSleepCycle);
                _CpuScheduler.executingPCB = nextProcess;
                _CPU.loadNewProcess(_CpuScheduler.executingPCB);
            }
            else {
                alert("Ready queue is empty.")
            }
        }
    }
}