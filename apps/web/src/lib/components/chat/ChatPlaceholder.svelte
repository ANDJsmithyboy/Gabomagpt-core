<script lang="ts">
	import { WEBUI_API_BASE_URL, WEBUI_BASE_URL } from '$lib/constants';
	import { marked } from 'marked';

	import { config, user, models as _models, temporaryChatEnabled } from '$lib/stores';
	import { onMount, getContext } from 'svelte';

	import { blur, fade } from 'svelte/transition';

	import Suggestions from './Suggestions.svelte';
	import { sanitizeResponseContent } from '$lib/utils';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import EyeSlash from '$lib/components/icons/EyeSlash.svelte';
	import { getGabomaGPTModelName } from '$lib/utils/gabomagpt-models';

	const i18n = getContext('i18n');

	export let modelIds = [];
	export let models = [];
	export let atSelectedModel;

	export let onSelect = (e) => {};

	let mounted = false;
	let selectedModelIdx = 0;

	/* Salutation gabonaise selon l'heure du jour */
	function getGreeting(): string {
		const hour = new Date().getHours();
		const name = $user?.name?.split(' ')[0] || 'ami';
		if (hour >= 5 && hour < 12) return `Mbolo ! Bonjour ${name} ☀️`;
		if (hour >= 12 && hour < 18) return `Akeva ! Bon après-midi ${name}`;
		if (hour >= 18 && hour < 22) return `Bonsoir ${name}, on gère quoi ? 🌙`;
		return `C'est tard ${name}, GabomaGPT veille 🔥`;
	}

	$: if (modelIds.length > 0) {
		selectedModelIdx = models.length - 1;
	}

	$: models = modelIds.map((id) => $_models.find((m) => m.id === id));

	onMount(() => {
		mounted = true;
	});
</script>

{#key mounted}
	<div class="m-auto w-full max-w-6xl px-4 sm:px-8 lg:px-20 flex flex-col items-center justify-center">
		<!-- Logo centré Claude-mobile style -->
		<div class="flex flex-col items-center mb-4 sm:mb-6" in:fade={{ duration: 300 }}>
			{#if models.length === 0 || !models[0]?.info?.meta?.profile_image_url}
				<img
					src="/gabomagpt-logo.jpeg"
					class="size-16 sm:size-20 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10"
					alt="GabomaGPT"
					draggable="false"
				/>
			{:else}
				<div class="flex -space-x-4 items-center">
					{#each models as model, modelIdx}
						<button
							on:click={() => {
								selectedModelIdx = modelIdx;
							}}
						>
							<Tooltip
								content={marked.parse(
									sanitizeResponseContent(
										models[selectedModelIdx]?.info?.meta?.description ?? ''
									).replaceAll('\n', '<br>')
								)}
								placement="right"
							>
								<img
									src={`${WEBUI_API_BASE_URL}/models/model/profile/image?id=${model?.id}&lang=${$i18n.language}`}
									class="size-14 sm:size-16 rounded-full border-2 border-white dark:border-gray-800 shadow-md"
									alt="logo"
									draggable="false"
								/>
							</Tooltip>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		{#if $temporaryChatEnabled}
			<Tooltip
				content={$i18n.t("This chat won't appear in history and your messages will not be saved.")}
				className="w-full flex justify-center mb-1"
				placement="top"
			>
				<div class="flex items-center gap-2 text-gray-500 text-sm mt-1 w-fit">
					<EyeSlash strokeWidth="2.5" className="size-4" />{$i18n.t('Temporary Chat')}
				</div>
			</Tooltip>
		{/if}

		<!-- Greeting centré -->
			<div class="text-center mb-4 sm:mb-6 font-primary" in:fade={{ duration: 200 }}>
				<div class="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
					{#if models[selectedModelIdx]?.name}
						{getGabomaGPTModelName(models[selectedModelIdx]?.id, models[selectedModelIdx]?.name)}
					{:else}
						{getGreeting()}
					{/if}
				</div>

			<div class="mt-1.5" in:fade={{ duration: 200, delay: 200 }}>
				{#if models[selectedModelIdx]?.info?.meta?.description ?? null}
					<div
						class="text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400 line-clamp-3 markdown max-w-md mx-auto"
					>
						{@html marked.parse(
							sanitizeResponseContent(
								models[selectedModelIdx]?.info?.meta?.description
							).replaceAll('\n', '<br>')
						)}
					</div>
					{#if models[selectedModelIdx]?.info?.meta?.user}
						<div class="mt-0.5 text-xs font-normal text-gray-400 dark:text-gray-500">
							By
							{#if models[selectedModelIdx]?.info?.meta?.user.community}
								<a
									href="https://gabomagpt.com/m/{models[selectedModelIdx]?.info?.meta?.user
										.username}"
									>{models[selectedModelIdx]?.info?.meta?.user.name
										? models[selectedModelIdx]?.info?.meta?.user.name
										: `@${models[selectedModelIdx]?.info?.meta?.user.username}`}</a
								>
							{:else}
								{models[selectedModelIdx]?.info?.meta?.user.name}
							{/if}
						</div>
					{/if}
				{:else}
					<div class="text-sm sm:text-base text-gray-400 dark:text-gray-500 font-normal">
						{$i18n.t('Comment puis-je vous aider aujourd\'hui ?')}
					</div>
				{/if}
			</div>
		</div>

		<!-- Suggestions responsive grid -->
		<div class="w-full max-w-2xl font-primary" in:fade={{ duration: 200, delay: 300 }}>
			<Suggestions
				className="grid grid-cols-1 sm:grid-cols-2 gap-2"
				suggestionPrompts={atSelectedModel?.info?.meta?.suggestion_prompts ??
					models[selectedModelIdx]?.info?.meta?.suggestion_prompts ??
					$config?.default_prompt_suggestions ??
					[]}
				{onSelect}
			/>
		</div>
	</div>
{/key}
