import * as vscode from 'vscode'
import { extendMarkdownIt } from './extendMarkdownIt'

export async function activate(_context: vscode.ExtensionContext) {
  return {
    extendMarkdownIt,
  }
}

export function deactivate() {}
