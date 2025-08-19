export enum MessageRole {
  USER = "user",
  AI = "assistant",
}

export enum MessagePartType {
  TEXT = "text",
  TOOL_WEATHER = "tool-weather",
}

export const CHAT_CONSTANTS = {
  STORAGE_KEY: "chat-history",
  USER_PREFIX: "user-",
} as const;

export const MESSAGE_LABELS = {
  [MessageRole.USER]: "User: ",
  [MessageRole.AI]: "AI: ",
} as const;
