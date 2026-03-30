/* GabomaGPT · gabomagpt-models.ts
   SmartANDJ AI Technologies · Constitution Zion Core
   Fondateur : Daniel Jonathan ANDJ
   
   Mapping des noms techniques vers noms GabomaGPT Premium
   Flash ⚡ / Pro 🐬 / Black Panther 🐆
*/

/** Correspondance nom technique → nom GabomaGPT affiche */
const MODEL_NAME_MAP: Record<string, string> = {
	// ── Flash ⚡ (Groq rapide) ──
	'llama-3.3-8b-instant': 'GabomaGPT Flash ⚡',
	'llama3-8b-8192': 'GabomaGPT Flash ⚡',
	'llama-3.1-8b-instant': 'GabomaGPT Flash ⚡',
	'gemma2-9b-it': 'GabomaGPT Flash Lite ⚡',

	// ── GPT-OSS 120B (Groq — modele principal) ──
	'gpt-oss-120b': 'GabomaGPT Flash ⚡',
	'openai/gpt-oss-120b': 'GabomaGPT Flash ⚡',

	// ── Pro 🐬 (Groq puissant) ──
	'llama-3.3-70b-versatile': 'GabomaGPT Pro 🐬',
	'llama3-70b-8192': 'GabomaGPT Pro 🐬',
	'llama-3.1-70b-versatile': 'GabomaGPT Pro 🐬',
	'mixtral-8x7b-32768': 'GabomaGPT Pro Mix 🐬',
	'deepseek-r1-distill-llama-70b': 'GabomaGPT Pro Deep 🐬',

	// ── Black Panther 🐆 (Anthropic elite) ──
	'claude-sonnet-4-20250514': 'GabomaGPT Panthère 🐆',
	'claude-3-5-sonnet-20241022': 'GabomaGPT Panthère 🐆',
	'claude-3-5-haiku-20241022': 'GabomaGPT Panthère Lite 🐆',
	'claude-3-opus-20240229': 'GabomaGPT Panthère Elite 🐆',

	// ── OpenAI (si configure) ──
	'gpt-4o': 'GabomaGPT Elite 🌍',
	'gpt-4o-mini': 'GabomaGPT Elite Lite 🌍',
	'gpt-4-turbo': 'GabomaGPT Elite Turbo 🌍'
};

/**
 * Retourne le nom GabomaGPT Premium pour un modele donne.
 * Si le modele n'est pas dans la map, retourne le nom original
 * avec un nettoyage basique (suppression du prefixe provider).
 */
export function getGabomaGPTModelName(modelId: string, originalName?: string): string {
	// Verifier la correspondance exacte
	if (MODEL_NAME_MAP[modelId]) {
		return MODEL_NAME_MAP[modelId];
	}

	// Verifier par correspondance partielle (le modele peut avoir un prefixe comme "groq/")
	const bareId = modelId.includes('/') ? modelId.split('/').pop()! : modelId;
	if (MODEL_NAME_MAP[bareId]) {
		return MODEL_NAME_MAP[bareId];
	}

	// Si pas de correspondance, retourner le nom original ou un nom nettoye
	if (originalName) {
		return originalName;
	}

	// Nettoyage basique : capitaliser, supprimer les prefixes provider
	return bareId
		.replace(/^(groq|openai|anthropic)[/-]/i, '')
		.replace(/-/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Retourne la couleur d'accent associee au mode du modele.
 */
export function getModelAccentColor(modelId: string): string {
	const bareId = modelId.includes('/') ? modelId.split('/').pop()! : modelId;

	// Flash = Jaune
	if (bareId.includes('8b') || bareId.includes('gemma')) {
		return '#FFD54F';
	}
	// Pro = Bleu
	if (bareId.includes('70b') || bareId.includes('mixtral') || bareId.includes('deepseek')) {
		return '#29B6F6';
	}
	// Panthere = Rouge
	if (bareId.includes('claude')) {
		return '#FF2244';
	}
	// Elite = Vert
	if (bareId.includes('gpt')) {
		return '#2ECC8A';
	}

	// Default = accent Zion Core
	return 'var(--accent, #2ECC8A)';
}
