import React from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ActivityAction from "./src/components/ActivityAction";
import { Routes } from "./src/navigation/Routes";
import { TimerProvider } from "./src/contexts/timer-context";

const App = () => {
  const [navState, setNavState] = React.useState(null);

  return (
    <SafeAreaProvider>
      <TimerProvider initialTime={"00:00:00"} throttling={1000}>
        <ActivityAction />
        <Routes setNavState={setNavState} />
      </TimerProvider>
    </SafeAreaProvider>
  );
};

export default App;
