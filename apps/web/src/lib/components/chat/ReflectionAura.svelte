<!-- GabomaGPT · ReflectionAura.svelte
     SmartANDJ AI Technologies · Constitution Zion Core
     Fondateur : Daniel Jonathan ANDJ
     Aura de réflexion GSAP — 5 arcs qui respirent comme Gemini mais en gabonais.
     Chaque arc a sa propre vitesse et phase — organique, vivant.
     Se déclenche avant chaque réponse IA, s'arrête au premier token streaming. -->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { gsap } from 'gsap';

  /** Contrôle l'affichage de l'aura — true = réflexion en cours */
  export let active: boolean = false;

  /** Taille de l'aura en pixels */
  export let size: number = 36;

  /* 5 pétales — couleurs, dashoffsets initiaux (72° apart = 360/5) */
  const arcs = [
    { color: '#FFD54F', offset: 0 },      /* Perroquet */
    { color: '#29B6F6', offset: -24 },     /* Dauphin */
    { color: '#4CAF50', offset: -48 },     /* Panthère */
    { color: '#EF5350', offset: -72 },     /* Masque Bwiti */
    { color: '#CE93D8', offset: -96 },     /* Éléphant */
  ];

  /* circumference = 2π × 19 = 119.4px */
  const circumference = 119.4;

  let svgEl: SVGElement;
  let tweens: gsap.core.Tween[] = [];

  onMount(() => {
    if (!svgEl) return;
    const arcEls = svgEl.querySelectorAll('.arc');

    arcEls.forEach((arc, i) => {
      /* Rotation continue — chaque arc légèrement plus lent */
      tweens.push(
        gsap.to(arc, {
          strokeDashoffset: `-=${circumference}`,
          duration: 1.8 + i * 0.12,
          ease: 'none',
          repeat: -1,
        })
      );

      /* Respiration organique — l'arc s'étire et se contracte */
      tweens.push(
        gsap.to(arc, {
          strokeDasharray: `${22 + i * 2} ${38 - i * 2}`,
          duration: 0.9 + i * 0.15,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      );
    });
  });

  onDestroy(() => {
    tweens.forEach((t) => t.kill());
  });
</script>

{#if active}
  <div
    class="aura-wrap"
    style="width: {size}px; height: {size}px;"
    transition:fade={{ duration: 200 }}
  >
    <!-- SVG 5 arcs — un par couleur pétale -->
    <svg
      bind:this={svgEl}
      class="aura-svg"
      viewBox="0 0 40 40"
      width={size + 10}
      height={size + 10}
    >
      {#each arcs as arc, i}
        <circle
          class="arc"
          cx="20"
          cy="20"
          r="19"
          fill="none"
          stroke={arc.color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="20 40"
          stroke-dashoffset={arc.offset}
          opacity="0.85"
        />
      {/each}
    </svg>

    <!-- Cœur — logo 5 pétales -->
    <div class="avatar-core">
      <img
        src="/gabomagpt-logo.jpeg"
        alt="GabomaGPT"
        style="width: {size * 0.6}px; height: {size * 0.6}px; border-radius: 50%; object-fit: cover;"
      />
    </div>
  </div>
{/if}

<style>
  .aura-wrap {
    position: relative;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .aura-svg {
    position: absolute;
    inset: -5px;
    filter: blur(1.5px);
  }

  .avatar-core {
    position: relative;
    border-radius: 50%;
    background: var(--bg-surface, #0F1520);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
