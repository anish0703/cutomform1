import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormBuilderPage from "./pages/FormBuilderPage";
import PreviewPage from "./pages/PreviewPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormBuilderPage />} />
        <Route path="/form-builder" element={<FormBuilderPage />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
