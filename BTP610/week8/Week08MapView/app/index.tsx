import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from 'react-native-maps';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React from "react";

// npm install react-native-maps

type Attraction = {
  name: string,
  lat: number,
  lng: number
}

const attractionsList: Attraction[] = [
  {
    name: "Sydney Opera House",
    lat: -33.856159,
    lng: 151.215256
  },
  {
    name: "Great Barrier Reef",
    lat: -18.156290,
    lng: 147.485962
  },
  {
    name: "Uluru-Kata Tjuta National Park",
    lat: -25.344490,
    lng: 131.035431
  },
  {
    name: "CN Tower",
    lat: 43.64272,
    lng: -79.38705
  },
  {
    name: "Blue Mountains National Park",
    lat: -33.733333,
    lng: 150.316667
  },
  {
    name: "Cradle Mountain-Lake St. Clair National Park",
    lat: -41.650000,
    lng: 145.950000
  }
]

export default function Index() {

  const displayRegion: Region = {
    latitude: 29.97936,
    longitude: 31.13482,
    latitudeDelta: 0.0045,
    longitudeDelta: 0.0065
  }

  const [markerList, setMarkerList] = useState<Attraction[]>([])

  const mapRef = useRef<MapView>(null)

  const addMarker = () => {
    if (mapRef.current === null) {
      return
    }

    // Pick random attraction
    const pos = Math.floor(Math.random() * (attractionsList.length) + 0)
    const selected = attractionsList[pos]

    // Add attraction to the MarkerList
    markerList.push(selected)
    console.log(markerList)
    setMarkerList([...markerList])

    // Move the map to be centered on that attraction
    mapRef.current.animateToRegion({ latitude: selected.lat, longitude: selected.lng, latitudeDelta: 1, longitudeDelta: 1 })
  }

  const clearMarkers = () => {
    if (mapRef.current === null) {
      return
    }

    setMarkerList([])

    mapRef.current.animateToRegion({ latitude: 43.64272, longitude: -79.38705, latitudeDelta: 0.0045, longitudeDelta: 0.0065 })
  }

  const zoomToLocation = () => {
    if (mapRef.current === null) {
      return
    }

    mapRef.current.animateToRegion({ latitude: 43.73388, longitude: 7.42799, latitudeDelta: 0.05, longitudeDelta: 0.05 })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonStyle} onPress={addMarker}>
        <Text style={styles.buttonText}>Add Marker</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonStyle} onPress={clearMarkers}>
        <Text style={styles.buttonText}>Clear Marker</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonStyle} onPress={zoomToLocation}>
        <Text style={styles.buttonText}>Zoom To Location</Text>
      </TouchableOpacity>
      <MapView
        style={{ flex: 1 }}
        zoomControlEnabled={true}
        initialRegion={displayRegion}
        ref={mapRef}
      >
        {
          markerList.map((location, index) => {
            return (
              <Marker key={index}
                coordinate={{ latitude: location.lat, longitude: location.lng }}>
                <FontAwesome6 name="building-columns" size={24} color="red" />
              </Marker>
            )
          })
        }
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20
  },
  buttonStyle: {
    marginVertical: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'rgba(238, 82, 83, 0.7)'
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700'
  },
});
