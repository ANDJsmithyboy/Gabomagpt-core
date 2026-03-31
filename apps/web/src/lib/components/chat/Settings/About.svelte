<script lang="ts">
	import { getVersionUpdates } from '$lib/apis';
	import { getOllamaVersion } from '$lib/apis/ollama';
	import { WEBUI_BUILD_HASH, WEBUI_VERSION } from '$lib/constants';
	import { WEBUI_NAME, config, showChangelog } from '$lib/stores';
	import { compareVersion } from '$lib/utils';
	import { onMount, getContext } from 'svelte';

	import Tooltip from '$lib/components/common/Tooltip.svelte';

	const i18n = getContext('i18n');

	let ollamaVersion = '';

	let updateAvailable = null;
	let version = {
		current: '',
		latest: ''
	};

	const checkForVersionUpdates = async () => {
		updateAvailable = null;
		version = await getVersionUpdates(localStorage.token).catch((error) => {
			return {
				current: WEBUI_VERSION,
				latest: WEBUI_VERSION
			};
		});

		updateAvailable = compareVersion(version.latest, version.current);
	};

	onMount(async () => {
		ollamaVersion = await getOllamaVersion(localStorage.token).catch((error) => {
			return '';
		});

		if ($config?.features?.enable_version_update_check) {
			checkForVersionUpdates();
		}
	});
</script>

<div id="tab-about" class="flex flex-col h-full justify-between text-sm mb-6">
	<div class="space-y-4 overflow-y-auto max-h-[28rem] md:max-h-full pr-1">

		<!-- Header avec logo -->
		<div class="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
			<img src="/gabomagpt-logo.jpeg" alt="GabomaGPT" class="size-12 rounded-xl shadow-md" draggable="false" />
			<div>
				<div class="text-base font-bold text-gray-900 dark:text-white">GabomaGPT</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">
					v{WEBUI_VERSION} · SmartANDJ AI Technologies
				</div>
			</div>
		</div>

		<!-- I. VISION ET MISSION -->
		<section>
			<h3 class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">I. Vision et Mission</h3>
			<p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
				GabomaGPT est le <strong>système d'exploitation cognitif du Gabon</strong>. Notre mission est d'élever chaque citoyen en mettant à sa disposition une intelligence de pointe capable de comprendre, d'agir et de préserver.
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1.5">
				Inspirés par la vision d'Andrew Ng sur l'IA comme "nouvelle électricité", nous brisons la dépendance technologique pour instaurer une <strong class="text-gray-700 dark:text-gray-200">Souveraineté Numérique Totale</strong>.
			</p>
		</section>

		<!-- II. BLACK PANTHER -->
		<section>
			<h3 class="text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400 mb-2">II. Black Panther — Agent d'Action</h3>
			<p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
				Le mode <strong>Black Panther</strong> marque la fin de l'IA passive. C'est un agent autonome conçu pour exécuter des missions complexes.
			</p>
			<div class="mt-2 space-y-1.5">
				<div class="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
					<span class="text-red-500 mt-0.5">●</span>
					<span><strong class="text-gray-700 dark:text-gray-200">ANPI & CNAMGS</strong> — Aide à la création d'entreprise et immatriculation</span>
				</div>
				<div class="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
					<span class="text-red-500 mt-0.5">●</span>
					<span><strong class="text-gray-700 dark:text-gray-200">Mobile Money</strong> — Transactions Airtel Money & Moov sécurisées</span>
				</div>
				<div class="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
					<span class="text-red-500 mt-0.5">●</span>
					<span><strong class="text-gray-700 dark:text-gray-200">Services Publics</strong> — RDV, permis, état civil</span>
				</div>
			</div>
		</section>

		<!-- III. ZION CORE CONSTITUTION -->
		<section>
			<h3 class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">III. Constitution Zion Core — Les 7 Piliers</h3>
			<div class="space-y-1">
				{#each [
					{ n: '1', t: "Intégrité Culturelle", d: "Fang, Punu, Nzebi, Myènè traitées avec le même respect que les langues internationales" },
					{ n: '2', t: "Élévation Humaine", d: "Chaque interaction vise à instruire ou aider l'utilisateur" },
					{ n: '3', t: "Neutralité Tribale", d: "Unité nationale, rejet de tout biais discriminatoire" },
					{ n: '4', t: "Souveraineté des Faits", d: "Priorité aux sources historiques vérifiées du Gabon" },
					{ n: '5', t: "Confidentialité Absolue", d: "Protégée par la hiérarchie du Tabernacle Numérique (7-77-777)" },
					{ n: '6', t: "Sécurité des Actions", d: "Black Panther ne cause aucun préjudice financier ou légal" },
					{ n: '7', t: "Transparence Algorithmique", d: "L'IA explique son raisonnement sur demande" }
				] as pillar}
					<div class="flex items-start gap-2 text-xs">
						<span class="flex-shrink-0 size-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-[10px]">{pillar.n}</span>
						<span class="text-gray-500 dark:text-gray-400"><strong class="text-gray-700 dark:text-gray-200">{pillar.t}</strong> — {pillar.d}</span>
					</div>
				{/each}
			</div>
		</section>

		<!-- IV. CONFIDENTIALITÉ -->
		<section>
			<h3 class="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">IV. Confidentialité et Sécurité</h3>
			<div class="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
				<div class="flex items-start gap-2">
					<span class="text-blue-500 mt-0.5">🔒</span>
					<span><strong class="text-gray-700 dark:text-gray-200">Stockage Souverain</strong> — Vos données ne quittent jamais notre périmètre de sécurité. Infrastructure hybride visant 100% de traitement national.</span>
				</div>
				<div class="flex items-start gap-2">
					<span class="text-blue-500 mt-0.5">🛡️</span>
					<span><strong class="text-gray-700 dark:text-gray-200">Anonymisation Différentielle</strong> — Vos questions personnelles ne peuvent jamais être liées à votre identité lors de l'amélioration du modèle.</span>
				</div>
			</div>
		</section>

		<!-- V. ROADMAP -->
		<section>
			<h3 class="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">V. Feuille de Route</h3>
			<div class="space-y-2 text-xs">
				<div class="rounded-lg border border-emerald-200 dark:border-emerald-800/50 p-2.5 bg-emerald-50/50 dark:bg-emerald-900/10">
					<div class="font-semibold text-emerald-700 dark:text-emerald-300">V1 — Actuelle</div>
					<div class="text-gray-500 dark:text-gray-400 mt-0.5">Inférence haute performance · Agent Black Panther (Alpha) · Support multilingue national · Paiement Mobile Money</div>
				</div>
				<div class="rounded-lg border border-purple-200 dark:border-purple-800/50 p-2.5 bg-purple-50/50 dark:bg-purple-900/10">
					<div class="font-semibold text-purple-700 dark:text-purple-300">V2 — Expansion Diaspora</div>
					<div class="text-gray-500 dark:text-gray-400 mt-0.5">Inscriptions diaspora mondiale · Paiements internationaux (CB, PayPal) · GraphRAG sourcé · Mode vocal natif</div>
				</div>
			</div>
		</section>

		<!-- MOT DU FONDATEUR -->
		<section class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 border border-gray-200 dark:border-gray-700/50">
			<div class="text-xs italic text-gray-600 dark:text-gray-300 leading-relaxed">
				"L'IA n'est pas une menace pour notre identité, c'est le bouclier qui la protégera. Avec GabomaGPT, nous ne nous contentons pas de suivre le futur, nous l'écrivons en nos propres termes."
			</div>
			<div class="mt-2 flex items-center gap-2">
				<div class="size-6 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white text-[8px] font-bold">DA</div>
				<div>
					<div class="text-xs font-semibold text-gray-700 dark:text-gray-200">Daniel Jonathan ANDJ</div>
					<div class="text-[10px] text-gray-400">Fondateur & CEO — SmartANDJ AI Technologies</div>
				</div>
			</div>
		</section>

		<!-- FOOTER -->
		<div class="pt-3 border-t border-gray-100 dark:border-gray-800 text-center">
			<div class="text-[10px] text-gray-400 dark:text-gray-500 space-y-0.5">
				<p>🇬🇦 GabomaGPT v{WEBUI_VERSION} · SmartANDJ AI Technologies · Libreville, Gabon</p>
				<p>Copyright © {new Date().getFullYear()} SmartANDJ AI Technologies. Tous droits réservés.</p>
				<p class="text-gray-300 dark:text-gray-600">Constitution Zion Core · 7-77-777</p>
			</div>
		</div>

	</div>
</div>
