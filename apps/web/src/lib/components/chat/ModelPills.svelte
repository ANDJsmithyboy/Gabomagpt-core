<script lang="ts">
	import { models } from '$lib/stores';
	import { getGabomaModelName, getGabomaModelIcon, getGabomaModelTier } from '$lib/utils/modelUtils';
	
	// Find the actual selected model from the chat component
	$: selectedModel = models.find(m => m.id === atSelectedModel?.id) || models[0];
	
	function selectModel(modelId: string) {
		// This would need to be connected to the actual model selection logic
		console.log('Selected model:', modelId);
	}
	
	function getTier(modelId: string): string {
		return getGabomaModelTier(modelId);
	}
</script>

<div class="gaboma-model-pills">
	{#each $models as model}
		<button
			class="gaboma-model-pill {getTier(model.id)} 
			       {$selectedModel === model.id ? 'active' : ''}"
			on:click={() => selectModel(model.id)}
		>
			{#if getTier(model.id) === 'flash'}⚡{/if}
			{#if getTier(model.id) === 'pro'}🔥{/if}
			{#if getTier(model.id) === 'black_panther'}🐆{/if}
			{getGabomaModelName(model.id)}
		</button>
	{/each}
</div>

<style>
	.gaboma-model-pills {
		display: flex !important;
		flex-direction: row !important;
		gap: 8px !important;
		padding: 8px 16px !important;
		overflow-x: auto !important;
		scrollbar-width: none !important;
		-webkit-overflow-scrolling: touch !important;
		position: sticky !important;
		top: 0 !important;
		z-index: 10 !important;
		background: rgba(5, 8, 16, 0.95) !important;
		backdrop-filter: blur(12px) !important;
		border-bottom: 1px solid rgba(255,255,255,0.05) !important;
	}

	.gaboma-model-pills::-webkit-scrollbar {
		display: none !important;
	}

	.gaboma-model-pill {
		flex-shrink: 0 !important;
		padding: 6px 16px !important;
		border-radius: 20px !important;
		font-size: 13px !important;
		font-weight: 500 !important;
		cursor: pointer !important;
		transition: all 0.2s !important;
		border: 1px solid rgba(255,255,255,0.1) !important;
		background: rgba(255,255,255,0.04) !important;
		color: rgba(255,255,255,0.5) !important;
		white-space: nowrap !important;
		font-family: 'Sora', sans-serif !important;
	}

	.gaboma-model-pill.active {
		background: rgba(29,185,84,0.15) !important;
		border-color: rgba(29,185,84,0.4) !important;
		color: #1DB954 !important;
	}

	.gaboma-model-pill.pro.active {
		background: rgba(201,162,39,0.15) !important;
		border-color: rgba(201,162,39,0.4) !important;
		color: #C9A227 !important;
	}

	.gaboma-model-pill.black-panther.active {
		background: rgba(139,92,246,0.15) !important;
		border-color: rgba(139,92,246,0.4) !important;
		color: #8B5CF6 !important;
	}

	.gaboma-model-pill:hover {
		background: rgba(255,255,255,0.08) !important;
		transform: translateY(-1px) !important;
	}

	.gaboma-model-pill:active {
		transform: translateY(0) !important;
	}
</style>
