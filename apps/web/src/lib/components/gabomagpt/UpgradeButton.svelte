<script lang="ts">
	/* GabomaGPT · UpgradeButton.svelte · SmartANDJ AI Technologies
	   Bouton "Mettre à niveau" — style Claude.ai, à côté du sélecteur modèle */
	import { gabomaStore, currentPlan, tokensLeft, tokensPercent, isLowTokens } from '$lib/stores/gabomagpt';
	import { cn } from '$lib/utils/cn';

	$: plan = $currentPlan;
	$: tokens = $tokensLeft;
	$: percent = $tokensPercent;
	$: low = $isLowTokens;

	// Cacher pour les super admins
	$: isSuperAdmin = $gabomaStore.isSuperAdmin;

	function openUpgrade() {
		gabomaStore.openUpgradeModal();
	}
</script>

{#if !isSuperAdmin}
<button
	class={cn(
		'group flex items-center gap-2 rounded-xl px-3 py-1.5',
		'border transition-all duration-200',
		'hover:opacity-90 active:scale-[0.97]',
		low
			? 'border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.06)] animate-pulse'
			: 'border-[var(--accent-35)] bg-[var(--accent-10)]'
	)}
	on:click={openUpgrade}
	title="Mettre à niveau — {tokens} jetons restants"
>
	<!-- Spark icon -->
	<svg
		class={cn(
			'h-3.5 w-3.5 transition-colors duration-200',
			low ? 'text-red-400' : 'text-[var(--accent)]'
		)}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
	</svg>

	<!-- Label -->
	<span
		class={cn(
			'text-[11px] font-semibold tracking-wide',
			low ? 'text-red-300' : 'text-[var(--accent)]'
		)}
	>
		{#if low}
			{tokens} jetons
		{:else}
			Upgrade
		{/if}
	</span>

	<!-- Mini progress bar -->
	<div class="hidden sm:block h-1 w-8 rounded-full bg-white/5 overflow-hidden">
		<div
			class="h-full rounded-full transition-all duration-500"
			style="width: {percent}%; background: {low ? '#EF4444' : plan.color};"
		></div>
	</div>
</button>
{/if}
