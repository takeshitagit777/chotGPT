import { useApp } from "./store";
import TopPage from "./components/TopPage";
import RacePage from "./components/RacePage";

export default function App() {
  const screen = useApp((s) => s.screen);
  return screen === "top" ? <TopPage /> : <RacePage />;
}
