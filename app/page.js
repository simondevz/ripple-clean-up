import Analytics from "./components/analytics";
import ListWCP from "./components/listWCP";

export default function Home() {
  return (
    <div className="flex border flex-row p-2">
      <Analytics />
      <ListWCP />
    </div>
  );
}
