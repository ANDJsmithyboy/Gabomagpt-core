<script lang="ts">
	/* GabomaGPT · MaintenancePage.svelte · SmartANDJ AI Technologies
	   Page maintenance plein écran — API down, zéro technique visible */
	import { onMount, onDestroy } from 'svelte';
	import { gabomaStore } from '$lib/stores/gabomagpt';
	import { cn } from '$lib/utils/cn';
	import LogoSVG from './LogoSVG.svelte';

	let countdown = 30;
	let interval: ReturnType<typeof setInterval> | null = null;

	onMount(() => {
		interval = setInterval(async () => {
			countdown -= 1;
			if (countdown <= 0) {
				const healthy = await gabomaStore.checkApiHealth();
				if (healthy) {
					window.location.reload();
				}
				countdown = 30;
			}
		}, 1000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<div
	class={cn(
		'fixed inset-0 z-[200] flex flex-col items-center justify-center',
		'bg-[var(--bg-deep)] px-8 text-center'
	)}
	role="alert"
	aria-label="GabomaGPT en maintenance"
>
	<!-- Logo animé -->
	<div class="mb-8">
		<LogoSVG size={80} animate={true} />
	</div>

	<!-- Message principal -->
	<h1 class="text-xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
		GabomaGPT est en retraite initiatique.
	</h1>

	<p class="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed mb-2">
		Le système se renforce dans la forêt sacrée.
	</p>

	<p class="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed mb-8">
		Retour de la Panthère sous peu, plus puissante que jamais.
	</p>

	<!-- Countdown -->
	<div class="flex items-center gap-2 text-[var(--text-tertiary)]">
		<div class="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse"></div>
		<span class="font-mono text-xs">
			Reconnexion dans {countdown}s
		</span>
	</div>

	<!-- Contact -->
	<div class="mt-12 flex flex-col items-center gap-2">
		<a
			href="https://wa.me/24107000000"
			class={cn(
				'rounded-2xl px-6 py-2.5 text-xs font-semibold',
				'bg-[rgba(255,255,255,0.06)] text-[var(--text-secondary)]',
				'transition-all duration-200',
				'hover:bg-[rgba(255,255,255,0.1)] active:scale-[0.97]'
			)}
			target="_blank"
			rel="noopener"
		>
			💬 Contacter le support WhatsApp
		</a>
		<p class="text-[10px] text-[var(--text-tertiary)] mt-4">
			SmartANDJ AI Technologies · Libreville, Gabon 🇬🇦
		</p>
	</div>
</div>
