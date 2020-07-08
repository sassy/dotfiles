"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const exec_1 = require("./exec");
/**
 * Run current file.
 */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const document = vscode_1.window.activeTextEditor.document;
        yield document.save();
        const filePath = `"${document.fileName}"`;
        exec_1.execVInTerminal(["run", filePath]);
    });
}
exports.run = run;
/**
 * Build an optimized executable from current file.
 */
function prod() {
    return __awaiter(this, void 0, void 0, function* () {
        const document = vscode_1.window.activeTextEditor.document;
        yield document.save();
        const filePath = `"${document.fileName}"`;
        exec_1.execVInTerminal(["-prod", filePath]);
    });
}
exports.prod = prod;
/**
 * Show help info.
 */
function help() { }
exports.help = help;
/**
 * Show version info.
 */
function ver() {
    exec_1.execV(["-version"], (err, stdout) => {
        if (err) {
            vscode_1.window.showErrorMessage("Unable to get the version number. Is V installed correctly?");
            return;
        }
        vscode_1.window.showInformationMessage(stdout);
    });
}
exports.ver = ver;
/**
 * Test current file.
 */
function testFile() { }
exports.testFile = testFile;
/**
 * Test current package.
 */
function testPackage() { }
exports.testPackage = testPackage;
/**
 * Upload and share current code to V playground.
 */
function playground() { }
exports.playground = playground;
//# sourceMappingURL=commands.js.map