# BTP610 Final Assessment — Easy-Read Study Guide

> **Course:** BTP610 — Mobile Applications  
> **Stack:** TypeScript, Expo, React Native, Firebase Authentication, Firestore  
> **Best study method:** rebuild small pieces from memory, predict what code will do, and practice writing small functions without looking them up.

---

# 1. Highest-Priority Topics

Focus most on:

1. **Firebase Authentication**
2. **Firestore CRUD + real-time listeners**
3. **React hooks and state**
4. **Expo Router**
5. **Camera + media-library permissions**
6. **End-to-end application flow**

The final is not only about memorizing functions. Be ready to explain:

- what a function does;
- what it returns;
- what triggers the next step;
- how data moves through the app;
- how the UI reacts when state or Firestore changes.

---

# 2. Firebase Setup & Configuration

## Core functions

| Function | Purpose |
|---|---|
| `initializeApp()` | Initializes/connects the app to Firebase |
| `getAuth()` | Gets the Firebase Authentication instance |
| `getFirestore()` | Gets the Firestore database instance |

## `firebaseConfig.ts`

Know:

- what configuration it stores;
- why it should not be shared publicly;
- why shared instances such as `auth` and the database are exported for reuse across screens.

### Mental model

```text
firebaseConfig
    ↓
initializeApp()
    ↓
Firebase app
    ↓
getAuth()       getFirestore()
    ↓                 ↓
Authentication     Firestore
```

---

# 3. Firebase Authentication

## Creating vs. signing in

Know the difference between:

- creating a **new account**;
- signing in an **existing account**.

A successful auth call returns a user credential.

### Important value

```ts
userCredential.user.uid
```

This is:

> A unique ID Firebase Authentication automatically generates for the account.

It is **not**:

- the password;
- a temporary login value;
- the name of a Firestore collection.

## Logged-in user information

Know how to access:

- UID;
- email.

---

# 4. Auth State

The course project uses a value that can be:

| Value | Meaning |
|---|---|
| `undefined` | Firebase is still checking who is logged in |
| `null` | No user is logged in |
| `User` object | A user is logged in |

### Important

Do not treat `undefined` as logged out.

```text
undefined → still loading/checking
null      → logged out
User      → logged in
```

Know how the app:

1. listens for login-state changes;
2. reacts after sign in;
3. reacts after sign out;
4. routes the user based on auth state.

Use `try/catch` around async authentication calls.

---

# 5. Firestore Data Model

Firestore stores data as:

```text
Collection
   ↓
Document
   ↓
Fields / data
```

Example:

```text
BookDB
├── auto-id-1
├── auto-id-2
└── auto-id-3
```

---

# 6. Auto IDs vs. Known IDs

## `BookDB`

Uses:

```text
auto-generated document IDs
```

Reason:

> Books do not need to be looked up using a known ID.

## `userProfile`

Uses:

```text
Firebase Auth UID as the document ID
```

Reason:

> The app already knows the logged-in user's UID and can use it to find that user's profile.

### Relationship

```text
Firebase Auth account
        ↓
       UID
        ↓
Firestore userProfile document
```

---

# 7. Firestore References

```ts
collection(fireDB, "BookDB")
```

returns:

> A reference to the `BookDB` collection.

It does **not** immediately return an array of books.

The reference can be passed to functions such as:

```ts
addDoc(...)
onSnapshot(...)
```

---

# 8. Firestore CRUD

## Create

Know how to:

- add a new document with an auto-generated ID;
- write to a document using a specific known ID.

## Read

Know the difference between:

- reading data **one time**;
- listening for **ongoing changes**.

## Update

Know how to update only selected fields without replacing the rest of the document.

## Delete

Know how to permanently remove a document.

---

# 9. Real-Time Listeners

For a list that should update automatically:

```ts
onSnapshot(...)
```

is used.

### Flow

```text
Book added / edited / deleted
        ↓
Firestore changes
        ↓
onSnapshot callback runs
        ↓
new snapshot arrives
        ↓
state updates
        ↓
screen re-renders
```

No manual refresh is needed.

## What triggers the callback?

Any add, edit, or delete in the collection being listened to.

## What does the snapshot contain?

```ts
snapshot.docs
```

This gives an array of the current matching documents.

Each document gives access to:

```ts
doc.id
doc.data()
```

### Typical flow

```text
snapshot.docs
    ↓
map each document
    ↓
combine id + data
    ↓
store array in state
```

---

# 10. Listener Cleanup

Real-time listeners need cleanup.

This is commonly tied to the cleanup function returned from `useEffect()`.

```text
Component mounts
    ↓
listener starts
    ↓
component uses live data
    ↓
component unmounts
    ↓
listener cleanup runs
```

---

# 11. React Hooks

## `useState`

Use state when changing the value should update the UI.

Examples from the course:

- form values;
- error messages;
- camera type.

## `useEffect`

Know:

- what it does;
- dependency arrays;
- cleanup functions.

### Empty dependency array

```ts
useEffect(() => {
  // ...
}, [])
```

Know how this differs from leaving the dependency array off entirely.

---

# 12. `useRef` vs. `useState`

A key course example:

## `isCameraReady`

Implemented as a ref because:

> It needs to be remembered, but changing it does not need to trigger a re-render.

## `cameraType`

Implemented as state because:

> Changing it must re-render `CameraView` with a new `facing` value.

### Easy rule

```text
Need UI to re-render?
    YES → state
    NO  → ref may be appropriate
```

---

# 13. Object State Pattern

Course pattern:

```ts
const [userObject, setUserObject] = useState({
  email: "",
  password: "",
  error: ""
})
```

To update only one field:

```ts
setUserObject({
  ...userObject,
  error: newValue
})
```

Why?

```ts
...userObject
```

keeps the existing fields.

Then:

```ts
error: newValue
```

changes only `error`.

### Common mistake

```ts
setUserObject({ error: newValue })
```

does not preserve the other fields.

---

# 14. Boolean Conversion with `!!`

```ts
!!userObject.error
```

converts the string to a boolean.

| Value | Result |
|---|---|
| `""` | `false` |
| `"Invalid password"` | `true` |

Useful for conditionally showing an error message.

---

# 15. Custom Hooks

Know the idea of a custom hook that:

1. starts a listener;
2. receives live data;
3. stores/returns a value;
4. lets any screen reuse the same logic.

Main purpose:

> Reuse state/listener logic without duplicating it across screens.

---

# 16. Expo Router

## File-based routing

File and folder names map to screens and routes.

## Route groups

Folders such as:

```text
(auth)
(welcome)
(tabs)
```

group related screens **without adding that folder name to the URL path**.

They are for organization.

---

# 17. Routing Based on Login State

```text
App opens
   ↓
Firebase checks auth
   ↓
undefined → still checking
   ↓
null → go to login/auth
   ↓
User object → go to authenticated app
```

---

# 18. Navigate vs. Replace

Know the difference between navigation that:

- lets the user go **back**;
- **replaces** the current screen so they cannot return to it.

This matters for flows like:

```text
login → main app
logout → login screen
```

---

# 19. Tabs

Know how to configure:

- multiple tab screens;
- icons;
- active tab styling;
- headers.

Important property:

```ts
tabBarActiveTintColor
```

controls:

> The color of the active tab's icon and label.

---

# 20. Lists & Components

For lists from state or Firestore:

```text
array
  ↓
render each item
  ↓
each item needs a unique key
```

Use small reusable components for individual list items.

Example:

```text
BookList
   ↓
BookItem
BookItem
BookItem
```

---

# 21. Camera & Media-Library Permissions

These permissions are separate.

## Camera permission

Needed to use the camera.

## Media-library permission

Needed to save the captured photo to the device gallery.

### Common mistake

```text
Camera permission granted
        ≠
Media-library permission granted
```

Having camera permission does not automatically give permission to save photos.

---

# 22. Camera Flow

Only render the camera after permission has been confirmed.

```text
request permission
      ↓
check result
      ↓
permission granted?
   ↙           ↘
 YES            NO
 ↓              ↓
render        don't render
CameraView    CameraView
```

Know how to:

- reference the live camera;
- check that it is ready;
- switch front/back camera;
- capture a photo;
- save it to the gallery.

Always guard camera actions that depend on the camera being mounted and ready.

---

# 23. Expo Go Media-Library Limitation

These functions are left as reference code in the class project:

```ts
getAlbumAsync()
createAlbumAsync()
addAssetsToAlbumAsync()
```

Reason:

> Expo Go cannot get the full media-library access needed to browse or organize existing albums.

That requires a dedicated development build.

---

# 24. Forms & User Input

Know how to:

- connect `TextInput` value to state;
- update state from the change handler;
- validate required fields;
- show/hide an error message;
- use input props for password hiding, keyboard type, and auto-capitalization.

### Controlled-input idea

```text
TextInput
   ↓
value comes from state
   ↓
onChange updates state
```

---

# 25. Full Application Flow

## A. Sign-up

```text
User enters account information
        ↓
Create Firebase Auth account
        ↓
Firebase generates UID
        ↓
Save profile separately in Firestore
        ↓
Use UID to link profile to user
```

## B. Sign-in

```text
User signs in
      ↓
Firebase auth state changes
      ↓
auth listener sees User object
      ↓
app routes into authenticated screens
```

## C. Firestore CRUD

```text
User adds / edits / deletes data
           ↓
Firestore changes
           ↓
onSnapshot detects it
           ↓
snapshot.docs received
           ↓
state updated
           ↓
UI updates automatically
```

## D. Sign-out

```text
User signs out
      ↓
Firebase auth state changes
      ↓
User becomes null
      ↓
app routes back to login
```

---

# 26. Common Mistakes

## Firebase / Firestore

- Treating a collection reference as if it already contains documents.
- Forgetting that `onSnapshot()` is a live listener.
- Forgetting listener cleanup.
- Using the wrong ID strategy.
- Forgetting to link a profile to the Auth UID.

## React

- Replacing an entire object when only one field should change.
- Mutating object state directly.
- Using state when a ref is enough.
- Using a ref when the UI needs to re-render.
- Misunderstanding the `useEffect` dependency array.

## Navigation

- Forgetting that `(auth)` / `(tabs)` do not add URL segments.
- Using a navigation method that allows Back when the screen should be replaced.
- Routing before Firebase finishes checking auth state.

## Camera

- Requesting camera permission but not media-library permission.
- Using the camera before it is ready.
- Rendering `CameraView` before permission is confirmed.

---

# 27. Review Quiz — 15 Must-Know Facts

1. Firestore stores **documents inside collections**.
2. `userCredential.user.uid` is the user's unique Firebase Auth ID.
3. `BookDB` uses auto IDs; `userProfile` uses the Auth UID.
4. Use `onSnapshot()` for live Firestore updates.
5. The listener runs again when a document is added, edited, or deleted.
6. `(auth)` / `(welcome)` folders organize routes without changing the URL path.
7. `undefined` auth state means Firebase is still checking.
8. Update one field in object state with the spread pattern.
9. `tabBarActiveTintColor` controls the active tab icon and label color.
10. Ref = remember without re-render; state = change should re-render.
11. Camera and media-library permissions are separate.
12. `snapshot.docs` contains the current matching documents.
13. Full album access needs a dedicated dev build, not Expo Go.
14. `collection(fireDB, "BookDB")` returns a collection reference.
15. `!!userObject.error` converts an empty/non-empty string to `false`/`true`.

---

# 28. Last-Minute Cheat Sheet

## Firebase

```text
initializeApp() → Firebase app
getAuth()       → Authentication
getFirestore()  → Firestore
```

## Auth

```text
undefined → still checking
null      → logged out
User      → logged in
```

## Firestore

```text
Collection → Documents → Fields
```

```text
BookDB      → auto-generated IDs
userProfile → Firebase Auth UID
```

## Real-time list

```text
onSnapshot
   ↓
snapshot.docs
   ↓
map to array
   ↓
set state
   ↓
UI updates
```

## React

```text
state → change should re-render UI
ref   → remember value without re-render
```

```ts
setUserObject({
  ...userObject,
  error: newValue
})
```

## Router

```text
(folder) → route group
```

Organizes screens without adding the group to the URL.

## Camera

```text
Camera permission ≠ Media-library permission
```

Need both when taking and saving a photo.

---

# 29. How to Study

## Round 1 — Explain

Without looking, explain:

- `undefined` vs. `null` vs. `User`;
- collection vs. document;
- auto ID vs. UID;
- state vs. ref;
- one-time read vs. `onSnapshot`;
- camera permission vs. media-library permission.

## Round 2 — Trace

Trace these four flows:

1. Sign up
2. Sign in
3. Add/edit/delete Firestore data
4. Sign out

## Round 3 — Write From Memory

Practice writing:

- an auth call inside `try/catch`;
- an object-state spread update;
- an `onSnapshot()` listener;
- listener cleanup in `useEffect`;
- a permission check;
- a route decision based on auth state.

## Round 4 — Predict Code

When shown code, ask:

1. What runs first?
2. What value changes?
3. Does it trigger a re-render?
4. Does Firestore change?
5. Does a listener fire?
6. Does navigation happen?
7. What cleanup is needed?

---

# 30. Final Mental Model

```text
USER ACTION
    ↓
React event handler
    ↓
Firebase Auth / Firestore / Camera action
    ↓
Result or listener callback
    ↓
React state changes
    ↓
Component re-renders
    ↓
Navigation / UI updates
```

The main goal for the final is to understand **how the pieces connect**, not only what each individual line of code does.
