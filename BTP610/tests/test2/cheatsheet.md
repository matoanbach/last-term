# BTP610 Test 2 Cheat Sheet

## Test Details

- Date: Thursday, June 18, 2026
- Time: 1:30 PM - 3:15 PM
- Duration: 70 minutes
- Mode: In-person

## Test Focus

- Coverage: Week 1 to Week 6
- Main focus: `FlatList`, `Expo Router`, `React Context Provider`
- Format: build a mobile app from a problem statement

## Test Rules

- No generative AI
- Internet usage is limited
- No Blackboard or course material access
- Full desktop sharing in Microsoft Teams is required
- Make sure Expo, Node, simulator/device, and screen sharing work before the test

## What Was Actually Covered

### Week 1

- `View`, `Text`, `Image`, `TextInput`
- `useState`
- inline styles
- `.map()` rendering
- dropdown with `react-native-element-dropdown`
- checkbox with `expo-checkbox`

### Week 2

- `StyleSheet`
- `ScrollView`
- `Platform.OS`
- `Alert`
- `TouchableOpacity`
- basic validation
- TypeScript class model
- hooks: `useState`, `useEffect`
- React Context: `createContext`, provider, `useContext`

### Week 3

- style arrays like `[style1, style2]`
- flexbox: `flex`, `flexDirection`, `justifyContent`, `alignItems`, `gap`, `flexWrap`

### Week 5

- Expo Router with `Stack`
- tab routing with `Tabs` and route groups like `app/(tabs)`
- `useRouter()`
- `router.navigate()`
- `router.back()`
- `router.canDismiss()` and `router.dismiss()`
- header options in `_layout.tsx`

### Week 6

- `FlatList`
- `keyExtractor`
- `renderItem`
- `ListHeaderComponent`
- `ListFooterComponent`
- `ListEmptyComponent`
- `ItemSeparatorComponent`
- updating and deleting list items with state

## Core Imports

```tsx
import { useContext, useEffect, useState, createContext } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, Tabs, useRouter } from 'expo-router';
```

## `useState`

```tsx
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [items, setItems] = useState<string[]>([]);
```

Update array state:

```tsx
setItems([...items, 'New Item']);
```

Do not do this:

```tsx
items.push('New Item');
```

## `useEffect`

Used in Week 2 for derived state:

```tsx
const [count, setCount] = useState(0);
const [calculation, setCalculation] = useState(0);

useEffect(() => {
  setCalculation(count * 2);
}, [count]);
```

Remember:

- no dependency array: runs every render
- `[]`: runs once on first render
- `[count]`: runs when `count` changes

## Form Pattern from Weeks 1-2

```tsx
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');
```

```tsx
const validateEmail = () => {
  if (!email || email.length === 0) {
    setEmailError('Email cannot be empty!');
    return false;
  }

  setEmailError('');
  return true;
};
```

```tsx
if (!validateEmail()) {
  Alert.alert('Incomplete Registration Info', 'You must provide all the info!');
  return;
}
```

## `Alert`

Simple alert:

```tsx
Alert.alert('Registration', 'Registration Completed');
```

Confirmation alert:

```tsx
Alert.alert('Confirmation', 'Do you want to submit?', [
  { text: 'Cancel', style: 'cancel' },
  { text: 'Confirm', onPress: () => console.log('Confirmed') },
]);
```

## `TouchableOpacity`

```tsx
<TouchableOpacity style={styles.buttonStyle} onPress={handleSubmit}>
  <Text style={styles.buttonText}>Register</Text>
</TouchableOpacity>
```

## `ScrollView`

Used when the screen has a long form:

```tsx
<ScrollView>
  <View>{/* form UI */}</View>
</ScrollView>
```

## `Platform.OS`

Week 2 pattern:

```tsx
{Platform.OS === 'ios' ? (
  <Dropdown ... />
) : (
  <RadioButton.Group value={selectedTution} onValueChange={setSelectedTution}>
    {/* radio buttons */}
  </RadioButton.Group>
)}
```

## Styling

Inline style:

```tsx
<Text style={{ fontSize: 24, fontWeight: 'bold' }}>User Information</Text>
```

`StyleSheet`:

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
```

Style array:

```tsx
style={[styles.buttonStyle, { backgroundColor: '#ee5253' }]}
```

## Flexbox

Common properties used in class:

- `flex: 1`
- `flexDirection: 'row'`
- `justifyContent`
- `alignItems`
- `gap`
- `marginLeft: 'auto'`

Example:

```tsx
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
  <Text>Row Item</Text>
</View>
```

## `.map()` Rendering

Used before `FlatList`:

```tsx
{campusOptions.map((campus) => (
  <View key={campus}>
    <Text>{campus}</Text>
  </View>
))}
```

## TypeScript Model / Type

Class model from Week 2:

```tsx
export default class RegistrationInfo {
  name: string;
  email: string;
  program: string;
  tution: string;
  campuses: string[];

  constructor(name: string, email: string, program: string, tution: string, campuses: string[]) {
    this.name = name;
    this.email = email;
    this.program = program;
    this.tution = tution;
    this.campuses = campuses;
  }
}
```

Type alias from Week 6:

```tsx
type Student = {
  name: string;
  grade: number;
  tuitionPaid: boolean;
  userid: string;
};
```

## React Context Provider

### Basic idea

- create context
- wrap children with provider
- read shared data using `useContext`

### Week 2 pattern

```tsx
import { createContext, useState } from 'react';

export const StateContext = createContext({});

export const StateProvider = (props: any) => {
  const [expensiveCars, setExpensiveCars] = useState([
    'Rolls Royce Boattail',
    'Pagani Zonda',
  ]);

  const [city, setCity] = useState(['Toronto', 'Montreal']);

  return (
    <StateContext.Provider
      value={{
        cars: [expensiveCars, setExpensiveCars],
        city: [city, setCity],
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
};
```

Use it:

```tsx
import { useContext } from 'react';

const { cars, city } = useContext(StateContext);
const [carsList, setCarsList] = cars;
const [cityList, setCityList] = city;
```

Wrap a screen:

```tsx
<StateProvider>
  <DisplayList />
</StateProvider>
```

### Simple context example

```tsx
const UserContext = createContext('');

<UserContext.Provider value={username}>
  <Component2 />
</UserContext.Provider>
```

Read it later:

```tsx
const finalUsername = useContext(UserContext);
```

## Expo Router: Stack

### Basic `_layout.tsx`

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack />;
}
```

### Layout with screen options

```tsx
<Stack
  screenOptions={{
    headerStyle: { backgroundColor: '#ff9f43' },
    headerTintColor: 'white',
  }}
>
  <Stack.Screen name="index" options={{ title: 'Main Screen' }} />
  <Stack.Screen name="screen2" options={{ title: 'Screen 2', headerShown: false }} />
</Stack>
```

### Navigate with `useRouter`

```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

router.navigate('/screen2');
router.navigate('/screen3');
router.back();
```

### Dismiss pattern from class

```tsx
if (router.canDismiss()) {
  router.dismiss();
} else {
  Alert.alert('Error!', 'You are the top of the stack.');
}
```

## Expo Router: Tabs

Folder structure used in class:

```txt
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    index2.tsx
    settings/
      screen1.tsx
      screen2.tsx
      screen3.tsx
```

Root stack:

```tsx
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
</Stack>
```

Tabs layout:

```tsx
<Tabs>
  <Tabs.Screen name="index" options={{ title: 'Home' }} />
  <Tabs.Screen name="index2" options={{ title: 'Index 2' }} />
  <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
</Tabs>
```

Navigate inside tabs:

```tsx
router.navigate({ pathname: '/(tabs)/settings/screen2' });
router.navigate({ pathname: '/(tabs)/settings/screen3' });
```

Dismiss multiple screens:

```tsx
router.dismiss(2);
```

## `FlatList`

### Core props

- `data`
- `renderItem`
- `keyExtractor`
- `ListHeaderComponent`
- `ListFooterComponent`
- `ListEmptyComponent`
- `ItemSeparatorComponent`

### Week 6 pattern

```tsx
<FlatList
  style={{ width: '100%' }}
  data={studentList}
  keyExtractor={(student) => student.userid}
  renderItem={(rowData) => {
    return (
      <TouchableOpacity style={styles.mainView}>
        <View>
          <Text style={styles.txtName}>{rowData.item.name}</Text>
          <Text style={styles.txtGrade}>{rowData.item.grade}</Text>
          {
            rowData.item.tuitionPaid
              ? <Text style={{ color: 'green' }}>Tuition Paid</Text>
              : <Text style={{ color: 'red' }}>Tuition Not Paid</Text>
          }
        </View>

        <View style={styles.iconView}>
          <TouchableOpacity onPress={() => updateGrade(rowData.index)}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteStudent(rowData.index)}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }}
  ListHeaderComponent={ListHeader}
  ListFooterComponent={ListFooter}
  ListEmptyComponent={EmptyList}
  ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
/>
```

### Header / footer / empty examples

```tsx
const ListHeader = () => <Text style={styles.listHeader}>BTP610</Text>;
const ListFooter = () => <Text style={[styles.listHeader, { backgroundColor: 'green' }]}>Class of 2026</Text>;
const EmptyList = () => <Text style={{ fontSize: 26, color: 'red' }}>No Students Found</Text>;
```

### Update one item with `.map()`

```tsx
const updateGrade = (pos: number) => {
  const result = studentList.map((item, index) => {
    if (index === pos && item.grade <= 95) {
      return { ...item, grade: item.grade + 5 };
    }

    return item;
  });

  setStudentList(result);
};
```

### Delete one item with `.filter()`

```tsx
const deleteStudent = (pos: number) => {
  Alert.alert('Remove!', 'Are you sure you want to remove this student?', [
    { text: 'No', style: 'cancel' },
    {
      text: 'Yes',
      onPress: () => {
        setStudentList(studentList.filter((item, index) => index !== pos));
      },
    },
  ]);
};
```

## Common Exam Build Pattern

Most likely you will need to do some combination of these:

1. Build a form with `TextInput`
2. Store values with `useState`
3. Validate input
4. Show a list with `FlatList`
5. Update or delete list items
6. Navigate between screens using Expo Router
7. Share data using a context provider if multiple screens need the same state

## Fast Build Order During Test

1. Create `app/_layout.tsx`
2. Create screen files in `app/`
3. Build UI with `View`, `Text`, `TextInput`, `TouchableOpacity`
4. Add state with `useState`
5. Add validation and `Alert`
6. Add `FlatList`
7. Add navigation with `useRouter`
8. Add context provider only if state must be shared between screens

## Common Mistakes

- forgetting `keyExtractor` in `FlatList`
- mutating state directly
- forgetting to wrap components with the provider
- wrong route path in `router.navigate()`
- using `router.dismiss()` when there is nothing to dismiss
- forgetting `ScrollView` for long forms
- forgetting `Platform.OS` logic when asked for platform-specific UI

## Quick Memory Lines

- `useState` stores screen data
- `useEffect` reacts to changes
- `createContext` + provider shares data
- `useContext` reads shared data
- `useRouter()` controls navigation
- `FlatList` = `data` + `renderItem` + `keyExtractor`
- update item with `.map()`
- delete item with `.filter()`
