import React , { ChangeEvent, FC , useState } from 'react';

interface PromptPieceProps {
  rawPromptPart: string
}


const PromptPiece: FC<PromptPieceProps> = ({
  rawPromptPart
}) => {
  return (
    <div>
      <p>the raw prompt part is: {rawPromptPart}</p>
    </div>
  )
};

export default PromptPiece
