import React from "react";
import "./App.css";
import AlertMessage from "./components/api/api";
import Test from "./components/IndexedDB/IDB";

function App() {
   return (
      <div className="App">
         <Test />
         <AlertMessage />
      </div>
   );
}

export default App;
