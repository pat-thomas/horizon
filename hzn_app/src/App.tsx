import logo from "./logo.svg"
import { Counter } from "./features/counter/Counter"
//import { PromptBuilder } from "./features/promptBuilder/PromptBuilder"
//import { PromptGallery } from "./features/promptGallery/PromptGallery"
//import { TourBuilder } from "./features/tourBuilder/TourBuilder"
import "./App.css"
import { store } from "./app/store";
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

import Home from './components/Home'
import Login from './components/Login'
import NoPage from './components/NoPage'
import Builder from './components/Builder'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="builder" element={<Builder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
