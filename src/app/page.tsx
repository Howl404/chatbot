"use client";

import {
  loadMessagesFromStorage,
  saveMessageToStorage,
  deleteMessageFromStorage,
} from "@/utils/localStorage";
import { useChat } from "@ai-sdk/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  MessageRole,
  MessagePartType,
  CHAT_CONSTANTS,
  MESSAGE_LABELS,
} from "@/constants/chat";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages } = useChat({
    onFinish: ({ message }) => {
      saveMessageToStorage({
        ...message,

        timestamp: Date.now(),
      });
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput("");
    saveMessageToStorage({
      id: `${CHAT_CONSTANTS.USER_PREFIX}${Date.now()}`,
      role: MessageRole.USER,
      parts: [
        {
          type: MessagePartType.TEXT,
          text: input,
        },
      ],
      timestamp: Date.now(),
    });
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.currentTarget.value);
  }

  function handleDeleteMessage(messageId: string) {
    const updatedMessages = deleteMessageFromStorage(messageId);
    setMessages(updatedMessages);
  }

  function clearAllMessages() {
    if (messages.length === 0) return;

    if (window.confirm("Are you sure you want to clear all messages?")) {
      localStorage.removeItem(CHAT_CONSTANTS.STORAGE_KEY);
      setMessages([]);
    }
  }

  useEffect(() => {
    const savedMessages = loadMessagesFromStorage();

    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, [setMessages]);

  return (
    <main className="flex flex-col items-center p-6 max-w-2xl mx-auto">
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Chat</h1>
        {messages.length > 0 && (
          <button
            onClick={clearAllMessages}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-200 transition-colors"
            title="Clear all messages"
          >
            Clear History
          </button>
        )}
      </div>
      <div className="w-full border rounded-lg p-4 h-[70vh] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className="mb-2 p-3 border rounded-lg relative group hover:bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-600 mb-1">
                  {MESSAGE_LABELS[message.role as MessageRole]}
                </div>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case MessagePartType.TEXT:
                      return <div key={`${message.id}-${i}`}>{part.text}</div>;
                  }
                })}
              </div>
              <button
                onClick={() => handleDeleteMessage(message.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 text-red-500 hover:text-red-700 hover:cursor-pointer hover:bg-red-50 rounded"
              >
                Delete message
              </button>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 w-full mt-4">
        <input
          className="flex-grow border rounded p-2"
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </form>
    </main>
  );
}
