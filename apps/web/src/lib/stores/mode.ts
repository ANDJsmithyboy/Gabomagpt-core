/* GabomaGPT · mode.ts
   SmartANDJ AI Technologies · Constitution Zion Core
   Fondateur : Daniel Jonathan ANDJ
   Store Svelte pour les 3 modes : Flash / Pro / Black Panther */

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

/* ── Types ────────────────────────────────────────── */
export type Mode = 'flash' | 'pro' | 'bp';

export interface ModeConfig {
	label: string;
	emoji: string;
	model: string;
	provider: 'groq' | 'anthropic';
	color: string;
	colorGlow: string;
	description: string;
}

/* ── Mapping modèles → fournisseurs ─────────────── */
export const MODEL_MAP: Record<Mode, ModeConfig> = {
	flash: {
		label: 'Flash',
		emoji: '⚡',
		model: 'llama-3.3-8b-instant',
		provider: 'groq',
		color: '#F57F17',
		colorGlow: '#FFD54F',
		description: 'Rapide et léger — réponses instantanées'
	},
	pro: {
		label: 'Pro',
		emoji: '🐬',
		model: 'llama-3.3-70b-versatile',
		provider: 'groq',
		color: '#01579B',
		colorGlow: '#29B6F6',
		description: 'Puissant et polyvalent — raisonnement avancé'
	},
	bp: {
		label: 'Black Panther',
		emoji: '🐆',
		model: 'claude-sonnet-4-20250514',
		provider: 'anthropic',
		color: '#FF2244',
		colorGlow: '#FF2244',
		description: 'Agent autonome — actions Airtel Money, navigation web'
	}
};

/* ── Store principal ─────────────────────────────── */
function createModeStore() {
	/* Récupérer le mode sauvegardé dans localStorage */
	const stored = browser ? (localStorage.getItem('gabomagpt-mode') as Mode | null) : null;
	const initial: Mode = stored && stored in MODEL_MAP ? stored : 'flash';

	const { subscribe, set, update } = writable<Mode>(initial);

	return {
		subscribe,
		set: (mode: Mode) => {
			set(mode);
			if (browser) {
				localStorage.setItem('gabomagpt-mode', mode);
				/* Basculer la classe body.mode-bp pour le thème Black Panther */
				if (mode === 'bp') {
					document.body.classList.add('mode-bp');
				} else {
					document.body.classList.remove('mode-bp');
				}
			}
		},
		update
	};
}

export const activeMode = createModeStore();

/* ── Stores dérivés ──────────────────────────────── */
export const activeModeConfig = derived(activeMode, ($mode: Mode) => MODEL_MAP[$mode]);
export const activeModel = derived(activeMode, ($mode: Mode) => MODEL_MAP[$mode].model);
export const activeProvider = derived(activeMode, ($mode: Mode) => MODEL_MAP[$mode].provider);
export const isBPMode = derived(activeMode, ($mode: Mode) => $mode === 'bp');

/* ── Initialisation au chargement — appliquer la classe body si BP ── */
if (browser) {
	const stored = localStorage.getItem('gabomagpt-mode');
	if (stored === 'bp') {
		document.body.classList.add('mode-bp');
	}
}
