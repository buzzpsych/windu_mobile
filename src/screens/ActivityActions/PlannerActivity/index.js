import React, { useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import Button from "../../../components/Button";
import OverlayMenu from "../../../components/OverlayMenu";
import PlanActivityModal from "../../../components/PlanActivityModal";

import { styles } from "../styles";

const data = [
  {
    title: "Planned Activity",
    project: "project ",
  },
  {
    title: "Planned Activity",
    project: "project ",
  },
  {
    title: "Planned Activity",
    project: "project ",
  },
  {
    title: "Planned Activity",
    project: "project ",
  },
  {
    title: "Planned Activity",
    project: "project ",
  },
  {
    title: "Planned Activity",
    project: "project ",
  },
  {
    title: "Planned Activity",
    project: "project ",
  },
];

const PlannerActivity = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const handleChange = (d) => {
    console.log("Request date", d);
  };
  const handleMenuItemSelect = () => {
    setShowPlanModal(true);
    setShowMenu(false);
  };
  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "white",
        marginBottom: 10,
        width: "100%",
        padding: 10,
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{ height: 20, width: 20, marginRight: 5 }}
          source={{
            uri:
              "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/clock_gray.png",
          }}
          resizeMode="contain"
        />
        <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
      </View>
      <Text style={{ color: "#AFB0B1" }}>{item.project}</Text>
    </View>
  );

  return (
    <View style={[styles.page]}>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          paddingTop: 20,
          height: "65%",
          paddingBottom: 20,
        }}
      >
        <FlatList
          style={{ width: "80%" }}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View
        style={{ height: "30%", justifyContent: "flex-end", width: "100%" }}
      >
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "row",
            height: 50,
          }}
        >
          <Button onPress={() => setShowMenu(true)}>
            <Image
              style={{ height: 20, width: 20, marginRight: 5 }}
              source={{
                uri:
                  "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/yellow_elipsis.png",
              }}
              resizeMode="contain"
            />
          </Button>
        </View>
        <CalendarStrip
          calendarAnimation={{ type: "sequence", duration: 30 }}
          daySelectionAnimation={{
            type: "border",
            duration: 200,
            borderWidth: 1,
            borderHighlightColor: "#4E35C2",
          }}
          style={{
            height: 100,
            paddingTop: 20,
            paddingBottom: 10,
          }}
          calendarHeaderStyle={{ color: "white" }}
          calendarColor={"#F5A623"}
          dateNumberStyle={{ color: "white" }}
          dateNameStyle={{ color: "white" }}
          highlightDateNumberStyle={{ color: "#4E35C2" }}
          highlightDateNameStyle={{ color: "#4E35C2" }}
          disabledDateNameStyle={{ color: "grey" }}
          disabledDateNumberStyle={{ color: "grey" }}
          // iconLeft={require('./img/left-arrow.png')}
          //  iconRight={require('./img/right-arrow.png')}
          iconContainer={{ flex: 0.1 }}
          scrollable={true}
          selectedDate={moment()}
          onDateSelected={handleChange}
        />
        <OverlayMenu
          onPress={handleMenuItemSelect}
          options={[{ label: "Plan Activity", id: "plan" }]}
          visible={showMenu}
          onClose={() => setShowMenu(false)}
        />
      </View>
      <PlanActivityModal
        onclose={() => setShowPlanModal(false)}
        visible={showPlanModal}
      />
    </View>
  );
};

export default PlannerActivity;
