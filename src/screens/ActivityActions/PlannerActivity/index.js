import React, { useState } from "react";
import {
  View,
  SectionList,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Text } from "react-native-elements";
import CalendarStrip from "react-native-calendar-strip";
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import _ from "lodash";
import PlanActivityModal from "../../../components/PlanActivityModal";
import { GET_PLANNED_ACTIVITY } from "../../../graphql/queries/activity/getPlannedActivity";
import { REMOVE_ACTIVITY } from "../../../graphql/mutations/activity/removeActivity";
import { START_PLAN_ACTIVITY } from "../../../graphql/mutations/activity/startPlanActivity";
import Item from "./Item";

const PlannerActivity = () => {
  const [plannedActivities, setPlannedActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activitySelected, setActivitySelected] = useState(null);
  const modalizeRef = React.useRef();
  const windowHeight = Dimensions.get("window").height;

  const { loading, data, refetch } = useQuery(GET_PLANNED_ACTIVITY, {
    fetchPolicy: "cache-and-network",
    onError: (error) => toast.show(String(error), { type: "danger" }),
  });

  const [removeActivity] = useMutation(REMOVE_ACTIVITY, {
    onCompleted: ({ removeActivity }) => {
      toast.show(`${removeActivity.title} removed`, { type: "success" });
    },
    refetchQueries: [
      {
        query: GET_PLANNED_ACTIVITY,
      },
    ],
  });

  const [startPlannedActivity] = useMutation(START_PLAN_ACTIVITY, {
    onCompleted: ({ startPlannedActivity }) => {
      toast.show(`${startPlannedActivity.title} started`, { type: "success" });
      navigation.navigate("Timer");
    },
    onError: (error) => toast.show(String(error), { type: "danger" }),
    refetchQueries: [
      {
        query: GET_PLANNED_ACTIVITY,
      },
    ],
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

  const onOpen = () => modalizeRef.current?.open();

  const handleChange = (date) => {
    setSelectedDate(date);
    setActivitySelected(null);
    onOpen();
  };

  const onStart = (_id) => {
    startPlannedActivity({
      variables: {
        input: {
          activity: _id,
          date_start: moment.utc(new Date()),
        },
      },
    });
  };

  const onRemove = (_id) => {
    removeActivity({
      variables: {
        activity: _id,
      },
    });
  };

  const onChangeDate = (item) => {
    setActivitySelected(item);
    onOpen();
  };

  const keyExtractor = (item) => item._id;

  const datesBlacklistFunc = (date) => {
    const today = moment(new Date()).format("MM/DD/YY");
    const calendarDate = moment(new Date(date)).format("MM/DD/YY");
    return moment(calendarDate).isBefore(today);
  };

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
            nestedScrollEnabled={true}
            keyExtractor={keyExtractor}
            sections={plannedActivities}
            renderItem={({ item }) => {
              return (
                <Item
                  item={item}
                  onRemove={onRemove}
                  onStart={onStart}
                  onChangeDate={onChangeDate}
                />
              );
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
            refreshing={loading}
            onRefresh={() => refetch()}
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
        activitySelected={activitySelected}
      />
    </SafeAreaView>
  );
};

export default PlannerActivity;
