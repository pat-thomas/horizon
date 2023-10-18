import React , { ChangeEvent, FC , useState } from 'react';

// inner PromptWeight component
interface PromptWeightProps {
  index: number
  onPromptPartWeightInputChange: any
  weight: string
}

const PromptWeight: FC<PromptWeightProps> = ({
  index,
  onPromptPartWeightInputChange,
  weight
}) => {
  const handlePromptWeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const evtVal = e.target.value;
    onPromptPartWeightInputChange(index, evtVal);
  };
  return (
    <div className='App.PromptWeight'>
      <input value={weight} id="promptWeight" type="text" onChange={handlePromptWeightInputChange} />
    </div>
  )
};

// main PromptPiece component
interface PromptPieceProps {
  index: number
  weight: string
  rawPromptPart: string
  onPromptPartWeightInputChange: any // TODO type this function
}

const PromptPiece: FC<PromptPieceProps> = ({
  index,
  rawPromptPart,
  onPromptPartWeightInputChange,
  weight
}) => {
  const promptWeightProps = {
    onPromptPartWeightInputChange: onPromptPartWeightInputChange,
    index: index,
    weight: weight
  };

  return (
    <div>
      <div className='App.PromptPiece'>
        <p>[{index}] {rawPromptPart}</p>
        <PromptWeight { ...promptWeightProps } />
      </div>
    </div>
  )
};

export default PromptPiece
