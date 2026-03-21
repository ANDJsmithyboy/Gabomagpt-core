<!-- GabomaGPT · BPWorkspace.svelte
     SmartANDJ AI Technologies · Constitution Zion Core
     Fondateur : Daniel Jonathan ANDJ
     Panneau workspace Manus-style pour le mode Black Panther -->

<script lang="ts">
	import { isPantherMode } from '$lib/stores/gabomagpt';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let activeTab: 'preview' | 'code' | 'files' | 'terminal' = 'preview';

	const tabs = [
		{ id: 'preview' as const, label: 'Aperçu', icon: '◎' },
		{ id: 'code' as const, label: 'Code', icon: '⟨/⟩' },
		{ id: 'files' as const, label: 'Fichiers', icon: '▤' },
		{ id: 'terminal' as const, label: 'Terminal', icon: '▸_' },
	];
</script>

{#if $isPantherMode}
	<div
		class="bp-workspace"
		transition:slide={{ duration: 300, axis: 'x', easing: cubicOut }}
	>
		<!-- Tabbar du workspace -->
		<div class="bp-ws-tabs">
			{#each tabs as tab (tab.id)}
				<button
					class="bp-ws-tab"
					class:active={activeTab === tab.id}
					on:click={() => (activeTab = tab.id)}
				>
					<span class="bp-ws-tab-icon">{tab.icon}</span>
					<span class="bp-ws-tab-label">{tab.label}</span>
				</button>
			{/each}
		</div>

		<!-- Contenu du workspace -->
		<div class="bp-ws-content">
			{#if activeTab === 'preview'}
				<div class="bp-ws-empty">
					<div class="bp-ws-empty-icon">◎</div>
					<p class="bp-ws-empty-title">Workspace Black Panther</p>
					<p class="bp-ws-empty-desc">
						L'agent va afficher ici les résultats en temps réel :
						pages web, code généré, fichiers créés.
					</p>
				</div>
			{:else if activeTab === 'code'}
				<div class="bp-ws-empty">
					<div class="bp-ws-empty-icon">⟨/⟩</div>
					<p class="bp-ws-empty-title">Éditeur de code</p>
					<p class="bp-ws-empty-desc">
						Le code généré par l'agent s'affichera ici
						avec coloration syntaxique.
					</p>
				</div>
			{:else if activeTab === 'files'}
				<div class="bp-ws-empty">
					<div class="bp-ws-empty-icon">▤</div>
					<p class="bp-ws-empty-title">Explorateur de fichiers</p>
					<p class="bp-ws-empty-desc">
						Les fichiers et artefacts générés par l'agent
						seront listés ici.
					</p>
				</div>
			{:else if activeTab === 'terminal'}
				<div class="bp-ws-empty">
					<div class="bp-ws-empty-icon">▸_</div>
					<p class="bp-ws-empty-title">Terminal</p>
					<p class="bp-ws-empty-desc">
						Sortie en temps réel des commandes exécutées
						par l'agent.
					</p>
				</div>
			{/if}
		</div>

		<!-- Status bar -->
		<div class="bp-ws-status">
			<span class="bp-ws-status-dot"></span>
			<span>Agent prêt</span>
			<span class="bp-ws-status-sep">·</span>
			<span>Black Panther</span>
		</div>
	</div>
{/if}

<style>
	.bp-workspace {
		display: flex;
		flex-direction: column;
		width: 50%;
		min-width: 360px;
		max-width: 55%;
		height: 100%;
		border-left: 1px solid rgba(212, 164, 23, 0.12);
		background: #010102;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.bp-ws-tabs {
		display: flex;
		align-items: center;
		gap: 0;
		padding: 0 4px;
		height: 36px;
		border-bottom: 1px solid rgba(212, 164, 23, 0.08);
		background: rgba(2, 3, 4, 0.95);
		flex-shrink: 0;
	}

	.bp-ws-tab {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 6px 12px;
		border: none;
		background: transparent;
		color: rgba(255, 255, 255, 0.35);
		font-family: inherit;
		font-size: 11px;
		cursor: pointer;
		transition: color 0.15s, background 0.15s;
		border-bottom: 2px solid transparent;
		white-space: nowrap;
	}

	.bp-ws-tab:hover {
		color: rgba(255, 255, 255, 0.6);
		background: rgba(255, 255, 255, 0.03);
	}

	.bp-ws-tab.active {
		color: #D4A417;
		border-bottom-color: #D4A417;
	}

	.bp-ws-tab-icon {
		font-size: 10px;
		opacity: 0.7;
	}

	.bp-ws-tab-label {
		font-size: 10px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.bp-ws-content {
		flex: 1;
		overflow: auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bp-ws-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 32px;
		text-align: center;
		max-width: 280px;
	}

	.bp-ws-empty-icon {
		font-size: 28px;
		color: rgba(212, 164, 23, 0.3);
		margin-bottom: 4px;
	}

	.bp-ws-empty-title {
		font-size: 12px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.bp-ws-empty-desc {
		font-size: 11px;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.25);
		font-family: 'Outfit', 'Sora', sans-serif;
	}

	.bp-ws-status {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 12px;
		height: 24px;
		border-top: 1px solid rgba(212, 164, 23, 0.08);
		background: rgba(2, 3, 4, 0.95);
		font-size: 9px;
		color: rgba(255, 255, 255, 0.3);
		letter-spacing: 0.05em;
		text-transform: uppercase;
		flex-shrink: 0;
	}

	.bp-ws-status-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #00FF87;
		animation: blink-dot 2s ease-in-out infinite;
	}

	.bp-ws-status-sep {
		opacity: 0.3;
	}

	@keyframes blink-dot {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}

	@media (max-width: 768px) {
		.bp-workspace {
			width: 100%;
			max-width: 100%;
			min-width: unset;
			height: 40vh;
			border-left: none;
			border-top: 1px solid rgba(212, 164, 23, 0.12);
		}
	}
</style>
