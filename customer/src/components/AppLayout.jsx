import { Outlet } from "react-router-dom";
import APIStatusIndicator from "./APIStatusIndicator";
import Footer from "./footer";
import Header from "./header";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <APIStatusIndicator />
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
