// Airtel Money Webhook Callback Handler
// SmartANDJ AI Technologies · Constitution Zion Core

import { json, type RequestHandler } from '@sveltejs/kit';
import { verifyWebhookSignature, type AirtelWebhook } from '$lib/apis/airtel-money';
import { WEBUI_API_BASE_URL } from '$lib/constants';

// Webhook secret (devrait être dans les variables d'environnement)
const WEBHOOK_SECRET = process.env.AIRTEL_WEBHOOK_SECRET || 'gabomagpt_webhook_secret_2026';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Récupérer le corps de la requête
		const body = await request.text();
		const signature = request.headers.get('x-signature') || '';

		// Vérifier la signature pour sécurité
		if (!verifyWebhookSignature(body, signature, WEBHOOK_SECRET)) {
			console.error('Signature webhook invalide');
			return json({ error: 'Signature invalide' }, { status: 401 });
		}

		// Parser le webhook
		const webhook: AirtelWebhook = JSON.parse(body);
		const { transaction } = webhook;

		console.log('Webhook Airtel Money reçu:', {
			transactionId: transaction.id,
			status: transaction.status,
			amount: transaction.amount,
			phone: transaction.payee.msisdn
		});

		// Mettre à jour le statut de la transaction en base de données
		// TODO: Implémenter la mise à jour en base selon votre architecture
		await updateTransactionStatus({
			transactionId: transaction.id,
			status: transaction.status.toLowerCase() as 'successful' | 'failed' | 'pending',
			amount: transaction.amount,
			currency: transaction.currency,
			phone: transaction.payee.msisdn,
			reference: transaction.reference_id,
			timestamp: transaction.transaction_date
		});

		// Envoyer une notification au client si WebSocket connecté
		// TODO: Implémenter la notification WebSocket
		await notifyClient(transaction.id, transaction.status);

		// Répondre à Airtel Money pour confirmer la réception
		return json({
			status: 'success',
			message: 'Webhook traité avec succès',
			transaction_id: transaction.id
		});

	} catch (error) {
		console.error('Erreur traitement webhook Airtel Money:', error);
		
		return json({
			error: 'Erreur interne du serveur',
			message: error.message
		}, { status: 500 });
	}
};

/**
 * Met à jour le statut d'une transaction en base de données
 */
async function updateTransactionStatus(transactionData: {
	transactionId: string;
	status: 'successful' | 'failed' | 'pending';
	amount: number;
	currency: string;
	phone: string;
	reference: string;
	timestamp: string;
}) {
	try {
		// Implémentation selon votre base de données
		// Exemple avec une API REST interne:
		
		const response = await fetch(`${WEBUI_API_BASE_URL}/payments/update-status`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || 'internal_key'}`
			},
			body: JSON.stringify({
				transaction_id: transactionData.transactionId,
				status: transactionData.status,
				completed_at: transactionData.timestamp,
				metadata: {
					amount: transactionData.amount,
					currency: transactionData.currency,
					phone: transactionData.phone,
					reference: transactionData.reference
				}
			})
		});

		if (!response.ok) {
			throw new Error(`Erreur mise à jour transaction: ${response.statusText}`);
		}

		console.log(`Transaction ${transactionData.transactionId} mise à jour: ${transactionData.status}`);

	} catch (error) {
		console.error('Erreur mise à jour transaction:', error);
		// Ne pas lancer d'erreur pour éviter les retries du webhook
	}
}

/**
 * Notifie le client en temps réel via WebSocket
 */
async function notifyClient(transactionId: string, status: string) {
	try {
		// Implémentation WebSocket selon votre architecture
		// Exemple: envoyer un événement aux clients connectés
		
		console.log(`Notification client: Transaction ${transactionId} -> ${status}`);

		// TODO: Implémenter la notification WebSocket réelle
		// Exemple:
		// websocketServer.emit('payment-update', {
		//     transactionId,
		//     status,
		//     timestamp: new Date().toISOString()
		// });

	} catch (error) {
		console.error('Erreur notification client:', error);
	}
}

/**
 * Endpoint GET pour vérifier la configuration du webhook
 */
export const GET: RequestHandler = async () => {
	return json({
		status: 'active',
		service: 'Airtel Money Webhook',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
		endpoint: '/api/payment/airtel/callback'
	});
};
