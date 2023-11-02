import Link from "next/link";
import Header from "./components/header";
import Footer from "./components/footer";
import Content from "./components/content";

export default function Home() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
