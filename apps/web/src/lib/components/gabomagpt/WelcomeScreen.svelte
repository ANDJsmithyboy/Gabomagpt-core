<script lang="ts">
	/* GabomaGPT · WelcomeScreen.svelte · SmartANDJ AI Technologies
	   Écran d'accueil gabonais — première impression mémorable */
	import { gabomaStore, PLANS, isPantherMode } from '$lib/stores/gabomagpt';
	import { cn } from '$lib/utils/cn';
	import LogoSVG from './LogoSVG.svelte';

	$: panther = $isPantherMode;
	$: state = $gabomaStore;
	$: planConfig = PLANS[state.plan];
	$: greeting = state.userName ? `Mbolo, ${state.userName} !` : 'Mbolo !';

	const suggestions = [
		{ icon: '📜', label: "Explique-moi le droit OHADA", category: 'legal' },
		{ icon: '🌍', label: "L'histoire du Gabon en résumé", category: 'default' },
		{ icon: '💼', label: "Rédige un business plan FCFA", category: 'default' },
		{ icon: '🗣️', label: "Apprends-moi le Fang basique", category: 'default' }
	];
</script>

<div
	class={cn(
		'flex flex-col items-center justify-center gap-8 px-6 py-12',
		'mx-auto max-w-lg text-center'
	)}
>
	<!-- Logo -->
	<div class="mb-2">
		<LogoSVG size={56} animate={true} />
	</div>

	<!-- Salutation gabonaise -->
	<div>
		<h1 class={cn(
			'text-2xl font-bold tracking-tight',
			panther ? 'text-[#D4A417]' : 'text-[var(--text-primary)]'
		)}>
			{greeting}
		</h1>
		<p class="mt-2 text-sm text-[var(--text-secondary)]">
			Le Gabon parle, le monde s'inspire.
		</p>
	</div>

	<!-- Badge plan -->
	<div class={cn(
		'inline-flex items-center gap-2 rounded-full px-4 py-1.5',
		'border text-xs font-medium',
		panther
			? 'border-[rgba(212,164,23,0.2)] bg-[rgba(212,164,23,0.06)] text-[#D4A417]'
			: 'border-[var(--accent-20)] bg-[var(--accent-10)] text-[var(--accent)]'
	)}>
		<span>{planConfig.icon}</span>
		<span>{planConfig.name}</span>
		<span class="opacity-50">·</span>
		<span>{state.tokens} jetons</span>
	</div>

	<!-- Suggestions rapides -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mt-4">
		{#each suggestions as s}
			<button
				class={cn(
					'flex items-center gap-3 rounded-2xl border px-4 py-3',
					'text-left text-sm',
					'transition-all duration-200',
					'hover:bg-[rgba(255,255,255,0.04)] active:scale-[0.97]',
					panther
						? 'border-[rgba(212,164,23,0.1)] text-[var(--text-secondary)]'
						: 'border-[var(--border)] text-[var(--text-secondary)]'
				)}
			>
				<span class="text-lg shrink-0">{s.icon}</span>
				<span class="line-clamp-1">{s.label}</span>
			</button>
		{/each}
	</div>

	<!-- Crédit -->
	<p class="text-[10px] text-[var(--text-tertiary)] mt-4">
		GabomaGPT · SmartANDJ AI Technologies · Libreville, Gabon 🇬🇦
	</p>
</div>
