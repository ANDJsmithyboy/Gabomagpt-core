/* GabomaGPT · haptics.ts · SmartANDJ AI Technologies
   Haptic feedback pour interactions natives (Capacitor)
   Vibration premium sur bouton envoi, mode switch, upgrade */

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

/** Vibration légère — navigation, toggle */
export async function hapticLight(): Promise<void> {
	if (!isNative) return;
	try {
		await Haptics.impact({ style: ImpactStyle.Light });
	} catch {
		// Pas de moteur haptique
	}
}

/** Vibration moyenne — bouton envoi "Or Massif" */
export async function hapticMedium(): Promise<void> {
	if (!isNative) return;
	try {
		await Haptics.impact({ style: ImpactStyle.Medium });
	} catch {
		// Silencieux
	}
}

/** Vibration forte — confirmation paiement, mode Black Panther activé */
export async function hapticHeavy(): Promise<void> {
	if (!isNative) return;
	try {
		await Haptics.impact({ style: ImpactStyle.Heavy });
	} catch {
		// Silencieux
	}
}

/** Notification success — paiement réussi */
export async function hapticSuccess(): Promise<void> {
	if (!isNative) return;
	try {
		await Haptics.notification({ type: NotificationType.Success });
	} catch {
		// Silencieux
	}
}

/** Notification warning — jetons faibles */
export async function hapticWarning(): Promise<void> {
	if (!isNative) return;
	try {
		await Haptics.notification({ type: NotificationType.Warning });
	} catch {
		// Silencieux
	}
}

/** Notification error — erreur paiement */
export async function hapticError(): Promise<void> {
	if (!isNative) return;
	try {
		await Haptics.notification({ type: NotificationType.Error });
	} catch {
		// Silencieux
	}
}
