# BTP610 - Mobile Applications

## Lab Activity 3 - My Dream Trip

- Worth: 5%
- Time limit: 60 minutes
- Partners allowed: max 2

This assessment contains materials that may be subject to copyright and other intellectual property rights. Modification, distribution or reposting of this document is strictly prohibited. Learners found reposting this document or its solution anywhere will be subject to the college's Copyright and Academic Integrity policies.

## Submission Instructions

1. Project must be created with Expo. Name the project: `DreamTrip_Firstname`.
Replace `Firstname` with your name.
2. Submit a zip file of your entire project folder to Blackboard.
3. You may work with **ONE partner (max 2 students per group)**. If you are working with a partner, include **BOTH** names in the project name: `DreamTrip_Firstname_Firstname`.
Both students must still submit the zip file.
4. Only ONE submission per student is accepted. Double-check your zip before submitting.

### Technical Submission Issues

Incorrect, empty, corrupted, or missing zip files will receive a grade of 0 with no opportunity to resubmit. It is your responsibility to verify your zip file contains the correct project before submitting. Test your submission by unzipping it and confirming the project opens correctly.

## Late Submission Policy

- Submissions are due at the end of the class session unless otherwise stated by the instructor.
- Late submissions will be penalized 10% per day late.
- Submissions more than 5 days late will receive a grade of 0.
- Technical issues (computer crashes, Blackboard errors, etc.) are NOT accepted as reasons for late submission. Submit what you have on time.
- If you experience a technical issue, inform your instructor BEFORE the deadline as proof.

## Academic Integrity

- This is an individual or paired assessment. Groups of 3 or more are NOT permitted.
- Permitted activities:
  - Usage of class examples and lecture notes.
  - Discussing general concepts with classmates, but not solution code.
- Not permitted:
  - Posting this assessment or your solution to any website such as Chegg, CourseHero, Discord, GitHub, etc.
  - Sharing or receiving solution code with anyone outside your partner.
  - Using generative AI tools such as ChatGPT, Copilot, GitHub Copilot, etc.

### Academic Integrity Warning

A solution that does not reflect what was taught in class will not be accepted (0 grade) and/or be subject to an academic integrity review. When creating your solution, you must use the coding practices and conventions demonstrated in class.

## Task: My Dream Trip

You will build a personal dream trip app. Users type in cities they want to visit and their dream activity for that city. The app keeps a list of their dream destinations and can fly the map to a randomly selected one.

## Install Commands

Run these before coding:

```bash
npx expo install react-native-maps
npx expo install expo-location
```

## Example Data

Use these to test your app. These are examples only. Your app must work with any city and dream activity the user types in.

| City (what you type) | Dream Activity (what you type) |
|---|---|
| Tokyo, Japan | Eat ramen at 2am in Shinjuku |
| Santorini, Greece | Watch the sunset in Oia |
| Bali, Indonesia | Surf at Kuta Beach |
| New York, USA | See a Broadway show |
| Cairo, Egypt | Ride a camel near the Pyramids |
| Paris, France | Have coffee at a sidewalk cafe |
| Sydney, Australia | Swim at Bondi Beach |
| Dubai, UAE | Visit the top of the Burj Khalifa |

## Requirements

Your app must implement all of the following:

1. Display a full-screen interactive map using `MapView` with zoom controls enabled. Use `useRef<MapView>` and `animateToRegion()` for all camera movement.
2. Provide two `TextInput` fields:
   - one for the city name
   - one for the dream activity
   Each field must be tracked with its own `useState` variable.
3. Add an **Add to Dream Trip** button. When tapped:
   - Validate that both fields are filled in. If either is empty, show an `Alert` and do not add the entry.
   - Add the entry (`city + dream activity`) to the dream trip list.
   - Clear both input fields after successfully adding.
4. Display the dream trip list on screen. Each entry must show the **city name** and **dream activity**. The list must update automatically as entries are added or cleared.
5. Add a **Clear List** button that removes all entries from the dream trip list, removes any marker from the map, and clears the coordinates and address shown on screen.
6. Add a **Go to Random Dream** button. When tapped:
   - If the dream list is empty, show an `Alert` telling the user to add destinations first. Do not proceed.
   - Otherwise, randomly pick one entry from the list using `Math.random()`.
   - Use forward geocoding (`geocodeAsync`) to convert the city name to coordinates.
   - Fly the camera to those coordinates using `animateToRegion()`.
   - Display the coordinates (latitude and longitude) on screen.
   - Use reverse geocoding (`reverseGeocodeAsync`) to display the formatted address on screen.
7. Apply a `StyleSheet` and follow the coding practices and conventions demonstrated in class.

## Hints

- Use two separate `useState` variables: one for city, one for dream activity.
- To store each dream destination, create an object with `city` and `dreamActivity` from your two `TextInput` values, then push it into your state array.

```tsx
const newEntry = { city: city, dreamActivity: dreamActivity }

dreamList.push(newEntry)

setDreamList([...dreamList])
```

- The dream list is a state array. Use `push` + spread `[...list]` to add entries.
- For the random pick: `Math.floor(Math.random() * dreamList.length)`
- `geocodeAsync` returns an array, so always check `result.length > 0` before using `result[0]`.
- For the single marker: use one `useState` variable to store the current marker, with `null` when no marker exists.
- The marker `description` prop shows a popup when the pin is tapped. The description is the dream activity.
- You do **not** need location permission for `geocodeAsync`. Permission is only needed for `getCurrentPositionAsync`.

## Marking Rubric

| Criteria | Excellent (Full) | Partial | Not Done (0) | Marks |
|---|---|---|---|---:|
| MapView displayed, `useRef` + `animateToRegion` used | Full-screen map visible; `useRef<MapView>` declared; `animateToRegion` called for camera movement | Map shows but `useRef` missing or `animateToRegion` not used | No map | 1 |
| Two TextInputs, separate `useState` for each, cleared after add | Both inputs present, each tracked with own `useState`, both cleared after successful add | Inputs present but not cleared or only one `useState` used | No inputs | 1 |
| Add to Dream Trip, validation + add to list + clear inputs | Alert if either field empty; entry added to list; inputs cleared, all 3 working | 1-2 of 3 working | Button missing or does nothing | 2 |
| Dream list displayed, city + dream activity, updates automatically | All entries visible with both city and activity; updates as entries added/cleared | List shows but missing one field or doesn't update | No list | 1 |
| Clear List, removes entries, marker, coords and address | List emptied, map marker removed, coords and address cleared | Only some elements cleared | Button missing | 1 |
| Go to Random Dream, all sub-requirements | Empty alert; random pick; geocode; camera fly; one marker replaced each time with dream activity description; coords shown; address shown | 3-5 of 7 working, award 1.0; 6 of 7 working, award 1.25 | 0-2 working or not attempted | 3 |
| `StyleSheet` + code quality | `StyleSheet` applied; code follows class conventions; clean layout | Some styling but incomplete or inconsistent | No `StyleSheet` or poor code quality | 1 |
