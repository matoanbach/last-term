import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const INITIAL_REGION = {
  latitude: 43.6532,
  longitude: -79.3832,
  latitudeDelta: 40,
  longitudeDelta: 40,
};

const MAP_ZOOM_REGION = {
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

type DreamEntry = {
  city: string;
  dreamActivity: string;
};

type CurrentMarker = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
};

export default function Index() {
  const mapRef = useRef<MapView>(null);

  const [city, setCity] = useState('');
  const [dreamActivity, setDreamActivity] = useState('');
  const [dreamList, setDreamList] = useState<DreamEntry[]>([]);
  const [currentMarker, setCurrentMarker] = useState<CurrentMarker | null>(null);
  const [coordinates, setCoordinates] = useState('');
  const [address, setAddress] = useState('');

  const resetInputs = () => {
    setCity('');
    setDreamActivity('');
  };

  const formatCoordinates = (latitude: number, longitude: number) => {
    return `Latitude: ${latitude.toFixed(4)} | Longitude: ${longitude.toFixed(4)}`;
  };

  const formatAddress = (place: Location.LocationGeocodedAddress) => {
    return [place.name, place.city, place.region, place.country].filter(Boolean).join(', ');
  };

  const addDreamTrip = () => {
    const trimmedCity = city.trim();
    const trimmedDreamActivity = dreamActivity.trim();

    if (trimmedCity === '' || trimmedDreamActivity === '') {
      Alert.alert('Missing Information', 'Please enter both the city and dream activity.');
      return;
    }

    const newEntry: DreamEntry = {
      city: trimmedCity,
      dreamActivity: trimmedDreamActivity,
    };

    setDreamList([...dreamList, newEntry]);
    resetInputs();
  };

  const clearList = () => {
    setDreamList([]);
    setCurrentMarker(null);
    setCoordinates('');
    setAddress('');
  };

  const goToRandomDream = async () => {
    if (dreamList.length === 0) {
      Alert.alert('No Destinations', 'Please add dream destinations first.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * dreamList.length);
    const selectedEntry = dreamList[randomIndex];

    try {
      const result = await Location.geocodeAsync(selectedEntry.city);

      if (result.length === 0) {
        Alert.alert('Location Not Found', 'Could not find that city on the map.');
        return;
      }

      const latitude = result[0].latitude;
      const longitude = result[0].longitude;

      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          ...MAP_ZOOM_REGION,
        },
        1200
      );

      setCurrentMarker({
        latitude,
        longitude,
        title: selectedEntry.city,
        description: selectedEntry.dreamActivity,
      });

      setCoordinates(formatCoordinates(latitude, longitude));

      const reverseResult = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (reverseResult.length > 0) {
        setAddress(formatAddress(reverseResult[0]));
      } else {
        setAddress('Address not found');
      }
    } catch {
      Alert.alert('Error', 'Unable to search for that destination right now.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          zoomControlEnabled
          initialRegion={INITIAL_REGION}>
          {currentMarker && (
            <Marker
              coordinate={{
                latitude: currentMarker.latitude,
                longitude: currentMarker.longitude,
              }}
              title={currentMarker.title}
              description={currentMarker.description}
            />
          )}
        </MapView>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter dream activity"
          value={dreamActivity}
          onChangeText={setDreamActivity}
        />

        <TouchableOpacity style={styles.button} onPress={addDreamTrip}>
          <Text style={styles.buttonText}>Add to Dream Trip</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.smallButton} onPress={clearList}>
            <Text style={styles.buttonText}>Clear List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={goToRandomDream}>
            <Text style={styles.buttonText}>Go to Random Dream</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>{coordinates || 'Coordinates: none'}</Text>
        <Text style={styles.infoText}>{address || 'Address: none'}</Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Dream Trip List</Text>
        <FlatList
          data={dreamList}
          keyExtractor={(item, index) => `${item.city}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listCity}>{item.city}</Text>
              <Text style={styles.listText}>{item.dreamActivity}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No dream destinations yet.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    minHeight: 280,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  smallButton: {
    flex: 1,
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  listContainer: {
    flex: 0.8,
    padding: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  listItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  listCity: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listText: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
  },
});
