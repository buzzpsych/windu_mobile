import React, { useState } from "react";
import {
  View,
  SectionList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Text } from "react-native-elements";
import CalendarStrip from "react-native-calendar-strip";
import { useQuery } from "@apollo/client";
import moment from "moment";
import _ from "lodash";
import PlanActivityModal from "../../../components/PlanActivityModal";
import { GET_PLANNED_ACTIVITY } from "../../../graphql/queries/activity/getPlannedActivity";
import Item from "./Item";

const PlannerActivity = () => {
  const [plannedActivities, setPlannedActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const modalizeRef = React.useRef();
  const windowHeight = Dimensions.get("window").height;

  const { loading, data, refetch } = useQuery(GET_PLANNED_ACTIVITY, {
    fetchPolicy: "cache-and-network",
    onError: (error) => toast.show(String(error), { type: "error" }),
  });

  React.useEffect(() => {
    if (data) {
      const { getPlannedActivity } = data;

      const dates = _.uniq(
        _.flatMap(getPlannedActivity, (activity) => {
          return moment(new Date(activity.planned_date)).format("MM/DD/YY");
        })
      );

      const dataFormat = _.map(dates, (date, index) => {
        return {
          _id: index,
          title: date,
          data: _.filter(
            getPlannedActivity,
            (activity) =>
              moment(new Date(activity.planned_date)).format("MM/DD/YY") ===
              date
          ),
        };
      });

      setPlannedActivities(dataFormat);
    }
  }, [data]);

  const handleChange = (date) => {
    setSelectedDate(date);
    modalizeRef.current?.open();
  };

  const keyExtractor = (item) => item._id;

  const datesBlacklistFunc = (date) =>
    moment(new Date(date)).isBefore(new Date());

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#F5A623" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {_.size(plannedActivities) <= 0 ? (
        <View
          style={{
            flex: 3,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Text h4 style={{ textAlign: "center", color: "#989898" }}>
            No activities
          </Text>
        </View>
      ) : (
        <View
          style={{
            height: windowHeight - 220,
          }}
        >
          <SectionList
            keyExtractor={keyExtractor}
            sections={plannedActivities}
            renderItem={({ item }) => {
              return <Item item={item} />;
            }}
            renderSectionHeader={({ section: { title } }) => (
              <Text
                h4
                style={{
                  marginLeft: 20,
                  height: 50,
                  textAlignVertical: "center",
                  color: "#989898",
                }}
              >
                {title}
              </Text>
            )}
            renderScrollComponent={() => (
              <RefreshControl
                onRefresh={() => refetch()}
                refreshing={loading}
              />
            )}
          />
        </View>
      )}
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
        iconContainer={{ flex: 0.1 }}
        scrollable={true}
        selectedDate={moment(new Date())}
        onDateSelected={handleChange}
        datesBlacklist={datesBlacklistFunc}
      />
      <PlanActivityModal
        modalizeRef={modalizeRef}
        selectedDate={selectedDate}
      />
    </SafeAreaView>
  );
};

export default PlannerActivity;
