'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback } from 'react';

export function Conversation() {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
        connectionType: 'websocket',
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={conversation.status === 'connected'}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== 'connected'}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Conversation
        </button>
      </div>

      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>

        <VoiceActivityIndicator conversation={conversation} />
      </div>
    </div>
  );
}

const VoiceActivityIndicator = ({
  conversation,
}: {
  conversation: ReturnType<typeof useConversation>;
}) => {
  return (
    <div className="mt-4 relative">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center ${
          conversation.status === 'connected'
            ? conversation.isSpeaking
              ? 'bg-green-500/20' // AI speaking
              : 'bg-blue-500/20' // User speaking/listening
            : 'bg-gray-300/20' // Disconnected
        }`}
      >
        <div
          className={`absolute w-8 h-8 rounded-full ${
            conversation.status === 'connected'
              ? conversation.isSpeaking
                ? 'bg-green-500 animate-pulse'
                : 'bg-blue-500 animate-pulse'
              : 'bg-gray-300'
          }`}
        />
      </div>
    </div>
  );
};
