// GabomaGPT Model Masking Utility
// SmartANDJ AI Technologies · Constitution Zion Core
// Fondateur: Daniel Jonathan ANDJ

const GABOMA_MODEL_MAP: Record<string, {
  display: string;
  icon: string;
  tier: 'flash' | 'pro' | 'black_panther';
}> = {
  // Groq models — Flash ⚡
  'llama-3.1-8b-instant': {
    display: 'GabomaGPT Flash',
    icon: '⚡',
    tier: 'flash'
  },
  'llama-3.3-8b-instant': {
    display: 'GabomaGPT Flash',
    icon: '⚡',
    tier: 'flash'
  },
  'llama3-8b-8192': {
    display: 'GabomaGPT Flash',
    icon: '⚡',
    tier: 'flash'
  },
  'gemma2-9b-it': {
    display: 'GabomaGPT Flash Lite',
    icon: '⚡',
    tier: 'flash'
  },
  'gpt-oss-120b': {
    display: 'GabomaGPT Flash',
    icon: '⚡',
    tier: 'flash'
  },
  'openai/gpt-oss-120b': {
    display: 'GabomaGPT Flash',
    icon: '⚡',
    tier: 'flash'
  },

  // Groq models — Pro 🔥
  'llama-3.3-70b-versatile': {
    display: 'GabomaGPT Pro',
    icon: '🔥',
    tier: 'pro'
  },
  'llama3-70b-8192': {
    display: 'GabomaGPT Pro',
    icon: '🔥',
    tier: 'pro'
  },
  'llama-3.1-70b-versatile': {
    display: 'GabomaGPT Pro',
    icon: '🔥',
    tier: 'pro'
  },
  'mixtral-8x7b-32768': {
    display: 'GabomaGPT Pro Mix',
    icon: '🔥',
    tier: 'pro'
  },
  'deepseek-r1-distill-llama-70b': {
    display: 'GabomaGPT Pro Deep',
    icon: '🔥',
    tier: 'pro'
  },

  // Anthropic models — Black Panther 🐆
  'claude-sonnet-4-20250514': {
    display: 'GabomaGPT Panthère',
    icon: '🐆',
    tier: 'black_panther'
  },
  'claude-3-5-sonnet-20241022': {
    display: 'GabomaGPT Panthère',
    icon: '🐆',
    tier: 'black_panther'
  },
  'claude-3-5-haiku-20241022': {
    display: 'GabomaGPT Panthère Lite',
    icon: '🐆',
    tier: 'black_panther'
  },
  'claude-3-opus-20240229': {
    display: 'GabomaGPT Panthère Elite',
    icon: '🐆',
    tier: 'black_panther'
  },

  // OpenAI models (if configured)
  'gpt-4o': {
    display: 'GabomaGPT Elite',
    icon: '🌍',
    tier: 'black_panther'
  },
  'gpt-4o-mini': {
    display: 'GabomaGPT Elite Lite',
    icon: '🌍',
    tier: 'pro'
  },
  'gpt-4-turbo': {
    display: 'GabomaGPT Elite Turbo',
    icon: '🌍',
    tier: 'black_panther'
  }
};

// Catch-all function for complete model masking
export function getGabomaModelName(modelId: string): string {
  if (!modelId) return 'GabomaGPT';
  
  // Exact match
  const exact = GABOMA_MODEL_MAP[modelId];
  if (exact) return exact.display;
  
  // Fuzzy matching - remove provider prefixes
  const bareId = modelId.includes('/') ? modelId.split('/').pop()! : modelId;
  const bareMatch = GABOMA_MODEL_MAP[bareId];
  if (bareMatch) return bareMatch.display;
  
  // Pattern matching
  const lower = modelId.toLowerCase();
  if (lower.includes('8b') || lower.includes('flash') || lower.includes('instant') || lower.includes('gemma'))
    return 'GabomaGPT Flash';
  if (lower.includes('70b') || lower.includes('pro') || lower.includes('mixtral') || lower.includes('deepseek'))
    return 'GabomaGPT Pro';
  if (lower.includes('claude') || lower.includes('black') || lower.includes('panther') || lower.includes('sonnet'))
    return 'GabomaGPT Panthère';
  
  // Default — NEVER show real model names
  return 'GabomaGPT';
}

export function getGabomaModelIcon(modelId: string): string {
  if (!modelId) return '🤖';
  
  const exact = GABOMA_MODEL_MAP[modelId];
  if (exact) return exact.icon;
  
  const bareId = modelId.includes('/') ? modelId.split('/').pop()! : modelId;
  const bareMatch = GABOMA_MODEL_MAP[bareId];
  if (bareMatch) return bareMatch.icon;
  
  const lower = modelId.toLowerCase();
  if (lower.includes('8b') || lower.includes('flash')) return '⚡';
  if (lower.includes('70b') || lower.includes('pro')) return '🔥';
  if (lower.includes('claude') || lower.includes('panther')) return '🐆';
  
  return '🤖';
}

export function getGabomaModelTier(modelId: string): 'flash' | 'pro' | 'black_panther' {
  if (!modelId) return 'flash';
  
  const exact = GABOMA_MODEL_MAP[modelId];
  if (exact) return exact.tier;
  
  const bareId = modelId.includes('/') ? modelId.split('/').pop()! : modelId;
  const bareMatch = GABOMA_MODEL_MAP[bareId];
  if (bareMatch) return bareMatch.tier;
  
  const lower = modelId.toLowerCase();
  if (lower.includes('claude') || lower.includes('black') || lower.includes('panther'))
    return 'black_panther';
  if (lower.includes('70b') || lower.includes('pro') || lower.includes('mixtral'))
    return 'pro';
  
  return 'flash';
}
