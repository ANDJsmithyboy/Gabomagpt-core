// GabomaGPT · payment.go · SmartANDJ AI Technologies
// Initiation de paiement + statut polling
package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
)

// URLs SUMB — PRIVÉES, jamais exposées côté client
var sumbURLs = map[string]map[int]string{
	"moov": {
		2500:  "https://sumb.cyberschool.ga/?productId=5R3C3AlZ9yGVv5xjKlUv&operationAccountCode=ACC_6835AD2DD02FF&maison=moov&amount=2500",
		13000: "https://sumb.cyberschool.ga/?productId=fvFJXD12JK1Fou2KQjjW&operationAccountCode=ACC_6835AD2DD02FF&maison=moov&amount=13000",
		50000: "https://sumb.cyberschool.ga/?productId=JOWVrhDWo7s4NaEceAwF&operationAccountCode=ACC_6835AD2DD02FF&maison=moov&amount=50000",
	},
	"airtel": {
		2500:   "https://sumb.cyberschool.ga/?productId=oQYSlrXN14nKG4LEgqfB&operationAccountCode=ACC_6835A60F891F7&maison=airtel&amount=2500",
		13000:  "https://sumb.cyberschool.ga/?productId=CC8UsxqY6wh8iU1krjCD&operationAccountCode=ACC_6835A60F891F7&maison=airtel&amount=13000",
		50000:  "https://sumb.cyberschool.ga/?productId=HralksUzSZIlJLNA9fnl&operationAccountCode=ACC_6835A60F891F7&maison=airtel&amount=50000",
		150000: "https://sumb.cyberschool.ga/?productId=Q96dMk0RwvRA1z68Atwt&operationAccountCode=ACC_6835A60F891F7&maison=airtel&amount=150000",
	},
}

// Plans → montants et jetons
var planConfig = map[string]struct {
	Price  int
	Tokens int
}{
	"pro":         {2500, 500},
	"elite":       {13000, 3000},
	"panther":     {50000, 12000},
	"panther_pro": {150000, 45000},
}

// Transaction en mémoire (Phase 1 — en prod, utiliser PostgreSQL)
type Transaction struct {
	Ref       string    `json:"ref"`
	UserID    string    `json:"userId"`
	Plan      string    `json:"plan"`
	Operator  string    `json:"operator"`
	Amount    int       `json:"amount"`
	Tokens    int       `json:"tokens"`
	Status    string    `json:"status"` // pending | success | failed | expired
	CreatedAt time.Time `json:"createdAt"`
	ExpiresAt time.Time `json:"expiresAt"`
}

var (
	transactions = make(map[string]*Transaction)
	mu           sync.RWMutex
)

// Génère une référence unique GABOMA-XXXXXX
func generateRef() string {
	b := make([]byte, 6)
	rand.Read(b)
	return "GABOMA-" + strings.ToUpper(hex.EncodeToString(b))
}

// InitiatePayment — POST /api/payment/initiate
func InitiatePayment(c *fiber.Ctx) error {
	type Request struct {
		Plan     string `json:"plan"`
		Operator string `json:"operator"`
		UserID   string `json:"userId"`
	}

	var req Request
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Corps invalide"})
	}

	// Valider le plan
	pc, ok := planConfig[req.Plan]
	if !ok {
		return c.Status(400).JSON(fiber.Map{"error": "Plan inconnu"})
	}

	// Valider l'opérateur
	opURLs, ok := sumbURLs[req.Operator]
	if !ok {
		return c.Status(400).JSON(fiber.Map{"error": "Opérateur inconnu"})
	}

	// Vérifier que le montant est disponible pour cet opérateur
	sumbURL, ok := opURLs[pc.Price]
	if !ok {
		return c.Status(400).JSON(fiber.Map{
			"error": fmt.Sprintf("Montant %d FCFA non disponible pour %s", pc.Price, req.Operator),
		})
	}

	ref := generateRef()
	now := time.Now()
	tx := &Transaction{
		Ref:       ref,
		UserID:    req.UserID,
		Plan:      req.Plan,
		Operator:  req.Operator,
		Amount:    pc.Price,
		Tokens:    pc.Tokens,
		Status:    "pending",
		CreatedAt: now,
		ExpiresAt: now.Add(5 * time.Minute),
	}

	mu.Lock()
	transactions[ref] = tx
	mu.Unlock()

	// Lancer l'auto-expiration en arrière-plan
	go func() {
		time.Sleep(5 * time.Minute)
		mu.Lock()
		if t, exists := transactions[ref]; exists && t.Status == "pending" {
			t.Status = "expired"
		}
		mu.Unlock()
	}()

	// Ajouter la ref comme paramètre de retour à l'URL SUMB
	returnURL := os.Getenv("PAYMENT_RETURN_URL")
	if returnURL == "" {
		returnURL = "https://gabomagpt.ga/payment/confirm"
	}
	fullURL := fmt.Sprintf("%s&returnUrl=%s?ref=%s", sumbURL, returnURL, ref)

	return c.JSON(fiber.Map{
		"ref":        ref,
		"sumb_url":   fullURL,
		"amount":     pc.Price,
		"tokens":     pc.Tokens,
		"expires_at": tx.ExpiresAt.Format(time.RFC3339),
	})
}

// GetPaymentStatus — GET /api/payment/status?ref=XXX
func GetPaymentStatus(c *fiber.Ctx) error {
	ref := c.Query("ref")
	if ref == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Référence manquante"})
	}

	mu.RLock()
	tx, exists := transactions[ref]
	mu.RUnlock()

	if !exists {
		return c.Status(404).JSON(fiber.Map{"error": "Transaction introuvable"})
	}

	return c.JSON(fiber.Map{
		"status": tx.Status,
		"tokens": tx.Tokens,
		"plan":   tx.Plan,
	})
}
