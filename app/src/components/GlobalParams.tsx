import React , { FC , useState } from 'react';

interface GlobalParamsProps {
  appState: any,
  setAppState: any
}

const GlobalParams: FC<GlobalParamsProps> = ({
  appState,
  setAppState
}) => {
  const [suffixVisible, setSuffixVisible] = useState(false);

  const toggleSuffixVisible = () => {
    setSuffixVisible((suffixVisible: boolean) => !suffixVisible);
  };

  const onSuffixInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    let newAppState = { ...appState };
    newAppState.params.suffix = inputVal;
    setAppState(newAppState);
  };

  return (
    <div className="globalParams">
      <p>Parameter configuration</p>
      <div className="globalParamsSuffix">
        <button onClick={toggleSuffixVisible}>Click to configure suffix</button>
        {suffixVisible && <input type="text" onChange={onSuffixInputChange}></input>}
      </div>
      <div>
        <button>Click to add artist</button>
      </div>
    </div>
  )
};

export default GlobalParams;
