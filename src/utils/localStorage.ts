import { UIDataTypes, UIMessage, UITools } from "ai";
import { CHAT_CONSTANTS } from "@/constants/chat";

type StoredMessage = UIMessage<unknown, UIDataTypes, UITools> & {
  timestamp: number;
};

export function saveMessageToStorage(message: StoredMessage) {
  const existing = loadMessagesFromStorage();
  const updated = [...existing, message];
  localStorage.setItem(CHAT_CONSTANTS.STORAGE_KEY, JSON.stringify(updated));
}

export function loadMessagesFromStorage(): StoredMessage[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CHAT_CONSTANTS.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading messages from storage:", error);
    return [];
  }
}

export function deleteMessageFromStorage(messageId: string) {
  const existing = loadMessagesFromStorage();
  const updated = existing.filter((message) => message.id !== messageId);
  localStorage.setItem(CHAT_CONSTANTS.STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistory() {
  localStorage.removeItem(CHAT_CONSTANTS.STORAGE_KEY);
}
