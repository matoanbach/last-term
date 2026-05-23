import AntDesign from '@expo/vector-icons/AntDesign';
import { ImageBackground } from "expo-image";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Switch, Text, View } from "react-native";


type Song = {
  id: number;
  title: string;
  artist: string;
  imageURL: string;
  duration: number;
  isFavorite: boolean,
}

const popSongs: Song[] = [
  {
    id: 1,
    title: "Tears",
    artist: "Sabrina Carpenter",
    imageURL: "https://charts-static.billboard.com/img/2014/06/sabrina-carpenter-l0r-344x344.jpg",
    duration: 3,
    isFavorite: false,
  },
  {
    id: 2,
    title: "Golden",
    artist: "HUNTR/X",
    imageURL: "https://charts-static.billboard.com/img/2025/07/huntrxejaeaudreynunareiami-o2t-golden-ozh-180x180.jpg",
    duration: 5,
    isFavorite: true,
  },
  {
    id: 3,
    title: "Back To Friends",
    artist: "sombr",
    imageURL: "https://charts-static.billboard.com/img/2025/04/sombr-kpn-backtofriends-zqh-180x180.jpg",
    duration: 4,
    isFavorite: false,
  },
];

const rapSongs: Song[] = [
  {
    id: 103,
    title: "Changes",
    artist: "2Pac",
    imageURL: "https://charts-static.billboard.com/img/1992/02/2pac-u29-344x344.jpg",
    duration: 7,
    isFavorite: true,
  },
  {
    id: 82,
    title: "Denial is a River",
    artist: "Doechii",
    imageURL: "https://charts-static.billboard.com/img/2021/05/doechii-h8h-344x344.jpg",
    duration: 3,
    isFavorite: true,
  },
  {
    id: 4,
    title: "Alright",
    artist: "Kendrick Lamar",
    imageURL: "https://charts-static.billboard.com/img/2010/10/kendrick-lamar-2un-344x344.jpg",
    duration: 5,
    isFavorite: false,
  },
];


export default function Index() {

  const [songsToDisplay, setSongsToDisplay] = useState<Song[]>(popSongs)
  const [showPopSong, setShowPopSong] = useState<boolean>(true)

  // Keep the switch selection separate so the submit button controls when the list updates.
  const btnPressed = () => {
    setSongsToDisplay(showPopSong ? popSongs : rapSongs)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.textPrimary}>Do you want to listen to pop music?</Text>
      <View style={styles.switchContainer}>
        <Switch value={showPopSong} onValueChange={setShowPopSong} />
      </View>
      <Button title="Submit" onPress={btnPressed} />

      {songsToDisplay.map((song) => (
        <View key={song.id} style={styles.songContainer}>
          <ImageBackground
            source={{ uri: song.imageURL }}
            style={styles.songImage}
            contentFit="cover"
            contentPosition="center"
          >
            <View style={styles.overlay}>
              <AntDesign
                name={song.isFavorite ? "heart" : "playcircleo"}
                size={60}
                style={styles.icon}
              />
            </View>
          </ImageBackground>

          <Text style={[styles.textPrimary, song.isFavorite && styles.favoriteText]}>
            {song.title} by {song.artist}
          </Text>

          {song.isFavorite && (
            <Text style={[styles.textSecondary, styles.favoriteDuration]}>
              {song.duration} min - ON FAVORITES LIST
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "white",
  },
  switchContainer: {
    paddingVertical: 10,
  },
  textPrimary: {
    fontSize: 15,
  },
  textSecondary: {
    fontSize: 13,
  },
  songContainer: {
    borderWidth: 1,
    borderColor: "#555",
    padding: 12,
    marginTop: 12,
  },
  songImage: {
    width: "100%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    opacity: 0.6,
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    color: "black",
  },
  favoriteText: {
    color: "blue",
  },
  favoriteDuration: {
    color: "blue",
  },
})
