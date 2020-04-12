import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Logger } from "./logger";

const viewType = "vscode-drawio.editor";
export class DrawIOEditorProvider implements vscode.CustomTextEditorProvider {
  static register(context: vscode.ExtensionContext) {
    const provider = new DrawIOEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(viewType, provider);
    return providerRegistration;
  }

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    const drawIoAppRoot = path.join(this.context.extensionPath, "drawioApp");
    let indexContent = fs.readFileSync(path.join(drawIoAppRoot, "index.html"), "utf8");
    indexContent = indexContent.replace(
      /#vscode-root#/g,
      webviewPanel.webview.asWebviewUri(vscode.Uri.file(drawIoAppRoot)).toString()
    );
    indexContent = indexContent.replace(
      /#init-localStorage#/,
      `vscode.setState(${this.context.workspaceState.get("drawio") || "{}"})`
    );
    indexContent = indexContent.replace(/#init-localStorage#/, "");

    webviewPanel.webview.html = indexContent;
    webviewPanel.webview.options = {
      enableScripts: true,
    };

    webviewPanel.webview.onDidReceiveMessage((e) => {
      if (e.type === "error") {
        return;
      }
      const data = e.data;
      Logger.debug(`message from drawio:${JSON.stringify(data)}`);
      if (e.type === "data") {
        this.dataEventHandler(data, document, webviewPanel);
      }
      if (e.type === "setting") {
        this.settingEventHandler(data, document, webviewPanel);
      }
    });
  }

  dataEventHandler(data: any, document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel) {
    if (data.event === "init") {
      webviewPanel.webview.postMessage({
        action: "load",
        autosave: 1,
        xml: document.getText(),
      });
    }

    if (data.event === "save") {
      webviewPanel.webview.postMessage({
        action: "export",
        xml: data.xml,
      });
    }
    if (data.event === "autosave") {
      this.updateDocument(document,data.xml);
    }

    if (data.event === "export") {
      this.updateDocument(document,data.xml,true);
    }
    if (data.event === "error") {
      Logger.debug(`Error: ${JSON.stringify(data)}`);
    }
  }

  settingEventHandler(data: any, document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel) {
    this.context.workspaceState.update("drawio", JSON.stringify(data || {}));
  }

  private updateDocument(document: vscode.TextDocument, newContent: string, save?: boolean) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), newContent);
    const editTask = vscode.workspace.applyEdit(edit);
    if (save) {
      editTask.then(() => {
        document.save();
      });
    }
  }
}
