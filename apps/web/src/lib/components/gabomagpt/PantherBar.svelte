<script lang="ts">
	/* GabomaGPT · PantherBar.svelte · SmartANDJ AI Technologies
	   Barre visible uniquement en mode Black Panther */
	import { isPantherMode, tokensLeft } from '$lib/stores/gabomagpt';
	import { cn } from '$lib/utils/cn';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	$: panther = $isPantherMode;
	$: tokens = $tokensLeft;
</script>

{#if panther}
	<div
		class={cn(
			'flex items-center justify-between',
			'px-4 py-2',
			'bg-[rgba(0,0,0,0.7)]',
			'border-b border-[rgba(212,164,23,0.2)]',
			'font-mono text-[10px] tracking-widest'
		)}
		transition:slide={{ duration: 300, easing: cubicOut }}
		aria-label="Mode Black Panther actif"
	>
		<div class="flex items-center gap-2 text-[#00FF87]">
			<!-- Point clignotant neon -->
			<span class="inline-block h-1.5 w-1.5 rounded-full bg-[#00FF87] animate-blink"></span>
			<span>PANTHÈRE ACTIVE</span>
		</div>
		<span class="hidden text-[9px] text-[rgba(212,164,23,0.65)] sm:inline">
			▸ Airtel Money · Droit gabonais · Agents prêts
		</span>
		<span class="text-[#D4A417]">{tokens} jetons</span>
	</div>
{/if}
