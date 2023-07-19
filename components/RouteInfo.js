import React, { useEffect, useRef, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";

import BottomSheet from "@gorhom/bottom-sheet";
import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
} from "victory-native";
import { AntDesign } from "@expo/vector-icons";

export default function RouteInfo({
  route,
  color,
  setLocacationInputActive,
  setRouteInfoActive,
}) {
  // bottomShelf variables
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["40%"], []);

  const handlePress = () => {
    setLocacationInputActive(true);
    setRouteInfoActive(false);
  };

  return (
    <>
      <BottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        backgroundStyle={styles.backgroundCol}
      >
        <View style={styles.container}>
          <Text style={styles.smallText}>Elevation Graph</Text>
          <View style={styles.graphContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              height={180}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
              padding={{ top: 25, bottom: 50, left: 50, right: 40 }}
            >
              <VictoryLabel
                text="Elevation (m)"
                x={10}
                y={75}
                angle={270}
                textAnchor="middle"
                style={{ fill: "#e1e1e1" }}
              />
              <VictoryLabel
                text="Distance (km)"
                x={185}
                y={165}
                textAnchor="middle"
                style={{ fill: "#e1e1e1" }}
              />
              <VictoryLine
                style={{
                  data: { stroke: color },
                  parent: { border: "1px solid #ccc" },
                }}
                data={route.elevDist}
              />
            </VictoryChart>
          </View>
          <View
            style={{
              margin: 40,
              padding: 10,
              borderTopWidth: 2,
              borderTopColor: "#515151",
              width: "90%",
              alignItems: "center",
            }}
          >
            <Text style={styles.smallText}>
              {"Total Time: " + secondsToHms(route.time)}
            </Text>
            <Text style={styles.smallText}>
              {"Total Distance: " +
                Math.round(route.distance / 100) / 10 +
                " km"}
            </Text>
          </View>
        </View>
      </BottomSheet>
      <View style={styles.backBtnParent}>
        <TouchableOpacity onPress={handlePress}>
          <AntDesign name="leftcircleo" size={32} color="#e1e1e1" />
        </TouchableOpacity>
      </View>
    </>
  );
}

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);

  var hDisplay = h > 0 ? h + " hr " : "";
  var mDisplay = m > 0 ? m + " min" : "";
  return hDisplay + mDisplay;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 0,
    paddingTop: 0,
  },
  graphContainer: {
    flex: 1,
    paddingLeft: 30,
  },
  smallText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#e1e1e1",
  },
  backgroundCol: {
    backgroundColor: "#222222",
    // backgroundColor: "rgba(34, 34, 34, 0.9)",
  },
  backBtnParent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: 15,
  },
});
