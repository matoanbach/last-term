# Activity 4 Video Plan

## Timeline

### 1. 0:00-0:30 - Both introduce yourselves
- say your names
- say this is Activity 4 Community Event Board

### 2. 0:30-2:30 - You demo the app
- sign up or sign in
- show redirect to Event Board
- show Add Event form
- add an event
- show it appears on Event Board
- edit your own event
- delete your own event
- sign out

### 3. 2:30-4:00 - Teammate shows code
- open one main function and explain it line by line
- best choices:
- `addEvent` in `AddEvent.tsx`
- or `updateEvent` in `EventBoard.tsx`
- or `onSignUp` in `signUp.tsx`

### 4. 4:00-5:00 - Teammate or both explain reflection
- design rationale
- one challenge
- one thing you are proud of

## Your Script

### Part 1: Intro
"Hi, my name is Your Name, and this is our Activity 4 Community Event Board app for BTP610.
Our app allows users to sign up, sign in, add community events, view all events in real time, edit their own events, delete their own events, and sign out."

### Part 2: Demo
"First, I'll show the app running.
When the app starts, it checks whether the user is logged in.
If the user is not logged in, it redirects to the Sign In screen.
Here on the Sign Up screen, a new user can enter their full name, email, password, and confirm password.
After signing up, the app creates a Firebase Authentication account and saves the user profile to Firestore.
After signing in, the app redirects to the Event Board tab.
At the bottom, we have two tabs:
Event Board and Add Event.
In Add Event, the user enters:
Event Title, Date, Location, and Description.
If any field is empty, the app shows an alert and does not save.
When all fields are filled, the app saves the event to Firestore using `addDoc`.
It also stores the current user's UID and email as `postedBy`.
After saving, the form is cleared automatically.
Now on the Event Board screen, all events are displayed in real time using `onSnapshot`.
Each event shows the title, date, location, description, and who posted it.
If the event belongs to the current user, edit and delete buttons appear.
If it does not belong to the current user, those buttons do not appear.
I can tap edit to open a modal with the current event data already filled in.
Then I can update the event and save it.
I can also tap delete, confirm the alert, and the event is removed.
Finally, the user can sign out using the button in the header, and the app returns to the Sign In screen."

### Part 3: Design Rationale
"For our design rationale, we chose to store `postedBy` as the user's email instead of the full name.
One alternative was storing and displaying the full name from the user profile.
We considered that approach, but it would require extra logic to fetch and manage that data when creating or displaying events.
We rejected that approach because email is already available from the authenticated user and is simpler to use.
We chose email because it is reliable, easy to access, and matches the class style of keeping the solution simple."

### Part 4: Challenge
"One challenge we faced was Firebase permissions.
At first, authentication worked, but Firestore blocked some writes with a permissions error.
We solved that by checking the Firebase Console setup, enabling the required services, and updating the Firestore rules so authenticated users could read and write data during testing."

### Part 5: Proud Moment
"One thing I'm proud of is that the event board updates in real time.
When an event is added, edited, or deleted, the changes appear immediately without refreshing the app.
That made the app feel complete and showed that our Firebase integration was working properly."

### Transition to Teammate
"Now my teammate will explain one of the main functions in the code line by line."

## Teammate Tasks
- explain one function line by line
- best choice: `addEvent` in `AddEvent.tsx`
- alternatives:
- `updateEvent` in `EventBoard.tsx`
- `onSignUp` in `signUp.tsx`
- help with the reflection section if needed
- make sure they clearly speak in the video so both members contribute
