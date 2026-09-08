import { useState } from 'react';

function attempt(generate) {
  try {
    return { values: generate(), error: '' };
  } catch (error) {
    return {
      values: [],
      error:
        error instanceof Error ? error.message : 'Unable to generate passwords',
    };
  }
}

// Generation components are keyed by configuration. A lazy initial value avoids
// an empty first paint and an effect-driven render; clicks replace the batch.
export default function useGeneratedValues(generate) {
  const [result, setResult] = useState(() => attempt(generate));
  return { ...result, regenerate: () => setResult(attempt(generate)) };
}
