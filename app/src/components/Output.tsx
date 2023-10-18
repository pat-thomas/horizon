import React , { FC } from 'react';
import type { AppState } from '../types';

interface OutputProps {
  appState: AppState
}

const generatePartOutput = (part: any) => {
  return `${part.text}::${part.weight}`;
};

const generateOutput = (promptParts: any) => {
  console.log(promptParts);

  if (promptParts.length === 1 && promptParts[0].text.trim() === '') {
    return '';
  }

  let outputStr = '';
  outputStr = promptParts.map((part: any) => {
    return generatePartOutput(part);
  }).join('\n');

  return outputStr;
};

const Output: FC<OutputProps> = ({
  appState
}) => {
  const outputStr = generateOutput(appState.promptParts);
  return (
    <div className="output">
      <p>/imagine prompt:{outputStr}</p>
    </div>
  );
};

export default Output
