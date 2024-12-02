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
  const { conversationId, messages, setMessages } = useChatContext();
  const { data: endpointsConfig } = useGetEndpointsQuery();

  const submitMessage = useCallback(
    async (data: TSubmitMessageData) => {
      // Implementation details...
    },
    [conversationId, messages, setMessages, endpointsConfig],
  );

  const submitPrompt = useCallback(
    async (data: TSubmitMessageData) => {
      // Implementation details...
    },
    [submitMessage],
  );

  return {
    submitMessage,
    submitPrompt,
  };
};

export default useSubmitMessage;
