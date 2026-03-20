// GabomaGPT · sumb_webhook.go · SmartANDJ AI Technologies
// Réception webhook SUMB → crédit jetons via FastAPI
package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
)

// Corps attendu de SUMB
type SUMBWebhookPayload struct {
	Reference string `json:"reference"`
	Status    string `json:"status"` // SUCCESS | FAILED
	Amount    int    `json:"amount"`
	Operator  string `json:"operator"`
}

// HandleSUMBWebhook — POST /webhook/sumb
func HandleSUMBWebhook(c *fiber.Ctx) error {
	var payload SUMBWebhookPayload
	if err := c.BodyParser(&payload); err != nil {
		log.Printf("[SUMB] Erreur parsing webhook: %v", err)
		return c.Status(400).JSON(fiber.Map{"error": "Corps invalide"})
	}

	log.Printf("[SUMB] Webhook reçu: ref=%s status=%s amount=%d op=%s",
		payload.Reference, payload.Status, payload.Amount, payload.Operator)

	mu.Lock()
	tx, exists := transactions[payload.Reference]
	if !exists {
		mu.Unlock()
		log.Printf("[SUMB] Transaction introuvable: %s", payload.Reference)
		return c.Status(404).JSON(fiber.Map{"error": "Transaction introuvable"})
	}

	// Ne traiter que les transactions en attente
	if tx.Status != "pending" {
		mu.Unlock()
		log.Printf("[SUMB] Transaction déjà traitée: %s → %s", payload.Reference, tx.Status)
		return c.JSON(fiber.Map{"status": "already_processed"})
	}

	if payload.Status == "SUCCESS" {
		tx.Status = "success"
		mu.Unlock()

		// Créditer les jetons via FastAPI
		if err := creditTokensViaAPI(tx.UserID, tx.Plan, tx.Tokens); err != nil {
			log.Printf("[SUMB] Erreur crédit jetons pour %s: %v", payload.Reference, err)
			// On ne revert pas le status — les jetons seront crédités manuellement si nécessaire
		} else {
			log.Printf("[SUMB] Jetons crédités: user=%s plan=%s tokens=%d", tx.UserID, tx.Plan, tx.Tokens)
		}
	} else {
		tx.Status = "failed"
		mu.Unlock()
		log.Printf("[SUMB] Paiement échoué: %s", payload.Reference)
	}

	return c.JSON(fiber.Map{"status": "ok"})
}

// creditTokensViaAPI — appel interne vers FastAPI /internal/credit-tokens
func creditTokensViaAPI(userID, plan string, tokens int) error {
	apiURL := os.Getenv("FASTAPI_INTERNAL_URL")
	if apiURL == "" {
		apiURL = "http://gabomagpt-api:8000"
	}

	body, _ := json.Marshal(map[string]interface{}{
		"userId": userID,
		"plan":   plan,
		"tokens": tokens,
	})

	req, err := http.NewRequest("POST", apiURL+"/internal/credit-tokens", bytes.NewBuffer(body))
	if err != nil {
		return fmt.Errorf("erreur création requête: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Authentification interne via secret partagé
	internalSecret := os.Getenv("INTERNAL_API_SECRET")
	if internalSecret != "" {
		req.Header.Set("X-Internal-Secret", internalSecret)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("erreur appel FastAPI: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("FastAPI retourne %d", resp.StatusCode)
	}

	return nil
}
