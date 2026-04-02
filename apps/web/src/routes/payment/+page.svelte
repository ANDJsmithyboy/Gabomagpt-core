<!-- GabomaGPT Payment Demo - Black Panther Mode -->
<!-- SmartANDJ AI Technologies · Constitution Zion Core -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import BlackPantherPayment from '$lib/components/payment/BlackPantherPayment.svelte';
	import { getAirtelMoneyService, type AirtelMoneyRequest } from '$lib/apis/airtel-money';

	// Page state
	let showPayment = false;
	let paymentHistory: Array<{
		id: string;
		service: string;
		amount: number;
		customer: string;
		status: 'success' | 'pending' | 'failed';
		timestamp: Date;
	}> = [];

	// Mock data for demo
	const mockHistory = [
		{
			id: 'ATL1743527600123',
			service: 'Canal+ Afrique',
			amount: 35000,
			customer: 'Jean Mbarga',
			status: 'success' as const,
			timestamp: new Date(Date.now() - 3600000)
		},
		{
			id: 'ATL1743527000456',
			service: 'Edan Streaming',
			amount: 20000,
			customer: 'Marie Ndong',
			status: 'success' as const,
			timestamp: new Date(Date.now() - 7200000)
		},
		{
			id: 'ATL1743526400789',
			service: 'CanalBox Internet',
			amount: 50000,
			customer: 'Paul Ondo',
			status: 'pending' as const,
			timestamp: new Date(Date.now() - 10800000)
		}
	];

	onMount(() => {
		paymentHistory = mockHistory;
	});

	// Handle payment success
	function handlePaymentSuccess(event: CustomEvent) {
		const { transactionId, amount, provider, customer } = event.detail;
		
		// Add to history
		paymentHistory = [{
			id: transactionId,
			service: provider === 'canal' ? 'Canal+ Afrique' : 
					provider === 'edan' ? 'Edan Streaming' : 
					provider === 'canalbox' ? 'CanalBox Internet' : 'Autre',
			amount,
			customer,
			status: 'success',
			timestamp: new Date()
		}, ...paymentHistory];

		toast.success(`Paiement enregistré: ${amount.toLocaleString()} XAF`);
	}

	// Format timestamp
	function formatTime(date: Date): string {
		return date.toLocaleTimeString('fr-GA', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatDate(date: Date): string {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Aujourd\'hui';
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Hier';
		} else {
			return date.toLocaleDateString('fr-GA', {
				day: 'numeric',
				month: 'short'
			});
		}
	}

	// Status colors
	function getStatusColor(status: string): string {
		switch (status) {
			case 'success': return 'text-green-400 bg-green-400/10 border-green-400/30';
			case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
			case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/30';
			default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
		}
	}

	function getStatusIcon(status: string): string {
		switch (status) {
			case 'success': return '✅';
			case 'pending': return '⏳';
			case 'failed': return '❌';
			default: return '❓';
		}
	}
</script>

<style>
	.payment-demo-container {
		background: linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #0a0a0a 100%);
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
	}

	/* Animated background particles */
	.particle {
		position: absolute;
		background: radial-gradient(circle, rgba(255, 34, 68, 0.3) 0%, transparent 70%);
		border-radius: 50%;
		pointer-events: none;
		animation: float 20s infinite ease-in-out;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0) translateX(0) scale(1); }
		25% { transform: translateY(-100px) translateX(50px) scale(1.1); }
		50% { transform: translateY(-50px) translateX(-30px) scale(0.9); }
		75% { transform: translateY(-150px) translateX(-50px) scale(1.05); }
	}

	/* Header styling */
	.demo-header {
		background: rgba(255, 255, 255, 0.03);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	/* History card */
	.history-card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		transition: all 0.3s ease;
	}

	.history-card:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 34, 68, 0.3);
		transform: translateY(-2px);
	}

	/* Launch button */
	.launch-btn {
		background: linear-gradient(135deg, #FF2244, #FF4466);
		border: none;
		border-radius: 20px;
		padding: 16px 32px;
		color: white;
		font-weight: 700;
		font-size: 18px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 20px rgba(255, 34, 68, 0.3);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.launch-btn:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(255, 34, 68, 0.4);
	}

	.launch-btn:active {
		transform: translateY(-1px);
	}

	/* Typography */
	.demo-title {
		font-family: 'Outfit', sans-serif;
		font-weight: 800;
		background: linear-gradient(135deg, #FF2244, #29B6F6, #FFD54F);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.demo-title {
			font-size: 28px;
		}
		
		.launch-btn {
			padding: 14px 24px;
			font-size: 16px;
		}
	}
</style>

<div class="payment-demo-container">
	<!-- Background particles -->
	<div class="particle w-32 h-32 top-10 left-10" style="animation-delay: 0s;"></div>
	<div class="particle w-24 h-24 top-1/4 right-20" style="animation-delay: 5s;"></div>
	<div class="particle w-40 h-40 bottom-20 left-1/3" style="animation-delay: 10s;"></div>
	<div class="particle w-28 h-28 bottom-1/4 right-1/4" style="animation-delay: 15s;"></div>

	<!-- Header -->
	<header class="demo-header relative z-10 px-6 py-6">
		<div class="max-w-7xl mx-auto">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="demo-title text-4xl md:text-5xl mb-2">
						Black Panther Payment
					</h1>
					<p class="text-gray-400 text-lg">
						Agent de paiement quantum • Airtel Money Integration
					</p>
				</div>
				
				<div class="text-right">
					<div class="text-sm text-gray-400">Statut du système</div>
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
						<span class="text-green-400 font-semibold">En ligne</span>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="relative z-10 max-w-7xl mx-auto px-6 py-8">
		{#if !showPayment}
			<!-- Welcome Section -->
			<div class="text-center mb-12" in:fade={{ duration: 600 }}>
				<div class="mb-8">
					<div class="text-8xl mb-4">🐆</div>
					<h2 class="text-white text-2xl font-semibold mb-4">
						Bienvenue dans le mode Black Panther
					</h2>
					<p class="text-gray-400 max-w-2xl mx-auto">
						Effectuez des paiements sécurisés pour Canal+, Edan, CanalBox et plus via Airtel Money.<br>
						Interface quantum avec sécurité de niveau militaire.
					</p>
				</div>

				<button 
					class="launch-btn"
					on:click={() => showPayment = true}
					transition:scale={{ duration: 200 }}
				>
					🚀 Lancer le paiement
				</button>
			</div>

			<!-- Stats Cards -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
				<div 
					class="history-card p-6 text-center"
					in:fly={{ y: 20, duration: 400, delay: 100 }}
				>
					<div class="text-3xl font-bold text-white mb-2">
						{paymentHistory.filter(p => p.status === 'success').length}
					</div>
					<div class="text-gray-400">Paiements réussis</div>
				</div>

				<div 
					class="history-card p-6 text-center"
					in:fly={{ y: 20, duration: 400, delay: 200 }}
				>
					<div class="text-3xl font-bold text-yellow-400 mb-2">
						{paymentHistory.filter(p => p.status === 'pending').length}
					</div>
					<div class="text-gray-400">En attente</div>
				</div>

				<div 
					class="history-card p-6 text-center"
					in:fly={{ y: 20, duration: 400, delay: 300 }}
				>
					<div class="text-3xl font-bold text-green-400 mb-2">
						{paymentHistory.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} XAF
					</div>
					<div class="text-gray-400">Volume total</div>
				</div>
			</div>

			<!-- Payment History -->
			<div class="history-card p-6" in:fly={{ y: 20, duration: 400, delay: 400 }}>
				<h3 class="text-white text-xl font-semibold mb-6 flex items-center gap-3">
					📊 Historique des transactions
					<span class="text-sm text-gray-400 font-normal">
						({paymentHistory.length} transactions)
					</span>
				</h3>

				{#if paymentHistory.length === 0}
					<div class="text-center py-12 text-gray-400">
						Aucune transaction pour le moment
					</div>
				{:else}
					<div class="space-y-4">
						{#each paymentHistory as payment (payment.id)}
							<div 
								class="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-all"
								in:fly={{ x: -20, duration: 300 }}
							>
								<div class="flex items-center gap-4">
									<div class="text-2xl">
										{payment.service.includes('Canal+') ? '📺' :
										 payment.service.includes('Edan') ? '🎬' :
										 payment.service.includes('CanalBox') ? '🌐' : '💳'}
									</div>
									<div>
										<div class="text-white font-semibold">
											{payment.service}
										</div>
										<div class="text-gray-400 text-sm">
											{payment.customer} • {formatDate(payment.timestamp)} {formatTime(payment.timestamp)}
										</div>
									</div>
								</div>

								<div class="flex items-center gap-4">
									<div class="text-right">
										<div class="text-white font-bold">
											{payment.amount.toLocaleString()} XAF
										</div>
										<div class="text-xs text-gray-400">
											#{payment.id.slice(-6)}
										</div>
									</div>
									
									<div class="px-3 py-1 rounded-full border text-sm font-medium {getStatusColor(payment.status)}">
										<span class="mr-1">{getStatusIcon(payment.status)}</span>
										{payment.status === 'success' ? 'Succès' :
										 payment.status === 'pending' ? 'En cours' : 'Échec'}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<!-- Payment Interface -->
			<div in:fade={{ duration: 400 }}>
				<div class="mb-6 flex items-center justify-between">
					<button 
						class="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
						on:click={() => showPayment = false}
					>
						← Retour au dashboard
					</button>
					
					<div class="text-sm text-gray-400">
						Mode: <span class="text-red-400 font-semibold">Black Panther Quantum</span>
					</div>
				</div>

				<BlackPantherPayment 
					on:payment-success={handlePaymentSuccess}
				/>
			</div>
		{/if}
	</main>
</div>
