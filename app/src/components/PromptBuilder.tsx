import React , { FC } from 'react';
import PromptPiece from './PromptPiece';

interface PromptBuilderProps {
  appState: any
  onPromptPartWeightInputChange: any
}

const PromptBuilder: FC<PromptBuilderProps> = ({
  appState,
  onPromptPartWeightInputChange
}) => {
  const promptParts: any[] = appState.promptParts;

  return (
    <div className="promptBuilder">
      <div>
        {promptParts.map((partData: any, index: number) => {
          const promptPieceProps = { 
            weight: partData.weight,
            rawPromptPart: partData.text,
            onPromptPartWeightInputChange: onPromptPartWeightInputChange,
            key: index,
            index: index
          };
          return (
            <PromptPiece { ...promptPieceProps } />
          );
        })}
      </div>
    </div>
  )
};

export default PromptBuilder
