import Header from "../components/header";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div className="page home-page">
      <Header />
      <main>
        <h2>Welcome to the Bookstore</h2>
        <p>Discover a variety of books and authors.</p>
      </main>
      <Footer />
    </div>
  );
}
