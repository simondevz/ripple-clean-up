import Analytics from "./components/analytics";
import ListWCP from "./components/listWCP";

export default function Home() {
  return (
    <div className="flex lg:flex-row flex-col py-6 px-4">
      <Analytics />
      <ListWCP />
    </div>
  );
}
