<!-- GabomaGPT · IbogaToggle.svelte
     SmartANDJ AI Technologies · Constitution Zion Core
     Fondateur : Daniel Jonathan ANDJ
     Bouton sidebar — vrai logo IBOGA AI (iboga-ai.jpeg).
     Remplace le menu hamburger de GabomaGPT.
     Effet spring au clic, lueur au survol. -->

<script lang="ts">
  /** État d'ouverture de la sidebar */
  export let open: boolean = false;

  /** Callback au clic */
  export let onToggle: () => void = () => {};

  function handleClick() {
    open = !open;
    onToggle();
  }
</script>

<button
  class="iboga-toggle"
  class:open
  on:click={handleClick}
  aria-label={open ? 'Fermer la barre latérale' : 'Ouvrir la barre latérale'}
  title="IBOGA AI — Barre latérale"
>
  <img
    class="iboga-img"
    src="/iboga-ai.jpeg"
    alt="Iboga AI"
    width="32"
    height="32"
  />
</button>

<style>
  .iboga-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md, 10px);
    background: transparent;
    border: 1px solid var(--border-subtle, rgba(255,255,255,0.04));
    cursor: pointer;
    transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0;
    overflow: hidden;
  }

  .iboga-toggle:hover {
    background: var(--bg-elevated, #141C2A);
    border-color: var(--border-emerald, rgba(46,204,138,0.15));
    box-shadow: 0 0 12px rgba(46,204,138,0.12);
  }

  .iboga-img {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    object-fit: cover;
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), filter 0.28s ease;
  }

  .iboga-toggle:hover .iboga-img {
    filter: brightness(1.2);
    transform: scale(1.05);
  }

  .iboga-toggle:active .iboga-img {
    transform: scale(0.94);
  }

  .iboga-toggle.open .iboga-img {
    filter: brightness(1.15) saturate(1.2);
  }
</style>
