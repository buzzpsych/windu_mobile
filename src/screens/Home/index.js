import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Badge } from "react-native-elements";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Timer from "./Timer";
import ContinueActivity from "./ContinueActivity";
import PlannerActivity from "./PlannerActivity";
import { navigationRef } from "../../common/rootNavigation";

const Tab = createMaterialTopTabNavigator();
const Home = ({ navigation, route }) => {
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
      ref={navigationRef}
    >
      <Tab.Screen name="Timer" component={Timer} />
      <Tab.Screen name="Continue" component={ContinueActivity} />
      <Tab.Screen name="Plan" component={PlannerActivity} />
    </Tab.Navigator>
  );
};

export default Home;
