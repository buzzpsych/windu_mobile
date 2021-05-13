import React from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Timer from "./Timer";
import ContinueActivity from "./ContinueActivity";
import PlannerActivity from "./PlannerActivity";

const Tab = createMaterialTopTabNavigator();

const ActivityActions = () => {
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: { top: insets.top },
    tabBackground: {
      backgroundColor: "#F0F2F5",
      shadowOpacity: 0,
      elevation: 0,
    },
    indicator: { backgroundColor: "#F5A623" },
  });

  return (
    <Tab.Navigator
      tabBarOptions={{
        showIcon: true,
        style: styles.tabBackground,
        tabStyle: styles.tab,
        activeTintColor: "#F5A623",
        indicatorStyle: styles.indicator,
      }}
      style={styles.container}
      initialRouteName="Timer"
    >
      <Tab.Screen name="Timer" component={Timer} />
      <Tab.Screen name="Continue" component={ContinueActivity} />
      <Tab.Screen name="Plan" component={PlannerActivity} />
    </Tab.Navigator>
  );
};

export default ActivityActions;
