import { useState } from "react";
import AppRoutes from "./AppRoutes";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AppRoutes />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
    </>
  );
}

export default App;
