# BTP610

Course work organized by week. Each week folder contains one or more separate Expo (React Native) projects.

## Week 1 (`week1/Week01Components`)

- Expo Router basics (`_layout.tsx` with `Stack`)
- Core React Native UI components: `View`, `Text`, `Image`, `TextInput`
- Form state with `useState`
- Inline styling with the `style` prop
- Rendering lists with `.map(...)`
- Using third-party components: dropdown (`react-native-element-dropdown`), checkbox (`expo-checkbox`)

## Week 2 (`week2`)

Week 2 contains two projects:

**`week2/Week01Components`**

- Reusable styling with `StyleSheet` (`styles/AppStyle.tsx`)
- Scrollable screens with `ScrollView`
- Platform-specific UI with `Platform.OS` (iOS dropdown vs Android radio group)
- Alerts/confirmations with `Alert`
- Touch interactions with `TouchableOpacity` (and commented `Pressable`)
- Basic validation + error state handling
- Simple data modeling with a TypeScript class (`models/RegistrationInfo.tsx`)
- Third-party components: `react-native-paper` `RadioButton`, plus dropdown/checkbox

**`week2/Week02Hooks`**

- Hooks: `useState`, `useEffect` dependency patterns
- Derived state/calculations (count -> calculation)
- React Context: `createContext`, Provider, `useContext`
- Sharing state across components and displaying it (list rendering)

## Week 3 (`week3/Week03StyleLayout`)

- Styling approaches: inline styles vs `StyleSheet` (`src/style/AppStyle.tsx`)
- Combining styles with arrays (e.g. `[style1, style2]`)
- Flexbox layout: `flex`, `flexDirection`, `justifyContent`, `alignItems`, `flexWrap`, `gap`, spacing
- Proportional layouts using flex ratios (stacked sections with different `flex` values)
- Project structure using `src/` + TypeScript path aliases (`@/*` -> `src/*`)
