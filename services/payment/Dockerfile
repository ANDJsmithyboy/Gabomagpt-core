# GabomaGPT · Dockerfile · Service paiement Go
# SmartANDJ AI Technologies
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o gabomagpt-payment .

FROM alpine:3.19
RUN apk --no-cache add ca-certificates curl
WORKDIR /app
COPY --from=builder /app/gabomagpt-payment .

EXPOSE 8001
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8001/ping || exit 1

CMD ["./gabomagpt-payment"]
