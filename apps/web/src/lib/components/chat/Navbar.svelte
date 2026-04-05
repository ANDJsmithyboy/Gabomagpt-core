<script lang="ts">
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';

	import {
		WEBUI_NAME,
		banners,
		chatId,
		config,
		mobile,
		models as _models,
		settings,
		showArchivedChats,
		showControls,
		showSidebar,
		temporaryChatEnabled,
		user
	} from '$lib/stores';
	import { getGabomaGPTModelName, filterModelsForUser, TIER_DESCRIPTIONS } from '$lib/utils/gabomagpt-models';

	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import ShareChatModal from '../chat/ShareChatModal.svelte';
	import Tooltip from '../common/Tooltip.svelte';
	import Menu from '$lib/components/layout/Navbar/Menu.svelte';
	import UserMenu from '$lib/components/layout/Sidebar/UserMenu.svelte';
	import AdjustmentsHorizontal from '../icons/AdjustmentsHorizontal.svelte';

	import PencilSquare from '../icons/PencilSquare.svelte';
	import Banner from '../common/Banner.svelte';
	import Sidebar from '../icons/Sidebar.svelte';

	import ChatBubbleDotted from '../icons/ChatBubbleDotted.svelte';
	import ChatBubbleDottedChecked from '../icons/ChatBubbleDottedChecked.svelte';

	import EllipsisHorizontal from '../icons/EllipsisHorizontal.svelte';
	import ChatPlus from '../icons/ChatPlus.svelte';
	import ChatCheck from '../icons/ChatCheck.svelte';
	import Knobs from '../icons/Knobs.svelte';
	import { WEBUI_API_BASE_URL, WEBUI_BASE_URL } from '$lib/constants';

	/* GabomaGPT */
	import { TokenBadge, UpgradeButton } from '$lib/components/gabomagpt';

	const i18n: any = getContext('i18n');

	export let initNewChat: Function;
	export let shareEnabled: boolean = false;
	export const scrollTop = 0;

	export let chat: any;
	export let history: any;
	export let selectedModels: string[];
	export let showModelSelector = true;

	export let onSaveTempChat: () => {};
	export let archiveChatHandler: (id: string) => void;
	export let moveChatHandler: (id: string, folderId: string) => void;

	let closedBannerIds: string[] = [];

	let showShareChatModal = false;
	let showDownloadChatModal = false;
	let showModelSheet = false;

	$: isAdmin = ($user as any)?.role === 'admin';
	$: currentModelId = selectedModels?.[0] ?? '';
	$: currentModel = $_models.find((m) => m.id === currentModelId);
	$: currentModelDisplay = currentModel
		? getGabomaGPTModelName(currentModel.id, currentModel.name)
		: 'GabomaGPT';
</script>

<ShareChatModal bind:show={showShareChatModal} chatId={$chatId} />

<button
	id="new-chat-button"
	class="hidden"
	on:click={() => {
		initNewChat();
	}}
	aria-label="New Chat"
></button>

<nav
	class="sticky top-0 z-30 w-full {chat?.id
		? 'pt-0.5 pb-1'
		: 'pt-1 pb-1'} -mb-12 flex flex-col items-center drag-region
		glass-header
		transition-all duration-200"
>
	<div class="flex items-center w-full pl-1.5 pr-1">
		<div
			id="navbar-bg-gradient-to-b"
			class="{chat?.id
				? 'visible'
				: 'invisible'} bg-linear-to-b via-40% to-97% from-white/90 via-white/50 to-transparent dark:from-gray-900/90 dark:via-gray-900/50 dark:to-transparent pointer-events-none absolute inset-0 -bottom-10 z-[-1]"
		></div>

		<div class=" flex max-w-full w-full mx-auto px-1.5 md:px-2 pt-0.5 bg-transparent">
			<div class="flex items-center w-full max-w-full">
				{#if $mobile && !$showSidebar}
					<div
						class="-translate-x-0.5 mr-1 self-start flex flex-none items-center"
					>
						<Tooltip content={$i18n.t('Open Sidebar')}>
							<button
								class="cursor-pointer flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-gray-100 dark:hover:bg-gray-850 transition"
								on:click={() => {
									showSidebar.set(true);
								}}
							>
								<img
									src="/gabomagpt-logo.jpeg"
									alt="GabomaGPT"
									class="size-7 rounded-lg object-cover"
									draggable="false"
								/>
							</button>
						</Tooltip>
					</div>
				{/if}

					<!-- Mobile model selector pill (Claude style) -->
				<div class="flex-1 flex items-center justify-center min-w-0">
					{#if $mobile && showModelSelector}
						<button
							class="flex items-center gap-1.5 px-3 py-1 rounded-full
								bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-750
								border border-gray-200/60 dark:border-gray-700/60
								transition-all duration-150 max-w-[200px] truncate"
							on:click={() => { showModelSheet = !showModelSheet; }}
							aria-label="Select model"
						>
							<span class="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">
								{currentModelDisplay}
							</span>
							<svg class="size-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
							</svg>
						</button>
					{/if}
				</div>

				<div class="self-start flex flex-none items-center gap-1 text-gray-600 dark:text-gray-400">
					<!-- GabomaGPT — Upgrade + Badge jetons -->
					<div class="hidden sm:flex items-center gap-1.5 mr-1">
						<UpgradeButton />
						<TokenBadge />
					</div>
					<!-- <div class="md:hidden flex self-center w-[1px] h-5 mx-2 bg-gray-300 dark:bg-stone-700" /> -->

					{#if $user?.role === 'user' ? ($user?.permissions?.chat?.temporary ?? true) && !($user?.permissions?.chat?.temporary_enforced ?? false) : true}
						{#if !chat?.id}
							<Tooltip content={$i18n.t(`Temporary Chat`)}>
								<button
									class="flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition"
									id="temporary-chat-button"
									on:click={async () => {
										if (($settings as any)?.temporaryChatByDefault && $temporaryChatEnabled) {
									// for proper initNewChat handling
									await temporaryChatEnabled.set(false as any);
										} else {
											await temporaryChatEnabled.set(!$temporaryChatEnabled);
										}

										if ($page.url.pathname !== '/') {
											await goto('/');
										}

										// add 'temporary-chat=true' to the URL
										if ($temporaryChatEnabled) {
											window.history.replaceState(null, '', '?temporary-chat=true');
										} else {
											window.history.replaceState(null, '', location.pathname);
										}
									}}
								>
									<div class=" m-auto self-center">
										{#if $temporaryChatEnabled}
											<ChatBubbleDottedChecked className=" size-4.5" strokeWidth="1.5" />
										{:else}
											<ChatBubbleDotted className=" size-4.5" strokeWidth="1.5" />
										{/if}
									</div>
								</button>
							</Tooltip>
						{:else if $temporaryChatEnabled}
							<Tooltip content={$i18n.t(`Save Chat`)}>
								<button
									class="flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition"
									id="save-temporary-chat-button"
									on:click={async () => {
										onSaveTempChat();
									}}
								>
									<div class=" m-auto self-center">
										<ChatCheck className=" size-4.5" strokeWidth="1.5" />
									</div>
								</button>
							</Tooltip>
						{/if}
					{/if}

					{#if $mobile && !$temporaryChatEnabled && chat && chat.id}
						<Tooltip content={$i18n.t('New Chat')}>
							<button
								class=" flex {$showSidebar
									? 'md:hidden'
									: ''} cursor-pointer px-2 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850 transition"
								on:click={() => {
									initNewChat();
								}}
								aria-label="New Chat"
							>
								<div class=" m-auto self-center">
									<ChatPlus className=" size-4.5" strokeWidth="1.5" />
								</div>
							</button>
						</Tooltip>
					{/if}

					{#if shareEnabled && chat && (chat.id || $temporaryChatEnabled)}
						<Menu
							{chat}
							{shareEnabled}
							shareHandler={() => {
								showShareChatModal = !showShareChatModal;
							}}
							archiveChatHandler={() => {
								archiveChatHandler(chat.id);
							}}
							{moveChatHandler}
						>
							<button
								class="flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition"
								id="chat-context-menu-button"
							>
								<div class=" m-auto self-center">
									<EllipsisHorizontal className=" size-5" strokeWidth="1.5" />
								</div>
							</button>
						</Menu>
					{/if}

					<!-- GabomaGPT: Barre laterale droite desactivee sur PC -->
				{#if false && ($user?.role === 'admin' || ($user?.permissions.chat?.controls ?? true))}
					<Tooltip content={$i18n.t('Controls')}>
						<button
							class=" flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition"
							on:click={async () => {
								await showControls.set(!$showControls);
							}}
							aria-label="Controls"
						>
							<div class=" m-auto self-center">
								<Knobs className=" size-5" strokeWidth="1" />
							</div>
						</button>
					</Tooltip>
				{/if}

					{#if $user !== undefined && $user !== null}
						<UserMenu
							className="max-w-[240px]"
							role={$user?.role}
							help={true}
							on:show={(e) => {
								if (e.detail === 'archived-chat') {
									showArchivedChats.set(true);
								}
							}}
						>
							<div
								class="select-none flex rounded-xl p-1.5 w-full hover:bg-gray-50 dark:hover:bg-gray-850 transition"
							>
								<div class=" self-center">
									<span class="sr-only">{$i18n.t('User menu')}</span>
									<img
										src={`${WEBUI_API_BASE_URL}/users/${$user?.id}/profile/image`}
										class="size-6 object-cover rounded-full"
										alt=""
										draggable="false"
									/>
								</div>
							</div>
						</UserMenu>
					{/if}
				</div>
			</div>
		</div>
	</div>

	{#if $temporaryChatEnabled && ($chatId ?? '').startsWith('local:')}
		<div class=" w-full z-30 text-center">
			<div class="text-xs text-gray-500">{$i18n.t('Temporary Chat')}</div>
		</div>
	{/if}

	<div class="absolute top-[100%] left-0 right-0 h-fit">
		{#if !history.currentId && !$chatId && ($banners.length > 0 || (($config as any)?.license_metadata?.type ?? null) === 'trial' || ((($config as any)?.license_metadata?.seats ?? null) !== null && ($config as any)?.user_count > ($config as any)?.license_metadata?.seats))}
			<div class=" w-full z-30">
				<div class=" flex flex-col gap-1 w-full">
					{#if (($config as any)?.license_metadata?.type ?? null) === 'trial'}
					<Banner
						banner={{ id: '__trial', timestamp: 0, type: 'info', title: 'Trial License', content: $i18n.t('You are currently using a trial license. Please contact support to upgrade your license.') }}
					/>
				{/if}

					{#if (($config as any)?.license_metadata?.seats ?? null) !== null && ($config as any)?.user_count > ($config as any)?.license_metadata?.seats}
					<Banner
						banner={{ id: '__seats', timestamp: 0, type: 'error', title: 'License Error', content: $i18n.t('Exceeded the number of seats in your license. Please contact support to increase the number of seats.') }}
					/>
				{/if}

					{#each $banners.filter((b) => ![...JSON.parse(localStorage.getItem('dismissedBannerIds') ?? '[]'), ...closedBannerIds].includes(b.id)) as banner (banner.id)}
						<Banner
							{banner}
							on:dismiss={(e) => {
								const bannerId = e.detail;

								if (banner.dismissible) {
									localStorage.setItem(
										'dismissedBannerIds',
										JSON.stringify(
											[
												bannerId,
												...JSON.parse(localStorage.getItem('dismissedBannerIds') ?? '[]')
											].filter((id) => $banners.find((b) => b.id === id))
										)
									);
								} else {
									closedBannerIds = [...closedBannerIds, bannerId];
								}
							}}
						/>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</nav>

<!-- Mobile Model Bottom Sheet -->
{#if showModelSheet && $mobile}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm"
		on:click={() => { showModelSheet = false; }}
	>
		<div
			class="fixed bottom-0 left-0 right-0 z-[1200] bg-white dark:bg-gray-900
				rounded-t-2xl max-h-[60vh] overflow-y-auto
				shadow-2xl border-t border-gray-200 dark:border-gray-700"
			style="padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));"
			on:click|stopPropagation
		>
			<div class="flex justify-center pt-3 pb-2">
				<div class="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
			</div>
			<div class="px-4 pb-2">
				<div class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
					{$i18n.t('Select a model')}
				</div>
				{#each filterModelsForUser($_models.filter((m) => !((m?.info?.meta as any)?.hidden ?? false)), isAdmin) as model (model.id)}
				{@const tierName = getGabomaGPTModelName(model.id, model.name)}
				<button
					class="flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all
						{model.id === currentModelId
							? 'bg-gray-100 dark:bg-gray-800'
							: 'hover:bg-gray-50 dark:hover:bg-gray-850'}"
					on:click={() => {
						selectedModels = [model.id];
						showModelSheet = false;
					}}
				>
					<img
						src="/gabomagpt-logo.jpeg"
						alt=""
						class="size-8 rounded-lg object-cover shrink-0"
					/>
					<div class="flex flex-col items-start min-w-0">
						<span class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate w-full text-left">
							{tierName}
						</span>
						<span class="text-xs text-gray-400 dark:text-gray-500 truncate w-full text-left">
							{TIER_DESCRIPTIONS[tierName] ?? ''}
						</span>
					</div>
					{#if model.id === currentModelId}
						<svg class="size-5 text-green-500 shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
						</svg>
					{/if}
				</button>
			{/each}
			</div>
		</div>
	</div>
{/if}
