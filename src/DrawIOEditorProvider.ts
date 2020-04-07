import * as vscode from "vscode";
interface Edit {
  readonly points: [number, number][];
  readonly data: Uint8Array;
}

const viewType = "CustomDocument";
export class DrawIOEditorProvider
  implements vscode.CustomEditorProvider<Edit>, vscode.CustomEditorEditingDelegate<Edit> {
  private _onDidEdit = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<Edit>>();
  onDidEdit: vscode.Event<vscode.CustomDocumentEditEvent<Edit>> = this._onDidEdit.event;
  get editingDelegate() {
    return this;
  }
  save(document: vscode.CustomDocument<Edit>, cancellation: vscode.CancellationToken): Thenable<void> {
    return Promise.resolve();
  }
  saveAs(document: vscode.CustomDocument<Edit>, targetResource: vscode.Uri): Thenable<void> {
    return Promise.resolve();
  }
  applyEdits(document: vscode.CustomDocument<Edit>, edits: readonly Edit[]): Thenable<void> {
    return Promise.resolve();
  }
  undoEdits(document: vscode.CustomDocument<Edit>, edits: readonly Edit[]): Thenable<void> {
    return Promise.resolve();
  }
  revert(document: vscode.CustomDocument<Edit>, edits: vscode.CustomDocumentRevert<Edit>): Thenable<void> {
    return Promise.resolve();
  }
  backup(document: vscode.CustomDocument<Edit>, cancellation: vscode.CancellationToken): Thenable<void> {
    return Promise.resolve();
  }

  openCustomDocument(uri: vscode.Uri, token: vscode.CancellationToken): Thenable<vscode.CustomDocument<Edit>> {
    return Promise.resolve(new DrawIODocument(viewType,uri));
  }
  resolveCustomEditor(
    document: vscode.CustomDocument<Edit>,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Thenable<void> {
    return Promise.resolve();
  }
}
export class DrawIODocument extends vscode.CustomDocument<Edit> {}
