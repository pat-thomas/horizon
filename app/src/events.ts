import { ChangeEvent } from 'react';
import { AppState } from './types';

const splitPrompt = (rawPrompt: string) => {
  let splitParts = rawPrompt.split('::');
  return splitParts.filter((part) => {
    return part.trim() !== '';
  });
};

const onRawPromptInputChange = (appState: AppState, e: ChangeEvent<HTMLInputElement>) => {
  console.log('onRawPromptInputChange');
  const inputVal = e.target.value;
  let newAppState = { ...appState };
  const rawPromptParts = splitPrompt(inputVal);
  newAppState.rawPrompt = inputVal;
  newAppState.promptParts = rawPromptParts.map((part) => {
    return {
      text: part.trim(),
      weight: '1' // TODO make this parseable from the prompt, i.e. foo::1 bar::0.5 baz::2
    }
  });
  return newAppState;
};

const onPromptPartWeightInputChange = (
  appState: AppState,
  e: ChangeEvent<HTMLInputElement>,
  index: number,
  weight: string
) => {
  const inputVal = e.target.value;
  let newAppState = { ...appState };
  newAppState.promptParts[index].weight = inputVal;
  return newAppState;
};

const onSuffixChange = (appState: AppState, e: React.ChangeEvent<HTMLInputElement>) => {
  const inputVal = e.target.value;
  let newAppState = { ...appState };
  newAppState.params.suffix = inputVal;
  return newAppState;
};


const eventListeners = {
  onRawPromptInputChange: onRawPromptInputChange,
  onPromptPartWeightInputChange: onPromptPartWeightInputChange,
  onSuffixChange: onSuffixChange
}

export default eventListeners;
