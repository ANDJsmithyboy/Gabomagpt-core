<script lang="ts">
	/* GabomaGPT · PaymentModal.svelte · SmartANDJ AI Technologies
	   Modal de paiement 4 pages — SUMB caché via backend · Apple Sheet */
	import { onDestroy } from 'svelte';
	import { gabomaStore, PLANS, type PlanKey, type OperatorKey, isPaymentModalOpen, isPantherMode } from '$lib/stores/gabomagpt';
	import { cn } from '$lib/utils/cn';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import ThinkingStates from './ThinkingStates.svelte';

	// ── Types ──────────────────────────────────────────

	interface Operator {
		id: OperatorKey;
		name: string;
		emoji: string;
		color: string;
		maxAmount: number;
	}

	const OPERATORS: Operator[] = [
		{ id: 'airtel', name: 'Airtel Money', emoji: '📱', color: '#E40000', maxAmount: 150000 },
		{ id: 'moov', name: 'Moov Money', emoji: '📱', color: '#0070C0', maxAmount: 50000 }
	];

	// ── État local ─────────────────────────────────────

	type Step = 'choose_plan' | 'choose_operator' | 'processing' | 'success' | 'error';
	let step: Step = 'choose_plan';
	let selectedPlan: PlanKey = 'pro';
	let selectedOperator: Operator | null = null;
	let countdown = 120;
	let countdownInterval: ReturnType<typeof setInterval> | null = null;
	let pollInterval: ReturnType<typeof setInterval> | null = null;
	let paymentRef = '';
	let errorMessage = '';

	$: open = $isPaymentModalOpen;
	$: panther = $isPantherMode;
	$: currentState = $gabomaStore;

	// Initialiser quand le modal s'ouvre
	$: if (open) {
		selectedPlan = currentState.targetPlan ?? getNextPlan(currentState.plan);
		step = 'choose_plan';
		selectedOperator = null;
		errorMessage = '';
		paymentRef = '';
	}

	$: planConfig = PLANS[selectedPlan];

	// Plans payants pour upgrade
	$: availablePlans = (['pro', 'elite', 'panther', 'panther_pro'] as PlanKey[]).filter(
		(p) => PLANS[p].price > PLANS[currentState.plan].price || currentState.plan === 'flash'
	);

	function getNextPlan(current: PlanKey): PlanKey {
		const order: PlanKey[] = ['flash', 'pro', 'elite', 'panther', 'panther_pro'];
		const idx = order.indexOf(current);
		return order[Math.min(idx + 1, order.length - 1)];
	}

	// ── PAGE 2 → PAGE 3 : initier paiement via backend ──

	async function selectAndPay(op: Operator) {
		selectedOperator = op;
		step = 'processing';
		countdown = 120;
		errorMessage = '';

		// Démarrer le countdown
		countdownInterval = setInterval(() => {
			countdown -= 1;
			if (countdown <= 0) {
				cleanup();
				step = 'error';
				errorMessage = 'Délai expiré. Aucune confirmation reçue.';
			}
		}, 1000);

		try {
			// Demander l'URL SUMB au backend (jamais exposée dans le frontend)
			const res = await fetch('/api/payment/initiate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					plan: selectedPlan,
					operator: op.id,
					userId: currentState.userEmail || 'anonymous'
				})
			});

			if (!res.ok) throw new Error('Erreur serveur');

			const data = await res.json();
			paymentRef = data.ref;

			// Ouvrir SUMB dans un popup (l'utilisateur ne voit jamais l'URL)
			const popup = window.open(data.sumb_url, 'gabomagpt_payment', 'width=480,height=640,scrollbars=yes');

			// Polling du statut toutes les 3 secondes
			pollInterval = setInterval(async () => {
				try {
					const statusRes = await fetch(`/api/payment/status?ref=${paymentRef}`);
					if (statusRes.ok) {
						const statusData = await statusRes.json();
						if (statusData.status === 'success') {
							cleanup();
							if (popup && !popup.closed) popup.close();
							gabomaStore.setPlan(selectedPlan);
							gabomaStore.creditTokens(statusData.tokens || planConfig.tokens);
							step = 'success';
							setTimeout(() => gabomaStore.closePaymentModal(), 3000);
						} else if (statusData.status === 'failed') {
							cleanup();
							if (popup && !popup.closed) popup.close();
							step = 'error';
							errorMessage = 'Le paiement a échoué. Aucun montant débité.';
						}
					}
				} catch {
					// Silencieux, on continue le polling
				}
			}, 3000);
		} catch {
			cleanup();
			step = 'error';
			errorMessage = 'Impossible de contacter le service de paiement.';
		}
	}

	function cleanup() {
		if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
		if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
	}

	function retry() {
		cleanup();
		step = 'choose_operator';
		errorMessage = '';
	}

	function close() {
		cleanup();
		gabomaStore.closePaymentModal();
	}

	onDestroy(() => cleanup());
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
		transition:fade={{ duration: 200 }}
	>
		<button
			class="absolute inset-0 bg-black/60 backdrop-blur-sm"
			on:click={close}
			aria-label="Fermer"
		></button>

		<!-- Card modale — Apple Sheet bottom-sheet mobile, centered desktop -->
		<div
			class={cn(
				'relative z-10 w-full max-w-md',
				'rounded-t-3xl sm:rounded-3xl',
				'border transition-all duration-200',
				'overflow-hidden',
				panther
					? 'border-[rgba(212,164,23,0.18)] bg-[#080D18]'
					: 'border-[var(--border)] bg-[var(--bg-surface)]',
				'shadow-lg'
			)}
			transition:fly={{ y: 100, duration: 300, easing: cubicOut }}
		>
			<!-- Poignée mobile -->
			<div class="flex justify-center pt-3 sm:hidden">
				<div class="h-1 w-10 rounded-full bg-white/10"></div>
			</div>

			<div class="p-6">

				<!-- ═══ PAGE 1 : Choisir le plan ═══ -->
				{#if step === 'choose_plan'}
					<h3 class="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
						Choisir votre plan
					</h3>
					<p class="mt-1 text-xs text-[var(--text-secondary)]">
						Rechargez vos jetons pour continuer
					</p>

					<div class="mt-4 flex flex-col gap-2">
						{#each availablePlans as planKey}
							{@const p = PLANS[planKey]}
							<button
								class={cn(
									'relative flex items-center justify-between rounded-2xl border p-4',
									'transition-all duration-200',
									'hover:opacity-80 active:scale-[0.97]',
									selectedPlan === planKey
										? 'border-[var(--accent-35)] bg-[var(--accent-10)]'
										: 'border-[var(--border)] bg-transparent'
								)}
								on:click={() => { selectedPlan = planKey; }}
							>
								{#if planKey === 'panther'}
									<span class="absolute -top-2 right-3 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[9px] font-bold text-[var(--accent-foreground)] uppercase">
										Populaire
									</span>
								{/if}
								<div class="flex items-center gap-3">
									<span class="text-lg">{p.icon}</span>
									<div class="text-left">
										<div class="text-sm font-semibold text-[var(--text-primary)]">{p.name}</div>
										<div class="text-[11px] text-[var(--text-tertiary)]">
											{p.tokens.toLocaleString()} jetons
										</div>
									</div>
								</div>
								<span class="text-sm font-semibold" style="color: {p.color};">
									{p.price.toLocaleString()} FCFA
								</span>
							</button>
						{/each}
					</div>

					<button
						class={cn(
							'mt-4 w-full rounded-2xl py-3 text-sm font-semibold',
							'transition-all duration-200',
							'hover:opacity-90 active:scale-[0.97]',
							'bg-[var(--accent)] text-[var(--accent-foreground)]',
							'shadow-accent'
						)}
						on:click={() => { step = 'choose_operator'; }}
					>
						Continuer — {planConfig.price.toLocaleString()} FCFA
					</button>

				<!-- ═══ PAGE 2 : Choisir l'opérateur ═══ -->
				{:else if step === 'choose_operator'}
					<h3 class="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
						Payer {planConfig.price.toLocaleString()} FCFA
					</h3>
					<p class="mt-1 text-xs text-[var(--text-secondary)]">
						{planConfig.name} · {planConfig.tokens.toLocaleString()} jetons
					</p>

					<p class="mt-5 text-center text-[11px] font-medium uppercase tracking-widest text-[var(--text-tertiary)]">
						Choisir ton opérateur
					</p>

					<div class="mt-3 grid grid-cols-2 gap-3">
						{#each OPERATORS as op}
							{@const disabled = planConfig.price > op.maxAmount}
							<button
								class={cn(
									'flex flex-col items-center gap-2 rounded-2xl border p-4',
									'transition-all duration-200',
									disabled
										? 'opacity-40 cursor-not-allowed'
										: 'hover:opacity-80 active:scale-[0.97]'
								)}
								style="border-color: {op.color}20; background: {op.color}08;"
								on:click={() => !disabled && selectAndPay(op)}
								{disabled}
								title={disabled ? `${op.name} : montant max ${op.maxAmount.toLocaleString()} FCFA` : ''}
							>
								<span class="text-2xl">{op.emoji}</span>
								<span class="text-xs font-semibold" style="color: {op.color};">
									{op.name}
								</span>
								{#if disabled}
									<span class="text-[9px] text-[var(--text-tertiary)]">Airtel uniquement</span>
								{/if}
							</button>
						{/each}
					</div>

					<button
						class="mt-3 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
						on:click={() => { step = 'choose_plan'; }}
					>
						← Retour au choix du plan
					</button>

				<!-- ═══ PAGE 3 : Traitement SUMB (caché) ═══ -->
				{:else if step === 'processing'}
					<div class="flex flex-col items-center gap-4 py-4">
						<ThinkingStates mode="panther" />

						<h3 class="text-base font-semibold text-[var(--text-primary)]">
							Paiement en cours...
						</h3>
						<p class="text-xs text-[var(--text-secondary)]">
							Confirme sur ton téléphone
						</p>
						<span class="font-mono text-2xl font-bold text-[var(--accent)]">
							{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
						</span>
						<p class="text-[10px] text-[var(--text-tertiary)]">
							Valide le paiement {selectedOperator?.name} sur ton mobile
						</p>
					</div>

				<!-- ═══ PAGE 4A : Succès ═══ -->
				{:else if step === 'success'}
					<div class="flex flex-col items-center gap-4 py-4">
						<div class="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-20)]">
							<svg class="h-8 w-8 text-[var(--accent)]" viewBox="0 0 24 24" fill="none">
								<path
									d="M5 13l4 4L19 7"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="checkmark-path"
								/>
							</svg>
						</div>
						<h3 class="text-base font-semibold text-[var(--text-primary)]">
							{planConfig.tokens.toLocaleString()} jetons ajoutés !
						</h3>
						<p class="text-xs text-[var(--text-secondary)]">
							Bienvenue dans {planConfig.name}, frère !
						</p>
						<p class="text-sm font-semibold" style="color: {planConfig.color};">
							{planConfig.icon} On est ensemble. Gabon d'abord. 🇬🇦
						</p>
					</div>

				<!-- ═══ PAGE 4B : Échec ═══ -->
				{:else if step === 'error'}
					<div class="flex flex-col items-center gap-4 py-4">
						<span class="text-5xl">🌉</span>
						<h3 class="text-base font-semibold text-[var(--text-primary)]">
							Le pont de lianes vers la banque est instable.
						</h3>
						<p class="text-xs text-center text-[var(--text-secondary)]">
							{errorMessage || 'Je sécurise tes jetons. On retente la traversée dans quelques instants.'}
						</p>
						<div class="flex w-full gap-2">
							<button
								class={cn(
									'flex-1 rounded-2xl py-3 text-sm font-semibold',
									'bg-[var(--accent)] text-[var(--accent-foreground)]',
									'transition-all duration-200',
									'hover:opacity-90 active:scale-[0.97]'
								)}
								on:click={retry}
							>
								Réessayer
							</button>
							<a
								href="https://wa.me/24107000000"
								target="_blank"
								rel="noopener"
								class={cn(
									'flex-1 rounded-2xl py-3 text-center text-sm font-semibold',
									'bg-[rgba(255,255,255,0.06)] text-[var(--text-secondary)]',
									'transition-all duration-200',
									'hover:bg-[rgba(255,255,255,0.1)] active:scale-[0.97]'
								)}
							>
								Support
							</a>
						</div>
					</div>
				{/if}

				<!-- Bouton annuler (sauf succès) -->
				{#if step !== 'success'}
					<button
						class="mt-4 w-full text-center text-xs text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-secondary)]"
						on:click={close}
					>
						✕ Annuler
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.checkmark-path {
		stroke-dasharray: 30;
		stroke-dashoffset: 30;
		animation: draw-check 400ms ease forwards 100ms;
	}
	@keyframes draw-check {
		to { stroke-dashoffset: 0; }
	}
</style>
