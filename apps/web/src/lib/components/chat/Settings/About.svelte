<script lang="ts">
	import { getVersionUpdates } from '$lib/apis';
	import { getOllamaVersion } from '$lib/apis/ollama';
	import { WEBUI_BUILD_HASH, WEBUI_VERSION } from '$lib/constants';
	import { WEBUI_NAME, config, showChangelog } from '$lib/stores';
	import { compareVersion } from '$lib/utils';
	import { onMount, getContext } from 'svelte';

	import Tooltip from '$lib/components/common/Tooltip.svelte';

	const i18n = getContext('i18n');

	let ollamaVersion = '';

	let updateAvailable = null;
	let version = {
		current: '',
		latest: ''
	};

	const checkForVersionUpdates = async () => {
		updateAvailable = null;
		version = await getVersionUpdates(localStorage.token).catch((error) => {
			return {
				current: WEBUI_VERSION,
				latest: WEBUI_VERSION
			};
		});

		updateAvailable = compareVersion(version.latest, version.current);
	};

	onMount(async () => {
		ollamaVersion = await getOllamaVersion(localStorage.token).catch((error) => {
			return '';
		});

		if ($config?.features?.enable_version_update_check) {
			checkForVersionUpdates();
		}
	});
</script>

<div id="tab-about" class="flex flex-col h-full justify-between space-y-3 text-sm mb-6">
	<div class=" space-y-3 overflow-y-scroll max-h-[28rem] md:max-h-full">
		<div>
			<div class=" mb-2.5 text-sm font-medium flex space-x-2 items-center">
				<div>
					{$WEBUI_NAME}
					{$i18n.t('Version')}
				</div>
			</div>
			<div class="flex w-full justify-between items-center">
				<div class="flex flex-col text-xs text-gray-700 dark:text-gray-200">
					<div class="flex gap-1">
						<Tooltip content={WEBUI_BUILD_HASH}>
							v{WEBUI_VERSION}
						</Tooltip>

						{#if $config?.features?.enable_version_update_check}
							<a
								href="https://github.com/gabomagpt/gabomagpt/releases/tag/v{version.latest}"
								target="_blank"
							>
								{updateAvailable === null
									? $i18n.t('Checking for updates...')
									: updateAvailable
										? `(v${version.latest} ${$i18n.t('available!')})`
										: $i18n.t('(latest)')}
							</a>
						{/if}
					</div>

					<button
						class=" underline flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500"
						on:click={() => {
							showChangelog.set(true);
						}}
					>
						<div>{$i18n.t("See what's new")}</div>
					</button>
				</div>

				{#if $config?.features?.enable_version_update_check}
					<button
						class=" text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-800 transition rounded-lg font-medium"
						on:click={() => {
							checkForVersionUpdates();
						}}
					>
						{$i18n.t('Check for updates')}
					</button>
				{/if}
			</div>
		</div>

		{#if ollamaVersion}
			<hr class=" border-gray-100/30 dark:border-gray-850/30" />

			<div>
				<div class=" mb-2.5 text-sm font-medium">{$i18n.t('Ollama Version')}</div>
				<div class="flex w-full">
					<div class="flex-1 text-xs text-gray-700 dark:text-gray-200">
						{ollamaVersion ?? 'N/A'}
					</div>
				</div>
			</div>
		{/if}

		<hr class=" border-gray-100/30 dark:border-gray-850/30" />

		{#if $config?.license_metadata}
			<div class="mb-2 text-xs">
				{#if !$WEBUI_NAME.includes('GabomaGPT')}
					<span class=" text-gray-500 dark:text-gray-300 font-medium">{$WEBUI_NAME}</span> -
				{/if}

				<span class=" capitalize">{$config?.license_metadata?.type}</span> license purchased by
				<span class=" capitalize">{$config?.license_metadata?.organization_name}</span>
			</div>
		{:else}
			<div class="flex space-x-1">
				<a href="https://discord.gg/5rJgQTnV4s" target="_blank">
					<img
						alt="Discord"
						src="https://img.shields.io/badge/Discord-GabomaGPT-blue?logo=discord&logoColor=white"
					/>
				</a>

				<a href="https://twitter.com/GabomaGPT" target="_blank">
					<img
						alt="X (formerly Twitter) Follow"
						src="https://img.shields.io/twitter/follow/GabomaGPT"
					/>
				</a>

				<a href="https://github.com/gabomagpt/gabomagpt" target="_blank">
					<img
						alt="Github Repo"
						src="https://img.shields.io/github/stars/gabomagpt/gabomagpt?style=social&label=Star us on Github"
					/>
				</a>
			</div>
		{/if}

		<div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
			<div class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
				<p class="font-medium text-gray-700 dark:text-gray-200">🇬🇦 GabomaGPT — IA Souveraine du Gabon</p>
				<p class="mt-1">Conçu et développé par
					<a class="font-semibold text-gray-700 dark:text-gray-200 hover:underline" href="https://smartandj.com" target="_blank">Daniel Jonathan ANDJ</a>,
					Fondateur & CEO
				</p>
				<p class="mt-0.5">
					<a class="font-medium text-gray-600 dark:text-gray-300 hover:underline" href="https://smartandj.com" target="_blank">SmartANDJ AI Technologies</a>
					· Libreville, Gabon
				</p>
				<p class="mt-1.5 text-gray-400 dark:text-gray-500">
					Copyright © {new Date().getFullYear()} SmartANDJ AI Technologies. Tous droits réservés.
				</p>
			</div>
		</div>
	</div>
</div>
