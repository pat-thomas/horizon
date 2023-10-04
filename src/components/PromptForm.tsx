import React , { useState } from 'react';

const PromptParameterInput = () => {
  const [inputValue, setInputValue] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const evtVal = event.target.value;
    console.log('evtVal', evtVal);
    setInputValue(evtVal);
  };
  return (
    <div>
      <label>Configure new prompt parameter:
      <input type="text" value={inputValue} onChange={handleChange} />
      </label>
    </div>
  );
};

const PromptForm = () => {
  const [inputValue, setInputValue] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const evtVal = event.target.value;
    console.log('evtVal', evtVal);
    setInputValue(evtVal);
  };
  return (
    <div>
      <form>
        <button>Click to add new prompt parameter to prompt builder</button>
        <PromptParameterInput />
        <PromptParameterInput />
      </form>
      <button>Click to submit prompt parameters</button>
    </div>
  );
};

export default PromptForm
