import React from "react";
import Search from "./components/Search";
import { useState } from "react";

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="wrapper">
      <header>
        <img className="w-100 h-100" src="./movies-banner.jpg" alt="Movies Banner"/>
        <h1>
          Find <span className="text-gradient">Movies</span> that you'd love here without efforts!
        </h1>
        
      </header>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
    </div>
  )
}

export default App