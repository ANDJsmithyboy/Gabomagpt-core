<script lang="ts">
	/* GabomaGPT · TokenBadge.svelte · SmartANDJ AI Technologies
	   Badge compact affichant les jetons restants */
	import { gabomaStore, currentPlan, isPantherMode } from '$lib/stores/gabomagpt';
	import { cn } from '$lib/utils/cn';

	$: tokens = $gabomaStore.tokens;
	$: plan = $currentPlan;
	$: panther = $isPantherMode;
</script>

<button
	on:click={() => gabomaStore.openPaymentModal()}
	class={cn(
		'flex items-center gap-1.5 rounded-xl px-3 py-1.5',
		'text-xs font-medium tracking-wide',
		'transition-all duration-200',
		'border',
		panther
			? 'border-[rgba(212,164,23,0.2)] bg-[rgba(212,164,23,0.06)] text-[#D4A417]'
			: 'border-[var(--border)] bg-[var(--accent-10)] text-[var(--accent)]',
		'hover:opacity-80 active:scale-95'
	)}
	aria-label="Jetons restants : {tokens}"
>
	<!-- Point clignotant -->
	<span
		class={cn(
			'inline-block h-1.5 w-1.5 rounded-full animate-blink',
			panther ? 'bg-[#D4A417]' : 'bg-[var(--accent)]'
		)}
	></span>
	<span>{tokens} jetons</span>
</button>
