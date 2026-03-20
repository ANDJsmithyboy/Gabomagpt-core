<script lang="ts">
	/* GabomaGPT · UpgradeModal.svelte · SmartANDJ AI Technologies
	   Popup premium de plans — Apple + Gabon soul
	   Apparaît à la 2e visite, clic upgrade, ou jetons épuisés */
	import { gabomaStore, PLANS, type PlanKey, isUpgradeModalOpen, isPantherMode } from '$lib/stores/gabomagpt';
	import { cn } from '$lib/utils/cn';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	$: open = $isUpgradeModalOpen;
	$: panther = $isPantherMode;
	$: currentState = $gabomaStore;

	// Plans affichés dans la grille
	const planKeys: PlanKey[] = ['flash', 'pro', 'elite', 'panther', 'panther_pro'];

	// SVG icons pour chaque plan (stroke only, sobre, 24px)
	const planIcons: Record<PlanKey, string> = {
		flash: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
		pro: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`,
		elite: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
		panther: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-1.2 0-2.4.6-3 1.5A3.5 3.5 0 0 0 6 8c0 3 2 5.5 4 7.5L12 18l2-2.5c2-2 4-4.5 4-7.5a3.5 3.5 0 0 0-3-3.5C14.4 3.6 13.2 3 12 3z"/><path d="M9 12l2 2 4-4"/></svg>`,
		panther_pro: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`
	};

	// Features par plan
	const planFeatures: Record<PlanKey, string[]> = {
		flash: ['50 jetons/jour', 'Langues gabonaises', 'Modèle rapide'],
		pro: ['500 jetons', 'Toutes les langues', 'Agent disponible', 'Support prioritaire'],
		elite: ['3 000 jetons', 'Toutes les langues', 'Agent avancé', 'Support VIP'],
		panther: ['12 000 jetons', 'Accès illimité', 'Agent Black Panther', 'Support dédié', 'API access'],
		panther_pro: ['45 000 jetons', 'Accès illimité', 'Agent ultime', 'Support 24/7', 'API illimitée', 'Multi-workspace']
	};

	function selectPlan(planKey: PlanKey) {
		if (planKey === 'flash') {
			gabomaStore.closeUpgradeModal();
			return;
		}
		gabomaStore.openPaymentModal(planKey, 'choose_plan');
	}

	function close() {
		gabomaStore.closeUpgradeModal();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-[60] flex items-center justify-center p-4"
		transition:fade={{ duration: 200 }}
	>
		<!-- Backdrop -->
		<button
			class="absolute inset-0 bg-black/70 backdrop-blur-md"
			on:click={close}
			aria-label="Fermer"
		></button>

		<!-- Modal -->
		<div
			class={cn(
				'relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto',
				'rounded-3xl border',
				'overflow-hidden',
				panther
					? 'border-[rgba(212,164,23,0.18)] bg-[#060A14]'
					: 'border-[rgba(255,255,255,0.06)] bg-[#080C16]',
				'shadow-2xl'
			)}
			transition:fly={{ y: 40, duration: 350, easing: cubicOut }}
		>
			<!-- Header -->
			<div class="relative px-8 pt-8 pb-4 text-center">
				<!-- Close button -->
				<button
					class="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
					on:click={close}
					aria-label="Fermer"
				>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
						<path d="M1 1l12 12M13 1L1 13"/>
					</svg>
				</button>

				<!-- Logo -->
				<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center">
					<img src="/gabomagpt-logo.jpeg" alt="GabomaGPT" class="h-12 w-12 rounded-xl" />
				</div>

				<h2 class="text-xl font-bold tracking-tight text-white" style="font-family: var(--font-display);">
					Passer au plan supérieur
				</h2>
				<p class="mt-1.5 text-sm text-white/45" style="font-family: var(--font-body);">
					La connaissance du Gabon. Pour tous les Gabonais.
				</p>
			</div>

			<!-- Plans Grid -->
			<div class="grid grid-cols-1 gap-3 px-6 pb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{#each planKeys as planKey}
					{@const plan = PLANS[planKey]}
					{@const isPopular = planKey === 'panther'}
					{@const isCurrent = currentState.plan === planKey}
					{@const isUpgrade = PLANS[planKey].price > PLANS[currentState.plan].price}

					<div
						class={cn(
							'relative flex flex-col rounded-2xl border p-5 transition-all duration-200',
							isPopular
								? 'border-[var(--accent)] bg-[var(--accent)]/[0.04]'
								: 'border-white/[0.06] bg-white/[0.02]',
							isCurrent && 'ring-1 ring-white/10',
							'hover:border-white/[0.12] hover:bg-white/[0.04]'
						)}
					>
						<!-- Populaire badge -->
						{#if isPopular}
							<span
								class="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em]"
								style="background: var(--accent); color: var(--accent-foreground, #000);"
							>
								Populaire
							</span>
						{/if}

						<!-- Plan icon -->
						<div
							class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
							style="background: {plan.color}12; color: {plan.color};"
						>
							{@html planIcons[planKey]}
						</div>

						<!-- Plan name -->
						<h3 class="text-sm font-semibold text-white/90" style="font-family: var(--font-display);">
							{plan.name.replace('GabomaGPT ', '')}
						</h3>

						<!-- Price -->
						<div class="mt-2 flex items-baseline gap-1">
							{#if plan.price === 0}
								<span class="text-2xl font-bold text-white">Gratuit</span>
							{:else}
								<span class="text-2xl font-bold text-white" style="font-family: var(--font-display);">
									{plan.price.toLocaleString('fr-FR')}
								</span>
								<span class="text-xs text-white/35">FCFA</span>
							{/if}
						</div>

						<!-- Tokens -->
						<p class="mt-1 text-xs text-white/50">
							{plan.tokens.toLocaleString('fr-FR')} jetons
							{#if planKey === 'flash'}/ jour{/if}
						</p>

						<!-- Divider -->
						<div class="my-3 h-px w-full bg-white/[0.06]"></div>

						<!-- Features -->
						<ul class="flex flex-1 flex-col gap-1.5">
							{#each planFeatures[planKey] as feature}
								<li class="flex items-start gap-2 text-[11px] text-white/50">
									<svg class="mt-0.5 h-3 w-3 shrink-0" style="color: {plan.color};" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
										<path d="M2 6l3 3 5-5"/>
									</svg>
									{feature}
								</li>
							{/each}
						</ul>

						<!-- CTA Button -->
						<button
							class={cn(
								'mt-4 w-full rounded-xl py-2.5 text-xs font-semibold transition-all duration-200',
								'active:scale-[0.97]',
								isCurrent
									? 'bg-white/5 text-white/30 cursor-default'
									: isPopular
										? 'bg-[var(--accent)] text-[var(--accent-foreground,#000)] hover:opacity-90 shadow-lg'
										: isUpgrade
											? 'bg-white/8 text-white/80 hover:bg-white/12 border border-white/[0.08]'
											: 'bg-white/5 text-white/40 hover:bg-white/8'
							)}
							on:click={() => selectPlan(planKey)}
							disabled={isCurrent}
						>
							{#if isCurrent}
								Plan actuel
							{:else if planKey === 'flash'}
								Plan gratuit
							{:else}
								Choisir ce plan
							{/if}
						</button>
					</div>
				{/each}
			</div>

			<!-- Payment operators footer -->
			<div class="flex items-center justify-center gap-6 border-t border-white/[0.04] px-6 py-4">
				<span class="text-[10px] text-white/25 uppercase tracking-widest">Paiement par</span>
				<div class="flex items-center gap-4">
					<img src="/airtel-money.png" alt="Airtel Money" class="h-6 opacity-50 hover:opacity-80 transition-opacity" />
					<img src="/moov-money.png" alt="Moov Money" class="h-6 opacity-50 hover:opacity-80 transition-opacity" />
				</div>
			</div>

			<!-- Footer -->
			<div class="pb-4 text-center">
				<span class="text-[10px] text-white/20" style="letter-spacing: 0.3px;">
					by SmartANDJ AI Technologies
				</span>
			</div>
		</div>
	</div>
{/if}
