import React , { FC } from 'react';
import type { AppState } from '../types';

interface OutputProps {
  appState: AppState
}

const generatePartOutput = (part: any, suffix: string) => {
  if (suffix !== '') {
    return `${part.text} , ${suffix}::${part.weight}`;
  }
  return `${part.text}::${part.weight}`;
};

const generateOutput = (appState: AppState) => {
  const {
    promptParts,
  } = appState;
  const suffix = appState.params.suffix;

  if (promptParts.length === 1 && promptParts[0].text.trim() === '') {
    return '';
  }

  let outputStr = '';
  outputStr = promptParts.map((part: any) => {
    return generatePartOutput(part, suffix);
  }).join('\n');

  return outputStr;
};

const Output: FC<OutputProps> = ({
  appState
}) => {
  const outputStr = generateOutput(appState);
  return (
    <div className="output">
      <p>/imagine prompt:{outputStr}</p>
    </div>
  );
};

export default Output
