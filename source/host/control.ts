/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Initialize all displays
            this.initMemoryDisplay();
            this.initCpuDisplay();
            this.initPcbDisplay();
            this.initDiskDisplay();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static initMemoryDisplay(): void {
            var memoryDisplay = <HTMLTableElement> document.getElementById("memoryTable");
            var rowCount = 0;
            for (var i = 0; i <_MemorySize; i += 8) {
                var iStr = i.toString(16).toUpperCase();
                var row = memoryDisplay.insertRow(rowCount);
                if (i < 10) {
                    iStr = "0" + iStr;
                }
                if (i < 100) {
                    iStr = "0" + iStr;
                }
                if (i > 100 && i < 256) {
                    iStr = "0" + iStr;
                }

                iStr = "0x" + iStr;
                row.textContent = iStr;
                var cell = row.insertCell(0);
                for (var j = 0; j < 8; j++) {
                    cell = row.insertCell(j + 1);
                    cell.textContent = "00";
                }
                rowCount++;

            }
        }

        public static initCpuDisplay(): void {
            var table = <HTMLTableElement> document.getElementById("cpuTable");
            var headers = ['PC', 'IR', 'ACC', 'X', 'Y', 'Z'];
            var body = ['000', '--', '00', '00', '00', '0'];
            var headerRow = table.insertRow();
            var bodyRow = table.insertRow();
            for (var i = 0; i < headers.length; i++) {
                headerRow.insertCell(i).textContent = headers[i];
                bodyRow.insertCell(i).textContent = body[i];
            }
        }

        // I need to add disk along with memory for 'Location'
        public static initPcbDisplay(): void {
            var table = <HTMLTableElement> document.getElementById("pcbTable");
            var headers = ['PID', 'State', 'PC', 'IR', 'ACC', 'X', 'Y', 'Z', 'Base', 'Limit', 'Location', 'Wait', 'Turnaround'];
            var body = ['--', '--', '000', '--', '00', '00', '00', '0', '0', '0', '--', '--', '--'];
            var headerRow = table.insertRow();
            var bodyRow = table.insertRow();
            for (var i = 0; i < headers.length; i++) {
                headerRow.insertCell(i).textContent = headers[i];
                bodyRow.insertCell(i).textContent = body[i];
            }
        }

        public static updateMemoryDisplay() {
            var memoryDisplay = <HTMLTableElement> document.getElementById("memoryTable");
            var rowCount = 0;
            var memoryPointer = 0;
            for (var i = 0; i < _MemorySize; i += 8) {
                var iStr = i.toString(16).toUpperCase();
                memoryDisplay.deleteRow(rowCount);
                var row = memoryDisplay.insertRow(rowCount);
                if (i < 10) {
                    iStr = "0" + iStr;
                }
                if (i < 100) {
                    iStr = "0" + iStr;
                }
                if (i > 100 && i < 256) {
                    iStr = "0" + iStr;
                }
                iStr = "0x" + iStr;
                row.textContent = iStr;
                var cell = row.insertCell(0);
                for (var j = 0; j < 8; j++) {
                    cell = row.insertCell(j + 1);
                    cell.textContent = _Memory.memory[memoryPointer];
                    memoryPointer++;
                }
                rowCount++;
            }
        }

        public static updateCpuDisplay(pcb: TSOS.ProcessControlBlock, instruction: string) {
            var table = <HTMLTableElement> document.getElementById("cpuTable");
            table.deleteRow(1);
            var body = [pcb.programCounter.toString(), instruction, TSOS.Utils.toHexDigit(pcb.acc, 2), TSOS.Utils.toHexDigit(pcb.XRegister, 2), TSOS.Utils.toHexDigit(pcb.YRegister, 2), pcb.ZFlag.toString()];
            var bodyRow = table.insertRow();
            for (var i = 0; i < body.length; i++) {
                bodyRow.insertCell(i).textContent = body[i];
            }
        }

        public static updatePcbDisplay(isLoadCommand: boolean, pcb: TSOS.ProcessControlBlock, instruction?: string) {
            let table = document.getElementById("pcbTable");
            if (instruction === undefined) {
                instruction = "--";
            }
            if (pcb.baseRegister === 0) {
                pcb.memSegment = 0;
            }
            else if (pcb.baseRegister === 256) {
                pcb.memSegment = 1;
            }
            else if (pcb.baseRegister === 512) {
                pcb.memSegment = 2;
            }

            let tableBody = "<tbody>" + "<tr>" + "<th>PID</th><th>State</th><th>PC</th><th>IR</th><th>ACC</th><th>X</th><th>Y</th><th>Z</th><th>Base</th><th>Limit</th><th>Location</th><th>Wait</th><th>Turnaround</th>" + "</tr>";
            for (let i = 0; i < _MemoryManager.residentList.length; i++) {
                tableBody += "<tr>" +
                    `<td> ${_MemoryManager.residentList[i].processID.toString()} </td>` +
                    `<td> ${_MemoryManager.residentList[i].processState} </td>` +
                    `<td> ${_MemoryManager.residentList[i].programCounter.toString()} </td>` +
                    `<td> ${instruction} </td>` +
                    `<td> ${TSOS.Utils.toHexDigit(_MemoryManager.residentList[i].acc, 2)} </td>` +
                    `<td> ${TSOS.Utils.toHexDigit(_MemoryManager.residentList[i].XRegister, 2)} </td>` +
                    `<td> ${TSOS.Utils.toHexDigit(_MemoryManager.residentList[i].YRegister, 2)} </td>` +
                    `<td> ${_MemoryManager.residentList[i].ZFlag.toString()} </td>` +
                    `<td> ${_MemoryManager.residentList[i].baseRegister.toString()} </td>` +
                    `<td> ${_MemoryManager.residentList[i].limitRegister.toString()} </td>` +
                    `<td> ${_MemoryManager.residentList[i].memSegment} </td>` +
                    `<td> ${_MemoryManager.residentList[i].waitTime} </td>` +
                    `<td> ${_MemoryManager.residentList[i].turnAroundTime} </td>` +
                    "</tr>";
            }
            tableBody += "</tbody>";
            table.innerHTML = tableBody;
        }

        public static initDiskDisplay(): void {
            var table = <HTMLTableElement> document.getElementById("diskTable");
            var headers = ['T:S:B', 'Used', 'Next', 'Data'];
            var body = ['--', '--', '--', '--'];
            var headerRow = table.insertRow();
            var bodyRow = table.insertRow();
            for (var i = 0; i < headers.length; i++) {
                headerRow.insertCell(i).textContent = headers[i];
                bodyRow.insertCell(i).textContent = body[i];
            }
        }

        public static updateDiskDisplay(): void {
            var table = document.getElementById("diskTable");
            var tableBody = "<tbody>" + "<tr>" + "<th>T:S:B</th><th>Used</th><th>Next</th><th>Data</th>" +
            "</tr>";
            for (var i = 0; i < _Disk.numTracks; i++) {
                for (var j = 0; j < _Disk.numSectors; j++) {
                    for (var k = 0; k < _Disk.numBlocks; k++) {
                        var unsplitData = sessionStorage.getItem("0," + i + "," + j)
						if(unsplitData != null){
						
							var data = unsplitData.split(" ");
							var block = "";
							for (var l = 4; l < data.length; l++) {
								block += (data[l] + " ");
							}
							block.trim();
							tableBody += "<tr>" + `<td> ${i + ',' + j + ',' + k} </td>` +
							`<td> ${data[0]} </td>` + `<td> ${data[1] + ',' + data[2] + ',' + data[3]} </td>` +
							`<td> ${block} </td>`;
						}
                    }
                }
            }
            tableBody += "</tbody>";
            table.innerHTML = tableBody;
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt, Reset, and Single Step buttons...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStep")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnStep")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            _Memory = new Memory(_MemorySize);
            _Memory.init();
            _MemoryAccessor = new MemoryAccessor();

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        // used for single step
        public static hostBtnSingleStep_click(btn): void {
            // toggle single step mode
            TSOS.Cpu.singleStep = !(TSOS.Cpu.singleStep);
            (<HTMLButtonElement>document.getElementById("btnStep")).disabled = !(TSOS.Cpu.singleStep);
            btn.value = (TSOS.Cpu.singleStep) ? "Single-Step: On" : "Single-Step: Off";

            // if single step is turned off while executing
            if (!TSOS.Cpu.singleStep && !_CPU.isExecuting && _CPU.PC !== 0) {
                // resume execution
                _CPU.isExecuting = true;
            }
        }

        // used for single step
        public static hostBtnNextStep_click(btn): void {
            _CPU.isExecuting = true;
        }
    }
}
