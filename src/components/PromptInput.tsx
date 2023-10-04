import Input from './Input';
import { ChangeEvent, FC } from 'react';

interface PromptInputProps {
  inputState: string
}

const PromptInput: FC<PromptInputProps> = ({
  inputState
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('here is the e', e);
    //setInputState(eventVal);
  };

  return (
    <div>
      <label>Enter your prompt here</label>
      <Input
        type="text"
        label="Enter your prompt here"
        value={inputState}
        name="promptraw"
        onChange={handleChange}
        placeholder="..."
      />
    </div>
  );
};

export default PromptInput
