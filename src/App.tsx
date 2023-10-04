import React , { useState } from 'react';
import './App.css';
import PromptDisplay from './components/PromptDisplay';
import PromptBuilder from './components/PromptBuilder';

const splitPromptIntoParts = (rawPrompt: string) => {
  console.log('rawPrompt', rawPrompt);
  return rawPrompt.split('::');
};


const App: React.FC = () => {
  const [inputState, setInputState] = useState('');
  const [promptParts, setPromptParts] = useState([]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setInputState(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    // this should just retrigger the rawPrompt render
  };
  return (
    <div className="App">
      <header>
        <p>Create your Horizon</p>
      </header>
      <div className="App-body">
        <div>
          <label> Enter your prompt here</label>
          <input id="prompt" type="text" onChange={onInputChange} />
        </div>
        <button onClick={handleSubmit}>Click me to split apart prompt</button>
        <PromptBuilder rawPrompt={inputState} />
      </div>
    </div>
  );
};

export default App;
