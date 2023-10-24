import logo from "./logo.svg"
import { Counter } from "./features/counter/Counter"
import { PromptBuilder } from "./features/promptBuilder/PromptBuilder"
import "./App.css"
import { store } from "./app/store";
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <PromptBuilder />
        </header>
      </div>
    </Provider>
  )
}

export default App
