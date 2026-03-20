<script lang="ts">
	/* GabomaGPT · UpgradePrompt.svelte · SmartANDJ AI Technologies
	   Bandeau subtil quand jetons < 20% */
	import { gabomaStore, isLowTokens, tokensLeft } from '$lib/stores/gabomagpt';
	import { cn } from '$lib/utils/cn';

	$: low = $isLowTokens;
	$: tokens = $tokensLeft;
</script>

{#if low}
	<div
		class={cn(
			'flex items-center justify-between rounded-xl px-3 py-2.5',
			'border border-[var(--accent-35)]',
			'bg-[var(--accent-10)]',
			'transition-all duration-200'
		)}
	>
		<span class="text-xs text-[var(--text-secondary)]">
			⚡ Plus que <strong class="text-[var(--accent)]">{tokens}</strong> jetons
		</span>
		<button
			class={cn(
				'rounded-lg px-3 py-1 text-[11px] font-semibold',
				'bg-[var(--accent)] text-[var(--accent-foreground)]',
				'transition-all duration-200',
				'hover:opacity-80 active:scale-95'
			)}
			on:click={() => gabomaStore.openPaymentModal()}
			aria-label="Recharger mes jetons"
		>
			Recharger →
		</button>
	</div>
{/if}
