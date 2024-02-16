import React, { useEffect, useCallback, useState } from "react";
import "./App.css";

import { balance as principalBalance } from "./utils/ledger"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Users from "./pages/Users";
import Books from "./pages/Books";

const App = function AppWrapper() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
   
  );
};

export default App;
