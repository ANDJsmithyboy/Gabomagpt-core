<!-- Black Panther Payment Agent UI - GabomaGPT -->
<!-- SmartANDJ AI Technologies · Constitution Zion Core -->
<!-- Airtel Money Integration · Canal+ · Edan · CanalBox -->

<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { toast } from 'svelte-sonner';

	const dispatch = createEventDispatcher();

	// Payment state
	let paymentMode: 'canal' | 'edan' | 'canalbox' | 'orange' | 'vodacom' | null = null;
	let amount: number = 0;
	let phoneNumber: string = '';
	let customerName: string = '';
	let reference: string = '';
	let isProcessing = false;
	let paymentSuccess = false;
	let paymentError = '';
	let currentStep: 'select' | 'details' | 'confirm' | 'processing' | 'success' | 'error' = 'select';

	// Black Panther visual effects
	let pantherGlow = false;
	let quantumPulse = 0;
	let vibraniumCharge = 0;

	// Payment providers config
	const paymentProviders = {
		canal: {
			name: 'Canal+ Afrique',
			icon: '📺',
			color: '#FF2244',
			amounts: [15000, 25000, 35000, 55000, 75000],
			currency: 'XAF'
		},
		edan: {
			name: 'Edan Streaming',
			icon: '🎬',
			color: '#29B6F6',
			amounts: [10000, 20000, 30000, 50000],
			currency: 'XAF'
		},
		canalbox: {
			name: 'CanalBox Internet',
			icon: '🌐',
			color: '#FFD54F',
			amounts: [20000, 35000, 50000, 75000, 100000],
			currency: 'XAF'
		},
		orange: {
			name: 'Orange Money',
			icon: '🟠',
			color: '#FF6B00',
			amounts: [5000, 10000, 20000, 50000],
			currency: 'XAF'
		},
		vodacom: {
			name: 'Vodacom M-Pesa',
			icon: '💚',
			color: '#00C853',
			amounts: [5000, 10000, 25000, 50000],
			currency: 'XAF'
		}
	};

	// Generate unique transaction reference
	function generateReference(): string {
		const timestamp = Date.now();
		const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
		return `BP${timestamp}${random}`;
	}

	// Select payment mode
	function selectProvider(mode: typeof paymentMode) {
		paymentMode = mode;
		currentStep = 'details';
		reference = generateReference();
		pantherGlow = true;
		setTimeout(() => pantherGlow = false, 500);
	}

	// Validate phone number (Gabon format)
	function validatePhone(phone: string): boolean {
		const gabonRegex = /^(?:\+241|0)?[234567]\d{6}$/;
		return gabonRegex.test(phone.replace(/\s/g, ''));
	}

	// Proceed to confirmation
	function proceedToConfirm() {
		if (!paymentMode || !amount || !phoneNumber || !customerName) {
			toast.error('Veuillez remplir tous les champs');
			return;
		}
		if (!validatePhone(phoneNumber)) {
			toast.error('Numéro de téléphone invalide (format gabonais)');
			return;
		}
		currentStep = 'confirm';
	}

	// Process Airtel Money payment
	async function processPayment() {
		currentStep = 'processing';
		isProcessing = true;
		vibraniumCharge = 0;

		// Simulate quantum processing
		const chargeInterval = setInterval(() => {
			vibraniumCharge += 20;
			if (vibraniumCharge >= 100) clearInterval(chargeInterval);
		}, 100);

		try {
			// Simulate Airtel Money API call
			const paymentData = {
				provider: 'airtel_money',
				amount: amount,
				phone: phoneNumber,
				customer: customerName,
				reference: reference,
				service: paymentProviders[paymentMode!].name,
				currency: paymentProviders[paymentMode!].currency
			};

			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 3000));

			// Simulate successful response
			const response = {
				success: true,
				transactionId: `ATL${Date.now()}`,
				status: 'completed',
				balance: 1250000 // Simulated remaining balance
			};

			if (response.success) {
				paymentSuccess = true;
				currentStep = 'success';
				toast.success(`Paiement de ${amount} XAF effectué avec succès!`);
				
				// Dispatch success event
				dispatch('payment-success', {
					transactionId: response.transactionId,
					amount: amount,
					provider: paymentMode,
					customer: customerName
				});
			} else {
				throw new Error('Échec du paiement');
			}
		} catch (error) {
			paymentError = error.message || 'Erreur lors du paiement';
			currentStep = 'error';
			toast.error(paymentError);
		} finally {
			isProcessing = false;
			clearInterval(chargeInterval);
		}
	}

	// Reset payment
	function resetPayment() {
		currentStep = 'select';
		paymentMode = null;
		amount = 0;
		phoneNumber = '';
		customerName = '';
		reference = '';
		paymentSuccess = false;
		paymentError = '';
		vibraniumCharge = 0;
	}

	// Quantum pulse animation
	onMount(() => {
		const pulseInterval = setInterval(() => {
			quantumPulse = (quantumPulse + 1) % 360;
		}, 50);
		
		return () => clearInterval(pulseInterval);
	});

	$: quantumStyle = `transform: rotate(${quantumPulse}deg)`;
	$: vibraniumStyle = `width: ${vibraniumCharge}%`;
</script>

<style>
	/* Black Panther Quantum UI */
	.black-panther-container {
		background: linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #0a0a0a 100%);
		border: 2px solid rgba(255, 34, 68, 0.3);
		border-radius: 24px;
		position: relative;
		overflow: hidden;
		min-height: 600px;
		backdrop-filter: blur(20px);
		box-shadow: 
			0 0 60px rgba(255, 34, 68, 0.2),
			inset 0 0 40px rgba(255, 34, 68, 0.1);
	}

	/* Quantum field background */
	.quantum-field {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: 
			radial-gradient(circle at 20% 20%, rgba(255, 34, 68, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 80% 80%, rgba(41, 182, 246, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 50% 50%, rgba(255, 212, 79, 0.05) 0%, transparent 70%);
		animation: quantum-rotate 20s linear infinite;
		pointer-events: none;
	}

	@keyframes quantum-rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	/* Vibranium charge bar */
	.vibranium-bar {
		height: 4px;
		background: linear-gradient(90deg, #FF2244, #29B6F6, #FFD54F);
		border-radius: 2px;
		transition: width 0.3s ease;
		box-shadow: 0 0 10px currentColor;
	}

	/* Provider cards */
	.provider-card {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 20px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		backdrop-filter: blur(10px);
		position: relative;
		overflow: hidden;
	}

	.provider-card:hover {
		transform: translateY(-4px) scale(1.02);
		border-color: var(--provider-color, #FF2244);
		box-shadow: 
			0 10px 30px rgba(255, 34, 68, 0.3),
			inset 0 0 20px rgba(255, 34, 68, 0.1);
	}

	.provider-card.selected {
		border-color: var(--provider-color, #FF2244);
		background: rgba(255, 34, 68, 0.1);
		box-shadow: 
			0 0 30px rgba(255, 34, 68, 0.4),
			inset 0 0 20px rgba(255, 34, 68, 0.2);
	}

	/* Panther glow effect */
	.panther-glow {
		animation: panther-pulse 0.5s ease-out;
	}

	@keyframes panther-pulse {
		0% { box-shadow: 0 0 0 rgba(255, 34, 68, 0.8); }
		100% { box-shadow: 0 0 30px rgba(255, 34, 68, 0); }
	}

	/* Amount buttons */
	.amount-btn {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 12px;
		padding: 12px 16px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-weight: 600;
	}

	.amount-btn:hover {
		background: rgba(255, 34, 68, 0.2);
		border-color: #FF2244;
		transform: scale(1.05);
	}

	.amount-btn.selected {
		background: linear-gradient(135deg, #FF2244, #FF4466);
		border-color: #FF2244;
		box-shadow: 0 4px 20px rgba(255, 34, 68, 0.4);
	}

	/* Input fields Black Panther style */
	.panther-input {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 14px 16px;
		color: #ffffff;
		font-size: 16px;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}

	.panther-input:focus {
		outline: none;
		border-color: #FF2244;
		box-shadow: 
			0 0 20px rgba(255, 34, 68, 0.3),
			inset 0 0 10px rgba(255, 34, 68, 0.1);
		background: rgba(255, 34, 68, 0.05);
	}

	.panther-input::placeholder {
		color: rgba(255, 255, 255, 0.4);
	}

	/* Process button */
	.process-btn {
		background: linear-gradient(135deg, #FF2244, #FF4466);
		border: none;
		border-radius: 16px;
		padding: 16px 32px;
		color: white;
		font-weight: 700;
		font-size: 18px;
		cursor: pointer;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.process-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(255, 34, 68, 0.4);
	}

	.process-btn:active {
		transform: translateY(0);
	}

	.process-btn.processing {
		background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
		cursor: not-allowed;
		animation: processing-pulse 1.5s ease-in-out infinite;
	}

	@keyframes processing-pulse {
		0%, 100% { opacity: 0.8; }
		50% { opacity: 1; }
	}

	/* Success animation */
	.success-animation {
		animation: success-burst 0.6s ease-out;
	}

	@keyframes success-burst {
		0% { transform: scale(0) rotate(0deg); opacity: 0; }
		50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
		100% { transform: scale(1) rotate(360deg); opacity: 1; }
	}

	/* Typography */
	.panther-title {
		font-family: 'Outfit', sans-serif;
		font-weight: 800;
		font-size: 32px;
		background: linear-gradient(135deg, #FF2244, #29B6F6, #FFD54F);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-transform: uppercase;
		letter-spacing: 2px;
		margin-bottom: 8px;
	}

	.panther-subtitle {
		color: rgba(255, 255, 255, 0.6);
		font-size: 14px;
		margin-bottom: 32px;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.black-panther-container {
			border-radius: 16px;
			margin: 8px;
		}
		
		.provider-card {
			padding: 16px;
		}
		
		.panther-title {
			font-size: 24px;
		}
	}
</style>

<div class="black-panther-container p-8 relative">
	<!-- Quantum field background -->
	<div class="quantum-field" style={quantumStyle}></div>
	
	<!-- Vibranium charge bar (visible during processing) -->
	{#if currentStep === 'processing'}
		<div class="absolute top-0 left-0 right-0 vibranium-bar" style={vibraniumStyle}></div>
	{/if}

	<!-- Header -->
	<div class="relative z-10 text-center mb-8">
		<h1 class="panther-title">Black Panther</h1>
		<p class="panther-subtitle">Agent de Paiement Quantum • Airtel Money Integration</p>
	</div>

	<!-- Step 1: Select Provider -->
	{#if currentStep === 'select'}
		<div class="relative z-10" in:fly={{ y: 20, duration: 500 }}>
			<h2 class="text-white text-xl font-semibold mb-6 text-center">
				🐆 Sélectionnez le service à payer
			</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each Object.entries(paymentProviders) as [key, provider]}
					<div 
						class="provider-card {pantherGlow && paymentMode === key ? 'panther-glow' : ''}"
						style="--provider-color: {provider.color}"
						on:click={() => selectProvider(key)}
						transition:scale={{ duration: 200 }}
					>
						<div class="flex items-center gap-4">
							<div class="text-4xl">{provider.icon}</div>
							<div>
								<h3 class="text-white font-semibold text-lg">{provider.name}</h3>
								<p class="text-gray-400 text-sm">Monnaie: {provider.currency}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Step 2: Payment Details -->
	{#if currentStep === 'details'}
		<div class="relative z-10" in:slide={{ x: 50, duration: 400 }}>
			<h2 class="text-white text-xl font-semibold mb-6">
				{paymentProviders[paymentMode!].icon} {paymentProviders[paymentMode!].name}
			</h2>

			<!-- Amount Selection -->
			<div class="mb-6">
				<label class="text-gray-300 text-sm font-medium mb-3 block">Montant (XAF)</label>
				<div class="grid grid-cols-3 gap-3">
					{#each paymentProviders[paymentMode!].amounts as amt}
						<button 
							class="amount-btn {amount === amt ? 'selected' : ''}"
							on:click={() => amount = amt}
						>
							{amt.toLocaleString()} XAF
						</button>
					{/each}
				</div>
				
				<!-- Custom amount input -->
				<input 
					type="number" 
					class="panther-input w-full mt-3"
					placeholder="Ou entrer un montant personnalisé"
					bind:value={amount}
					min="1000"
					step="1000"
				/>
			</div>

			<!-- Customer Details -->
			<div class="space-y-4">
				<div>
					<label class="text-gray-300 text-sm font-medium mb-2 block">Nom complet</label>
					<input 
						type="text" 
						class="panther-input w-full"
						placeholder="Jean Dupont"
						bind:value={customerName}
					/>
				</div>

				<div>
					<label class="text-gray-300 text-sm font-medium mb-2 block">Téléphone (Airtel Money)</label>
					<input 
						type="tel" 
						class="panther-input w-full"
						placeholder="024123456"
						bind:value={phoneNumber}
					/>
				</div>

				<div>
					<label class="text-gray-300 text-sm font-medium mb-2 block">Référence</label>
					<input 
						type="text" 
						class="panther-input w-full"
						placeholder="Référence automatique"
						bind:value={reference}
						readonly
					/>
				</div>
			</div>

			<!-- Action buttons -->
			<div class="flex gap-4 mt-8">
				<button 
					class="panther-input flex-1 py-3"
					on:click={resetPayment}
				>
					← Retour
				</button>
				<button 
					class="process-btn flex-1"
					on:click={proceedToConfirm}
				>
					Continuer →
				</button>
			</div>
		</div>
	{/if}

	<!-- Step 3: Confirmation -->
	{#if currentStep === 'confirm'}
		<div class="relative z-10" in:fade={{ duration: 400 }}>
			<h2 class="text-white text-xl font-semibold mb-6 text-center">
				⚡ Confirmation du paiement
			</h2>

			<div class="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
				<div class="space-y-4">
					<div class="flex justify-between">
						<span class="text-gray-400">Service:</span>
						<span class="text-white font-semibold">
							{paymentProviders[paymentMode!].icon} {paymentProviders[paymentMode!].name}
						</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Montant:</span>
						<span class="text-white font-semibold text-xl">{amount.toLocaleString()} XAF</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Client:</span>
						<span class="text-white">{customerName}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Téléphone:</span>
						<span class="text-white">{phoneNumber}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Référence:</span>
						<span class="text-white font-mono text-sm">{reference}</span>
					</div>
				</div>
			</div>

			<div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-6">
				<p class="text-yellow-300 text-sm text-center">
					⚠️ Vous allez recevoir une notification Airtel Money pour confirmer ce paiement
				</p>
			</div>

			<!-- Action buttons -->
			<div class="flex gap-4 mt-8">
				<button 
					class="panther-input flex-1 py-3"
					on:click={() => currentStep = 'details'}
				>
					← Modifier
				</button>
				<button 
					class="process-btn flex-1"
					on:click={processPayment}
					disabled={isProcessing}
				>
					{#if isProcessing}
						🔄 Traitement...
					{:else}
						⚡ Confirmer le paiement
					{/if}
				</button>
			</div>
		</div>
	{/if}

	<!-- Step 4: Processing -->
	{#if currentStep === 'processing'}
		<div class="relative z-10 text-center" in:fade={{ duration: 300 }}>
			<div class="success-animation mb-8">
				<div class="text-6xl mb-4">🐆</div>
			</div>
			
			<h2 class="text-white text-2xl font-bold mb-4">
				Traitement Quantum en cours...
			</h2>
			
			<p class="text-gray-400 mb-8">
				Communication avec les serveurs Airtel Money<br>
				Sécurisation de la transaction...
			</p>

			<div class="max-w-md mx-auto">
				<div class="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
					<div class="flex items-center justify-between mb-2">
						<span class="text-gray-400">Charge Vibranium</span>
						<span class="text-white font-mono">{vibraniumCharge}%</span>
					</div>
					<div class="vibranium-bar" style={vibraniumStyle}></div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Step 5: Success -->
	{#if currentStep === 'success'}
		<div class="relative z-10 text-center" in:fade={{ duration: 500 }}>
			<div class="success-animation mb-8">
				<div class="text-6xl mb-4">✅</div>
			</div>
			
			<h2 class="text-white text-2xl font-bold mb-4">
				Paiement Réussi! 🐆
			</h2>
			
			<p class="text-gray-400 mb-8">
				Le paiement a été effectué avec succès<br>
				Transaction sécurisée par Black Panther Quantum
			</p>

			<div class="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8">
				<div class="space-y-3">
					<div class="flex justify-between">
						<span class="text-gray-400">Montant payé:</span>
						<span class="text-green-400 font-bold text-xl">{amount.toLocaleString()} XAF</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Service:</span>
						<span class="text-white">{paymentProviders[paymentMode!].name}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Client:</span>
						<span class="text-white">{customerName}</span>
					</div>
				</div>
			</div>

			<button 
				class="process-btn w-full"
				on:click={resetPayment}
			>
				Nouveau Paiement ⚡
			</button>
		</div>
	{/if}

	<!-- Step 6: Error -->
	{#if currentStep === 'error'}
		<div class="relative z-10 text-center" in:fade={{ duration: 400 }}>
			<div class="text-6xl mb-4">❌</div>
			
			<h2 class="text-red-400 text-2xl font-bold mb-4">
				Échec du paiement
			</h2>
			
			<p class="text-gray-400 mb-8">
				{paymentError}
			</p>

			<div class="flex gap-4">
				<button 
					class="panther-input flex-1 py-3"
					on:click={() => currentStep = 'confirm'}
				>
					Réessayer
				</button>
				<button 
					class="process-btn flex-1"
					on:click={resetPayment}
				>
					Nouveau paiement
				</button>
			</div>
		</div>
	{/if}
</div>
