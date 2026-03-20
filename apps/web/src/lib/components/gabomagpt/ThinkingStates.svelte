<script lang="ts">
	/* GabomaGPT · ThinkingStates.svelte · SmartANDJ AI Technologies
	   8 modes de réflexion immersifs — détection automatique du type de requête
	   Aura dynamique + phrases gabonaises + barre de progression */
	import { onMount, onDestroy } from 'svelte';
	import { isPantherMode } from '$lib/stores/gabomagpt';

	type ThinkingMode = 'default' | 'search' | 'legal' | 'panther' | 'payment' | 'language' | 'image' | 'analytics';

	export let mode: ThinkingMode = 'default';
	export let progress: number = 0;

	const THINKING_STATES: Record<ThinkingMode, {
		phrases: string[];
		auraColors: string[];
		icon: string;
		label: string;
	}> = {
		default: {
			icon: '🌿',
			label: 'GabomaGPT réfléchit',
			auraColors: ['#22C55E', '#38BDF8', '#FACC15'],
			phrases: [
				"GabomaGPT consulte les savoirs gabonais...",
				"Connexion aux mémoires de nos ancêtres...",
				"Les esprits de l'Iboga guident la réponse...",
				"Synthèse des connaissances du Gabon profond...",
				"Analyse depuis Libreville en cours..."
			]
		},
		search: {
			icon: '🌊',
			label: 'Recherche en cours',
			auraColors: ['#38BDF8', '#22C55E', '#06B6D4'],
			phrases: [
				"Sondage des courants profonds de l'Ogooué...",
				"Navigation à travers la brume de Lambaréné...",
				"Remontée du fleuve vers la source des informations...",
				"Traversée du delta vers les données fraîches...",
				"Consultation des archives de Port-Gentil...",
				"Exploration des profondeurs de l'estuaire du Gabon...",
				"Cartographie des informations en temps réel..."
			]
		},
		legal: {
			icon: '⚖️',
			label: 'Analyse juridique',
			auraColors: ['#A78BFA', '#7C3AED', '#D4A417'],
			phrases: [
				"Consultation silencieuse des anciens...",
				"Ouverture des archives sacrées du Mvett...",
				"Traduction des murmures de la forêt équatoriale...",
				"Convocation du conseil des sages sous l'arbre à palabre...",
				"Lecture des tablettes du droit OHADA...",
				"Les anciens de Libreville délibèrent...",
				"Consultation du Code Pénal gabonais...",
				"Harmonisation avec la jurisprudence de l'Afrique centrale..."
			]
		},
		panther: {
			icon: '⚫',
			label: 'Panthère en mission',
			auraColors: ['#D4A417', '#FF6B00', '#00FF87'],
			phrases: [
				"La Panthère piste la transaction dans l'ombre...",
				"Affût nocturne dans la forêt des Abeilles...",
				"Alignement des réseaux... L'œil de la Panthère est fixé.",
				"Traversée silencieuse de la canopée numérique...",
				"La Panthère approche de sa cible. Patience...",
				"Coordination des agents dans la nuit de Libreville...",
				"Synchronisation des flux de données en cours...",
				"La Panthère referme le cercle. Conclusion imminente."
			]
		},
		payment: {
			icon: '💫',
			label: 'Sécurisation du paiement',
			auraColors: ['#22C55E', '#D4A417', '#00FF87'],
			phrases: [
				"La Panthère sécurise ta transaction dans l'ombre numérique...",
				"Vérification des canaux Airtel Money en cours...",
				"Traversée sécurisée du pont financier gabonais...",
				"Validation de la transaction par les gardiens du réseau...",
				"Confirmation attendue depuis les serveurs de l'opérateur...",
				"Tes jetons sont en route, frère. Patience un instant."
			]
		},
		language: {
			icon: '🌿',
			label: 'Traduction en cours',
			auraColors: ['#22C55E', '#FACC15', '#EF4444'],
			phrases: [
				"Consultation des anciens locuteurs Fang du Woleu-Ntem...",
				"Harmonisation avec la phonologie Mpongwé de l'Estuaire...",
				"Recherche dans les archives linguistiques Punu du Ngounié...",
				"Alignement des structures grammaticales Bantu...",
				"Traduction depuis les profondeurs de la forêt équatoriale...",
				"Les voix de nos ancêtres guident chaque mot..."
			]
		},
		image: {
			icon: '🎨',
			label: 'Création en cours',
			auraColors: ['#EF4444', '#FACC15', '#A78BFA'],
			phrases: [
				"L'artiste numérique puise dans l'imaginaire gabonais...",
				"Fusion des couleurs de la forêt équatoriale...",
				"Modelage des pixels sur l'enclume du créateur...",
				"L'image prend forme depuis les profondeurs...",
				"Peinture numérique en cours depuis Libreville..."
			]
		},
		analytics: {
			icon: '📊',
			label: 'Analyse des données',
			auraColors: ['#38BDF8', '#22C55E', '#FACC15'],
			phrases: [
				"ANDJ Analytics traite les données gabonaises...",
				"Croisement des flux économiques de l'Afrique centrale...",
				"Cartographie des tendances du marché gabonais...",
				"Synthèse des indicateurs de Libreville à Port-Gentil...",
				"L'intelligence des données au service du Gabon..."
			]
		}
	};

	$: panther = $isPantherMode;
	$: activeMode = panther ? 'panther' : mode;
	$: state = THINKING_STATES[activeMode] ?? THINKING_STATES.default;

	let currentIndex = 0;
	let visible = true;
	let interval: ReturnType<typeof setInterval>;

	$: currentPhrase = state.phrases[currentIndex % state.phrases.length];

	onMount(() => {
		interval = setInterval(() => {
			visible = false;
			setTimeout(() => {
				currentIndex = (currentIndex + 1) % state.phrases.length;
				visible = true;
			}, 400);
		}, 2500);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<div class="flex flex-col items-center gap-4 py-6 select-none" aria-live="polite" aria-label={state.label}>
	<!-- Aura lumineuse dynamique avec couleurs du mode -->
	<div class="relative w-16 h-16">
		<div
			class="aura-outer absolute inset-0 rounded-full"
			style="
				background: conic-gradient({state.auraColors[0]}, {state.auraColors[1]}, {state.auraColors[2]}, {state.auraColors[0]});
				filter: blur(8px);
				opacity: 0.7;
			"
		></div>
		<div class="absolute inset-2 rounded-full bg-[var(--bg-surface,#080B12)] flex items-center justify-center text-xl aura-inner">
			{state.icon}
		</div>
	</div>

	<!-- Label du mode -->
	<span class="text-[11px] font-mono tracking-widest text-[var(--text-tertiary,#8B95A5)] uppercase">
		{state.label}
	</span>

	<!-- Phrase immersive avec fade -->
	<div class="h-6 flex items-center">
		<p
			class="text-[13px] text-[var(--text-secondary,#A0AEC0)] text-center font-mono italic max-w-xs transition-opacity duration-400"
			class:opacity-0={!visible}
			class:opacity-100={visible}
		>
			{currentPhrase}
		</p>
	</div>

	<!-- Barre de progression optionnelle -->
	{#if progress > 0}
		<div class="w-48 h-0.5 bg-[var(--border,#1E293B)] rounded-full overflow-hidden">
			<div
				class="h-full rounded-full transition-all duration-500 ease-out"
				style="width: {progress}%; background: {state.auraColors[0]};"
			></div>
		</div>
		<span class="text-[10px] text-[var(--text-tertiary,#8B95A5)] font-mono">{progress}%</span>
	{/if}

	<!-- Trois dots animés -->
	<div class="flex gap-1">
		{#each [0, 1, 2] as i}
			<span
				class="h-1.5 w-1.5 rounded-full"
				style="background: {state.auraColors[i % state.auraColors.length]}; animation: blink 1.4s infinite; animation-delay: {i * 200}ms; opacity: 0.3;"
			></span>
		{/each}
	</div>
</div>

<style>
	.aura-outer {
		animation: spin-slow 3s linear infinite;
	}
	.aura-inner {
		animation: pulse-inner 2s ease-in-out infinite;
	}
	@keyframes spin-slow {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	@keyframes pulse-inner {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}
	@keyframes blink {
		0%, 100% { opacity: 0.3; }
		50% { opacity: 1; }
	}
</style>
