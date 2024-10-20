import { NextResponse } from 'next/server';

const url = 'https://tavusapi.com/v2/conversations';
const apiKey = process.env.TAVUS_API_KEY ?? '';

type ConversationResponse = {
  conversation_id: string;
  conversation_name: string;
  conversation_url: string;
  status: 'active' | 'inactive' | 'pending';
  callback_url: string | null;
  created_at: string;
};

async function createConversation(): Promise<ConversationResponse> {
  const requestBody = {
    replica_id: 'rae3207700',
    persona_id: 'pa185783',
    // callback_url: 'https://example.com',
    conversation_name: 'Example Meeting',
    conversational_context: 'You are a helpful assistant named Jarvis.',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Unexpected response status ${response.status}`);
  }

  return await response.json();
}

export async function POST() {
  const data = await createConversation();
  const conversationId = data.conversation_id;
  return NextResponse.json({ success: true, conversationId });
}
