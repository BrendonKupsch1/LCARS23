///<reference path="../globals.ts" />

module TSOS {
    export class Memory {
        constructor(public mem = [768],
                    public memBase: number = 0,
                    public memLimit: number = 768,) {
        }

        public init(): void {
            this.mem[768];
            this.memBase=0;
            this.memLimit=768;
            for(var x=0; x<768; x++){
                this.mem[x]=parseInt("00");
            }
        }
    }
}