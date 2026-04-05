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

	/** @type {any} */
	const i18n: any = getContext('i18n');

	export let modelIds: string[] = [];
	export let models: any[] = [];
	export let atSelectedModel: any;

	export let onSelect: (e: any) => void = () => {};

	let mounted: boolean = false;
	let selectedModelIdx: number = 0;

	/* Salutation gabonaise selon l'heure du jour */
	function getGreeting(): string {
		const hour = new Date().getHours();
		const name = ($user as any)?.name?.split(' ')[0] || '';
		const prenom = name ? `, ${name}` : '';
		if (hour >= 5 && hour < 12) return `Mbolo ! Bonjour${prenom}`;
		if (hour >= 12 && hour < 18) return `Mbolo ! Bon après-midi${prenom}`;
		if (hour >= 18 && hour < 22) return `Mbolo ! Bonsoir${prenom}`;
		return `Mbolo ! Bonne nuit${prenom}`;
	}

	$: if (modelIds.length > 0) {
		selectedModelIdx = models.length - 1;
	}

	$: models = modelIds.map((id: string) => $_models.find((m: any) => m.id === id));

	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<div class="m-auto w-full max-w-6xl px-4 sm:px-8 lg:px-20 flex flex-col items-center justify-center">
		<!-- Logo GabomaGPT centre -->
		<div class="flex flex-col items-center mb-4 sm:mb-6" in:fade={{ duration: 300 }}>
			<img
				src="/gabomagpt-logo.jpeg"
				class="size-20 sm:size-[100px] rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10"
				alt="GabomaGPT"
				draggable="false"
			/>
		</div>

		{#if $temporaryChatEnabled}
			<Tooltip
				content={i18n?.t("This chat won't appear in history and your messages will not be saved.") ?? "This chat won't appear in history"}
				className="w-full flex justify-center mb-1"
				placement="top"
			>
				<div class="flex items-center gap-2 text-gray-500 text-sm mt-1 w-fit">
					<EyeSlash strokeWidth="2.5" className="size-4" />{i18n?.t('Temporary Chat') ?? 'Temporary Chat'}
				</div>
			</Tooltip>
		{/if}

		<!-- Greeting Mbolo -->
		<div class="text-center mb-6 sm:mb-8 font-primary" in:fade={{ duration: 200 }}>
			<div class="text-2xl sm:text-3xl font-bold tracking-tight welcome-message">
				<span style="color: #D4AF37; font-size: 1.15em;">{getGreeting().split('!')[0]}!</span>
				<span class="text-gray-800 dark:text-gray-100">{getGreeting().split('!').slice(1).join('!')}</span>
			</div>

			<div class="mt-2 text-sm sm:text-base text-gray-400 dark:text-gray-500 font-normal" in:fade={{ duration: 200, delay: 200 }}>
				Votre IA souveraine, toujours là pour vous.
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
{/if}
