<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { createEventDispatcher, onMount, getContext } from 'svelte';
	import { getLanguages, changeLanguage } from '$lib/i18n';
	const dispatch = createEventDispatcher();

	import { config, models, settings, theme, user } from '$lib/stores';
	import { gabomaStore, PLANS, isPaymentModalOpen } from '$lib/stores/gabomagpt';

	const i18n = getContext('i18n');

	$: gabomaState = $gabomaStore;

	import AdvancedParams from './Advanced/AdvancedParams.svelte';
	import Textarea from '$lib/components/common/Textarea.svelte';
	export let saveSettings: Function;
	export let getModels: Function;

	// General
	let themes = ['sombre', 'noir-oled', 'bleu-nuit', 'vert-foret', 'light'];
	let selectedTheme = 'system';

	let languages: Awaited<ReturnType<typeof getLanguages>> = [];
	let lang = $i18n.language;
	let notificationEnabled = false;
	let system = '';

	let showAdvanced = false;

	const toggleNotification = async () => {
		const permission = await Notification.requestPermission();

		if (permission === 'granted') {
			notificationEnabled = !notificationEnabled;
			saveSettings({ notificationEnabled: notificationEnabled });
		} else {
			toast.error(
				$i18n.t(
					'Response notifications cannot be activated as the website permissions have been denied. Please visit your browser settings to grant the necessary access.'
				)
			);
		}
	};

	let params = {
		// Advanced
		stream_response: null,
		stream_delta_chunk_size: null,
		function_calling: null,
		seed: null,
		temperature: null,
		reasoning_effort: null,
		logit_bias: null,
		frequency_penalty: null,
		presence_penalty: null,
		repeat_penalty: null,
		repeat_last_n: null,
		mirostat: null,
		mirostat_eta: null,
		mirostat_tau: null,
		top_k: null,
		top_p: null,
		min_p: null,
		stop: null,
		tfs_z: null,
		num_ctx: null,
		num_batch: null,
		num_keep: null,
		max_tokens: null,
		num_gpu: null
	};

	const saveHandler = async () => {
		saveSettings({
			system: system !== '' ? system : undefined,
			params: {
				stream_response: params.stream_response !== null ? params.stream_response : undefined,
				stream_delta_chunk_size:
					params.stream_delta_chunk_size !== null ? params.stream_delta_chunk_size : undefined,
				function_calling: params.function_calling !== null ? params.function_calling : undefined,
				seed: (params.seed !== null ? params.seed : undefined) ?? undefined,
				stop: params.stop ? params.stop.split(',').filter((e) => e) : undefined,
				temperature: params.temperature !== null ? params.temperature : undefined,
				reasoning_effort: params.reasoning_effort !== null ? params.reasoning_effort : undefined,
				logit_bias: params.logit_bias !== null ? params.logit_bias : undefined,
				frequency_penalty: params.frequency_penalty !== null ? params.frequency_penalty : undefined,
				presence_penalty: params.frequency_penalty !== null ? params.frequency_penalty : undefined,
				repeat_penalty: params.frequency_penalty !== null ? params.frequency_penalty : undefined,
				repeat_last_n: params.repeat_last_n !== null ? params.repeat_last_n : undefined,
				mirostat: params.mirostat !== null ? params.mirostat : undefined,
				mirostat_eta: params.mirostat_eta !== null ? params.mirostat_eta : undefined,
				mirostat_tau: params.mirostat_tau !== null ? params.mirostat_tau : undefined,
				top_k: params.top_k !== null ? params.top_k : undefined,
				top_p: params.top_p !== null ? params.top_p : undefined,
				min_p: params.min_p !== null ? params.min_p : undefined,
				tfs_z: params.tfs_z !== null ? params.tfs_z : undefined,
				num_ctx: params.num_ctx !== null ? params.num_ctx : undefined,
				num_batch: params.num_batch !== null ? params.num_batch : undefined,
				num_keep: params.num_keep !== null ? params.num_keep : undefined,
				max_tokens: params.max_tokens !== null ? params.max_tokens : undefined,
				use_mmap: params.use_mmap !== null ? params.use_mmap : undefined,
				use_mlock: params.use_mlock !== null ? params.use_mlock : undefined,
				num_thread: params.num_thread !== null ? params.num_thread : undefined,
				num_gpu: params.num_gpu !== null ? params.num_gpu : undefined,
				think: params.think !== null ? params.think : undefined,
				keep_alive: params.keep_alive !== null ? params.keep_alive : undefined,
				format: params.format !== null ? params.format : undefined
			}
		});
		dispatch('save');
	};

	onMount(async () => {
		selectedTheme = localStorage.theme ?? 'system';

		languages = await getLanguages();

		if (!$config?.features?.enable_easter_eggs) {
			languages = languages.filter((l) => l.code !== 'dg-DG');
		}

		notificationEnabled = $settings.notificationEnabled ?? false;
		system = $settings.system ?? '';

		params = { ...params, ...$settings.params };
		params.stop = $settings?.params?.stop ? ($settings?.params?.stop ?? []).join(',') : null;
	});

	const applyTheme = (_theme: string) => {
		/* ZION-CORE: Tous les thèmes sombres utilisent data-theme
		   pour une propagation CSS totale via --color-gray-* et --zc-* */
		const darkThemes = ['sombre', 'noir-oled', 'bleu-nuit', 'vert-foret'];
		const isDark = darkThemes.includes(_theme) || _theme === 'dark' || _theme === 'oled-dark';
		const isLight = _theme === 'clair' || _theme === 'light' || _theme === 'her';
		const isSystem = _theme === 'system';

		let themeToApply = isLight ? 'light' : 'dark';
		if (isSystem) {
			themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		} 

		/* Nettoyage classes HTML */
		document.documentElement.classList.remove('dark', 'light');
		document.documentElement.classList.add(themeToApply);

		/* Nettoyage inline styles (ancien système) */
		['--color-gray-50','--color-gray-100','--color-gray-200','--color-gray-300','--color-gray-400','--color-gray-500','--color-gray-600','--color-gray-700','--color-gray-800','--color-gray-850','--color-gray-900','--color-gray-950'].forEach(v => {
			document.documentElement.style.removeProperty(v);
		});

		/* data-theme UNIQUEMENT pour les themes custom (pas clair/sombre = GabomaGPT natif) */
		const dataThemeMap: Record<string, string> = {
			'noir-oled': 'noir-oled',
			'oled-dark': 'noir-oled',
			'bleu-nuit': 'bleu-nuit',
			'vert-foret': 'vert-foret'
		};

		const dataThemeValue = dataThemeMap[_theme];
		if (dataThemeValue) {
			document.documentElement.setAttribute('data-theme', dataThemeValue);
		} else {
			document.documentElement.removeAttribute('data-theme');
		}

		/* Meta theme-color */
		const metaThemeColor = document.querySelector('meta[name="theme-color"]');
		if (metaThemeColor) {
			const metaColorMap: Record<string, string> = {
				'clair': '#FFFFFF',
				'sombre': '#050810',
				'dark': '#050810',
				'noir-oled': '#000000',
				'oled-dark': '#000000',
				'bleu-nuit': '#05081A',
				'vert-foret': '#06150C',
				'light': '#FFFFFF',
				'her': '#983724'
			};
			metaThemeColor.setAttribute('content', metaColorMap[_theme] ?? (themeToApply === 'dark' ? '#050810' : '#ffffff'));
		}

		if (typeof window !== 'undefined' && window.applyTheme) {
			window.applyTheme();
		}
	};

	const themeChangeHandler = (_theme: string) => {
		theme.set(_theme);
		localStorage.setItem('theme', _theme);
		applyTheme(_theme);
	};
</script>

<div class="flex flex-col h-full justify-between text-sm" id="tab-general">
	<div class="  overflow-y-scroll max-h-[28rem] md:max-h-full">
		<div class="">
			<div class=" mb-1 text-sm font-medium">{$i18n.t('WebUI Settings')}</div>

			<div class="flex w-full justify-between">
				<div class=" self-center text-xs font-medium">{$i18n.t('Theme')}</div>
				<div class="flex items-center relative">
					<select
						class="w-fit pr-8 rounded-sm py-2 px-2 text-xs bg-transparent text-right {$settings.highContrastMode
							? ''
							: 'outline-hidden'}"
						bind:value={selectedTheme}
						placeholder={$i18n.t('Select a theme')}
						on:change={() => themeChangeHandler(selectedTheme)}
					>
						<option value="system">⚙️ {$i18n.t('System')}</option>
						<option value="clair">☀️ Clair</option>
						<option value="sombre">� Sombre</option>
						<option value="noir-oled">🌃 Noir OLED</option>
						<option value="bleu-nuit">🌌 Bleu Nuit</option>
						<option value="vert-foret">🌿 Vert Forêt</option>
						{#if $config?.features?.enable_easter_eggs}
							<option value="her">🌷 Her</option>
						{/if}
					</select>
				</div>
			</div>

			<div class="flex w-full justify-between">
				<div class=" self-center text-xs font-medium">{$i18n.t('Language')}</div>
				<div class="flex items-center relative">
					<select
						class="w-fit pr-8 rounded-sm py-2 px-2 text-xs bg-transparent text-right {$settings.highContrastMode
							? ''
							: 'outline-hidden'}"
						bind:value={lang}
						placeholder={$i18n.t('Select a language')}
						on:change={(e) => {
							changeLanguage(lang);
						}}
					>
						{#each languages as language}
							<option value={language['code']}>{language['title']}</option>
						{/each}
					</select>
				</div>
			</div>
			{#if $i18n.language === 'en-US' && !($config?.license_metadata ?? false)}
				<div
					class="mb-2 text-xs {($settings?.highContrastMode ?? false)
						? 'text-gray-800 dark:text-gray-100'
						: 'text-gray-400 dark:text-gray-500'}"
				>
					Couldn't find your language?
					<a
						class="font-medium underline {($settings?.highContrastMode ?? false)
							? 'text-gray-700 dark:text-gray-200'
							: 'text-gray-300'}"
						href="https://github.com/gabomagpt/gabomagpt/blob/main/docs/CONTRIBUTING.md#-translations-and-internationalization"
						target="_blank"
					>
						Help us translate GabomaGPT!
					</a>
				</div>
			{/if}

			<div>
				<div class=" py-0.5 flex w-full justify-between">
					<div class=" self-center text-xs font-medium">{$i18n.t('Notifications')}</div>

					<button
						class="p-1 px-3 text-xs flex rounded-sm transition"
						on:click={() => {
							toggleNotification();
						}}
						type="button"
						role="switch"
						aria-checked={notificationEnabled}
					>
						{#if notificationEnabled === true}
							<span class="ml-2 self-center">{$i18n.t('On')}</span>
						{:else}
							<span class="ml-2 self-center">{$i18n.t('Off')}</span>
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- GabomaGPT Plan Pro — Airtel Money / Moov Money -->
		<hr class="border-gray-100/30 dark:border-gray-850/30 my-3" />
		<div>
			<div class="mb-1.5 text-sm font-medium">Mon Plan GabomaGPT</div>
			<div class="glass-card p-4">
				<div class="flex items-center justify-between mb-3">
					<div>
						<div class="text-sm font-semibold flex items-center gap-1.5" style="color: {PLANS[gabomaState.plan].color}">
							{PLANS[gabomaState.plan].icon} {PLANS[gabomaState.plan].name}
						</div>
						<div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
							{gabomaState.tokens} / {gabomaState.tokensMax} jetons restants
						</div>
					</div>
					<div class="w-12 h-12 relative">
						<svg viewBox="0 0 36 36" class="w-12 h-12 -rotate-90">
							<circle cx="18" cy="18" r="15.5" fill="none" stroke-width="2.5" class="stroke-gray-200 dark:stroke-gray-700"></circle>
							<circle cx="18" cy="18" r="15.5" fill="none" stroke-width="2.5"
								stroke-linecap="round"
								style="stroke: {PLANS[gabomaState.plan].color}; stroke-dasharray: {2 * Math.PI * 15.5}; stroke-dashoffset: {2 * Math.PI * 15.5 * (1 - gabomaState.tokens / gabomaState.tokensMax)};"
							></circle>
						</svg>
						<span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
							{Math.round(gabomaState.tokens / gabomaState.tokensMax * 100)}%
						</span>
					</div>
				</div>

				<div class="flex gap-2">
					<button
						class="flex-1 rounded-xl py-2.5 text-xs font-semibold bg-[var(--accent)] text-[var(--accent-foreground)] transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
						on:click={() => gabomaStore.openPaymentModal()}
					>
						📱 Recharger via Airtel Money
					</button>
					<button
						class="flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.97] bg-blue-600 text-white"
						on:click={() => gabomaStore.openPaymentModal()}
					>
						📱 Recharger via Moov Money
					</button>
				</div>

				<div class="mt-3 text-center">
					<button
						class="text-[11px] text-[var(--accent)] hover:underline transition-colors"
						on:click={() => gabomaStore.openPaymentModal()}
					>
						Voir tous les plans (Pro, Elite, Black Panther)
					</button>
				</div>
			</div>
		</div>

		{#if $user?.role === 'admin' || (($user?.permissions.chat?.controls ?? true) && ($user?.permissions.chat?.system_prompt ?? true))}
			<hr class="border-gray-100/30 dark:border-gray-850/30 my-3" />

			<div>
				<div class=" my-2.5 text-sm font-medium">{$i18n.t('System Prompt')}</div>
				<Textarea
					bind:value={system}
					className={'w-full text-sm outline-hidden resize-vertical' +
						($settings.highContrastMode
							? ' p-2.5 border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 overflow-y-hidden'
							: '  dark:text-gray-300 ')}
					rows="4"
					placeholder={$i18n.t('Enter system prompt here')}
				/>
			</div>
		{/if}

		{#if $user?.role === 'admin' || (($user?.permissions.chat?.controls ?? true) && ($user?.permissions.chat?.params ?? true))}
			<div class="mt-2 space-y-3 pr-1.5">
				<div class="flex justify-between items-center text-sm">
					<div class="  font-medium">{$i18n.t('Advanced Parameters')}</div>
					<button
						class=" text-xs font-medium {($settings?.highContrastMode ?? false)
							? 'text-gray-800 dark:text-gray-100'
							: 'text-gray-400 dark:text-gray-500'}"
						type="button"
						aria-expanded={showAdvanced}
						on:click={() => {
							showAdvanced = !showAdvanced;
						}}>{showAdvanced ? $i18n.t('Hide') : $i18n.t('Show')}</button
					>
				</div>

				{#if showAdvanced}
					<AdvancedParams admin={$user?.role === 'admin'} bind:params />
				{/if}
			</div>
		{/if}
	</div>

	<div class="flex justify-end pt-3 text-sm font-medium">
		<button
			class="px-3.5 py-1.5 text-sm font-medium bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 transition rounded-full"
			on:click={() => {
				saveHandler();
			}}
		>
			{$i18n.t('Save')}
		</button>
	</div>
</div>
