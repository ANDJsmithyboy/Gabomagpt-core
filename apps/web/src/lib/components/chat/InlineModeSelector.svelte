<!-- GabomaGPT · InlineModeSelector.svelte
     SmartANDJ AI Technologies · Constitution Zion Core
     Fondateur : Daniel Jonathan ANDJ
     Sélecteur de mode minimaliste intégré dans la zone d'input (style Claude) -->

<script lang="ts">
	import { activeMode, MODEL_MAP, type Mode } from '$lib/stores/mode';

	let open = false;
	let selectorEl: HTMLDivElement;
	const modes: Mode[] = ['flash', 'pro', 'bp'];

	$: current = MODEL_MAP[$activeMode];

	function selectMode(mode: Mode) {
		activeMode.set(mode);
		open = false;
	}

	function handleWindowClick(e: MouseEvent) {
		if (open && selectorEl && !selectorEl.contains(e.target as Node)) {
			open = false;
		}
	}
</script>

<svelte:window on:click={handleWindowClick} />

<div class="inline-mode-selector relative" bind:this={selectorEl}>
	<button
		type="button"
		class="mode-trigger"
		aria-haspopup="listbox"
		aria-expanded={open}
		on:click|stopPropagation={() => (open = !open)}
		style="--mode-color: {current.color}; --mode-glow: {current.colorGlow};"
	>
		<span class="mode-icon">
			{#if $activeMode === 'flash'}
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
					<path d="M12 2C9.5 2 7 3.5 6 6C5 8.5 6 11 7 12.5L4 15C3.5 15.5 4 16.5 5 16L8 14C9.5 15.5 11.5 16 13.5 15.5C16 15 18 13 19 10.5C20 8 19.5 5 17.5 3.5C16 2.5 14 2 12 2Z" fill="url(#fg1)"/>
					<circle cx="8.5" cy="8" r="1" fill="#1a1a2e"/>
					<defs><linearGradient id="fg1" x1="4" y1="2" x2="20" y2="16"><stop offset="0%" stop-color="#F5A623"/><stop offset="50%" stop-color="#E040A0"/><stop offset="100%" stop-color="#7B42F6"/></linearGradient></defs>
				</svg>
			{:else if $activeMode === 'pro'}
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
					<path d="M3 12C3 12 5 8 9 7C11 6.5 13 7 14 8C15 9 16 10 18 10C20 10 21 9 21 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
					<path d="M14 8C14.5 9.5 14 11 13 12C12 13 10.5 13.5 9 13C7.5 12.5 6.5 11.5 6 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
					<circle cx="7.5" cy="9" r="0.8" fill="currentColor"/>
				</svg>
			{:else}
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
					<path d="M6 4C4 5 3 7 3 9C3 11 4 13 6 14.5C8 16 10 17 12 17C14 17 16 16 17.5 14.5C19 13 20 11 20 9C20 7 19 5.5 17 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
					<path d="M6 4C7 3 8.5 3 10 3.5C11.5 4 12 5 12 5C12 5 12.5 4 14 3.5C15.5 3 17 3.5 17 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
					<path d="M8 10L10 11.5L9 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M16 10L14 11.5L15 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			{/if}
		</span>
		<span class="mode-name">{current.label}</span>
		<svg class="mode-chevron" class:open width="10" height="10" viewBox="0 0 10 10" fill="none">
			<path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	</button>

	{#if open}
		<div
			class="mode-dropdown"
			role="listbox"
		>
			{#each modes as mode (mode)}
				{@const config = MODEL_MAP[mode]}
				{@const isActive = $activeMode === mode}
				<button
					type="button"
					class="mode-option"
					class:active={isActive}
					role="option"
					aria-selected={isActive}
					on:click={() => selectMode(mode)}
					style="--opt-color: {config.color};"
				>
					<span class="opt-icon">
						{#if mode === 'flash'}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
								<path d="M12 2C9.5 2 7 3.5 6 6C5 8.5 6 11 7 12.5L4 15C3.5 15.5 4 16.5 5 16L8 14C9.5 15.5 11.5 16 13.5 15.5C16 15 18 13 19 10.5C20 8 19.5 5 17.5 3.5C16 2.5 14 2 12 2Z" fill="url(#fdd)"/>
								<circle cx="8.5" cy="8" r="1" fill="#1a1a2e"/>
								<defs><linearGradient id="fdd" x1="4" y1="2" x2="20" y2="16"><stop offset="0%" stop-color="#F5A623"/><stop offset="50%" stop-color="#E040A0"/><stop offset="100%" stop-color="#7B42F6"/></linearGradient></defs>
							</svg>
						{:else if mode === 'pro'}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
								<path d="M3 12C3 12 5 8 9 7C11 6.5 13 7 14 8C15 9 16 10 18 10C20 10 21 9 21 9" stroke="var(--opt-color)" stroke-width="1.8" stroke-linecap="round"/>
								<path d="M14 8C14.5 9.5 14 11 13 12C12 13 10.5 13.5 9 13C7.5 12.5 6.5 11.5 6 10" stroke="var(--opt-color)" stroke-width="1.8" stroke-linecap="round"/>
								<circle cx="7.5" cy="9" r="0.8" fill="var(--opt-color)"/>
							</svg>
						{:else}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
								<path d="M6 4C4 5 3 7 3 9C3 11 4 13 6 14.5C8 16 10 17 12 17C14 17 16 16 17.5 14.5C19 13 20 11 20 9C20 7 19 5.5 17 4.5" stroke="var(--opt-color)" stroke-width="1.6" stroke-linecap="round"/>
								<path d="M6 4C7 3 8.5 3 10 3.5C11.5 4 12 5 12 5C12 5 12.5 4 14 3.5C15.5 3 17 3.5 17 4.5" stroke="var(--opt-color)" stroke-width="1.6" stroke-linecap="round"/>
								<path d="M8 10L10 11.5L9 13" stroke="var(--opt-color)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M16 10L14 11.5L15 13" stroke="var(--opt-color)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						{/if}
					</span>
					<div class="opt-info">
						<span class="opt-name">{config.label}</span>
						<span class="opt-desc">{config.description}</span>
					</div>
					{#if isActive}
						<svg class="opt-check" width="14" height="14" viewBox="0 0 14 14" fill="none">
							<path d="M3 7L6 10L11 4" stroke="var(--opt-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.inline-mode-selector {
		display: flex;
		align-items: center;
	}

	.mode-trigger {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px 8px;
		border: none;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.04);
		color: var(--mode-glow);
		font-family: 'Outfit', 'Sora', sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s ease;
		white-space: nowrap;
		line-height: 1;
	}

	.mode-trigger:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.mode-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}

	.mode-name {
		letter-spacing: 0.02em;
	}

	.mode-chevron {
		opacity: 0.5;
		transition: transform 0.15s ease;
		margin-left: 1px;
	}
	.mode-chevron.open {
		transform: rotate(180deg);
	}

	.mode-dropdown {
		position: absolute;
		bottom: calc(100% + 6px);
		left: 0;
		min-width: 220px;
		padding: 4px;
		border-radius: 12px;
		background: var(--zc-input, var(--bg-surface, #0A0F1A));
		border: 1px solid var(--border, rgba(255,255,255,0.07));
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		z-index: 50;
	}

	.mode-option {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 8px 10px;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: var(--text-secondary, rgba(255,255,255,0.65));
		font-family: 'Outfit', 'Sora', sans-serif;
		font-size: 0.8rem;
		cursor: pointer;
		transition: background 0.12s ease;
		text-align: left;
	}

	.mode-option:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	.mode-option.active {
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-primary, #EEF2FF);
	}

	.opt-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.opt-info {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
		flex: 1;
	}

	.opt-name {
		font-weight: 600;
		font-size: 0.8rem;
		color: var(--text-primary, #EEF2FF);
	}

	.opt-desc {
		font-size: 0.65rem;
		opacity: 0.5;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.opt-check {
		flex-shrink: 0;
		margin-left: auto;
	}

	@media (max-width: 640px) {
		.mode-name {
			display: none;
		}
		.mode-chevron {
			display: none;
		}
		.mode-trigger {
			padding: 4px 6px;
		}
	}
</style>
