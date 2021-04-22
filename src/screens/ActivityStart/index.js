import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import Animated, { set } from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const AnimatedView = Animated.View;

const songCoverSizes = [
  Dimensions.get("window").width,
  Dimensions.get("window").width - 60,
];
const songCoverTopPositions = [
  70,
  Dimensions.get("window").width / 2 - songCoverSizes[1] / 2,
];
const songCoverLeftPositions = [
  0,
  Dimensions.get("window").width / 2 - songCoverSizes[1] / 2,
];
const snapPoints = [
  100,
  songCoverSizes[1] + songCoverTopPositions[1] + 15 + 24 + 10 + 30 + 28,
];

const ActivityStart = ({ children, show, onCloseEnd }) => {
  let bottomSheetRef = React.createRef();
  let fall = new Animated.Value(1);

  const [isOpen, setIsopen] = React.useState(false);
  useEffect(() => {
    if (show) {
      bottomSheetRef.current?.snapTo(1);
    }
  }, [show]);
  const animatedSongCoverTopPosition = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: songCoverTopPositions.slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const animatedSongCoverSize = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [100, songCoverSizes[1]].slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const animatedWidth = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [100, songCoverSizes[1]].slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const animatedBorderRadius = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [0, 100],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const animatedHeaderContentOpacity = Animated.interpolate(fall, {
    inputRange: [0.75, 1],
    outputRange: [0, 1],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const onHeaderPress = () => {
    bottomSheetRef.current?.snapTo(1);
  };

  const renderFormContent = () => {
    const animatedSongCoverLeftPosition = Animated.interpolate(fall, {
      inputRange: [0, 1],
      outputRange: songCoverLeftPositions.slice().reverse(),
      extrapolate: Animated.Extrapolate.CLAMP,
    });

    return (
      <AnimatedView
        key={"song-cover-container"}
        style={[
          styles.songCoverContainer,
          {
            height: animatedSongCoverSize,
            width: animatedWidth,
            left: animatedSongCoverLeftPosition,
            right: 0,
            margin: "auto",
            top: animatedSongCoverTopPosition,
            borderRadius: animatedBorderRadius,
            backgroundColor: "#62C376",
            flex: 1,
          },
        ]}
      >
        <View style={[styles.songCoverImage]}>{show && <Text>Form</Text>}</View>
      </AnimatedView>
    );
  };

  const renderForm = () => {
    const animatedBackgroundOpacity = Animated.sub(
      1,
      animatedHeaderContentOpacity
    );
    return [
      <TouchableWithoutFeedback
        key={"header-container"}
        onPress={onHeaderPress}
      >
        <AnimatedView style={styles.headerContainer}>
          <AnimatedView
            style={[
              styles.headerBackground,
              {
                opacity: animatedBackgroundOpacity,
              },
            ]}
          >
            {renderHandler()}
          </AnimatedView>
        </AnimatedView>
      </TouchableWithoutFeedback>,
      renderFormContent(),
    ];
  };

  const renderShadow = () => {
    const animatedShadowOpacity = Animated.interpolate(fall, {
      inputRange: [0, 1],
      outputRange: [0.5, 0],
    });

    return (
      <AnimatedView
        pointerEvents="none"
        style={[
          styles.shadowContainer,
          {
            opacity: animatedShadowOpacity,
          },
        ]}
      />
    );
  };

  const renderHandler = () => {
    const animatedBar1Rotation = (outputRange) =>
      Animated.interpolate(fall, {
        inputRange: [0, 1],
        outputRange: outputRange,
        extrapolate: Animated.Extrapolate.CLAMP,
      });

    return (
      <View style={styles.handlerContainer}>
        <AnimatedView
          style={[
            styles.handlerBar,
            {
              left: -7.5,
              transform: [
                {
                  rotate: Animated.concat(
                    // @ts-ignore
                    animatedBar1Rotation([0.3, 0]),
                    "rad"
                  ),
                },
              ],
            },
          ]}
        />
        <AnimatedView
          style={[
            styles.handlerBar,
            {
              right: -7.5,
              transform: [
                {
                  rotate: Animated.concat(
                    // @ts-ignore
                    animatedBar1Rotation([-0.3, 0]),
                    "rad"
                  ),
                },
              ],
            },
          ]}
        />
      </View>
    );
  };
  return (
    <View
      style={{
        position: "absolute",
        zIndex: 99,
        bottom: 100,
        width: "100%",
        alignSelf: "center",
        shadowColor: "black",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3, //Because shadow only work on iOS, elevation is same thing but for android.
      }}
    >
      <View style={{ left: 0, right: 0, margin: "auto" }}>
        {
          <Image
            style={{ height: 30, width: 30, zIndex: 9999 }}
            source={{
              uri:
                "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/play_mobile.png",
            }}
            resizeMode="contain"
          />
        }
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        initialSnap={0}
        callbackNode={fall}
        snapPoints={snapPoints}
        renderHeader={renderForm}
        onCloseEnd={onCloseEnd}
        onOpenEnd={() => setIsopen(true)}
        enabledBottomInitialAnimation={true}
      />
      {renderShadow()}
    </View>
  );
};

const styles = StyleSheet.create({
  // Screen
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },

  // Shadow
  shadowContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },

  contentBackground: {
    ...StyleSheet.absoluteFillObject,
  },

  // Header
  headerContainer: {
    height: snapPoints[0],
  },

  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },

  // Handler
  handlerContainer: {
    position: "absolute",
    alignSelf: "center",
    top: 10,
    height: 20,
    width: 20,
  },

  handlerBar: {
    position: "absolute",
    backgroundColor: "#F5A623",
    top: 5,
    borderRadius: 3,
    height: 5,
    width: 20,
  },

  // Song
  songCoverContainer: {
    position: "absolute",
    top: 0,
    left: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15.0,
  },

  songCoverImage: {
    width: "100%",
    height: "100%",
  },
});

export default ActivityStart;
