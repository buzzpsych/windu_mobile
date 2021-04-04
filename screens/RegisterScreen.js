import * as React from "react";
import { View, StyleSheet, Text, Button } from "react-native";

export default function RegisterScreen({ navigation }) {
  const onBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.getStartedContainer}>
        <Text style={styles.getStartedText}>Register Page</Text>
        <Text style={styles.getStartedText}>Register page for windu</Text>
        <Button
          onPress={onBack}
          title="Back"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    </View>
  );
}

RegisterScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingTop: 30,
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
});
