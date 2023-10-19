import React , { useState } from 'react';
import './App.css';
import PromptBuilder from './components/PromptBuilder';
import RawPromptInput from './components/RawPromptInput';
import Output from './components/Output';
import type { AppState } from './types';

const initialAppState: AppState = {
  rawPrompt: '',
  promptParts: [{text: '', weight: '1'}],
  params: {
    suffix: ''
  }
};

const splitPrompt = (rawPrompt: string) => {
  let splitParts = rawPrompt.split('::');
  return splitParts.filter((part) => {
    return part.trim() !== '';
  });
};

const App: React.FC = () => {
  const [appState, setAppState] = useState(initialAppState);

  const onRawPromptInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setAppState(newAppState);
  }

  const rawPromptInputProps = {
    onChange: onRawPromptInputChange
  }

  const onPromptPartWeightInputChange = (promptIndex: number, newWeight: string) => {
    let newAppState = { ...appState };
    newAppState.promptParts[promptIndex].weight = newWeight
    setAppState(newAppState);
  };

  const promptBuilderProps = {
    appState: appState,
    setAppState: setAppState,
    onPromptPartWeightInputChange: onPromptPartWeightInputChange
  };

  const outputProps = {
    appState: appState
  };

  return (
    <div className="App">
      <header>
        <p>Create your Horizon</p>
      </header>
      <div className="App-body">
        <RawPromptInput { ...rawPromptInputProps } />
        <PromptBuilder { ...promptBuilderProps } />
        <Output { ...outputProps } />
      </div>
    </div>
  );
};

export default App;
