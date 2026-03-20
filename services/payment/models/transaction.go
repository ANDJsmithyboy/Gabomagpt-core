// GabomaGPT · transaction.go · SmartANDJ AI Technologies
// Modèle de transaction — Phase 1 in-memory, Phase 2 PostgreSQL
package models

import "time"

// Transaction représente un paiement SUMB
type Transaction struct {
	Ref       string    `json:"ref" db:"ref"`
	UserID    string    `json:"userId" db:"user_id"`
	Plan      string    `json:"plan" db:"plan"`
	Operator  string    `json:"operator" db:"operator"`
	Amount    int       `json:"amount" db:"amount"`
	Tokens    int       `json:"tokens" db:"tokens"`
	Status    string    `json:"status" db:"status"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	ExpiresAt time.Time `json:"expiresAt" db:"expires_at"`
}

// StatusPending — en attente de confirmation SUMB
const StatusPending = "pending"

// StatusSuccess — paiement confirmé, jetons crédités
const StatusSuccess = "success"

// StatusFailed — paiement échoué
const StatusFailed = "failed"

// StatusExpired — timeout dépassé (5 minutes)
const StatusExpired = "expired"
