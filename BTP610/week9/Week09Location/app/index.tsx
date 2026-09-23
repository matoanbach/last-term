import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Region, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import React from "react";

// npx expo install expo-location
// npx expo install react-native-maps

export default function Index() {

  const [region, setRegion] = useState<Region | null>({
    latitude: 29.97936,
    longitude: 31.13482,
    latitudeDelta: 0.0045,
    longitudeDelta: 0.0065
  });
  const [currentAddress, setCurrentAddress] = useState("");
  const [address, setAddress] = useState("");

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if(status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access to continue");
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest
    });

    const newRegion: Region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0045,
      longitudeDelta: 0.0065
    };

    console.log(`${location.coords.latitude} - ${location.coords.longitude}`)

    setRegion(newRegion);

    reverseGeocode(location.coords.latitude, location.coords.longitude);
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    const result = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng
    });

    /*
    [
      {
        "city": "Toronto", 
        "country": "Canada", 
        "district": "Old Toronto", 
        "formattedAddress": "290 Bremner Blvd, Toronto, ON M5V 3L9, Canada", 
        "isoCountryCode": "CA", 
        "name": "290", 
        "postalCode": "M5V 3L9", 
        "region": "Ontario", 
        "street": "Bremner Boulevard", 
        "streetNumber": "290", 
        "subregion": "Toronto", 
        "timezone": null
      }
    ]
    */

    if(result.length > 0) {
      console.log(result);
      // const add = result[0].name + "," +
      // result[0].city + "," +
      // result[0].region + "," +
      // result[0].country

      const add = result[0].formattedAddress+ "";

      setCurrentAddress(add);
    }
  }

  const forwardGeocoding = async () => {
    const result = await Location.geocodeAsync(address);

    if(result.length === 0) {
      Alert.alert("Lat/Lng not found");
      return;
    }

    const lat = result[0].latitude;
    const lng = result[0].longitude;

    const newRegion: Region = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0045,
      longitudeDelta: 0.0065
    };

    setCurrentAddress(`${lat} , ${lng}`);

    setRegion(newRegion);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Example</Text>

      <TextInput
        style={styles.input}
        value={address}
        placeholder="Enter Address"
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.button} onPress={forwardGeocoding}>
        <Text style={styles.buttonText}>Forward Geocoding</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
        <Text style={styles.buttonText}>Get Current Location</Text>
      </TouchableOpacity>

      { currentAddress !== "" && (
        <Text style={styles.textAddress}>Address: {currentAddress}</Text>
      )}

      { region && (
        <MapView style={styles.map} region={region}>
          <Marker 
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude
            }}
            title="Selected Location"
            description={currentAddress} />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'dodgerblue'
  },
  input: {
    borderWidth: 1,
    borderColor: 'dodgerblue',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%'
  },
  button: {
    backgroundColor: 'dodgerblue',
    width: '80%',
    borderRadius: 25,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: 10
  },
  textAddress: {
    fontSize: 18,
    color: 'orange'
  }
})
