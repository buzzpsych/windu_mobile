import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {
  REGISTER_DEVICE,
  UNREGISTER_DEVICE,
} from "../graphql/mutations/device/registerDevice";
import { readData, saveData } from "../store/utils";

export const registerPushNotifications = async (client, user_id) => {
  const { status: existingStatus } =
    await Notifications.requestPermissionsAsync();
  let finalStatus = existingStatus;

  try {
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") return;

    const token = await Notifications.getExpoPushTokenAsync();

    const previousToken = await readData("@pushToken");

    if (previousToken && previousToken === token.data)
      return console.log("Push Token exist");

    if (previousToken && previousToken !== token.data) {
      await client.mutate({
        fetchPolicy: "no-cache",
        mutation: UNREGISTER_DEVICE,
        variables: { token: previousToken },
      });
    }

    const input = {
      deviceYear: Constants.deviceYearClass.toString(),
      systemVersion: Platform.Version.toString(),
      devicePlatform: Platform.OS.toUpperCase(),
      deviceName: Constants.deviceName,
      user_id,
      token: token.data,
    };

    const { data } = await client.mutate({
      fetchPolicy: "no-cache",
      mutation: REGISTER_DEVICE,
      variables: { input },
    });

    if (data.registerDevice) await saveData("@pushToken", token.data);
  } catch (error) {
    alert(error);
  }
};
