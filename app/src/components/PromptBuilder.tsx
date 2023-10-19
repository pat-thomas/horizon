import React , { FC } from 'react';
import PromptPiece from './PromptPiece';
import GlobalParams from './GlobalParams';

interface PromptBuilderProps {
  appState: any
  setAppState: any
  onPromptPartWeightInputChange: any
}

const PromptBuilder: FC<PromptBuilderProps> = ({
  appState,
  setAppState,
  onPromptPartWeightInputChange
}) => {
  const promptParts: any[] = appState.promptParts;
  const globalParamsProps = {
    appState: appState,
    setAppState: setAppState
  }

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
      <GlobalParams { ...globalParamsProps } />
    </div>
  )
};

export default PromptBuilder
