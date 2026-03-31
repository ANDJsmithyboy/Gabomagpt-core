/* GabomaGPT · gabomagpt.ts · SmartANDJ AI Technologies
   Store principal : plan, jetons, mode Black Panther, paiement */

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// ── Types ──────────────────────────────────────────────

export type PlanKey = 'flash' | 'pro' | 'elite' | 'panther' | 'panther_pro';

export interface PlanConfig {
	name: string;
	price: number;
	currency: string;
	tokens: number;
	tokensReset: 'daily' | 'one-time';
	color: string;
	icon: string;
}

export const PLANS: Record<PlanKey, PlanConfig> = {
	flash: {
		name: 'GabomaGPT Flash',
		price: 0,
		currency: 'FCFA',
		tokens: 50,
		tokensReset: 'daily',
		color: '#22C55E',
		icon: '\u26A1'
	},
	pro: {
		name: 'GabomaGPT Pro',
		price: 2500,
		currency: 'FCFA',
		tokens: 500,
		tokensReset: 'one-time',
		color: '#38BDF8',
		icon: '\uD83D\uDD35'
	},
	elite: {
		name: 'GabomaGPT \u00C9lite',
		price: 13000,
		currency: 'FCFA',
		tokens: 3000,
		tokensReset: 'one-time',
		color: '#FACC15',
		icon: '\uD83C\uDF1F'
	},
	/* PHASE 2 — Plans premium activés après premiers revenus
	panther: {
		name: 'GabomaGPT Black Panther',
		price: 50000,
		currency: 'FCFA',
		tokens: 12000,
		tokensReset: 'one-time',
		color: '#D4A417',
		icon: '\u26AB'
	},
	panther_pro: {
		name: 'GabomaGPT Panthère Pro',
		price: 150000,
		currency: 'FCFA',
		tokens: 45000,
		tokensReset: 'one-time',
		color: '#FF6B00',
		icon: '\uD83D\uDD25'
	}
	*/
};

export const AGENT_COST = 50;

// Super Admin — jetons illimités (Daniel Jonathan ANDJ)
export const SUPER_ADMIN_EMAILS = [
	'danielandj@smartandj.com',
	'daniel@smartandj.com',
	'admin@gabomagpt.com',
	'andjdanieljonathan@gmail.com',
	'daniel.jonathan.andj@gmail.com'
];

export function isSuperAdmin(email?: string): boolean {
	if (!email) return false;
	return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
}

export type PaymentStep = 'choose_plan' | 'choose_operator' | 'processing' | 'success' | 'error';
export type OperatorKey = 'airtel' | 'moov';

export interface GabomaState {
	plan: PlanKey;
	tokens: number;
	tokensMax: number;
	isSuperAdmin: boolean;
	isPantherMode: boolean;
	isPaymentModalOpen: boolean;
	isUpgradeModalOpen: boolean;
	paymentStep: PaymentStep;
	targetPlan: PlanKey | null;
	targetOperator: OperatorKey | null;
	userName: string;
	userEmail: string;
	language: string;
	isApiHealthy: boolean;
	thinkingMessage: string;
	isThinking: boolean;
	visitCount: number;
}

const STORAGE_KEY = 'gabomagpt_state';

const defaultState: GabomaState = {
	plan: 'flash',
	tokens: 50,
	tokensMax: 50,
	isSuperAdmin: false,
	isPantherMode: false,
	isPaymentModalOpen: false,
	isUpgradeModalOpen: false,
	paymentStep: 'choose_plan',
	targetPlan: null,
	targetOperator: null,
	userName: '',
	userEmail: '',
	language: 'fr',
	isApiHealthy: true,
	thinkingMessage: '',
	isThinking: false,
	visitCount: 0
};

function loadState(): GabomaState {
	if (!browser) return defaultState;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as Partial<GabomaState>;
			return { ...defaultState, ...parsed };
		}
	} catch {
		// Corrompu, on repart de zéro
	}
	return defaultState;
}

function saveState(state: GabomaState) {
	if (!browser) return;
	try {
		// On ne persiste pas les états éphémères
		const { isPaymentModalOpen, isUpgradeModalOpen, paymentStep, targetPlan, targetOperator, isApiHealthy, thinkingMessage, isThinking, ...persistable } = state;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
	} catch {
		// localStorage plein ou indisponible
	}
}

// ── Store writable ─────────────────────────────────────

function createGabomaStore() {
	const initial = loadState();
	const { subscribe, set, update } = writable<GabomaState>(initial);

	// Appliquer mode panther au body dès le chargement
	if (browser && initial.isPantherMode) {
		document.body.classList.add('panther');
	}

	return {
		subscribe,

		togglePantherMode() {
			update((s) => {
				const next = !s.isPantherMode;
				if (browser) {
					document.body.classList.toggle('panther', next);
				}
				const newState = { ...s, isPantherMode: next };
				saveState(newState);
				return newState;
			});
		},

		consumeTokens(amount: number): boolean {
			let success = false;
			update((s) => {
				// Super Admin = jetons illimités
				if (s.isSuperAdmin) {
					success = true;
					return s;
				}
				if (s.tokens >= amount) {
					const newState = { ...s, tokens: s.tokens - amount };
					saveState(newState);
					success = true;
					return newState;
				}
				// Pas assez de jetons → ouvrir modal paiement
				const newState = { ...s, isPaymentModalOpen: true, targetPlan: null };
				return newState;
			});
			return success;
		},

		creditTokens(amount: number) {
			update((s) => {
				const newState = {
					...s,
					tokens: Math.min(s.tokens + amount, s.tokensMax)
				};
				saveState(newState);
				return newState;
			});
		},

		setPlan(plan: PlanKey) {
			update((s) => {
				const planConfig = PLANS[plan];
				const newState = {
					...s,
					plan,
					tokens: planConfig.tokens,
					tokensMax: planConfig.tokens
				};
				saveState(newState);
				return newState;
			});
		},

		openPaymentModal(targetPlan: PlanKey | null = null, step: PaymentStep = 'choose_plan') {
			update((s) => ({ ...s, isPaymentModalOpen: true, isUpgradeModalOpen: false, targetPlan, paymentStep: step, targetOperator: null }));
		},

		closePaymentModal() {
			update((s) => ({ ...s, isPaymentModalOpen: false, targetPlan: null, paymentStep: 'choose_plan', targetOperator: null }));
		},

		openUpgradeModal() {
			update((s) => ({ ...s, isUpgradeModalOpen: true }));
		},

		closeUpgradeModal() {
			update((s) => ({ ...s, isUpgradeModalOpen: false }));
		},

		incrementVisitCount() {
			update((s) => {
				const newState = { ...s, visitCount: s.visitCount + 1 };
				saveState(newState);
				return newState;
			});
		},

		setPaymentStep(step: PaymentStep) {
			update((s) => ({ ...s, paymentStep: step }));
		},

		setTargetOperator(op: OperatorKey | null) {
			update((s) => ({ ...s, targetOperator: op }));
		},

		setThinkingState(thinking: boolean, message = '') {
			update((s) => ({ ...s, isThinking: thinking, thinkingMessage: message }));
		},

		setApiHealth(healthy: boolean) {
			update((s) => ({ ...s, isApiHealthy: healthy }));
		},

		async checkApiHealth() {
			try {
				const res = await fetch('/health', { signal: AbortSignal.timeout(5000) });
				const healthy = res.ok;
				update((s) => ({ ...s, isApiHealthy: healthy }));
				return healthy;
			} catch {
				update((s) => ({ ...s, isApiHealthy: false }));
				return false;
			}
		},

		setUser(name: string, email: string) {
			update((s) => {
				const superAdmin = isSuperAdmin(email);
				const newState = {
					...s,
					userName: name,
					userEmail: email,
					isSuperAdmin: superAdmin,
					// Super admin gets unlimited tokens
					...(superAdmin ? { tokens: 999999, tokensMax: 999999 } : {})
				};
				saveState(newState);
				return newState;
			});
		},

		setSuperAdmin(email: string, role?: string) {
			update((s) => {
				const superAdmin = isSuperAdmin(email) || role === 'admin';
				const newState = {
					...s,
					isSuperAdmin: superAdmin,
					...(superAdmin ? { tokens: 999999, tokensMax: 999999 } : {})
				};
				saveState(newState);
				return newState;
			});
		},

		setLanguage(lang: string) {
			update((s) => {
				const newState = { ...s, language: lang };
				saveState(newState);
				return newState;
			});
		},

		reset() {
			if (browser) {
				document.body.classList.remove('panther');
			}
			set(defaultState);
			saveState(defaultState);
		}
	};
}

export const gabomaStore = createGabomaStore();

// ── Derived stores pour accès rapide ───────────────────

export const currentPlan = derived(gabomaStore, ($s) => PLANS[$s.plan]);
export const tokensLeft = derived(gabomaStore, ($s) => $s.tokens);
export const tokensPercent = derived(gabomaStore, ($s) =>
	$s.tokensMax > 0 ? Math.round(($s.tokens / $s.tokensMax) * 100) : 0
);
export const isPantherMode = derived(gabomaStore, ($s) => $s.isPantherMode);
export const isLowTokens = derived(gabomaStore, ($s) =>
	$s.tokensMax > 0 ? $s.tokens / $s.tokensMax < 0.2 : false
);
export const isPaymentModalOpen = derived(gabomaStore, ($s) => $s.isPaymentModalOpen);
export const isUpgradeModalOpen = derived(gabomaStore, ($s) => $s.isUpgradeModalOpen);
export const visitCount = derived(gabomaStore, ($s) => $s.visitCount);
export const isApiHealthy = derived(gabomaStore, ($s) => $s.isApiHealthy);
export const isThinking = derived(gabomaStore, ($s) => $s.isThinking);
export const thinkingMessage = derived(gabomaStore, ($s) => $s.thinkingMessage);
