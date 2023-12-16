    // add command to set time to stardate
    // add redalert command that flashes some part of the screen red
    // add maybe some more randomized commands to make labouseur laugh (maybe star trek food like gach, or rediculous ideas like tuvix)

    /* ------------
    Shell.ts

    The OS Shell - The "command line interface" (CLI) for the console.

        Note: While fun and learning are the primary goals of all enrichment center activities,
            serious injuries may occur when trying to write your own Operating System.
    ------------ */

    // TODO: Write a base class / prototype for system services and let Shell inherit from it.

    module TSOS {
        export class Shell {
            // Properties
            public promptStr = ">";
            public commandList = [];
            public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            public apologies = "[sorry]";

            constructor() {
            }

            public init() {
                var sc: ShellCommand;
                //
                // Load the command list.

                // ver
                sc = new ShellCommand(this.shellVer,
                                    "ver",
                                    "- Displays the current version.");
                this.commandList[this.commandList.length] = sc;

                // help
                sc = new ShellCommand(this.shellHelp,
                                    "help",
                                    "- This is the help command. Seek help.");
                this.commandList[this.commandList.length] = sc;

                // shutdown
                sc = new ShellCommand(this.shellShutdown,
                                    "shutdown",
                                    "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
                this.commandList[this.commandList.length] = sc;

                // cls
                sc = new ShellCommand(this.shellCls,
                                    "cls",
                                    "- Clears the screen and resets the cursor position.");
                this.commandList[this.commandList.length] = sc;

                // man <topic>
                sc = new ShellCommand(this.shellMan,
                                    "man",
                                    "<topic> - Displays the MANual page for <topic>.");
                this.commandList[this.commandList.length] = sc;

                // trace <on | off>
                sc = new ShellCommand(this.shellTrace,
                                    "trace",
                                    "<on | off> - Turns the OS trace on or off.");
                this.commandList[this.commandList.length] = sc;

                // rot13 <string>
                sc = new ShellCommand(this.shellRot13,
                                    "rot13",
                                    "<string> - Does rot13 obfuscation on <string>.");
                this.commandList[this.commandList.length] = sc;

                // prompt <string>
                sc = new ShellCommand(this.shellPrompt,
                                    "prompt",
                                    "<string> - Sets the prompt.");
                this.commandList[this.commandList.length] = sc;

                // date
                sc = new ShellCommand(this.shellDate,
                                        "date",
                                        "- Displays the current date and time.");
                this.commandList[this.commandList.length] = sc;

                // whereami
                sc = new ShellCommand(this.shellWhereAmI,
                                        "whereami",
                                        "- Displays your current location.");
                this.commandList[this.commandList.length] = sc;

                // deepspacemessage
                sc = new ShellCommand(this.shellDeepSpaceMessage,
                                        "deepspacemessage",
                                        "- Displays a message picked up from deep space.");
                this.commandList[this.commandList.length] = sc;

                // lcars
                sc = new ShellCommand(this.shellLCARS,
                                        "lcars",
                                        "- Displays information about LCARS23.");
                this.commandList[this.commandList.length] = sc;

                // status <string>
                sc = new ShellCommand(this.shellStatus,
                                        "status",
                                        "<string> - Sets the status message.");
                this.commandList[this.commandList.length] = sc;

                // BSOD 
                sc = new ShellCommand(this.shellBSOD,
                                        "bsod",
                                        "- Displays the BSOD.");
                this.commandList[this.commandList.length] = sc;

                // load
                sc = new ShellCommand(this.shellLoad,
                                        "load",
                                        "- Validates the user code in the text area.");
                this.commandList[this.commandList.length] = sc;

                // run
                sc = new ShellCommand(this.shellRun,
                                        "run",
                                        "<pid> - Runs the process with the specified pid.");
                this.commandList[this.commandList.length] = sc;

                // clearmem
                sc = new ShellCommand(this.shellClearMem,
                                        "clearmem",
                                        "- Clears all memory partitions.");
                this.commandList[this.commandList.length] = sc;

                // runall
                sc = new ShellCommand(this.shellRunAll,
                                        "runall",
                                        "- Runs all processes in the ready queue.");
                this.commandList[this.commandList.length] = sc;

                // ps
                sc = new ShellCommand(this.shellPs,
                                        "ps",
                                        "- Lists all running processes and their IDs.");
                this.commandList[this.commandList.length] = sc;

                // kill
                sc = new ShellCommand(this.shellKill,
                                        "kill",
                                        "<pid> - Kills the process with the specified pid.");
                this.commandList[this.commandList.length] = sc;

                // killall
                sc = new ShellCommand(this.shellKillAll,
                                        "killall",
                                        "- Kills all running processes.");
                this.commandList[this.commandList.length] = sc;

                // quantum
                sc = new ShellCommand(this.shellQuantum,
                                        "quantum",
                                        "<int> - Sets the quantum for Round Robin scheduling.");
                this.commandList[this.commandList.length] = sc;

                // format
                sc = new ShellCommand(this.shellFormat,
                                        "format",
                                        "- Formats the disk.");
                this.commandList[this.commandList.length] = sc;

                // create
                sc = new ShellCommand(this.shellCreate,
                                        "create",
                                        "<filename> - Creates a file.");
                this.commandList[this.commandList.length] = sc;

                // read
                sc = new ShellCommand(this.shellRead,
                                        "read",
                                        "<filename> - Reads a file.");
                this.commandList[this.commandList.length] = sc;

                // write
                sc = new ShellCommand(this.shellWrite,
                                        "write",
                                        "<filename> \"data\" - Writes data to a file.");
                this.commandList[this.commandList.length] = sc;

                // delete
                sc = new ShellCommand(this.shellDelete,
                                        "delete",
                                        "<filename> - Deletes a file.");
                this.commandList[this.commandList.length] = sc;

                // copy
                sc = new ShellCommand(this.shellCopy,
                                        "copy",
                                        "<filename> <newfilename> - Copies a file.");
                this.commandList[this.commandList.length] = sc;

                // rename
                sc = new ShellCommand(this.shellRename,
                                        "rename",
                                        "<filename> <newfilename> - Renames a file.");
                this.commandList[this.commandList.length] = sc;

                // ls
                sc = new ShellCommand(this.shellLs,
                                        "ls",
                                        "- Lists all files on disk.");
                this.commandList[this.commandList.length] = sc;

                // tab completion testing
                /* sc = new ShellCommand(this.shellTabTest1,
                                        "tabtest1",
                                        "- Tests tab completion.");
                this.commandList[this.commandList.length] = sc;

                sc = new ShellCommand(this.shellTabTest2,
                                        "tabtest2",
                                        "- Tests tab completion.");
                this.commandList[this.commandList.length] = sc; */


                // ps  - list the running processes and their IDs
                // kill <id> - kills the specified process id.

                // Display the initial prompt.
                this.putPrompt();
            }

            public putPrompt() {
                _StdOut.putText(this.promptStr);
            }

            public handleInput(buffer) {
                _Kernel.krnTrace("Shell Command~" + buffer);
                //
                // Parse the input...
                //
                var userCommand = this.parseInput(buffer);
                // ... and assign the command and args to local variables.
                var cmd = userCommand.command;
                var args = userCommand.args;
                //
                // Determine the command and execute it.
                //
                // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
                // command list in attempt to find a match. 
                // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
                var index: number = 0;
                var found: boolean = false;
                var fn = undefined;
                while (!found && index < this.commandList.length) {
                    if (this.commandList[index].command === cmd) {
                        found = true;
                        fn = this.commandList[index].func;
                    } else {
                        ++index;
                    }
                }
                if (found) {
                    this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
                } else {
                    // It's not found, so check for curses and apologies before declaring the command invalid.
                    if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                        this.execute(this.shellCurse);
                    } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                        this.execute(this.shellApology);
                    } else { // It's just a bad command. {
                        this.execute(this.shellInvalidCommand);
                    }
                }
            }

            // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
            public execute(fn, args?) {
                // We just got a command, so advance the line...
                _StdOut.advanceLine();
                // ... call the command function passing in the args with some über-cool functional programming ...
                fn(args);
                // Check to see if we need to advance the line again
                if (_StdOut.currentXPosition > 0) {
                    _StdOut.advanceLine();
                }
                // ... and finally write the prompt again.
                this.putPrompt();
            }

            public parseInput(buffer: string): UserCommand {
                var retVal = new UserCommand();

                // 1. Remove leading and trailing spaces.
                buffer = Utils.trim(buffer);

                // 2. Lower-case it.
                buffer = buffer.toLowerCase();

                // 3. Separate on spaces so we can determine the command and command-line args, if any.
                var tempList = buffer.split(" ");

                // 4. Take the first (zeroth) element and use that as the command.
                var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
                // 4.1 Remove any left-over spaces.
                cmd = Utils.trim(cmd);
                // 4.2 Record it in the return value.
                retVal.command = cmd;

                // 5. Now create the args array from what's left.
                for (var i in tempList) {
                    var arg = Utils.trim(tempList[i]);
                    if (arg != "") {
                        retVal.args[retVal.args.length] = tempList[i];
                    }
                }
                return retVal;
            }

            //
            // Shell Command Functions. Kinda not part of Shell() class exactly, but
            // called from here, so kept here to avoid violating the law of least astonishment.
            //
            public shellInvalidCommand() {
                _StdOut.putText("Invalid Command. ");
                if (_SarcasticMode) {
                    _StdOut.putText("Unbelievable. You, [subject name here],");
                    _StdOut.advanceLine();
                    _StdOut.putText("must be the pride of [subject hometown here].");
                } else {
                    _StdOut.putText("Type 'help' for, well... help.");
                }
            }

            public shellCurse() {
                _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
                _StdOut.advanceLine();
                _StdOut.putText("Bitch.");
                _SarcasticMode = true;
            }

            public shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            } else {
                _StdOut.putText("For what?");
            }
            }

            // Although args is unused in some of these functions, it is always provided in the 
            // actual parameter list when this function is called, so I feel like we need it.

            public shellVer(args: string[]) {
                _StdOut.putText(APP_NAME + " version " + APP_VERSION);
            }

            public shellHelp(args: string[]) {
                _StdOut.putText("Commands:");
                for (var i in _OsShell.commandList) {
                    _StdOut.advanceLine();
                    _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
                }
            }

            public shellShutdown(args: string[]) {
                _StdOut.putText("Shutting down...");
                // Call Kernel shutdown routine.
                _Kernel.krnShutdown();
                // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
            }

            public shellCls(args: string[]) {         
                _StdOut.clearScreen();     
                _StdOut.resetXY();
            }

            public shellMan(args: string[]) {
                if (args.length > 0) {
                    var topic = args[0];
                    switch (topic) {
                        case "help":
                            _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                            break;
                        case "ver":
                            _StdOut.putText("Ver displays the current version of the OS.");
                            break;
                        case "shutdown":
                            _StdOut.putText("Shutdown shuts down the OS but leaves the hardware simulation running.");
                            break;
                        case "cls":
                            _StdOut.putText("Cls clears the screen and resets the cursor position.");
                            break;
                        case "trace":
                            _StdOut.putText("Trace <on | off> turns the OS trace on or off.");
                            break;
                        case "rot13":
                            _StdOut.putText("Rot13 <string> does rot13 obfuscation on <string>.");
                            break;
                        case "prompt":
                            _StdOut.putText("Prompt <string> sets the prompt.");
                            break;
                        case "load":
                            _StdOut.putText("Load validates the user code in the text area.");
                            break;
                        case "run":
                            _StdOut.putText("Run <pid> runs the process with the specified pid.");
                            break;
                        case "clearmem":
                            _StdOut.putText("Clearmem clears all memory partitions.");
                            break;
                        case "runall":
                            _StdOut.putText("Runall runs all processes in the ready queue.");
                            break;
                        case "ps":
                            _StdOut.putText("Ps lists all running processes and their IDs.");
                            break;
                        case "kill":
                            _StdOut.putText("Kill <pid> kills the process with the specified pid.");
                            break;
                        case "killall":
                            _StdOut.putText("Killall kills all running processes.");
                            break;
                        case "quantum":
                            _StdOut.putText("Quantum <int> sets the quantum for Round Robin scheduling.");
                            break;
                        case "format":
                            _StdOut.putText("Format formats the disk.");
                            break;
                        case "create":
                            _StdOut.putText("Create <filename> creates a file.");
                            break;
                        case "read":
                            _StdOut.putText("Read <filename> reads a file.");
                            break;
                        case "write":
                            _StdOut.putText("Write <filename> \"data\" writes data to a file.");
                            break;
                        case "delete":
                            _StdOut.putText("Delete <filename> deletes a file.");
                            break;
                        case "copy":
                            _StdOut.putText("Copy <filename> <newfilename> copies a file.");
                            break;
                        case "rename":
                            _StdOut.putText("Rename <filename> <newfilename> renames a file.");
                            break;
                        case "ls":
                            _StdOut.putText("Ls lists all files on disk.");
                            break;
                        
                        default:
                            _StdOut.putText("No manual entry for " + args[0] + ".");
                    }
                } else {
                    _StdOut.putText("Usage: man <topic>  Please supply a topic.");
                }
            }

            public shellTrace(args: string[]) {
                if (args.length > 0) {
                    var setting = args[0];
                    switch (setting) {
                        case "on":
                            if (_Trace && _SarcasticMode) {
                                _StdOut.putText("Trace is already on, doofus.");
                            } else {
                                _Trace = true;
                                _StdOut.putText("Trace ON");
                            }
                            break;
                        case "off":
                            _Trace = false;
                            _StdOut.putText("Trace OFF");
                            break;
                        default:
                            _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                    }
                } else {
                    _StdOut.putText("Usage: trace <on | off>");
                }
            }

            public shellRot13(args: string[]) {
                if (args.length > 0) {
                    // Requires Utils.ts for rot13() function.
                    _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
                } else {
                    _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
                }
            }

            public shellPrompt(args: string[]) {
                if (args.length > 0) {
                    _OsShell.promptStr = args[0];
                } else {
                    _StdOut.putText("Usage: prompt <string>  Please supply a string.");
                }
            }

            public shellDate(args: string[]) {
                var date = new Date();
                _StdOut.putText(date.toString());
            }

            public shellWhereAmI(args: string[]) {
                _StdOut.putText("You are on Ferenginar (I hope you have an umbrella).");
            }

            public shellDeepSpaceMessage(args: string[]) {
                const message = ["we are the borg, resistance is futile, you will be assimilated", "Do not interfere with the order of the Dominion.",
                "This is the Romulan Star Empire... we aren't up to anything...", "The Klngon Empire will fight any battle, Qovpatlhs!"];
                const random = Math.floor(Math.random() * message.length);
                _StdOut.putText(message[random]);
            }

            public shellLCARS(args: string[]) {
                _StdOut.putText("LCARS23 is the Library Computer Access/Retrieval System for the 21st century.");
            }

            public shellStatus(args: string[]) {
                if (args.length > 0) {
                    var status = args.join(' ');
                    document.getElementById("taStatus").innerHTML = status;
                } else {
                    _StdOut.putText("Usage: status <string>  Please supply a string.");
                }
            }

            public shellBSOD() {
                _Kernel.krnTrapError("Warning, complete computer shutdown.");
            }


            public shellLoad(args: string[]) {
                var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A','B', 'C', 'D', 'E', 'F', ' '];
                var isValid = true;

                _UserProgramInput = (<HTMLInputElement>document.getElementById("taProgramInput")).value;

                if (_UserProgramInput.length == 0) {
                    isValid = false;
                }

                for (var i = 0; i < _UserProgramInput.length; i++) {
                    var char = _UserProgramInput[i];
                    if (hexDigits.indexOf(char) === -1) {
                        isValid = false;
                        break;
                    }
                }

                if (!isValid) {
                    _StdOut.putText("Invalid program. Please enter a valid program.");
                }
                
                else {
                    var arrayProgram = _UserProgramInput.split(" ");
                    var processID = _MemoryManager.load(arrayProgram, 1);
                    _StdOut.putText("Process ID: " + processID);
                }
            }

            // use to test run, when i copy and paste from labouseur.com the spaces don't work, but my own spaces do work?
            // A9 A9 A2 01 EC 13 00 AC 0B 00 8D F0 00 EE 0B 00 D0 F5 00 00
            public shellRun(args: string[]) {
                if (args.length > 0) {
                    var pid = parseInt(args[0]);
                    if (isNaN(pid)) {
                        _StdOut.putText("Invalid PID. Please enter a valid PID.");
                    }
                    else if (_MemoryManager.doesProcessExist(pid)) {
                        _CPU.runProcess(pid);
                    }
                    else {
                        _StdOut.putText("Process does not exist.");
                    }
                }
                else {
                    _StdOut.putText("Usage: run <pid>  Please supply a PID.");
                }
            }

            public shellClearMem(args: string[]) {
                if (!_CPU.isExecuting) {
                    _Memory.clearMemory();
                    TSOS.Control.updateMemoryDisplay();
                    _StdOut.putText("Memory cleared.");
                }
                else {
                    _StdOut.putText("Cannot clear memory while CPU is executing.");
                }
            }

            public shellRunAll(args: string[]) {
                _CPU.runAllProcesses();
            }

            public shellPs(args: string[]) {
                var proccesses = _MemoryManager.getAllRunningProcesses();
                if (proccesses.length === 0) {
                    _StdOut.putText("No running processes.");
                }
                else {
                    _StdOut.putText("Running processes: ");
                    for (var process in proccesses) {
                        _StdOut.putText(proccesses[process].processID + " ");
                    }
                }
            }

            public shellKill(args: string[]) {
                if (args.length === 0) {
                    _StdOut.putText("Usage: kill <pid>  Please supply a PID.");
                }
                else {
                    var pid = parseInt(args[0]);
                    if (isNaN(pid)) {
                        _StdOut.putText("Invalid PID. Please enter a valid PID.");
                    }
                    else {
                        if (_MemoryManager.doesProcessExist(pid)) {
                            _MemoryManager.killProcess(pid);
                            _StdOut.putText("Process " + pid + " terminated.");
                        }
                        else {
                            _StdOut.putText("Process does not exist.");
                        }
                    }
                }
            }

            public shellKillAll(args: string[]) {
                var processes = _MemoryManager.getAllRunningProcesses();
                for (var process in processes) {
                    _MemoryManager.killProcess(processes[process]);
                }
                _StdOut.putText("All processes terminated.");
            }

            public shellQuantum(args: string[]) {
                if (args.length === 0) {
                    _StdOut.putText("Usage: quantum <int>  Please supply a quantum.");
                }
                else {
                    var quantum = parseInt(args[0]);
                    if (isNaN(quantum)) {
                        _StdOut.putText("Invalid quantum. Please enter a valid quantum.");
                    }
                    else if (quantum <= 0) {
                        _StdOut.putText("Quantum must be greater than 0.");
                    }

                    else {
                        _CpuScheduler.setQuantum(quantum);
                        _StdOut.putText("Quantum set to " + quantum + ".");
                    }
                }
            }

            public shellFormat(args: string[]) {
                if (_CPU.isExecuting) {
                    _StdOut.putText("Cannot format disk while CPU is executing.");
                }
                else {
                    _krnDiskDriver.format();
                    _IsDiskFormat = true;
                    _StdOut.putText("Disk formatted.");
                }
            }

            public shellCreate(args: string[]) {
                var fileName = args[0];
                if (_IsDiskFormat) {
                    if (fileName === undefined) {
                        _StdOut.putText("Must provide a file name to create a file.");
                    }
                    else if (_krnDiskDriver.createFile(fileName)) {
                        _StdOut.putText("File " + fileName + " created.");
                        TSOS.Control.updateDiskDisplay();
                    }
                    else {
                        _StdOut.putText("File " + fileName + " already exists.");
                    }
                }
                else {
                    _StdOut.putText("Disk must be formatted before files can be created.");
                }
            }

            public shellRead(args: string[]) {
                if (_IsDiskFormat) {
                    var fileName = args[0];
                    if (fileName === undefined) {
                        _StdOut.putText("Must provide a file name to read a file.");
                    }
                    else {
                        var fileData = _krnDiskDriver.readFile(fileName, undefined, undefined, undefined);
                        if (fileData != null) {
                            _StdOut.putText("Contents of file " + fileName + ": " + fileData);
                        }
                        else {
                            _StdOut.putText("File " + fileName + " does not exist.");
                        }
                    }
                }
                else {
                    _StdOut.putText("Disk must be formatted before files can be read.");
                }
            }

            public shellWrite(args: string[]) {
                if (_IsDiskFormat) {
                    var fileName = args[0];
                    if (fileName === undefined) {
                        _StdOut.putText("Must provide a file name to write to a file.");
                    }
                    else {
                        var writeFirst = args[1];
                        var writeLast = args[args.length - 1];
                        var dataToWrite = "";
                        if ((writeFirst.charAt(0) === "\"") && (writeLast.charAt(writeLast.length - 1) === "\"")) {
                            if (args.length == 2) {
                                dataToWrite = writeFirst.substring(1, (writeFirst.length - 1));
                            }
                            else {
                                dataToWrite = writeFirst.substring(1, writeFirst.length) + " ";
                                for (var i = 2; i < args.length; i++) {
                                    dataToWrite += args[i] + " ";
                                }
                                dataToWrite += writeLast.substring(0, writeLast.length - 1);
                            }
                            if (_krnDiskDriver.writeFile(fileName, dataToWrite)) {
                                _StdOut.putText("File updated: " + fileName);
                                TSOS.Control.updateDiskDisplay();
                            }
                            else {
                                _StdOut.putText("File " + fileName + " does not exist.");
                            }
                        }
                        else {
                            _StdOut.putText("Must provide data to write to file.");
                        }
                    }
                }
                else {
                    _StdOut.putText("Disk must be formatted before files can be written to.");
                }
            }

            public shellDelete(args: string[]) {
                if (_IsDiskFormat) {
                    var fileName = args[0];
                    if (fileName === undefined) {
                        _StdOut.putText("Must provide a file name to delete a file.");
                    }
                    else {
                        if (_krnDiskDriver.deleteFile(fileName)) {
                            _StdOut.putText("File " + fileName + " deleted.");
                            TSOS.Control.updateDiskDisplay();
                        }
                        else {
                            _StdOut.putText("File " + fileName + " does not exist.");
                        }
                    }
                }
                else {
                    _StdOut.putText("Disk must be formatted before files can be deleted.");
                }
            }

            public shellCopy(args: string[]) {
                if (_IsDiskFormat) {
                    var fileName = args[0];
                    var newFileName = args[1];
                    if (fileName === undefined || newFileName === undefined) {
                        _StdOut.putText("Must provide a file name to copy a file.");
                    }
                    else {
                        if (_krnDiskDriver.copyFile(fileName, newFileName)) {
                            _StdOut.putText("File " + fileName + " copied to " + newFileName + ".");
                            TSOS.Control.updateDiskDisplay();
                        }
                        else {
                            _StdOut.putText("Errory copying files: either the first file name doesn't exist, or the second file name already exists.");
                        }
                    }
                }
                else {
                    _StdOut.putText("Disk must be formatted before files can be copied.");
                }
            }

            public shellRename(args: string[]) {
                if (_IsDiskFormat) {
                    var fileName = args[0];
                    var newFileName = args[1];
                    if (fileName == undefined || newFileName === undefined) {
                        _StdOut.putText("Must provide a file name to rename a file.");
                    }
                    else {
                        if (_krnDiskDriver.renameFile(fileName, newFileName)) {
                            _StdOut.putText("File " + fileName + " renamed to " + newFileName + ".");
                            TSOS.Control.updateDiskDisplay();
                        }
                        else {
                            _StdOut.putText("File " + fileName + " does not exist.");
                        }
                    }
                }
                else {
                    _StdOut.putText("Disk must be formatted before files can be renamed.");
                }
            }

            public shellLs(args: string[]) {
                if (_IsDiskFormat) {
                    var files = _krnDiskDriver.listFiles();
                    if (files.length > 0) {
                        _StdOut.putText("Files: ");
                        _StdOut.advanceLine();
                        for (var i = 0; i < files.length; i++) {
                            _StdOut.putText(files[i]);
                            _StdOut.advanceLine();
                        }
                    }
                    else {
                        _StdOut.putText("No files on disk.");
                    }
                }
                else {
                    _StdOut.putText("Disk must be formatted before files can be listed.");
                }
            }

            /*
            public shellTabTest1(args: string[]) {
                _StdOut.putText("tabtest1");
            }

            public shellTabTest2(args: string[]) {
                _StdOut.putText("tabtest2");
            }
            */
        }
    }