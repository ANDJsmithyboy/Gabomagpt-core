/* GabomaGPT — Types Partagés · SmartANDJ AI Technologies */

/** Les 3 modes de GabomaGPT */
export type GabomaMode = "flash" | "pro" | "black-panther";

/** Rôles utilisateur */
export type UserRole = "admin" | "pro" | "free" | "pending";

/** Langues supportées */
export type Language = "fr" | "fang" | "mpongwe" | "punu";

/** Message dans une conversation */
export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  mode: GabomaMode;
  language?: Language;
  createdAt: string;
  tokens?: number;
}

/** Conversation */
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  mode: GabomaMode;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

/** Utilisateur */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferredLanguage: Language;
  createdAt: string;
}

/** Requête de chat streaming */
export interface ChatRequest {
  message: string;
  conversationId?: string;
  mode: GabomaMode;
  language?: Language;
  webSearch?: boolean;
}

/** Événement SSE streaming */
export interface StreamEvent {
  type: "token" | "done" | "error" | "reflection_start" | "reflection_end";
  content?: string;
  conversationId?: string;
  messageId?: string;
}

/** Stats admin dashboard */
export interface DashboardStats {
  totalUsers: number;
  messagesPerDay: number;
  revenueXAF: number;
  groqLatencyMs: number;
}

/** Document RAG */
export interface RagDocument {
  id: string;
  filename: string;
  collection: string;
  chunkCount: number;
  uploadedAt: string;
  uploadedBy: string;
}
