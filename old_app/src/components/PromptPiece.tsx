import React , { ChangeEvent, FC } from 'react';

// inner PromptWeight component
interface PromptWeightProps {
  index: number
  weight: string
  eventListeners: any
}

const PromptWeight: FC<PromptWeightProps> = ({
  index,
  weight,
  eventListeners
}) => {
  const onChange = ((e: ChangeEvent<HTMLInputElement>) => {
    return eventListeners.onPromptPartWeightInputChange(e, index, weight);
  });

  return (
    <div className='App.PromptWeight'>
      <input value={weight} id="promptWeight" type="text" onChange={onChange} />
    </div>
  )
};

// main PromptPiece component
interface PromptPieceProps {
  index: number
  weight: string
  rawPromptPart: string
  eventListeners: any
}

const PromptPiece: FC<PromptPieceProps> = ({
  index,
  rawPromptPart,
  weight,
  eventListeners
}) => {
  const promptWeightProps = {
    eventListeners: eventListeners,
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
