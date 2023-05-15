
import * as vscode from 'vscode';

function splitIntoWord(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
	let newSelections: vscode.Selection[] = [];
	
	for (let selection of textEditor.selections) {
		let line = textEditor.document.lineAt(selection.start);
		if (selection.isSingleLine) {

			if (line.text.length <= 1){
				continue;
			}

			let startIndex = 0;
			let isWord = false;

			const separatorSymbols: RegExp = /\s+/;
			for (let chIndx = selection.start.character; chIndx <= selection.end.character; chIndx++) {
				let symbol = line.text.charAt(chIndx);
				let foundSeparator = symbol.search(separatorSymbols);
				if ((foundSeparator === 0) || (chIndx === selection.end.character)){
					if (isWord){
						newSelections.push(new vscode.Selection(
							new vscode.Position(line.lineNumber, startIndex),
							new vscode.Position(line.lineNumber, chIndx),
						));
					}
					isWord = false;
				} else{
					if (isWord === false){
						startIndex = chIndx;
						isWord = true;
					}
				}
			}
			
			continue;
		}

		newSelections.push(new vscode.Selection(
			selection.start,
			line.range.end
		));
		for (let lineNum = selection.start.line + 1; lineNum < selection.end.line; lineNum++) {
			line = textEditor.document.lineAt(lineNum);
			newSelections.push(new vscode.Selection(
				line.range.start,
				line.range.end
			));
		}
		if (selection.end.character > 0) {
			newSelections.push(new vscode.Selection(
				selection.end.with(undefined, 0),
				selection.end
			));
		}
	}
	textEditor.selections = newSelections;
}


export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerTextEditorCommand('extension.splitIntoWord', splitIntoWord);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
