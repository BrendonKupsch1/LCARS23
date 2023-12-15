/* ------------
cpuDispatcher.ts

CPU Dispatcher
The CPU Dispatcher handles context switches from the CPU Scheduler.

When swapping from mem to disk, swap the last memeory segment with the disk (mem segment 2) this leads to the least 
amount of swapping

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
                _MemoryManager.readyQueue.enqueue(_CpuScheduler.executingPCB);
                TSOS.Control.updatePcbDisplay(false, _CpuScheduler.executingPCB);
                // get next process and update current process
                var nextProcess = _MemoryManager.readyQueue.dequeue();
                if (!nextProcess.isInMemory) {
                    var pcbToSwap = _MemoryManager.readyQueue.getLast();
                    var destinationSegment = pcbToSwap.memSegment;
                    _CpuSwapper.rollOut(pcbToSwap);
                    _CpuSwapper.rollIn(nextProcess, destinationSegment);
                }
                _CpuScheduler.executingPCB = nextProcess;
                _CPU.loadNewProcess(_CpuScheduler.executingPCB);
            }
            else {
                alert("Ready queue is empty.")
            }
        }
    }
}