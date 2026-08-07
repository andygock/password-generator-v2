import { WORD_LIST_OPTIONS } from './words';

const baseLog = (base, val) => Math.log(val) / Math.log(base);

const WordListRadio = ({ value, onChange = () => null }) => {
  const handleChange = (e) => {
    const id = e.target.id;
    onChange(id);
  };

  return (
    <>
      {WORD_LIST_OPTIONS.map(({ text, id, count: wordCount }) => {
        return (
          <label key={id}>
            <input
              type="radio"
              id={id}
              name="word-list"
              checked={value === id}
              onChange={handleChange}
            />
            {text} ({wordCount}
            {wordCount > 0 ? (
              <>
                , 2<sup>{baseLog(2, wordCount).toFixed(1)}</sup>
              </>
            ) : (
              ', —'
            )}
            )
          </label>
        );
      })}
    </>
  );
};

export default WordListRadio;
