/* ------------
cpuSCheduler.ts

CPU Scheduler
Schedules proccesses and send them to the CPU Dispatcher for context swtiches.
------------ */

module TSOS {

    export class CpuScheduler {
        
        private quantum: number; // Quantum set to 6 for Project 3 RR
        private scheduleMode: string; // Round Robin, first come first serve (FCFS)

        public executingPCB: TSOS.ProcessControlBlock;
        private counter: number;

        constructor() {
            this.quantum = 6;
            this.scheduleMode = "rr";
            this.executingPCB = null;
            this.counter = 1;
        }


        public getQuantum(q: number): void {
            this.quantum = q;
        }

        public setQuantum(q: number): number {
            return this.quantum;
        }

        public schedule(): void {
            switch (this.scheduleMode) {
                case "rr":
                    this.scheduleRoundRobin();
                    break;
                case "fcfs":
                    this.scheduleFCFS();
                    break;
            }
        }

        public scheduleRoundRobin(): void {
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

        public scheduleFCFS(): void {
            // FCFS uses Round Robin scheduling with quantum set to max
            this.quantum = Number.MAX_VALUE;
            this.scheduleRoundRobin();
        }

        public incrementCounter(): void {
            this.counter++;
        }

        public resetCounter(): void {
            this.counter = 1;
        }

        public setExecutingPCB(pcb: TSOS.ProcessControlBlock): void {
            this.executingPCB = pcb;
        }

        public getScheduleMode(): string {
            if (this.scheduleMode == "rr") {
                return "Round Robin";
            }
            else if (this.scheduleMode == "fcfs") {
                return "First Come First Serve";
            }
        }

        public setScheduleMode(mode: string): void {
            this.scheduleMode = mode;
        }

    }
}