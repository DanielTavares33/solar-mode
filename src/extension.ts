// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as SunCalc from 'suncalc';

let timer: NodeJS.Timeout | undefined;
let statusBarItem: vscode.StatusBarItem;
let currentMode: 'day' | 'night' | undefined;
let manualOverride: boolean = false;

function getConfig() {
	const config = vscode.workspace.getConfiguration('sunsetTheme');
	return {
		enabled: config.get<boolean>('enabled', true),
		lightTheme: config.get<string>('lightTheme', 'Default Light+'),
		darkTheme: config.get<string>('darkTheme', 'Default Dark+'),
		latitude: config.get<number>('latitude'),
		longitude: config.get<number>('longitude'),
	};
}

function getSunTimes(date: Date, lat: number, lon: number) {
	try {
		return SunCalc.getTimes(date, lat, lon);
	} catch {
		return undefined;
	}
}

async function getCurrentTheme(): Promise<string> {
	const config = vscode.workspace.getConfiguration('workbench');
	return config.get<string>('colorTheme', '');
}

async function setTheme(theme: string) {
	const current = await getCurrentTheme();
	if (current !== theme) {
		await vscode.workspace.getConfiguration('workbench').update('colorTheme', theme, vscode.ConfigurationTarget.Global);
	}
}

function updateStatusBar(mode: 'day' | 'night') {
	if (!statusBarItem) { return; }
	if (mode === 'day') {
		statusBarItem.text = '$(sun) Day mode';
	} else {
		statusBarItem.text = '$(moon) Night mode';
	}
	statusBarItem.tooltip = 'Sunset Theme Switcher';
	statusBarItem.show();
}

function clearTimer() {
	if (timer) {
		clearTimeout(timer);
		timer = undefined;
	}
}

async function applyThemeAndSchedule(context: vscode.ExtensionContext) {
	clearTimer();
	const cfg = getConfig();

	if (!cfg.enabled || typeof cfg.latitude !== 'number' || typeof cfg.longitude !== 'number') {
		return;
	}

	if (manualOverride) {
		// If user manually toggled, skip automatic switching until next event
		manualOverride = false;
		// But still schedule the next event
		let nextEvent: Date;
		const now = new Date();
		const sun = getSunTimes(now, cfg.latitude, cfg.longitude);
		if (!sun || !sun.sunrise || !sun.sunset) {
			return;
		}
		const isDay = now >= sun.sunrise && now < sun.sunset;
		if (isDay) {
			nextEvent = sun.sunset;
		} else {
			const tomorrow = new Date(now);
			tomorrow.setDate(now.getDate() + 1);
			const nextSun = getSunTimes(tomorrow, cfg.latitude, cfg.longitude);
			nextEvent = nextSun?.sunrise || new Date(tomorrow.setHours(6,0,0,0));
		}
		const ms = nextEvent.getTime() - now.getTime();
		if (ms > 0) {
			timer = setTimeout(() => applyThemeAndSchedule(context), ms);
		}
		return;
	}

	const now = new Date();
	const sun = getSunTimes(now, cfg.latitude, cfg.longitude);
	if (!sun || !sun.sunrise || !sun.sunset) {
		return;
	}

	const isDay = now >= sun.sunrise && now < sun.sunset;
	const mode: 'day' | 'night' = isDay ? 'day' : 'night';
	currentMode = mode;
	await setTheme(isDay ? cfg.lightTheme : cfg.darkTheme);
	updateStatusBar(mode);

	// Schedule next event
	let nextEvent: Date;
	if (isDay) {
		nextEvent = sun.sunset;
	} else {
		// Next sunrise may be tomorrow
		const tomorrow = new Date(now);
		tomorrow.setDate(now.getDate() + 1);
		const nextSun = getSunTimes(tomorrow, cfg.latitude, cfg.longitude);
		nextEvent = nextSun?.sunrise || new Date(tomorrow.setHours(6,0,0,0));
	}

	const ms = nextEvent.getTime() - now.getTime();
	if (ms > 0) {
		timer = setTimeout(() => applyThemeAndSchedule(context), ms);
	}
}

async function toggleTheme(context: vscode.ExtensionContext) {
	const cfg = getConfig();
	const currentTheme = await getCurrentTheme();
	const isCurrentlyDayTheme = currentTheme === cfg.lightTheme;

	// Toggle to the opposite theme
	if (isCurrentlyDayTheme) {
		await setTheme(cfg.darkTheme);
		currentMode = 'night';
	} else {
		await setTheme(cfg.lightTheme);
		currentMode = 'day';
	}

	updateStatusBar(currentMode);
	manualOverride = true;
	applyThemeAndSchedule(context);
}

export function activate(context: vscode.ExtensionContext) {
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'sunsetTheme.toggle';
	context.subscriptions.push(statusBarItem);

	context.subscriptions.push(vscode.commands.registerCommand('sunsetTheme.toggle', () => toggleTheme(context)));

	vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('sunsetTheme')) {
			applyThemeAndSchedule(context);
		}
	}, null, context.subscriptions);

	applyThemeAndSchedule(context);
}

export function deactivate() {
	clearTimer();
	if (statusBarItem) {
		statusBarItem.dispose();
	}
}
