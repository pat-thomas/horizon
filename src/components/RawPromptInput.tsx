import React , { ChangeEvent, FC , useState } from 'react';

interface RawPromptInputProps {
  onChange: any
}

const RawPromptInput: FC<RawPromptInputProps> = ({
  onChange
}) => {
  return (
    <div>
      <label> Enter your prompt here</label>
      <input id="prompt" type="text" onChange={onChange} />
    </div>
  );
};

export default RawPromptInput
