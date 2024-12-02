import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import type { TMessage } from 'librechat-data-provider';
import { useGetEndpointsQuery } from 'librechat-data-provider/react-query';
import { useChatContext } from '~/Providers';
import store from '~/store';

export type TSubmitMessageData = {
  text: string;
  webSearch?: boolean;
};

export const useSubmitMessage = ({ clearDraft }: { clearDraft?: () => void }) => {
  const {
    conversation,
    getMessages,
    setMessages,
    setIsSubmitting,
  } = useChatContext();
  const { data: endpointsConfig } = useGetEndpointsQuery();

  const submitMessage = useCallback(
    async (data: TSubmitMessageData) => {
      const { text, webSearch } = data;
      
      if (!text) return;

      const messages = getMessages() ?? [];
      const { conversationId } = conversation ?? { conversationId: crypto.randomUUID() };

      // Create user message
      const userMessage = {
        text,
        isCreatedByUser: true,
        messageId: crypto.randomUUID(),
        conversationId,
        parentMessageId: messages[messages.length - 1]?.messageId || '0',
        error: false,
      } as TMessage;

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsSubmitting(true);

      try {
        const endpoint = webSearch ? '/api/perplexica' : '/api/ask';
        const payload = {
          text,
          conversationId,
          parentMessageId: userMessage.parentMessageId,
          ...(webSearch ? { webSearch: true } : {}),
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.text || 'An error occurred during the request.');
        }

        const responseData = await response.json();
        const { message: assistantMessage } = responseData;

        if (assistantMessage) {
          setMessages([...newMessages, assistantMessage]);
        }

        if (clearDraft) {
          clearDraft();
        }
      } catch (error) {
        // Create error message
        const errorMessage = {
          text: error instanceof Error ? error.message : 'An error occurred during chat',
          isCreatedByUser: false,
          messageId: crypto.randomUUID(),
          conversationId,
          parentMessageId: userMessage.messageId,
          error: true,
        } as TMessage;

        setMessages([...newMessages, errorMessage]);
      } finally {
        setIsSubmitting(false);
      }
    },
    [conversation, getMessages, setMessages, setIsSubmitting, endpointsConfig],
  );

  const submitPrompt = useCallback(
    async (data: TSubmitMessageData) => {
      await submitMessage(data);
    },
    [submitMessage],
  );

  return {
    submitMessage,
    submitPrompt,
  };
};

export default useSubmitMessage;
