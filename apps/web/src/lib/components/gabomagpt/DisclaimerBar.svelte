<script lang="ts">
	/* GabomaGPT · DisclaimerBar.svelte · SmartANDJ AI Technologies */
	import { gabomaStore } from '$lib/stores/gabomagpt';
	import { cn } from '$lib/utils/cn';

	const PLAN_DISCLAIMERS: Record<string, string> = {
		flash: "GabomaGPT peut se tromper · Vérifiez les informations importantes · SmartANDJ AI Technologies 🇬🇦",
		pro: "GabomaGPT Pro · Réponses améliorées · Vérifiez toujours les infos critiques · SmartANDJ 🇬🇦",
		elite: "GabomaGPT Élite · Accès étendu · SmartANDJ AI Technologies · Libreville, Gabon 🇬🇦",
		panther: "GabomaGPT Black Panther · Agent actif · Toutes actions sont irréversibles · SmartANDJ 🇬🇦",
		panther_pro: "GabomaGPT Panthère Pro · Agent avancé · Toutes actions sont irréversibles · SmartANDJ 🇬🇦"
	};

	$: plan = $gabomaStore.plan;
	$: disclaimer = PLAN_DISCLAIMERS[plan] ?? PLAN_DISCLAIMERS.flash;
</script>

<div
	class={cn(
		'mx-auto max-w-[560px] py-2 text-center font-mono text-[11px]',
		'leading-relaxed tracking-wide',
		'text-[var(--text-tertiary)]',
		'select-none'
	)}
	aria-label="Avertissement GabomaGPT"
>
	<p>{disclaimer}</p>
</div>
