// GabomaGPT · main.go · SmartANDJ AI Technologies
// Service Go webhook paiement SUMB — Port 8001
package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"gabomagpt-payment/handlers"
)

func main() {
	app := fiber.New(fiber.Config{
		AppName: "GabomaGPT Payment Service v1.0",
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: getEnv("CORS_ALLOW_ORIGIN", "*"),
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Healthcheck
	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "gabomagpt-payment",
			"version": "1.0.0",
		})
	})

	// Routes paiement
	app.Post("/api/payment/initiate", handlers.InitiatePayment)
	app.Get("/api/payment/status", handlers.GetPaymentStatus)
	app.Post("/webhook/sumb", handlers.HandleSUMBWebhook)

	port := getEnv("PORT", "8001")
	log.Printf("GabomaGPT Payment Service démarré sur :%s", port)
	log.Fatal(app.Listen(":" + port))
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
