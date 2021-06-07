import React, { useEffect } from "react";
import { Text } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { useTimer } from "../../common/useTimer";
import { head, last } from "lodash";

const AvatarTimer = ({ timer }) => {
  const [expanded, setExpanded] = React.useState(false);
  const { startHandler, time } = useTimer("00:00:00");

  const avatarSrc =
    timer.created_by.avatar ||
    `https://ui-avatars.com/api/?name=${timer.created_by.full_name}`;

  useEffect(() => {
    if (head(timer.time.paused)?.continue !== undefined) {
      const continueAt = last(timer?.time.paused)?.continue;

      startHandler(continueAt);
    } else {
      const startTime = timer?.time?.start;

      startHandler(startTime);
    }
  }, [timer]);

  return (
    <ListItem.Accordion
      content={
        <>
          <Avatar
            rounded
            source={{ uri: avatarSrc }}
            containerStyle={{ marginRight: 20 }}
          />
          <ListItem.Content>
            <ListItem.Title>{timer.created_by.full_name}</ListItem.Title>
            <ListItem.Subtitle>{timer.created_by.email}</ListItem.Subtitle>
          </ListItem.Content>
          <Text style={{ color: "#62C376" }}>{time}</Text>
        </>
      }
      isExpanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
      }}
    >
      <ListItem style={{ paddingHorizontal: 20, backgroundColor: "white" }}>
        <ListItem.Content>
          <ListItem.Title>{timer.title}</ListItem.Title>
          <ListItem.Subtitle>{timer.description}</ListItem.Subtitle>
        </ListItem.Content>
        <Text style={{ color: "#62C376" }}>{timer.project.title}</Text>
      </ListItem>
    </ListItem.Accordion>
  );
};
export default AvatarTimer;
