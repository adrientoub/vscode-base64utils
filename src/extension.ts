"use strict";
import * as vscode from "vscode";
import { Base64, Base64D, GunzipBase64, GzipBase64 } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  console.log("Extension Base64Utils launched.");

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.Base64", Base64),
    vscode.commands.registerCommand("extension.Base64D", Base64D),
    vscode.commands.registerCommand("extension.GzipBase64", GzipBase64),
    vscode.commands.registerCommand("extension.GunzipBase64", GunzipBase64)
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
