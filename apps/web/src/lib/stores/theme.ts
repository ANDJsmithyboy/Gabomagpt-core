/* GabomaGPT · theme.ts · SmartANDJ AI Technologies
   5 thèmes basés sur les 5 pétales du logo */

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// ── Types ──────────────────────────────────────────────

export type ThemeKey = 'foret' | 'ocean' | 'soleil' | 'flamme' | 'nuit';

export interface ThemeConfig {
	key: ThemeKey;
	name: string;
	color: string;
}

export const themes: ThemeConfig[] = [
	{ key: 'foret', name: 'For\u00EAt Gabonaise', color: '#22C55E' },
	{ key: 'ocean', name: 'Oc\u00E9an Atlantique', color: '#38BDF8' },
	{ key: 'soleil', name: "Soleil d'Afrique", color: '#FACC15' },
	{ key: 'flamme', name: 'Flamme \u00C9quatoriale', color: '#EF4444' },
	{ key: 'nuit', name: 'Nuit Tropicale', color: '#7C3AED' }
];

const STORAGE_KEY = 'gabomagpt_theme';
const DEFAULT_THEME: ThemeKey = 'foret';

function loadTheme(): ThemeKey {
	if (!browser) return DEFAULT_THEME;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored && themes.some((t) => t.key === stored)) {
			return stored as ThemeKey;
		}
	} catch {
		// localStorage indisponible
	}
	return DEFAULT_THEME;
}

function applyTheme(key: ThemeKey) {
	if (!browser) return;
	document.documentElement.setAttribute('data-theme', key);
}

// ── Store ──────────────────────────────────────────────

function createThemeStore() {
	const initial = loadTheme();
	const { subscribe, set } = writable<ThemeKey>(initial);

	// Appliquer immédiatement au chargement
	applyTheme(initial);

	return {
		subscribe,

		setTheme(key: ThemeKey) {
			applyTheme(key);
			if (browser) {
				try {
					localStorage.setItem(STORAGE_KEY, key);
				} catch {
					// Silencieux
				}
			}
			set(key);
		}
	};
}

export const currentTheme = createThemeStore();

// ── Derived : config du thème actif ────────────────────

export const currentThemeConfig = derived(currentTheme, ($theme) =>
	themes.find((t) => t.key === $theme) ?? themes[0]
);
