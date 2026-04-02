// Airtel Money API Service - GabomaGPT Black Panther Mode
// SmartANDJ AI Technologies · Constitution Zion Core
// Integration pour paiements Canal+, Edan, CanalBox

export interface AirtelMoneyRequest {
	provider: 'airtel_money';
	amount: number;
	phone: string;
	customer: string;
	reference: string;
	service: string;
	currency: string;
}

export interface AirtelMoneyResponse {
	success: boolean;
	transactionId?: string;
	status?: 'pending' | 'completed' | 'failed';
	error?: string;
	balance?: number;
	fee?: number;
	timestamp?: string;
}

export interface AirtelMoneyConfig {
	apiKey: string;
	secretKey: string;
	environment: 'sandbox' | 'production';
	country: 'GA'; // Gabon
	currency: 'XAF';
}

class AirtelMoneyService {
	private config: AirtelMoneyConfig;
	private baseUrl: string;

	constructor(config: AirtelMoneyConfig) {
		this.config = config;
		this.baseUrl = config.environment === 'production' 
			? 'https://openapi.airtel.africa' 
			: 'https://openapi.airtel.africa/sandbox';
	}

	/**
	 * Génère un token OAuth pour l'API Airtel Money
	 */
	private async generateToken(): Promise<string> {
		const credentials = btoa(`${this.config.apiKey}:${this.config.secretKey}`);
		
		try {
			const response = await fetch(`${this.baseUrl}/auth/oauth2/token`, {
				method: 'POST',
				headers: {
					'Authorization': `Basic ${credentials}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					grant_type: 'client_credentials'
				})
			});

			const data = await response.json();
			return data.access_token;
		} catch (error) {
			console.error('Erreur génération token Airtel Money:', error);
			throw new Error('Impossible d\'obtenir le token d\'authentification');
		}
	}

	/**
	 * Valide le format du numéro de téléphone gabonais
	 */
	private validatePhoneNumber(phone: string): boolean {
		// Formats acceptés: +2411234567, 0241234567, 2411234567
		const gabonRegex = /^(?:\+241|0)?[234567]\d{6}$/;
		return gabonRegex.test(phone.replace(/\s/g, ''));
	}

	/**
	 * Formate le numéro pour l'API Airtel
	 */
	private formatPhoneNumber(phone: string): string {
		const cleaned = phone.replace(/\s/g, '');
		if (cleaned.startsWith('+241')) {
			return cleaned;
		}
		if (cleaned.startsWith('0')) {
			return `+241${cleaned.substring(1)}`;
		}
		if (cleaned.startsWith('241')) {
			return `+241${cleaned.substring(3)}`;
		}
		return `+241${cleaned}`;
	}

	/**
	 * Calcule les frais de transaction Airtel Money
	 */
	private calculateFees(amount: number): number {
		// Structure des frais Airtel Money Gabon (simulée)
		if (amount <= 2500) return 100;
		if (amount <= 5000) return 200;
		if (amount <= 10000) return 350;
		if (amount <= 20000) return 500;
		if (amount <= 50000) return 800;
		if (amount <= 100000) return 1200;
		return 1500;
	}

	/**
	 * Initie un paiement via Airtel Money
	 */
	async initiatePayment(request: AirtelMoneyRequest): Promise<AirtelMoneyResponse> {
		try {
			// Validation
			if (!this.validatePhoneNumber(request.phone)) {
				return {
					success: false,
					error: 'Numéro de téléphone invalide (format gabonais requis)'
				};
			}

			if (request.amount < 1000) {
				return {
					success: false,
					error: 'Montant minimum de 1000 XAF requis'
				};
			}

			// Simulation pour développement (remplacer par vrai appel API)
			if (this.config.environment === 'sandbox') {
				return this.simulatePayment(request);
			}

			// Vrai appel API Airtel Money
			const token = await this.generateToken();
			const formattedPhone = this.formatPhoneNumber(request.phone);
			const fees = this.calculateFees(request.amount);

			const payload = {
				payee: {
					msisdn: formattedPhone,
					country: this.config.country,
					currency: this.config.currency
				},
				transaction: {
					amount: request.amount,
					id: request.reference,
					reference_id: request.reference,
					comment: `Paiement ${request.service} - ${request.customer}`
				},
				notify_url: `${window.location.origin}/api/payment/airtel/callback`
			};

			const response = await fetch(`${this.baseUrl}/merchant/v1/payments/`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
					'X-Country': this.config.country,
					'X-Currency': this.config.currency
				},
				body: JSON.stringify(payload)
			});

			const data = await response.json();

			if (data.status.code === 200) {
				return {
					success: true,
					transactionId: data.data.transaction_id,
					status: 'pending',
					fee: fees,
					timestamp: new Date().toISOString()
				};
			} else {
				return {
					success: false,
					error: data.status.message || 'Erreur lors de l\'initiation du paiement'
				};
			}
		} catch (error) {
			console.error('Erreur paiement Airtel Money:', error);
			return {
				success: false,
				error: 'Erreur technique lors du traitement du paiement'
			};
		}
	}

	/**
	 * Vérifie le statut d'une transaction
	 */
	async checkTransactionStatus(transactionId: string): Promise<AirtelMoneyResponse> {
		try {
			const token = await this.generateToken();

			const response = await fetch(
				`${this.baseUrl}/merchant/v1/payments/${transactionId}`,
				{
					headers: {
						'Authorization': `Bearer ${token}`,
						'X-Country': this.config.country,
						'X-Currency': this.config.currency
					}
				}
			);

			const data = await response.json();

			return {
				success: true,
				transactionId: data.data.transaction_id,
				status: data.data.status,
				timestamp: data.data.transaction_date
			};
		} catch (error) {
			console.error('Erreur vérification statut:', error);
			return {
				success: false,
				error: 'Impossible de vérifier le statut de la transaction'
			};
		}
	}

	/**
	 * Simulation de paiement pour développement
	 */
	private simulatePayment(request: AirtelMoneyRequest): AirtelMoneyResponse {
		// Simuler différents scénarios de réponse
		const random = Math.random();
		const fees = this.calculateFees(request.amount);

		if (random > 0.1) { // 90% de succès
			return {
				success: true,
				transactionId: `ATL${Date.now()}`,
				status: 'completed',
				fee: fees,
				balance: 1250000 + Math.floor(Math.random() * 500000),
				timestamp: new Date().toISOString()
			};
		} else { // 10% d'échec
			return {
				success: false,
				error: 'Solde insuffisant ou service temporairement indisponible'
			};
		}
	}

	/**
	 * Refuse un paiement (remboursement)
	 */
	async refundPayment(transactionId: string, amount: number): Promise<AirtelMoneyResponse> {
		try {
			const token = await this.generateToken();

			const payload = {
				transaction: {
					amount: amount,
					id: transactionId
				}
			};

			const response = await fetch(`${this.baseUrl}/merchant/v1/payments/refund`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
					'X-Country': this.config.country,
					'X-Currency': this.config.currency
				},
				body: JSON.stringify(payload)
			});

			const data = await response.json();

			return {
				success: data.status.code === 200,
				transactionId: data.data?.transaction_id,
				status: data.data?.status
			};
		} catch (error) {
			console.error('Erreur remboursement:', error);
			return {
				success: false,
				error: 'Erreur lors du remboursement'
			};
		}
	}

	/**
	 * Récupère le solde du marchand
	 */
	async getMerchantBalance(): Promise<{ balance: number; currency: string } | null> {
		try {
			const token = await this.generateToken();

			const response = await fetch(`${this.baseUrl}/merchant/v1/balance`, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'X-Country': this.config.country,
					'X-Currency': this.config.currency
				}
			});

			const data = await response.json();

			return {
				balance: data.data.balance,
				currency: data.data.currency
			};
		} catch (error) {
			console.error('Erreur solde marchand:', error);
			return null;
		}
	}
}

// Instance singleton pour l'application
let airtelService: AirtelMoneyService | null = null;

export function getAirtelMoneyService(): AirtelMoneyService {
	if (!airtelService) {
		// Configuration par défaut (à remplacer par variables d'environnement)
		const config: AirtelMoneyConfig = {
			apiKey: import.meta.env.VITE_AIRTEL_API_KEY || 'sandbox_key',
			secretKey: import.meta.env.VITE_AIRTEL_SECRET_KEY || 'sandbox_secret',
			environment: import.meta.env.PROD ? 'production' : 'sandbox',
			country: 'GA',
			currency: 'XAF'
		};

		airtelService = new AirtelMoneyService(config);
	}

	return airtelService;
}

// Types pour les callbacks webhooks
export interface AirtelWebhook {
	transaction: {
		id: string;
		status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
		amount: number;
		currency: string;
		payee: {
			msisdn: string;
		};
		reference_id: string;
		transaction_date: string;
	};
	signature: string;
}

/**
 * Vérifie la signature du webhook Airtel Money
 */
export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
	// Implémentation de vérification HMAC-SHA256
	const crypto = require('crypto');
	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(payload)
		.digest('hex');

	return signature === expectedSignature;
}

export { AirtelMoneyService };
