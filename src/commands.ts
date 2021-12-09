"use strict";
import * as vscode from "vscode";
var gzip = require("gzip-js");

function changeText(f: (txt: string) => string): void {
  if (!vscode.window.activeTextEditor) {
    // If no open document, do nothing
    return;
  }

  let e = vscode.window.activeTextEditor;
  let d = e.document;
  let sel = e.selections;
  e.edit(function(edit) {
    // iterate through the selections
    for (var x = 0; x < sel.length; x++) {
      let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
      try {
        edit.replace(sel[x], f(txt));
      } catch (e) {
        console.log(e);
      }
    }
  });
}

function gunzipB64(txt: string): string {
  if (!isBase64(txt)) {
    throw new Error("Selected text is not base64.");
  }

  let b64d = Buffer.from(txt, "base64");
  let unzipped = gzip.unzip(b64d);
  let unzippedBuffer = Buffer.from(unzipped);
  return unzippedBuffer.toString();
}

function isBase64(txt: string): boolean {
  return Buffer.from(txt, "base64").toString("base64") === txt;
}

function base64d(txt: string): string {
  if (!isBase64(txt)) {
    throw new Error("Selected text is not base64.");
  }

  return Buffer.from(txt, "base64").toString();
}

export function GunzipBase64() {
  changeText(gunzipB64);
}

export function GzipBase64() {
  changeText(txt => {
    let zipped = gzip.zip(txt);
    let zippedBuffer = Buffer.from(zipped);
    return zippedBuffer.toString("base64");
  });
}

export function Base64() {
  changeText(txt => Buffer.from(txt).toString("base64"));
}

export function Base64D() {
  changeText(base64d);
}

export function OpenInNewTab(): void {
  if (!vscode.window.activeTextEditor) {
    // If no open document, do nothing
    return;
  }

  let e = vscode.window.activeTextEditor;
  let d = e.document;
  let sel = e.selections;
  for (var x = 0; x < sel.length; x++) {
    let txt: string = d
      .getText(new vscode.Range(sel[x].start, sel[x].end))
      .trim();
    try {
      txt = gunzipB64(txt);
    } catch (e) {
      console.log("Not a Gzip Base64 text.");
    }
    try {
      txt = base64d(txt);
    } catch (e) {
      console.log("Not a Base64 text.");
    }
    let options: {language?: string; content?: string} = {};
    try {
      txt = JSON.stringify(JSON.parse(txt), null, 2);
      options.language = 'json';
    } catch (e) {
      console.log("Not a JSON.");
    }
    options.content = txt;
    vscode.workspace
      .openTextDocument(options)
      .then(doc => vscode.window.showTextDocument(doc, { preview: false }));
  }
}
