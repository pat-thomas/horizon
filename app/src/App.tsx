import logo from "./logo.svg"
import { Counter } from "./features/counter/Counter"
import { PromptBuilder } from "./features/promptBuilder/PromptBuilder"
import "./App.css"
import { store } from "./app/store";
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import Layout from './components/Layout'
import Home from './components/Home'
import Gallery from './components/Gallery'
import NoPage from './components/NoPage'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="builder" element={<PromptBuilder />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
