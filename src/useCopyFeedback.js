import { useCallback, useEffect, useRef, useState } from 'react';

export default function useCopyFeedback({ timeout = 1500, resetKey } = {}) {
  const [feedback, setFeedback] = useState(null);
  const timer = useRef(null);
  const request = useRef(0);

  if (feedback && feedback.key !== resetKey) setFeedback(null);

  const resetCopied = useCallback(() => {
    request.current += 1;
    clearTimeout(timer.current);
    setFeedback(null);
  }, []);

  useEffect(
    () => () => {
      // Ignore pending clipboard writes after navigation, regeneration or unmount.
      request.current += 1;
      clearTimeout(timer.current);
    },
    [resetKey]
  );

  const copyText = useCallback(
    async (text, message = 'Copied') => {
      const currentRequest = ++request.current;
      clearTimeout(timer.current);
      let ok = false;
      try {
        // Call directly from the user gesture. Never open a blocking prompt or
        // infer success from a manual copy action we cannot observe.
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        }
      } catch {
        // Manual selection remains available when permission is denied.
      }
      if (currentRequest !== request.current) return false;
      setFeedback({
        key: resetKey,
        copied: ok ? text : '',
        message: ok
          ? message
          : 'Automatic copy unavailable. Select the text and copy it manually.',
      });
      // Failure instructions persist until another action or new output.
      if (ok)
        timer.current = setTimeout(() => {
          setFeedback((value) => (value ? { ...value, message: '' } : null));
        }, timeout);
      return ok;
    },
    [resetKey, timeout]
  );

  const current = feedback?.key === resetKey ? feedback : null;
  return {
    copied: current?.copied || '',
    copyNotify: current?.message || '',
    copyText,
    resetCopied,
  };
}
