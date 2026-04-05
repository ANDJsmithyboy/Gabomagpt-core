/* GabomaGPT · gabomagpt-models.ts
   SmartANDJ AI Technologies · Constitution Zion Core
   Fondateur : Daniel Jonathan ANDJ
   
   REGLE ABSOLUE : Aucun nom tiers (Groq, Llama, Claude, OpenAI,
   Whisper, Gemini, Deepseek, Qwen) ne doit JAMAIS apparaitre dans l'UI.
   Seul l'admin Daniel connait les vrais modeles derriere chaque tier.
*/

/** Correspondance exacte nom technique → nom GabomaGPT */
const MODEL_NAME_MAP: Record<string, string> = {
	// ── Flash (rapide, gratuit) ──
	'llama-3.3-8b-instant': 'GabomaGPT Flash',
	'llama3-8b-8192': 'GabomaGPT Flash',
	'llama-3.1-8b-instant': 'GabomaGPT Flash',
	'gemma2-9b-it': 'GabomaGPT Flash',
	'gemma-7b-it': 'GabomaGPT Flash',
	'gpt-oss-120b': 'GabomaGPT Flash',
	'openai/gpt-oss-120b': 'GabomaGPT Flash',

	// ── Pro (equilibre, puissant) ──
	'llama-3.3-70b-versatile': 'GabomaGPT Pro',
	'llama3-70b-8192': 'GabomaGPT Pro',
	'llama-3.1-70b-versatile': 'GabomaGPT Pro',
	'mixtral-8x7b-32768': 'GabomaGPT Pro',

	// ── Elite (expert, precis) ──
	'llama-3.1-405b-reasoning': 'GabomaGPT Elite',
	'gpt-4o': 'GabomaGPT Elite',
	'gpt-4o-mini': 'GabomaGPT Elite',
	'gpt-4-turbo': 'GabomaGPT Elite',

	// ── Black Panther (agent autonome) ──
	'deepseek-r1-distill-llama-70b': 'GabomaGPT Black Panther',
	'deepseek-coder': 'GabomaGPT Black Panther',
	'qwen-2.5-72b': 'GabomaGPT Black Panther',
	'qwen-2.5-coder-32b': 'GabomaGPT Black Panther',

	// ── Panthere Pro (API illimitee) ──
	'claude-sonnet-4-20250514': 'GabomaGPT Panthere Pro',
	'claude-3-5-sonnet-20241022': 'GabomaGPT Panthere Pro',
	'claude-3-5-haiku-20241022': 'GabomaGPT Panthere Pro',
	'claude-3-opus-20240229': 'GabomaGPT Panthere Pro',

	// ── Voice (speech/audio) ──
	'whisper-large-v3': 'GabomaGPT Voice',
	'whisper-large-v3-turbo': 'GabomaGPT Voice',
	'whisper-1': 'GabomaGPT Voice'
};

/** Mots-cles pour le pattern matching en fallback (JAMAIS de noms tiers) */
const PATTERN_RULES: Array<{ patterns: string[]; display: string }> = [
	{ patterns: ['whisper', 'tts', 'speech', 'audio', 'voice'], display: 'GabomaGPT Voice' },
	{ patterns: ['panthere', 'claude', 'anthropic', 'opus', 'sonnet', 'haiku'], display: 'GabomaGPT Panthere Pro' },
	{ patterns: ['black', 'panther', 'deepseek', 'qwen', 'coder'], display: 'GabomaGPT Black Panther' },
	{ patterns: ['elite', '405b', 'gpt-4', 'gpt4'], display: 'GabomaGPT Elite' },
	{ patterns: ['pro', '70b', 'mixtral', 'llama-3.3'], display: 'GabomaGPT Pro' },
	{ patterns: ['flash', 'gemma', 'fast', '8b', 'instant', 'mini', 'small', 'lite'], display: 'GabomaGPT Flash' }
];

/**
 * Retourne le nom GabomaGPT brande pour un modele donne.
 * REGLE ABSOLUE : ne retourne JAMAIS un nom tiers.
 * Fallback = "GabomaGPT Flash" (jamais un nom technique brut).
 */
export function getGabomaGPTModelName(modelId: string, _originalName?: string): string {
	if (!modelId) return 'GabomaGPT Flash';

	// 1. Correspondance exacte
	if (MODEL_NAME_MAP[modelId]) {
		return MODEL_NAME_MAP[modelId];
	}

	// 2. Strip provider prefix (groq/, openai/, anthropic/, etc.)
	const bareId = modelId.includes('/') ? modelId.split('/').pop()! : modelId;
	if (MODEL_NAME_MAP[bareId]) {
		return MODEL_NAME_MAP[bareId];
	}

	// 3. Pattern matching sur l'ID
	const lower = (bareId + ' ' + (modelId || '')).toLowerCase();
	for (const rule of PATTERN_RULES) {
		if (rule.patterns.some((p) => lower.includes(p))) {
			return rule.display;
		}
	}

	// 4. FALLBACK ABSOLU — jamais de nom tiers
	return 'GabomaGPT Flash';
}

/**
 * Tiers visibles pour les utilisateurs non-admin.
 * L'admin voit TOUT. Les users voient uniquement Flash, Pro, Black Panther.
 */
export const USER_VISIBLE_TIERS = ['GabomaGPT Flash', 'GabomaGPT Pro', 'GabomaGPT Black Panther'];

/**
 * Descriptions affichees dans le selecteur pour chaque tier.
 */
export const TIER_DESCRIPTIONS: Record<string, string> = {
	'GabomaGPT Flash': 'Rapide et léger — réponses instantanées',
	'GabomaGPT Pro': 'Puissant et polyvalent — raisonnement avancé',
	'GabomaGPT Black Panther': 'Agent autonome — actions Airtel Money, navigation web'
};

/**
 * Filtre les modeles pour les utilisateurs non-admin.
 * Retourne seulement 1 modele par tier visible (Flash, Pro, Black Panther).
 */
export function filterModelsForUser(models: any[], isAdmin: boolean): any[] {
	if (isAdmin) return models;
	const seen = new Set<string>();
	return models.filter((m) => {
		if (!m?.id) return false;
		const tierName = getGabomaGPTModelName(m.id, m.name);
		if (!USER_VISIBLE_TIERS.includes(tierName)) return false;
		if (seen.has(tierName)) return false;
		seen.add(tierName);
		return true;
	});
}

/**
 * Retourne la description courte du tier pour l'UI.
 */
export function getGabomaGPTModelDescription(modelId: string): string {
	const name = getGabomaGPTModelName(modelId);
	if (name.includes('Voice')) return 'Reconnaissance vocale';
	if (name.includes('Panthere Pro')) return 'API Illimitee';
	if (name.includes('Black Panther')) return 'Agent Autonome';
	if (name.includes('Elite')) return 'Expert & Precis';
	if (name.includes('Pro')) return 'Equilibre & Puissant';
	return 'Rapide & Gratuit';
}

/**
 * Retourne la couleur d'accent associee au tier du modele.
 */
export function getModelAccentColor(modelId: string): string {
	const name = getGabomaGPTModelName(modelId);
	if (name.includes('Voice')) return '#D4AF37';
	if (name.includes('Panthere Pro')) return '#D4AF37';
	if (name.includes('Black Panther')) return '#FF2244';
	if (name.includes('Elite')) return '#D4AF37';
	if (name.includes('Pro')) return '#1A3A2A';
	return '#2ECC8A';
}
