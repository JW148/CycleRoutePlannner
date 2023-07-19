//React imports
import React, { useRef, useState} from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

//module imports
import MapView, { Marker, Polyline } from "react-native-maps";
import { AntDesign } from "@expo/vector-icons";

//local imports
import LocationInput from "./components/LocationInput";
import RouteInfo from "./components/RouteInfo";

export default function App() {
  // map variables
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 55.9533456,
    longitude: -3.1883749,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [fromLocation, setFromLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: "Enter start location above",
    set: false,
  });
  const [toLocation, setToLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: "Enter destination above",
    set: false,
  });
  const [nav, setNav] = useState(false);

  //route vars
  const [routes, setRoutes] = useState(null);
  const [profile, setProfile] = useState(1);

  //var for when the routes are loading
  const [loading, setLoading] = useState(false);

  //colours for the poly line component
  const polylineColours = ["#c6282b", "#00b97b", "#303f9f"];

  //var that stores the current active component to display (locationInput, routeInfo, nav)
  const [locationInputActive, setLocacationInputActive] = useState(true);
  const [routeInfoActive, setRouteInfoActive] = useState(false);

  //var used to store the region of the map to display between the start and end locations
  const [midpoint, setMidpoint] = useState(null);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        initialRegion={region}
        style={styles.container}
        onRegionChangeComplete={(region) => setRegion(region)}
        userInterfaceStyle={"dark"}
        showsUserLocation={nav}
        followsUserLocation={nav}
      >
        <Marker
          coordinate={{
            latitude: fromLocation.latitude,
            longitude: fromLocation.longitude,
          }}
        />
        <Marker
          coordinate={{
            latitude: toLocation.latitude,
            longitude: toLocation.longitude,
          }}
        />
        {routes && (
          <Polyline
            coordinates={routes[profile].coords}
            strokeColor={polylineColours[profile]}
            strokeWidth={3}
            interval={20}
          />
        )}
      </MapView>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" />
        </View>
      )}
      {locationInputActive && (
        <LocationInput
          fromLocation={fromLocation}
          toLocation={toLocation}
          setFromLocation={setFromLocation}
          setToLocation={setToLocation}
          mapRef={mapRef}
          setRoutes={setRoutes}
          profile={profile}
          setProfile={setProfile}
          setLoading={setLoading}
          setLocacationInputActive={setLocacationInputActive}
          setRouteInfoActive={setRouteInfoActive}
          setNav={setNav}
          setMidpoint={setMidpoint}
        />
      )}
      {routeInfoActive && (
        <RouteInfo
          route={routes[profile]}
          color={polylineColours[profile]}
          setLocacationInputActive={setLocacationInputActive}
          setRouteInfoActive={setRouteInfoActive}
        />
      )}
      {nav && (
        <View style={styles.backBtnParent}>
          <TouchableOpacity
            onPress={() => {
              setLocacationInputActive(true);
              setNav(false);
              mapRef.current.animateToRegion(midpoint, 1000);
            }}
          >
            <AntDesign name="leftcircleo" size={32} color="#e1e1e1" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    top: "45%",
    left: "47%",
  },
  locationSearch: {
    flex: 1,
    position: "absolute",
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
