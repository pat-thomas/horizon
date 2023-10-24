import React , { useState, ChangeEvent } from 'react';
import './App.css';
import PromptBuilder from './components/PromptBuilder';
import RawPromptInput from './components/RawPromptInput';
import Output from './components/Output';
import type { AppState } from './types';
import eventListeners from './events';

const initialAppState: AppState = {
  rawPrompt: '',
  promptParts: [{text: '', weight: '1'}],
  params: {
    suffix: ''
  }
};

const App: React.FC = () => {
  const [appState, setAppState] = useState(initialAppState);

  const statefulEventListeners = {
    onRawPromptInputChange: ((e: ChangeEvent<HTMLInputElement>) => {
      setAppState(eventListeners.onRawPromptInputChange(appState, e));
    }),
    onPromptPartWeightInputChange: ((e: ChangeEvent<HTMLInputElement>, index: number, weight: string) => {
      setAppState(eventListeners.onPromptPartWeightInputChange(appState, e, index, weight));
    }),
    onSuffixChange: ((e: ChangeEvent<HTMLInputElement>) => {
      setAppState(eventListeners.onSuffixChange(appState, e));
    }),
  }

  const genericProps = {
    appState: appState,
    eventListeners: statefulEventListeners
  };

  const promptBuilderProps = {
    ...genericProps,
    setAppState: setAppState,
  };

  return (
    <div className="App">
      <header>
        <p>Create your Horizon</p>
      </header>
      <div className="App-body">
        <RawPromptInput { ...genericProps } />
        <PromptBuilder { ...promptBuilderProps } />
        <Output { ...genericProps } />
      </div>
    </div>
  );
};

export default App;
