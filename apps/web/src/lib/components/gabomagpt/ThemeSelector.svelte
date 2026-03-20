<script lang="ts">
	/* GabomaGPT · ThemeSelector.svelte · SmartANDJ AI Technologies
	   Sélecteur des 5 thèmes pétales du logo */
	import { currentTheme, themes, type ThemeKey } from '$lib/stores/theme';
	import { cn } from '$lib/utils/cn';

	$: active = $currentTheme;
</script>

<div class="flex flex-col gap-2" role="radiogroup" aria-label="Couleur d'accentuation">
	{#each themes as t}
		<button
			class={cn(
				'flex items-center gap-3 rounded-xl px-3 py-2',
				'border transition-all duration-200',
				'hover:opacity-80 active:scale-[0.97]',
				active === t.key
					? 'border-[var(--accent-35)] bg-[var(--accent-10)]'
					: 'border-transparent bg-transparent'
			)}
			role="radio"
			aria-checked={active === t.key}
			on:click={() => currentTheme.setTheme(t.key)}
		>
			<!-- Point coloré -->
			<span
				class={cn(
					'inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200',
					active === t.key && 'scale-125 ring-2 ring-offset-1 ring-offset-transparent'
				)}
				style="background: {t.color}; {active === t.key ? `box-shadow: 0 0 8px ${t.color}60;` : ''}"
			></span>
			<!-- Nom du thème -->
			<span
				class={cn(
					'text-xs transition-colors duration-200',
					active === t.key ? 'font-semibold text-[var(--text-primary)]' : 'font-normal text-[var(--text-secondary)]'
				)}
			>
				{t.name}
			</span>
			<!-- Code couleur -->
			<span class="ml-auto font-mono text-[10px] text-[var(--text-tertiary)]">
				{t.color}
			</span>
		</button>
	{/each}
</div>
