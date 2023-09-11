/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) || // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) { // a..z 
                // Determine the character we want to display
                chr = String.fromCharCode(keyCode + 32);
                // Check to see if we need to shift
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 32) || // space
                (keyCode == 9) || //tab
                (keyCode == 13) || // enter
                (keyCode == 38) || // up arrow
                (keyCode == 40)) { // down arrow
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            // if the key is a number and is shifted, then call the enableSymbol function
            else if ((keyCode >= 48) && (keyCode <= 57)) {
                _KernelInputQueue.enqueue(enableSymbol(keyCode, isShifted));
            }
            // if the key is backspace
            else if (keyCode == 8) {
                _StdIn.backspace();
            }
            // if the key is a punctuation character, then call the enablePuncChar function
            else if (puncChar(keyCode)) {
                _KernelInputQueue.enqueue(enablePuncChar(keyCode, isShifted));
            }
            // functions to handle punctuation characters
            function puncChar(ch) {
                if ((ch >= 186 && ch <= 192) || (ch >= 219 && ch <= 222)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            // function to enable punctuation characters
            function enablePuncChar(keyCode, isShifted) {
                var puncTable = {
                    '186': ';',
                    '187': '=',
                    '188': ',',
                    '189': '-',
                    '190': '.',
                    '191': '/',
                    '192': '`',
                    '219': '[',
                    '220': '\\',
                    '221': ']',
                    '222': '\''
                }, puncTableShifted = {
                    '186': ':',
                    '187': '+',
                    '188': '<',
                    '189': '_',
                    '190': '>',
                    '191': '?',
                    '192': '~',
                    '219': '{',
                    '220': '|',
                    '221': '}',
                    '222': '\"'
                };
                chr = puncTable[keyCode];
                if (isShifted) {
                    chr = puncTableShifted[keyCode];
                }
                return chr;
            }
            // functions to handle symbol characters
            function enableSymbol(keyCode, isShifted) {
                var puncTableShifted = {
                    '48': ')',
                    '49': '!',
                    '50': '@',
                    '51': '#',
                    '52': '$',
                    '53': '%',
                    '54': '^',
                    '55': '&',
                    '56': '*',
                    '57': '('
                };
                chr = String.fromCharCode(keyCode);
                if (isShifted) {
                    chr = puncTableShifted[keyCode];
                }
                return chr;
            }
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map