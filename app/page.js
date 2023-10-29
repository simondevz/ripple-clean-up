import Analytics from "./components/analytics";
import ListWCP from "./components/listWCP";

export default function Home() {
  return (
    <div className="flex flex-row py-6 px-4">
      <Analytics />
      <ListWCP />
    </div>
  );
}
