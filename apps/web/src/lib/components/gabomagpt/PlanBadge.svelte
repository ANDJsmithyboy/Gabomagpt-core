<script lang="ts">
	/* GabomaGPT · PlanBadge.svelte · SmartANDJ AI Technologies
	   Badge plan avec barre de progression des jetons */
	import { gabomaStore, PLANS, type PlanKey, tokensPercent, isPantherMode } from '$lib/stores/gabomagpt';
	import { cn } from '$lib/utils/cn';

	$: state = $gabomaStore;
	$: plan = PLANS[state.plan];
	$: percent = $tokensPercent;
	$: panther = $isPantherMode;
	$: isGlowing = state.plan === 'panther' || state.plan === 'panther_pro';
</script>

<div
	class={cn(
		'flex flex-col gap-2 rounded-2xl p-3',
		'border transition-all duration-200',
		isGlowing
			? 'border-[rgba(212,164,23,0.25)] shadow-glow-gold'
			: 'border-[var(--border)]'
	)}
	style="background: {plan.color}08;"
>
	<!-- Ligne plan -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<span class="text-sm">{plan.icon}</span>
			<span
				class="text-xs font-semibold tracking-tight"
				style="color: {plan.color};"
			>
				{plan.name}
			</span>
		</div>
	</div>

	<!-- Barre de progression -->
	<div class="flex flex-col gap-1">
		<div class="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
			<div
				class={cn(
					'h-full rounded-full transition-all duration-300',
					isGlowing && 'shadow-glow-gold'
				)}
				style="width: {percent}%; background: {plan.color};"
			></div>
		</div>
		<div class="flex items-center justify-between">
			<span class="text-[10px] text-[var(--text-tertiary)]">
				{state.tokens} / {state.tokensMax} jetons
			</span>
			{#if percent < 20}
				<span class="text-[10px] font-medium text-[var(--gabon-red)]">Bientôt épuisé</span>
			{/if}
		</div>
	</div>

	<!-- Bouton recharger -->
	<button
		on:click={() => gabomaStore.openPaymentModal()}
		class={cn(
			'mt-1 w-full rounded-xl py-2 text-xs font-semibold',
			'transition-all duration-200',
			'hover:opacity-80 active:scale-[0.97]',
			panther
				? 'bg-[#D4A417] text-black'
				: 'bg-[var(--accent)] text-[var(--accent-foreground)]'
		)}
		aria-label="Recharger mes jetons"
	>
		Recharger jetons
	</button>
</div>
