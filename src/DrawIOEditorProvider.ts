import * as vscode from "vscode";

const viewType = "vscode-drawio.editor";
export class DrawIOEditorProvider implements vscode.CustomTextEditorProvider{
  static register(context: vscode.ExtensionContext){
    const provider = new DrawIOEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(viewType, provider);
		return providerRegistration;
  }

  constructor(
		private readonly context: vscode.ExtensionContext
	) {

  }

  resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void> {
    throw new Error("Method not implemented.");
  }
}
