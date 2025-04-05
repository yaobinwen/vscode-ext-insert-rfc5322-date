import * as vscode from 'vscode';

function toRFC5322Date(date: Date): string {
	const days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	const dayName: string = days[date.getDay()];
	const day: string = String(date.getDate()).padStart(2, '0');
	const month: string = months[date.getMonth()];
	const year: number = date.getFullYear();

	const hours: string = String(date.getHours()).padStart(2, '0');
	const minutes: string = String(date.getMinutes()).padStart(2, '0');
	const seconds: string = String(date.getSeconds()).padStart(2, '0');

	const tzOffset: number = -date.getTimezoneOffset(); // in minutes
	const tzSign: string = tzOffset >= 0 ? '+' : '-';
	const tzHours: string = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, '0');
	const tzMinutes: string = String(Math.abs(tzOffset) % 60).padStart(2, '0');
	const tzString: string = `${tzSign}${tzHours}${tzMinutes}`;

	return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} ${tzString}`;
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "insertrfc5322datetime" is now active!');

	const disposable = vscode.commands.registerCommand('insertrfc5322datetime.insert', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const now = new Date();
		const nowRFC5322 = toRFC5322Date(now);

		editor.edit(editBuilder => {
			const positions = editor.selections;
			for (const position of positions) {
				editBuilder.insert(position.active, nowRFC5322);
			}
		});

		// Display a message box to the user
		vscode.window.showInformationMessage('An RFC 5322 date/time has been inserted!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
