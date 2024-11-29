import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Homepage />
            </>
          }
        />
        <Route path="/agenda" element={<Agenda />} />
      </Routes>
    </Router>
  );
};

export default App;
