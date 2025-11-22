import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppLayout from "./components/AppLayout";
import Cart from "./pages/Cart";
import Account from "./pages/Account";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cart" element={<Cart/>} />
          <Route path="profile" element={<Account />} />
        </Route>
        <Route
          path="*"
          element={<div style={{ padding: "2rem" }}>Page not found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
