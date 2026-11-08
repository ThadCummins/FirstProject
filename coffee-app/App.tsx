// The app's entry point. For now it shows one screen; later we'll add
// navigation between several screens here.

import { StatusBar } from "expo-status-bar";
import TrackerScreen from "./src/screens/TrackerScreen";

export default function App() {
  return (
    <>
      <TrackerScreen />
      <StatusBar style="auto" />
    </>
  );
}
