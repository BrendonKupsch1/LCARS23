/* ---------------
    disk.ts

    Disk
    4 tracks, with 8 secotrs per track, and 8 bytes per sector
    ---------------- */
var TSOS;
(function (TSOS) {
    class Disk {
        numTracks;
        numSectors;
        numBlocks;
        constructor() {
            this.numTracks = 4;
            this.numSectors = 8;
            this.numBlocks = 8;
        }
    }
    TSOS.Disk = Disk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=disk.js.map