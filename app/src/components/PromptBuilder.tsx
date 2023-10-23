import React , { FC } from 'react';
import PromptPiece from './PromptPiece';
import GlobalParams from './GlobalParams';
import { AppState } from '../types';

interface PromptBuilderProps {
  appState: AppState
  eventListeners: any
}

const PromptBuilder: FC<PromptBuilderProps> = ({
  appState,
  eventListeners
}) => {
  const promptParts: any[] = appState.promptParts;
  const globalParamsProps = {
    appState: appState,
    eventListeners: eventListeners
  }

  return (
    <div className="promptBuilder">
      <div>
        {promptParts.map((partData: any, index: number) => {
          const promptPieceProps = {
            weight: partData.weight,
            rawPromptPart: partData.text,
            key: index,
            index: index,
            eventListeners: eventListeners
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
