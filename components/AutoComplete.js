import React, { useRef } from "react";
import { StyleSheet } from "react-native";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { API_KEY } from "../keys/Key";

export default function AutoComplete({ onPress, placeholder }) {
  //autocomplete vars
  const autocompleteRef = useRef(null);
  return (
    <GooglePlacesAutocomplete
      ref={autocompleteRef}
      enablePoweredByContainer={false}
      fetchDetails={true}
      styles={{
        textInput: {
          backgroundColor: "#222222",
          borderRadius: 5,
          paddingVertical: 5,
          paddingHorizontal: 10,
          fontSize: 16,
          fontWeight: "400",
          flex: 1,
        },
        row: {
          backgroundColor: "#222222",
          padding: 13,
          height: 44,
          flexDirection: "row",
        },
        description: { color: "#e1e1e1" },
        separator: {
          height: 0.5,
          backgroundColor: "gray",
        },
      }}
      placeholder={placeholder}
      textInputProps={{
        placeholderTextColor: "#515151",
        color: "#e1e1e1",
        clearButtonMode: "never",
      }}
      listViewDisplayed={false}
      nearbyPlacesAPI="GooglePlacesSearch"
      query={{
        key: API_KEY, 
        language: "en",
        components: "country:uk", //restrict results to uk only
        location: "55.9533456, -3.1883749",
        radius: "500",
      }}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        let lat = details.geometry.location.lat;
        let long = details.geometry.location.lng;
        let address = autocompleteRef.current?.getAddressText();
        console.log(lat, long, address);
        onPress(lat, long, address);
      }}
      onFail={(error) => console.error(error)}
      debounce={200}
    />
  );
}

const styles = StyleSheet.create({});
