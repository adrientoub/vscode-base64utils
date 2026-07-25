"use strict";
import * as vscode from "vscode";
import { gzipSync, gunzipSync } from "fflate";

function changeText(f: (txt: string) => string): void {
  if (!vscode.window.activeTextEditor) {
    // If no open document, do nothing
    return;
  }

  const e = vscode.window.activeTextEditor;
  const d = e.document;
  const sel = e.selections;
  e.edit(function (edit) {
    // iterate through the selections
    for (let x = 0; x < sel.length; x++) {
      const txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
      try {
        edit.replace(sel[x], f(txt));
      } catch (e) {
        console.log(e);
      }
    }
  });
}

function gunzipB64(txt: string): string {
  const b64d = decodeBase64(txt);
  const unzipped = gunzipSync(b64d);
  const unzippedBuffer = Buffer.from(unzipped);
  return unzippedBuffer.toString();
}

function decodeBase64(txt: string): Buffer {
  if (/^[a-zA-Z0-9+=/\n\r\t ]+$/.test(txt)) {
    return Buffer.from(txt, "base64");
  }
  if (/^[a-zA-Z0-9%\n\r\t ]+$/.test(txt)) {
    return Buffer.from(decodeURIComponent(txt), "base64");
  }

  throw new Error("Selected text is not base64.");
}

function base64d(txt: string): string {
  return decodeBase64(txt).toString();
}

export function GunzipBase64() {
  changeText(gunzipB64);
}

export function GzipBase64() {
  changeText((txt) => {
    const zipped = gzipSync(Buffer.from(txt));
    const zippedBuffer = Buffer.from(zipped);
    return zippedBuffer.toString("base64");
  });
}

export function Base64() {
  changeText((txt) => Buffer.from(txt).toString("base64"));
}

export function Base64D() {
  changeText(base64d);
}

export function OpenInNewTab(): void {
  if (!vscode.window.activeTextEditor) {
    // If no open document, do nothing
    return;
  }

  const e = vscode.window.activeTextEditor;
  const d = e.document;
  const sel = e.selections;
  for (let x = 0; x < sel.length; x++) {
    let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end)).trim();
    try {
      txt = gunzipB64(txt);
    } catch {
      console.log("Not a Gzip Base64 text.");
    }
    try {
      txt = base64d(txt);
    } catch {
      console.log("Not a Base64 text.");
    }
    const options: { language?: string; content?: string } = {};
    try {
      txt = JSON.stringify(JSON.parse(txt), null, 2);
      options.language = "json";
    } catch {
      console.log("Not a JSON.");
    }
    options.content = txt;
    vscode.workspace.openTextDocument(options).then((doc) => vscode.window.showTextDocument(doc, { preview: false }));
  }
}
