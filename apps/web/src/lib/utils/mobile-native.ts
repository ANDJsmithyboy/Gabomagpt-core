/* GabomaGPT · mobile-native.ts · SmartANDJ AI Technologies
   Utilitaires Mobile Natif — Haptics, StatusBar, Keyboard, Offline
   Fondateur: Daniel Jonathan ANDJ */

import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

// ── Haptic Feedback ─────────────────────────────────────────
export const haptics = {
	/** Tap léger — bouton pressé */
	async light() {
		if (!isNative) return;
		const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
		await Haptics.impact({ style: ImpactStyle.Light });
	},
	/** Tap moyen — action confirmée */
	async medium() {
		if (!isNative) return;
		const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
		await Haptics.impact({ style: ImpactStyle.Medium });
	},
	/** Tap fort — erreur ou alerte */
	async heavy() {
		if (!isNative) return;
		const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
		await Haptics.impact({ style: ImpactStyle.Heavy });
	},
	/** Notification success — réponse IA terminée */
	async success() {
		if (!isNative) return;
		const { Haptics, NotificationType } = await import('@capacitor/haptics');
		await Haptics.notification({ type: NotificationType.Success });
	},
	/** Vibration sélection */
	async selection() {
		if (!isNative) return;
		const { Haptics } = await import('@capacitor/haptics');
		await Haptics.selectionStart();
		await Haptics.selectionChanged();
		await Haptics.selectionEnd();
	}
};

// ── Status Bar ──────────────────────────────────────────────
export async function configureStatusBar(isDark: boolean) {
	if (!isNative) return;
	const { StatusBar, Style } = await import('@capacitor/status-bar');
	await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
	if (platform === 'android') {
		await StatusBar.setBackgroundColor({ color: isDark ? '#050810' : '#FFFFFF' });
	}
	await StatusBar.setOverlaysWebView({ overlay: true });
}

// ── Keyboard ────────────────────────────────────────────────
export async function setupKeyboardListeners(
	onShow: (height: number) => void,
	onHide: () => void
) {
	if (!isNative) return;
	const { Keyboard } = await import('@capacitor/keyboard');
	await Keyboard.addListener('keyboardWillShow', (info) => {
		onShow(info.keyboardHeight);
		document.body.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
	});
	await Keyboard.addListener('keyboardWillHide', () => {
		onHide();
		document.body.style.setProperty('--keyboard-height', '0px');
	});
}

// ── Network / Offline ───────────────────────────────────────
export async function setupNetworkWatcher(
	onOnline: () => void,
	onOffline: () => void
) {
	if (!isNative) {
		window.addEventListener('online', onOnline);
		window.addEventListener('offline', onOffline);
		return;
	}
	const { Network } = await import('@capacitor/network');
	await Network.addListener('networkStatusChange', (status) => {
		if (status.connected) onOnline();
		else onOffline();
	});
}

export async function isOnline(): Promise<boolean> {
	if (!isNative) return navigator.onLine;
	const { Network } = await import('@capacitor/network');
	const status = await Network.getStatus();
	return status.connected;
}

// ── Deep Linking ────────────────────────────────────────────
export async function setupDeepLinks(handler: (url: string) => void) {
	if (!isNative) return;
	const { App } = await import('@capacitor/app');
	await App.addListener('appUrlOpen', (event) => {
		handler(event.url);
	});
}

// ── Safe Area CSS Variables ─────────────────────────────────
export function injectSafeAreas() {
	if (!isNative) return;
	document.body.classList.add('capacitor');
	document.body.classList.add(`platform-${platform}`);
}

// ── Init All Mobile Features ────────────────────────────────
export async function initMobileNative() {
	if (!isNative) return;

	injectSafeAreas();
	await configureStatusBar(true);

	// Hide splash after app is ready
	setTimeout(async () => {
		const { SplashScreen } = await import('@capacitor/splash-screen');
		await SplashScreen.hide({ fadeOutDuration: 500 });
	}, 800);
}

export { isNative, platform };
