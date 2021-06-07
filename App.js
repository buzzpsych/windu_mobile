import React from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ActivityAction from "./src/components/ActivityAction";
import CurrentTimer from "./src/components/CurrentTimer";
import { Routes } from "./src/navigation/Routes";
import { TimerProvider } from "./src/contexts/timer-context";

const App = () => {
  const [navState, setNavState] = React.useState(null);

  /*   if (newUser)
    return (
      <SafeAreaProvider>
        <HomeOnboard handleOnClosePress={() => setNewUser(false)} />
      </SafeAreaProvider>
    ); */

  return (
    <SafeAreaProvider>
      <TimerProvider initialTime={"00:00:00"} throttling={1000}>
        <ActivityAction />
        {/* <CurrentTimer currentRoute={navState} /> */}
        <Routes setNavState={setNavState} />
      </TimerProvider>
    </SafeAreaProvider>
  );
};

export default App;
