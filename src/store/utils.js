import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveData = async (field, v) => {
  try {
    await AsyncStorage.setItem(field, v);
  } catch (e) {
    alert("Failed to save the data to the storage");
  }
};
export const readData = (field) => {
  try {
    const token = AsyncStorage.getItem(field);
    return token;
  } catch (e) {
    alert("Failed to fetch the data from storage");
  }
};

export const clearStorage = async () => {
  try {
    return await AsyncStorage.clear();
  } catch (e) {
    alert("Failed to clear the async storage.");
  }
};
