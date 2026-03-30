<!-- GabomaGPT · InlineModeSelector.svelte
     SmartANDJ AI Technologies · Constitution Zion Core
     Fondateur : Daniel Jonathan ANDJ
     Sélecteur de mode minimaliste intégré dans la zone d'input (style Claude) -->

<script lang="ts">
	import { activeMode, MODEL_MAP, type Mode } from '$lib/stores/mode';
	import { WEBUI_BASE_URL } from '$lib/constants';

	let open = false;
	let selectorEl: HTMLDivElement;
	const modes: Mode[] = ['flash', 'pro', 'bp'];
	const MODE_IMAGES: Record<Mode, string> = {
		flash: `${WEBUI_BASE_URL}/flash-image.jpg`,
		pro: `${WEBUI_BASE_URL}/dauphin-image.jpg`,
		bp: `${WEBUI_BASE_URL}/black-panther-image.jpg`
	};

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
			<img src={MODE_IMAGES[$activeMode]} alt={current.label} class="mode-icon-image" draggable="false" />
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
						<img src={MODE_IMAGES[mode]} alt={config.label} class="opt-icon-image" draggable="false" />
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

	.mode-icon-image {
		width: 14px;
		height: 14px;
		border-radius: 4px;
		object-fit: cover;
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

	.opt-icon-image {
		width: 16px;
		height: 16px;
		border-radius: 4px;
		object-fit: cover;
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
