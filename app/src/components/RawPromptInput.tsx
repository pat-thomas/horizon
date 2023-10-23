import React , { FC } from 'react';
import { AppState } from '../types';

interface RawPromptInputProps {
  appState: AppState,
  eventListeners: any
}

const RawPromptInput: FC<RawPromptInputProps> = ({
  appState,
  eventListeners
}) => {
  const onChange = eventListeners.onRawPromptInputChange;
  return (
    <div>
      <label> Enter your prompt here</label>
      <input id="prompt" type="text" onChange={onChange} />
    </div>
  );
};

export default RawPromptInput
