import Footer from "../components/footer";
import Header from "../components/header";
import SearchBox from "../components/search_box";

export default function Home() {
  return (
    <div className="page home-page">
      <Header />
      <SearchBox />
      <main>
        <h2>Welcome to the Bookstore</h2>
        <p>Discover a variety of books and authors.</p>
      </main>
      <Footer />
    </div>
  );
}
