"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const TEMP_DIR = `${os_1.tmpdir()}${path_1.sep}vscode_vlang`;
const defaultCommand = "v";
function fullDocumentRange(document) {
    const lastLineId = document.lineCount - 1;
    return new vscode_1.Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
}
exports.fullDocumentRange = fullDocumentRange;
function getVExecCommand() {
    const config = getVConfig();
    const vPath = config.get("pathToExecutableFile", "") || defaultCommand;
    return vPath;
}
exports.getVExecCommand = getVExecCommand;
function getVConfig() {
    const currentDoc = getCurrentDocument();
    const uri = currentDoc ? currentDoc.uri : null;
    return vscode_1.workspace.getConfiguration("v", uri);
}
exports.getVConfig = getVConfig;
function getCwd(uri) {
    const folder = getWorkspaceFolder(uri || null);
    return folder.uri.fsPath;
}
exports.getCwd = getCwd;
function getWorkspaceFolder(uri) {
    if (uri)
        return vscode_1.workspace.getWorkspaceFolder(uri);
    const currentDoc = getCurrentDocument();
    return currentDoc
        ? vscode_1.workspace.getWorkspaceFolder(currentDoc.uri)
        : vscode_1.workspace.workspaceFolders[0];
}
exports.getWorkspaceFolder = getWorkspaceFolder;
function getCurrentDocument() {
    return vscode_1.window.activeTextEditor ? vscode_1.window.activeTextEditor.document : null;
}
exports.getCurrentDocument = getCurrentDocument;
function arrayInclude(arr, search) {
    return arr.findIndex(str => str.includes(search));
}
exports.arrayInclude = arrayInclude;
function trimBoth(str) {
    if (!str)
        return "";
    return str.trimStart().trimEnd();
}
exports.trimBoth = trimBoth;
function makeTempFolder() {
    if (!fs_1.existsSync(TEMP_DIR))
        fs_1.mkdirSync(TEMP_DIR);
}
exports.makeTempFolder = makeTempFolder;
function clearTempFolder() {
    fs_1.readdir(TEMP_DIR, (err, files) => {
        if (err)
            throw err;
        for (const file of files) {
            fs_1.unlink(path_1.join(TEMP_DIR, file), err => {
                if (err)
                    throw err;
            });
        }
    });
}
exports.clearTempFolder = clearTempFolder;
//# sourceMappingURL=utils.js.map