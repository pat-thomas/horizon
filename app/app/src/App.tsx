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
        <PromptBuilder />
      </div>
    </Provider>
  )
}

export default App
