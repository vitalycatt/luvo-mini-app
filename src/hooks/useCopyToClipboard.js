import { useState, useCallback } from "react";
import { copyToClipboard } from "@/utils/copy-to-clipboard.util";

export const useCopyToClipboard = (timeout = 3000) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(
    async (text) => {
      if (!text) return false;

      const success = await copyToClipboard(text);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), timeout);
        return true;
      }
      return false;
    },
    [timeout]
  );

  return {
    handleCopy,
    isCopied,
  };
};
