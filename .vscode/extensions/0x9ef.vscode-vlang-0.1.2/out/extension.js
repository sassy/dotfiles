"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commands = require("./commands");
const format_1 = require("./format");
const exec_1 = require("./exec");
const linter_1 = require("./linter");
const utils_1 = require("./utils");
const vLanguageId = "v";
const cmds = {
    "v.run": commands.run,
    "v.ver": commands.ver,
    "v.help": commands.help,
    "v.prod": commands.prod,
    "v.test.file": commands.testFile,
    "v.playground": commands.playground,
    "v.test.package": commands.testPackage
};
/**
 * This method is called when the extension is activated.
 * @param context The extension context
 */
function activate(context) {
    for (const cmd in cmds) {
        const handler = cmds[cmd];
        const disposable = vscode.commands.registerCommand(cmd, handler);
        context.subscriptions.push(disposable);
    }
    context.subscriptions.push(format_1.registerFormatter(), exec_1.attachOnCloseTerminalListener());
    if (utils_1.getVConfig().get("enableLinter")) {
        context.subscriptions.push(vscode.window.onDidChangeVisibleTextEditors(didChangeVisibleTextEditors), vscode.workspace.onDidSaveTextDocument(didSaveTextDocument), vscode.workspace.onDidCloseTextDocument(didCloseTextDocument));
        // If there are V files open, do the lint immediately
        if (vscode.window.activeTextEditor) {
            if (vscode.window.activeTextEditor.document.languageId === vLanguageId) {
                linter_1.lint(vscode.window.activeTextEditor.document);
            }
        }
    }
}
exports.activate = activate;
/**
 *  Handles the `onDidChangeVisibleTextEditors` event
 */
function didChangeVisibleTextEditors(editors) {
    editors.forEach(editor => {
        if (editor.document.languageId === vLanguageId) {
            linter_1.lint(editor.document);
        }
    });
}
/**
 *  Handles the `onDidSaveTextDocument` event
 */
function didSaveTextDocument(document) {
    if (document.languageId === vLanguageId) {
        linter_1.lint(document);
    }
}
/**
 *  Handles the `onDidCloseTextDocument` event
 */
function didCloseTextDocument(document) {
    if (document.languageId === vLanguageId) {
        if (!vscode.window.activeTextEditor)
            linter_1.collection.clear();
        linter_1.collection.delete(document.uri);
    }
}
/**
 * This method is called when the extension is deactivated.
 */
function deactivate() {
    utils_1.clearTempFolder();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map