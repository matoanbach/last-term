# Requirements
- Write the code for a single sreen mobile app that displays a list of songs:
    1. The user can choose between genres of music. In the starter code, the user chooses between displaying pop songs or rap songs, but you may use any two genres of your choice.
    2. To indicate the genre they want, the user makes a selection on a switch and then submits the information using a Button. After the Button is pressed, update the screen to show the songs in the selected genre.
    3. For each song, display:
    - Image:
        - If the song is on the favorite list, show a "head" icon
        - Otherwise, show a "play" icon
    - Title and artist name
        - If the song is on the favorite list, use a different color for the text.
    - Duration, example: "7 min"
        - If the song is on the favorite list, use a different color for the text.
        - Otherwhise, show nothing.
# UI
```
index

Do you want to list to pop music
                    <switch toggle>
            <submit botton>

<song>
song 1 player with a background
song name: Tears by Sabrina Carpenter
song duration: 3 min
<song>

<song>
song 1 player with a background
song name: Golder by HUNTR/X
song duration: 5 minite - On Favorite List
<song>

<song>
song 1 player with a background
song name: Back To Friends by sombr
song duration: 4 min
<song>
```
# Use the below as a reference
## Comment elements
```ts
<Text>
<Image> (from expo-image)
<Button title={} onPress={}>
```

## User input elements
```ts
<TextInput value={} onChangeText={}>
<Switch value={} onValueChange={}>
```

## Container Elements
```ts
<View>
<ImageBackground> (fron expo-image)
<Pressable onPress={}>
```

## Reusable Styles
```ts
import {StyleSheet} from "react-native"

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "blue"}
})

<Text style={styles.container}>
```

## Map function
```ts
conts names = ["Peter", "Abby", "Jiminez"]

names.map((currName: string)=>{
    return (
        <Text> { currName } </Text>
    )
})
```

## Conditionalk Rendering
```ts
{ (count > 100) && <Text>...</Text> }
{ (count > 100) ? <Text>...</Text> : <Text>...</Text>}
```

## State Variables
```ts
import {useState} from "react"
const [count, setCount] = useState<number>(100)
```

## Ref variables
```ts
import {useRef} from "react"
const countRef = useRef(100)
console.log(countRef.current)
```
