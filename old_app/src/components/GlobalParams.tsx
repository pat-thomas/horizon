import React , { FC , useState } from 'react';
import { AppState } from '../types';

interface GlobalParamsProps {
  appState: AppState,
  eventListeners: any
}

const GlobalParams: FC<GlobalParamsProps> = ({
  appState,
  eventListeners
  //setAppState
}) => {
  const [suffixVisible, setSuffixVisible] = useState(false);

  const toggleSuffixVisible = () => {
    setSuffixVisible((suffixVisible: boolean) => !suffixVisible);
  };

  const onSuffixChange = eventListeners.onSuffixChange;

  return (
    <div className="globalParams">
      <p>Parameter configuration</p>
      <div className="globalParamsSuffix">
        <button onClick={toggleSuffixVisible}>Click to configure suffix</button>
        {suffixVisible && <input type="text" onChange={onSuffixChange}></input>}
      </div>
      <div>
        <button>Click to add artist</button>
      </div>
    </div>
  )
};

export default GlobalParams;
