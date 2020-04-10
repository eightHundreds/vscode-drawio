import * as vscode from 'vscode';
import { DrawIOEditorProvider } from './DrawIOEditorProvider';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(DrawIOEditorProvider.register(context));
}

export function deactivate() {}
