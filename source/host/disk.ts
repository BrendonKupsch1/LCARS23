/* ---------------
    disk.ts

    Disk
    4 tracks, with 8 secotrs per track, and 8 bytes per sector
    ---------------- */

module TSOS {

    export class Disk {

        public numTracks: number; 
        public numSectors: number;
        public numBlocks: number;

    constructor() {
        this.numTracks = 4;
        this.numSectors = 8;
        this.numBlocks = 8;
    }
}