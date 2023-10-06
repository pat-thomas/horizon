import React , { FC } from 'react';
import PromptPiece from './PromptPiece';

interface PromptBuilderProps {
  appState: any
  onPromptPartWeightInputChange: any
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

const PromptBuilder: FC<PromptBuilderProps> = ({
  appState,
  onPromptPartWeightInputChange
}) => {
  const promptParts: any[] = appState.promptParts;
  const outputStr = generateOutput(promptParts);

  return (
    <div className="promptBuilder">
      <div>
        {promptParts.map((partData: any, index: number) => {
          const promptPieceProps = {
            onPromptPartWeightInputChange: onPromptPartWeightInputChange,
            key: index,
            index: index,
            weight: partData.weight,
            rawPromptPart: partData.text
          };
          return (
            <PromptPiece { ...promptPieceProps } />
          );
        })}
      </div>

      <div className="output">
        <p>/imagine prompt:{outputStr}</p>
      </div>
    </div>
  )
};

export default PromptBuilder
