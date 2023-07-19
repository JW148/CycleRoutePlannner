import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";

import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

import AutoComplete from "./AutoComplete";
import Button from "./Button";
import { getRoute } from "../utils/RouteRequest";

export default function LocationInput({
  fromLocation,
  setFromLocation,
  toLocation,
  setToLocation,
  mapRef,
  setRoutes,
  profile,
  setProfile,
  setLoading,
  setLocacationInputActive,
  setRouteInfoActive,
  setNav,
  setMidpoint,
}) {
  // bottomShelf variables
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["10%", "40%"], []);
  // const [snapPoints, setSnapPoints] = useState(["20%"]);

  ////////// location input functions ///////////

  handleFromLocation = (lat, long, address) => {
    mapRef.current.animateToRegion(setAnimateTo(lat, long, 0.01, 0.01), 1000);
    setFromLocation({
      latitude: lat,
      longitude: long,
      address: address,
      set: true,
    });
  };

  handleToLocation = (lat, long, address) => {
    let latitude = (lat + fromLocation.latitude) / 2 - 0.005;
    let longitude = (long + fromLocation.longitude) / 2;
    let latDelta = Math.abs(lat - fromLocation.latitude) * 2.2;
    let longDelta = Math.abs(long - fromLocation.longitude) * 1.4;

    mapRef.current.animateToRegion(
      setAnimateTo(latitude, longitude, latDelta, longDelta),
      1000
    );
    setToLocation({
      latitude: lat,
      longitude: long,
      address: address,
      set: true,
    });
    setMidpoint({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta,
    });
  };

  //once to location has been entered, load the routes (listen for change with a useEffect hook on the
  //to location state). (Loads on component first mount even though the state hasn't changed)
  //*** I think this is what's causing the routes to reload when going back from the routeInfo page
  useEffect(() => {
    if (toLocation.set) {
      setLoading(true);
      console.log("loading routes...");
      getRoute(fromLocation, toLocation)
        .then((route) => {
          setRoutes(route);
          setLoading(false);
          bottomSheetRef.current.expand();
          console.log("routes loaded!");
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }, [toLocation]);

  //helper function to set the region of the map to animate to
  setAnimateTo = (lat, long, latDelta, longDelta) => {
    return {
      latitude: lat,
      longitude: long,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta,
    };
  };

  //clearing the from location also clears the to location (may want to change this)
  clearFromLocation = () => {
    setFromLocation({
      latitude: 0,
      longitude: 0,
      address: "Enter start location above",
      set: false,
    });
    setToLocation({
      latitude: 0,
      longitude: 0,
      address: "Enter destination above",
      set: false,
    });
    mapRef.current.animateToRegion(
      setAnimateTo(55.9533456, -3.1883749, 0.0922, 0.0421),
      1000
    );
    setRoutes(null);
  };
  clearToLocation = () => {
    setToLocation({
      latitude: 0,
      longitude: 0,
      address: "Enter destination above",
      set: false,
    });
    mapRef.current.animateToRegion(
      setAnimateTo(fromLocation.latitude, fromLocation.longitude, 0.01, 0.01),
      1000
    );
    setRoutes(null);
  };

  //handles changing between the different components when the 'i' button is pressed
  handleOnPress = () => {
    setLocacationInputActive(false);
    setRouteInfoActive(true);
  };

  //
  startNav = () => {
    console.log("pressed");
    setLocacationInputActive(false);
    setRouteInfoActive(false);
    setNav(true);
  };

  return (
    <>
      <View style={styles.locationSearch}>
        {fromLocation.set ? (
          <View style={styles.locationText}>
            <Text
              style={{
                alignSelf: "center",
                paddingVertical: 5,
                paddingHorizontal: 10,
                fontSize: 16,
                color: "#e1e1e1",
                width: "90%",
              }}
            >
              {fromLocation.address}
            </Text>
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={clearFromLocation}
            >
              <AntDesign name="closecircle" size={24} color="#e1e1e1" />
            </TouchableOpacity>
          </View>
        ) : (
          <AutoComplete
            onPress={handleFromLocation}
            placeholder="Enter start location"
          />
        )}
      </View>
      {fromLocation.set && (
        <View style={[styles.locationSearch, { top: "13%" }]}>
          {toLocation.set ? (
            <View style={styles.locationText}>
              <Text
                style={{
                  alignSelf: "center",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  fontSize: 16,
                  color: "#e1e1e1",
                  width: "90%",
                }}
              >
                {toLocation.address}
              </Text>
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={clearToLocation}
              >
                <AntDesign name="closecircle" size={24} color="#e1e1e1" />
              </TouchableOpacity>
            </View>
          ) : (
            <AutoComplete
              onPress={handleToLocation}
              placeholder="Enter destination location"
            />
          )}
        </View>
      )}
      <BottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        backgroundStyle={{ backgroundColor: "#222222", borderRadius: 8 }}
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,

          elevation: 10,
        }}
      >
        <View style={styles.btmSheetContainer}>
          <View style={styles.pickerContainer}>
            <View
              style={{
                alignItems: "center",
                margin: 0,
                paddingBottom: 8,
                borderBottomWidth: 2,
                borderBottomColor: "#515151",
                marginHorizontal: 10,
              }}
            >
              <Text style={styles.text}>Routing Profile</Text>
            </View>
            <Picker
              selectedValue={profile}
              onValueChange={(itemValue, itemIndex) => setProfile(itemValue)}
              itemStyle={{
                height: 130,
              }}
              style={{
                borderBottomWidth: 2,
                borderBottomColor: "#515151",
                marginHorizontal: 10,
                marginBottom: 10,
              }}
              numberOfLines={1}
            >
              <Picker.Item label="Avoid Cobbles" value={0} color="#c6282b" />
              <Picker.Item label="Safest" value={1} color="#00b97b" />
              <Picker.Item label="Quickest" value={2} color="#303f9f" />
            </Picker>
            <View style={styles.btnContainer}>
              <Button
                title="Start Route"
                disabled={toLocation.set}
                onPress={startNav}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.infoBtn}
          onPress={handleOnPress}
          disabled={!toLocation.set}
        >
          <MaterialCommunityIcons
            name="information"
            size={24}
            color={toLocation.set ? "#e1e1e1" : "#515151"}
          />
        </TouchableOpacity>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  locationSearch: {
    flex: 1,
    padding: 10,
    top: "5%",
    position: "absolute",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0)",
  },
  btmSheetContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  closeBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  btnContainer: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "400",
    color: "#e1e1e1",
    marginLeft: 10,
    marginBottom: 0,
    marginTop: 0,
  },
  pickerContainer: {
    justifyContent: "flex-start",
  },
  locationText: {
    height: 40,
    backgroundColor: "rgba(34, 34, 34, 0.8)",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clearBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  infoBtn: {
    position: "absolute",
    top: 87,
    right: 25,
  },
});
