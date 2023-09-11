/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        currentFont;
        currentFontSize;
        currentXPosition;
        currentYPosition;
        buffer;
        tabCount;
        commandHistory;
        commandCount;
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "", tabCount = 0, commandHistory = [], commandCount = 0) {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.tabCount = tabCount;
            this.commandHistory = commandHistory;
            this.commandCount = commandCount;
        }
        init() {
            this.clearScreen();
            this.resetXY();
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        clearLine() {
            _DrawingContext.clearRect(0, this.currentYPosition - 14, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer, command count, and tab count.
                    this.commandHistory.push(this.buffer);
                    this.commandCount = this.commandHistory.length;
                    this.tabCount = 0;
                    this.buffer = "";
                }
                // handles tab completion
                else if (chr === String.fromCharCode(9)) {
                    var commands = [];
                    for (var i in _OsShell.commandList) {
                        if (this.buffer == _OsShell.commandList[i].command.substring(0, this.buffer.length)) {
                            commands.push(_OsShell.commandList[i].command);
                        }
                    }
                    if (commands.length > 0) {
                        this.currentXPosition = 0;
                        this.clearLine();
                        this.buffer = commands[this.tabCount];
                        this.putText(_OsShell.promptStr + commands[this.tabCount]);
                        this.tabCount += 1;
                    }
                }
                // handles up arrow
                else if (chr === String.fromCharCode(38) && this.commandCount > 0) {
                    this.currentXPosition = 0;
                    this.commandCount -= 1;
                    this.clearLine();
                    this.buffer = this.commandHistory[this.commandCount];
                    this.putText(_OsShell.promptStr + this.commandHistory[this.commandCount]);
                }
                // handles down arrow
                else if (chr === String.fromCharCode(40) && this.commandCount < this.commandHistory.length - 1) {
                    this.currentXPosition = 0;
                    this.commandCount += 1;
                    this.clearLine();
                    this.buffer = this.commandHistory[this.commandCount];
                    this.putText(_OsShell.promptStr + this.commandHistory[this.commandCount]);
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                    // if the tab key is not pressed, reset the tab count
                    this.tabCount = 0;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }
        putText(text) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        }
        advanceLine() {
            this.currentXPosition = 0;
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            if (this.currentYPosition > _Canvas.height) {
                _Kernel.krnTrace("End of canvas, scrolling");
                this.scrollText();
            }
            else if (this.currentXPosition > _Canvas.width) {
                _Kernel.krnTrace("");
                this.scrollText();
            }
        }
        scrollText() {
            // takes an image of the current canvas
            var imageData = _DrawingContext.getImageData(0, this.currentFontSize + 10, _Canvas.width, _Canvas.height);
            // resets screen and puts the image back on the canvas at a new position
            this.clearScreen();
            this.currentYPosition -= _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
            _DrawingContext.putImageData(imageData, 0, 0);
        }
        backspace() {
            var stringBufferLength = this.buffer.length;
            var lastChar = stringBufferLength - 1;
            this.buffer = this.buffer.substring(0, lastChar);
            // clear line
            _DrawingContext.clearRect(0, this.currentYPosition - this.currentFontSize, _Canvas.width, this.currentFontSize + 10);
            this.currentXPosition = 0;
            // replace text with buffer
            this.putText(">" + this.buffer);
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map