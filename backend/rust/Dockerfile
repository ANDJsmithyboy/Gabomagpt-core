# GabomaGPT · Dockerfile (Rust RAG Engine)
# SmartANDJ AI Technologies · Constitution Zion Core

FROM rust:1.77-slim-bookworm AS builder

WORKDIR /app
RUN apt-get update && apt-get install -y protobuf-compiler pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

COPY Cargo.toml Cargo.lock* ./
# Créer un dummy src pour pré-compiler les dépendances
RUN mkdir src && echo 'fn main() {}' > src/main.rs
RUN cargo build --release 2>/dev/null || true
RUN rm -rf src

COPY . .
RUN apt-get update && apt-get install -y pkg-config libssl-dev build-essential

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/target/release/gabomagpt-rag .

EXPOSE 8002
CMD ["./gabomagpt-rag"]
