import React from "react";
import { BrowserRouter} from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar";
import Routing from "./Routing";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
  );
}

export default App;
