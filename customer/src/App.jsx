import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={<div style={{ padding: "2rem" }}>Page not found</div>}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
