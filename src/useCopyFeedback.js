import copy from 'copy-to-clipboard';
import React from 'react';

export default function useCopyFeedback({ timeout = 1500 } = {}) {
  const [copied, setCopied] = React.useState('');
  const [copyNotify, setCopyNotify] = React.useState('');
  const copyTimeoutRef = React.useRef(null);

  const copyText = React.useCallback(
    (text, message = 'Copied') => {
      const ok = copy(text);
      if (ok) {
        setCopied(text);
        setCopyNotify(message);
      } else {
        setCopyNotify('Copy failed');
      }

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopyNotify('');
        copyTimeoutRef.current = null;
      }, timeout);

      return ok;
    },
    [timeout]
  );

  const resetCopied = React.useCallback(() => {
    setCopied('');
  }, []);

  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = null;
      }
    };
  }, []);

  return { copied, copyNotify, copyText, resetCopied };
}
