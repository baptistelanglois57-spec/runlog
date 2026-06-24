import { useState } from "react";

import { theme } from "../styles/theme";
import type { CoachMessage } from "../types/CoachMessage";

import CoachHeader from "../components/Coach/CoachHeader";
import MessageBubble from "../components/Coach/MessageBubble";
import ChatInput from "../components/Coach/ChatInput";

import { askCoach } from "../services/coachService";

export default function Coach() {
  const [input, setInput] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<CoachMessage[]>([
      {
        id: "1",
        sender: "coach",
        text: `Salut Baptiste 👋

Je suis ton Coach RunLog.

Je peux analyser tes entraînements,
préparer tes courses,
organiser ta musculation
et suivre ta progression.

Pose-moi une question.`,
      },
    ]);

  async function handleSend() {
    if (!input.trim()) return;

    const question = input;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "user",
        text: question,
      },
    ]);

    setInput("");

    setLoading(true);

    try {
      const answer =
        await askCoach(question);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "coach",
          text: answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "coach",
          text: "Erreur lors de la communication avec le Coach.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        padding: "40px 20px 120px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <CoachHeader />

        <div
          style={{
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "24px",
            padding: "25px",
            boxShadow: theme.shadow.card,
            minHeight: "520px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                sender={message.sender}
                message={message.text}
              />
            ))}

            {loading && (
              <MessageBubble
                sender="coach"
                message="Réflexion en cours..."
              />
            )}
          </div>

          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
          />
        </div>
      </div>
    </main>
  );
}