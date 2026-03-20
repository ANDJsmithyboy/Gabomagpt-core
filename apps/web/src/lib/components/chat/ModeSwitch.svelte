<!-- GabomaGPT · ModeSwitch.svelte
     SmartANDJ AI Technologies · Constitution Zion Core
     Fondateur : Daniel Jonathan ANDJ
     Sélecteur de mode 3 pilules : Flash ⚡ | Pro 🐬 | BP 🐆
     Transition fluide 400ms sur toute l'interface quand BP activé. -->

<script lang="ts">
  import { activeMode, MODEL_MAP, type Mode } from '$lib/stores/mode';

  const modes: Mode[] = ['flash', 'pro', 'bp'];

  function selectMode(mode: Mode): void {
    activeMode.set(mode);
  }
</script>

<div class="mode-switch" role="radiogroup" aria-label="Mode GabomaGPT">
  {#each modes as mode (mode)}
    {@const config = MODEL_MAP[mode]}
    {@const isActive = $activeMode === mode}
    <button
      class="mode-pill"
      class:active={isActive}
      role="radio"
      aria-checked={isActive}
      on:click={() => selectMode(mode)}
      style="
        --pill-color: {config.color};
        --pill-glow: {config.colorGlow};
      "
      title="{config.label} — {config.description}"
    >
      <span class="mode-emoji">{config.emoji}</span>
      <span class="mode-label">{config.label}</span>

      <!-- Indicateur lumineux actif -->
      {#if isActive}
        <span class="mode-dot" />
      {/if}
    </button>
  {/each}
</div>

<style>
  .mode-switch {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px;
    border-radius: var(--radius-lg, 14px);
    background: rgba(11, 15, 26, 0.75);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 0.5px solid rgba(255,255,255,0.08);
  }

  .mode-pill {
    position: relative;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border: none;
    border-radius: var(--radius-md, 10px);
    background: transparent;
    color: var(--text-muted, #4A566E);
    font-family: var(--font-body, 'Sora', sans-serif);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    overflow: hidden;
  }

  .mode-pill:hover {
    background: var(--bg-elevated, #141C2A);
    color: var(--text-secondary, #8A9BBE);
  }

  .mode-pill.active {
    background: var(--bg-elevated, #141C2A);
    color: var(--pill-glow);
    box-shadow: 0 0 12px color-mix(in srgb, var(--pill-color) 25%, transparent);
    border: 1px solid color-mix(in srgb, var(--pill-color) 30%, transparent);
  }

  .mode-emoji {
    font-size: 0.9rem;
    line-height: 1;
  }

  .mode-label {
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .mode-dot {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--pill-glow);
    box-shadow: 0 0 6px var(--pill-glow);
  }

  /* Responsive — masquer le label sur mobile */
  @media (max-width: 640px) {
    .mode-label {
      display: none;
    }
    .mode-pill {
      padding: 6px 10px;
    }
  }
</style>
