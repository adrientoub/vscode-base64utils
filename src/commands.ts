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

function isBase64(txt: string): boolean {
  return Buffer.from(txt, "base64").toString("base64") === txt;
}

export function GunzipBase64() {
  changeText(txt => {
    if (!isBase64(txt)) {
      throw new Error("Selected text is not base64.");
    }

    let b64d = new Buffer(txt, "base64");
    let unzipped = gzip.unzip(b64d);
    let unzippedBuffer = new Buffer(unzipped);
    return unzippedBuffer.toString();
  });
}

export function GzipBase64() {
  changeText(txt => {
    let zipped = gzip.zip(txt);
    let zippedBuffer = new Buffer(zipped);
    return zippedBuffer.toString("base64");
  });
}

export function Base64() {
  changeText(txt => new Buffer(txt).toString("base64"));
}

export function Base64D() {
  changeText(txt => {
    if (!isBase64(txt)) {
      throw new Error("Selected text is not base64.");
    }

    return new Buffer(txt, "base64").toString();
  });
}
