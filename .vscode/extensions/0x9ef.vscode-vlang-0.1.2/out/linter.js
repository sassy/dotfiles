"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const os_1 = require("os");
const path_1 = require("path");
const utils_1 = require("./utils");
const exec_1 = require("./exec");
const path_2 = require("path");
const fs_1 = require("fs");
const outDir = `${os_1.tmpdir()}${path_1.sep}vscode_vlang${path_1.sep}`;
const SEV_ERR = vscode_1.DiagnosticSeverity.Error;
const SEV_WRN = vscode_1.DiagnosticSeverity.Warning;
exports.collection = vscode_1.languages.createDiagnosticCollection("V");
function lint(document) {
    const workspaceFolder = utils_1.getWorkspaceFolder(document.uri);
    // Don't lint files that are not in the workspace
    if (!workspaceFolder)
        return true;
    const cwd = workspaceFolder.uri.fsPath;
    const foldername = path_2.dirname(document.fileName);
    const relativeFoldername = path_2.relative(cwd, foldername);
    const relativeFilename = path_2.relative(cwd, document.fileName);
    const fileCount = fs_1.readdirSync(foldername).filter(f => f.endsWith(".v")).length;
    let target = foldername === cwd ? "." : relativeFoldername;
    target = fileCount === 1 ? relativeFilename : target;
    let status = true;
    exec_1.execV(["-o", `${outDir}lint.c`, target], (err, stdout, stderr) => {
        exports.collection.clear();
        if (err || stderr.trim().length > 1) {
            const output = stderr || stdout;
            const isWarning = output.substring(0, 7) === "warning";
            if (!isWarning) {
                /* ERROR */
                const { file, line, column, message } = parseError(output);
                const fileuri = vscode_1.Uri.file(path_2.resolve(cwd, file));
                const start = new vscode_1.Position(line - 1, column);
                const end = new vscode_1.Position(line - 1, column);
                const range = new vscode_1.Range(start, end);
                const diagnostic = new vscode_1.Diagnostic(range, message, SEV_ERR);
                diagnostic.source = "V";
                exports.collection.set(fileuri, [diagnostic]);
            }
            else {
                /* WARNING */
                const warnings = parseWarning(output);
                warnings.forEach(warning => {
                    const { file, line, column, message } = warning;
                    const fileuri = vscode_1.Uri.file(path_2.resolve(cwd, file));
                    const start = new vscode_1.Position(line - 1, column);
                    const end = new vscode_1.Position(line - 1, column + 1);
                    const range = new vscode_1.Range(start, end);
                    const diagnostic = new vscode_1.Diagnostic(range, message, SEV_WRN);
                    diagnostic.source = "V";
                    exports.collection.set(fileuri, [...exports.collection.get(fileuri), diagnostic]);
                });
            }
            return (status = false);
        }
        else {
            exports.collection.delete(document.uri);
        }
    });
    return status;
}
exports.lint = lint;
function parseWarning(stderr) {
    stderr = utils_1.trimBoth(stderr);
    const lines = stderr.split("\n");
    const warnings = [];
    const moreInfos = [];
    for (let ln of lines) {
        ln = utils_1.trimBoth(ln);
        const cols = ln.split(":");
        if (cols.length < 5 && ln.startsWith("*")) {
            const obj = { for: warnings.length - 1, content: ln };
            moreInfos.push(obj);
        }
        else {
            const file = utils_1.trimBoth(cols[1]);
            const line = parseInt(cols[2]);
            const column = parseInt(cols[3]);
            const message = utils_1.trimBoth(cols[4]);
            warnings.push({ file, line, column, message, stderr });
        }
    }
    moreInfos.forEach(moreInfo => {
        warnings[moreInfo.for].message += `\n ${moreInfo.content}`;
    });
    return warnings;
}
function parseError(stderr) {
    stderr = stderr.replace(/^\s*$[\n\r]{1,}/gm, "");
    const split = stderr.split("\n");
    const index = utils_1.arrayInclude(split, ".v:");
    const moreMsgIndex = utils_1.arrayInclude(split, " *");
    const infos = (split[index] || "").split(":");
    const file = utils_1.trimBoth(infos[0]);
    const line = parseInt(infos[1]);
    const column = parseInt(infos[2]);
    let message = utils_1.trimBoth(infos.slice(3).join(""));
    if (split[moreMsgIndex])
        message += ":\n" + utils_1.trimBoth(split[moreMsgIndex]);
    return { file, line, column, message, stderr };
}
//# sourceMappingURL=linter.js.map