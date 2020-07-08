"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const exec_1 = require("./exec");
const fs_1 = require("fs");
const utils_1 = require("./utils");
function format(document) {
    const vfmtArgs = utils_1.getVConfig().get("format.args", "");
    const rand = Math.random().toString(36).substring(7);
    const tempFile = document.fileName.replace(".v", `${rand}tmp.v`);
    const args = ["fmt", vfmtArgs, tempFile];
    return new Promise((resolve, reject) => {
        fs_1.writeFile(tempFile, document.getText(), () => {
            exec_1.execV(args, (err, stdout, stderr) => {
                fs_1.unlink(tempFile, () => {
                    if (err) {
                        const errMessage = `Cannot format due to the following errors: ${stderr}`.replace(tempFile, document.fileName);
                        vscode_1.window.showErrorMessage(errMessage);
                        return reject(errMessage);
                    }
                    return resolve([vscode_1.TextEdit.replace(utils_1.fullDocumentRange(document), stdout)]);
                });
            });
        });
    });
}
function registerFormatter() {
    const provider = {
        provideDocumentFormattingEdits(document) {
            return format(document);
        }
    };
    return vscode_1.languages.registerDocumentFormattingEditProvider("v", provider);
}
exports.registerFormatter = registerFormatter;
//# sourceMappingURL=format.js.map