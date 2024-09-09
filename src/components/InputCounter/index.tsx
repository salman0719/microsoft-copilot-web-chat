import { FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getData, subscribe } from '../../utils/store';
import { INPUT_CHAR_LIMIT } from '../../utils/constants';

const InputCounter: FunctionalComponent = () => {
  const [value, setValue] = useState<string>(() => (getData('sendBoxValue') || '') as string);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const unlistenArr = [
      subscribe(['sendBoxValue'], (value: string) => {
        setValue(value);
      }),
      subscribe(['charLimitExceeded'], (hasError: boolean) => {
        setHasError(hasError);
      }),
    ];

    return () => {
      unlistenArr.forEach((unlisten) => {
        unlisten();
      });
    };
  }, []);

  return (
    <span
      className={
        'webchat__send-box-text-box-counter' +
        (hasError ? ' webchat__send-box-text-box-counter--error' : '')
      }
    >
      {value.length} / {INPUT_CHAR_LIMIT}
    </span>
  );
};

export default InputCounter;
