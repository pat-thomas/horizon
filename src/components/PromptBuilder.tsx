import React , { ChangeEvent, FC , useState } from 'react';
import PromptPiece from './PromptPiece';

interface PromptBuilderProps {
  rawPrompt: string
}

const generateOutput = (builderState: any) => {
  return 'this will be the output';
};

const splitPrompt = (rawPrompt: string) => {
  let splitParts = rawPrompt.split('::');
  return splitParts.filter((part) => {
    return part.trim() !== '';
  });
};

const PromptBuilder: FC<PromptBuilderProps> = ({
  rawPrompt
}) => {
  const [builderState, setBuilderState] = useState({});
  const promptSplitIntoParts: string[] = splitPrompt(rawPrompt);
  return (
    <div className="promptBuilder">
      <div>
        <div>
          {promptSplitIntoParts.map((rawPromptPartVal, index) => {
            return (
              <PromptPiece key={index} rawPromptPart={rawPromptPartVal} />
            );
          })}
        </div>
      </div>
      <div>
        <p>Output: {generateOutput(builderState)}</p>
      </div>
    </div>
  )
};

export default PromptBuilder
