<script lang="ts">
	/* GabomaGPT · ErrorHandler.svelte · SmartANDJ AI Technologies
	   Masquage culturel des erreurs — zéro technique visible */
	import { onMount, onDestroy } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { isPantherMode } from '$lib/stores/gabomagpt';

	export let code: number | string = 500;
	export let onRetry: (() => void) | null = null;

	interface ErrorConfig {
		title: string;
		body: string;
		icon: string;
		action: string | null;
		autoreload: number | null;
	}

	const ERROR_MESSAGES: Record<string | number, ErrorConfig> = {
		500: {
			title: "La saison des pluies a effacé nos pistes.",
			body: "La Panthère se replie un instant. On reprend la traque dans quelques minutes.",
			icon: "🌧️",
			action: "Réessayer",
			autoreload: 30
		},
		408: {
			title: "Les esprits de la forêt exigent de la patience.",
			body: "Les racines de l'Iboga cherchent plus profondément. Laisse-moi un instant.",
			icon: "🌿",
			action: "Attendre",
			autoreload: 10
		},
		429: {
			title: "Le village est très animé aujourd'hui.",
			body: "Laisse le temps aux anciens de reprendre leur souffle, et pose ta question à nouveau.",
			icon: "🌳",
			action: "Réessayer dans 60s",
			autoreload: 60
		},
		payment_error: {
			title: "Le pont de lianes vers la banque est instable.",
			body: "Je sécurise tes jetons. On retente la traversée dans quelques instants.",
			icon: "🌉",
			action: "Réessayer le paiement",
			autoreload: null
		},
		maintenance: {
			title: "GabomaGPT est en retraite initiatique.",
			body: "Le système se renforce dans la forêt sacrée. Retour de la Panthère sous peu, plus puissante que jamais.",
			icon: "⚫",
			action: null,
			autoreload: 120
		},
		offline: {
			title: "La connexion aux esprits est temporairement coupée.",
			body: "Vérifie ta connexion internet, frère. GabomaGPT t'attend de l'autre côté.",
			icon: "📡",
			action: "Vérifier ma connexion",
			autoreload: null
		}
	};

	$: panther = $isPantherMode;
	$: config = ERROR_MESSAGES[code] ?? ERROR_MESSAGES[500];
	let countdown: number = 0;
	let interval: ReturnType<typeof setInterval> | null = null;

	onMount(() => {
		if (config.autoreload && config.autoreload > 0) {
			countdown = config.autoreload;
			interval = setInterval(() => {
				countdown -= 1;
				if (countdown <= 0) {
					if (interval) clearInterval(interval);
					if (onRetry) onRetry();
					else window.location.reload();
				}
			}, 1000);
		}
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	function handleAction() {
		if (onRetry) onRetry();
		else window.location.reload();
	}
</script>

<div
	class={cn(
		'flex flex-col items-center justify-center gap-6 px-8 py-12',
		'text-center max-w-md mx-auto'
	)}
	role="alert"
	aria-live="assertive"
>
	<!-- Icône -->
	<span class="text-5xl">{config.icon}</span>

	<!-- Titre -->
	<h2 class={cn(
		'text-lg font-semibold tracking-tight',
		panther ? 'text-[#D4A417]' : 'text-[var(--text-primary)]'
	)}>
		{config.title}
	</h2>

	<!-- Corps -->
	<p class="text-sm text-[var(--text-secondary)] leading-relaxed">
		{config.body}
	</p>

	<!-- Countdown auto-reload -->
	{#if config.autoreload && countdown > 0}
		<p class="font-mono text-xs text-[var(--text-tertiary)]">
			Réessai automatique dans {countdown}s
		</p>
	{/if}

	<!-- Bouton action -->
	{#if config.action}
		<button
			class={cn(
				'rounded-2xl px-8 py-3 text-sm font-semibold',
				'transition-all duration-200',
				'hover:opacity-90 active:scale-[0.97]',
				'bg-[var(--accent)] text-[var(--accent-foreground)]'
			)}
			on:click={handleAction}
		>
			{config.action}
		</button>
	{/if}

	<!-- Crédit -->
	<p class="text-[10px] text-[var(--text-tertiary)] mt-4">
		GabomaGPT · SmartANDJ AI Technologies · Libreville, Gabon 🇬🇦
	</p>
</div>
