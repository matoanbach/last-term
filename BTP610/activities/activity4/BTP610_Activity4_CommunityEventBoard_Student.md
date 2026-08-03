# BTP610 Mobile Applications

## Activity 4 - Community Event Board (5%)

> This assessment contains materials that may be subject to copyright and other intellectual property rights. Modification, distribution, or reposting of this document is strictly prohibited. Learners found reposting this document or its solution anywhere will be subject to the college's Copyright and Academic Integrity policies.

## Submission Instructions

For this activity, you will work in groups of 2-3 students. Individual work will not be accepted.

1. Create your Firebase project on `console.firebase.google.com`. Each group creates their own project.
2. Create your Expo project. Name it `EventBoard_Name1_Name2` and include all group member names.
3. Your group has a Blackboard group. **One submission per group only.** Submit:
   - A ZIP file of your project code.
   - A video or video link.

## Technical Submission Issues

> **Warning:** Incorrect, empty, corrupted, or missing ZIP files will receive a grade of 0 with no opportunity to resubmit. Test your submission by unzipping it and confirming the project opens and runs correctly before submitting.

## Late Submission Policy

- Submissions are due by the date and time specified on Blackboard.
- Late submissions will be penalized **10% per day late**.
- Submissions more than **5 days late** will receive a grade of 0.
- Technical issues are **not** accepted as reasons for late submission. Submit what you have on time.
- If you experience a Blackboard issue, email your submission to the instructor **before the deadline** as proof.

## Academic Integrity

- Groups of 2-3 students only.
- **Permitted:**
  - Usage of class examples and lecture notes.
  - Discussion of general concepts within your group.
- **Not permitted:**
  - Sharing code with other groups.
  - Posting this assessment or your solution to any website, including Chegg, CourseHero, Discord, GitHub, and similar platforms.
  - Using generative AI tools such as ChatGPT, Copilot, and similar tools.

### Academic Integrity Warning

> A solution that does not reflect what was taught in class will not be accepted and may receive a grade of 0 and/or be subject to an academic integrity review. Every group member must be able to explain any part of the code during a review. Code that cannot be explained will be treated as academic misconduct.

# Task: Community Event Board

You will build a community event board app where users can sign up, post events, view all community events in real time, and manage their own posts.

## Install Command

```bash
npm install firebase
```

## Required Folder Structure

```text
EventBoard/
├── app/
│   ├── _layout.tsx                 # Root layout (headerShown: false)
│   ├── index.tsx                   # Entry point: redirect based on auth
│   ├── (auth)/
│   │   ├── _layout.tsx             # Dark header for auth screens
│   │   ├── signIn.tsx
│   │   └── signUp.tsx
│   └── (welcome)/
│       ├── _layout.tsx
│       └── (tabs)/
│           ├── _layout.tsx         # Tab navigation + sign out
│           ├── EventBoard.tsx      # Tab 1: All events (real-time)
│           └── AddEvent.tsx        # Tab 2: Add a new event
├── firebaseConfig.ts
├── userAuthentication.ts
├── CustomStyle.ts
└── types/
    └── Event.tsx                   # TypeScript type for an event
```

## Event Type

Copy this into `types/Event.tsx`:

```ts
export type Event = {
  id: string
  title: string
  date: string
  location: string
  description: string
  uid: string       // Firebase Auth UID of who posted this event
  postedBy: string  // Display name or email of the poster
}
```

# Requirements

Your app must implement **all** of the following:

## 1. Firebase Setup

- Create a Firebase project.
- Enable **Authentication** using Email/Password.
- Enable **Firestore**.
- Create a collection called `EventDB`.
- Set up `firebaseConfig.ts` and `userAuthentication.ts` as done in class.

## 2. Authentication

Implement:

- Sign Up
  - Creates a Firebase Authentication account.
  - Saves the user profile to Firestore.
- Sign In.
- Sign Out.
- After Sign Up or Sign In, redirect to the `EventBoard` tab.
- `index.tsx` must redirect based on the authentication state using the `userAuthentication()` hook.

## 3. Add Event Screen

Create a form with these fields:

- Event Title
- Date, for example: `July 15, 2026`
- Location
- Description

The form must also:

- Validate that **all fields** are filled before saving.
- Show an `Alert` if any field is empty.
- Save the event to Firestore in `EventDB` using `addDoc`.
- Include the user's UID.
- Include the user's email or name as `postedBy`.
- Clear the form after successful submission.

## 4. Event Board Screen

- Display **all events from all users** in real time using `onSnapshot`.
- Each event card must show:
  - Title
  - Date
  - Location
  - Description
  - Who posted it
- Use `FlatList` to display the events.

## 5. Delete Event

- Users can delete only their **own events**.
- Show a delete icon or button only when the event's `uid` matches the current user's `uid`.
- Confirm deletion with an `Alert`.
- Delete the event using `deleteDoc`.

## 6. Edit Event

- Users can edit only their **own events**.
- Show an edit icon or button only on their own events.
- When selected, open a `Modal`.
- Pre-fill the modal with the current event data.
- Allow the user to update and save the event using `updateDoc`.

## 7. Tab Navigation

Create two tabs:

1. Event Board
2. Add Event

Include a sign-out button in the header of the Event Board tab.

## 8. Video Demo and Explanation

Each group must submit a short video of approximately **5 minutes** that includes:

- A demonstration of the working features.
- One function explained line by line in your own words.
- A **Design Rationale**:
  - Choose one design decision where more than one approach was possible.
  - Explain what you chose.
  - Explain the alternative or alternatives you considered.
  - Explain why you rejected those alternatives.
  - Explain why you chose your final approach.
- One challenge you faced while building the app.
- One thing you are proud of.

Additional requirements:

- All members must contribute to the video.
- Cameras are optional, but audio must be enabled.

# Design Rationale - Talking Points

Choose **one** of the following, or a similar design decision from your own app:

- How you structured Add Event form validation:
  - Did you validate each field separately or check everything at once?
  - What tradeoff did that involve?
- How you display validation errors:
  - One combined `Alert`
  - A message for each field
  - Another method
  - Why did you choose it over the alternatives?
- What you store in `postedBy`:
  - The user's name
  - The user's email
  - Why did you choose one over the other?
- How you capture and store the date:
  - Free-text entry
  - A date-picker component
  - What tradeoff did that involve?
- How you manage the event being edited inside the `Modal`:
  - What state do you track?
  - How did you decide what needed to be stored in state?
- Any features added beyond the core requirements, such as:
  - Categories
  - Search
  - Capacity limits
  - How did you choose the implementation?
  - What alternatives did you consider?

# Hints

- Authentication, routing, `userAuthentication.ts`, `firebaseConfig.ts`, and tab navigation follow the same pattern as **GoodReadClub**. Refer to your class notes.
- To check whether an event belongs to the current user:

```ts
event.uid === firebaseAuth.currentUser?.uid
```

- For the edit `Modal`, use `useState` to track:
  - Which event is being edited.
  - Whether the modal is open.
- The `Modal` component was used in Week 4 in the **EventRegistration** project.
- Use `.filter()` from Week 6 for state-array operations.

# Marking Rubric - Out of 100

| Criteria | Excellent (Full) | Partial | Not Done | Marks |
|---|---|---|---|---:|
| Firebase Auth: sign up, sign in, sign out, and redirect | All working correctly: account created, profile saved, redirect based on auth state, and sign out clears the session. **17-20** | 2-3 of 4 working. **10-16** | 0-1 working or not attempted. **0-9** | 20 |
| Add Event: all fields, validation, `addDoc`, UID, and `postedBy` | All 7 sub-requirements working: form, validation, Firestore save, UID, `postedBy`, and form clearing. **17-20** | 4-6 of 7 working. **10-16** | 0-3 working or not attempted. **0-9** | 20 |
| Event Board: `onSnapshot`, `FlatList`, and all event fields shown | Real-time list works, all fields are displayed, and updates appear instantly when events are added or deleted. **13-15** | List works but has missing fields or is not real-time. **7-12** | Not implemented or not loading. **0-6** | 15 |
| Delete: own events only, `Alert`, and `deleteDoc` | Delete icon appears only on the user's own events, confirmation is shown, and the event disappears immediately. **8-10** | Delete works but has no UID check or no confirmation alert. **4-7** | Not implemented. **0-3** | 10 |
| Edit: pre-filled `Modal`, own events only, and `updateDoc` | Edit icon appears only on the user's own events, modal opens with pre-filled data, and saving updates Firestore. **8-10** | Modal opens but is not pre-filled or has no UID check. **4-7** | Not implemented. **0-3** | 10 |
| Tab navigation, layouts, and sign-out button | Two tabs work, headers are correct, and the sign-out button is present and functional. **4-5** | Tabs work but sign-out is missing or there are header issues. **2-3** | No tabs. **0-1** | 5 |
| Video demo and explanation | All questions are answered clearly. The Design Rationale names a genuine alternative, explains why it was rejected, describes one challenge and one proud moment, and demonstrates understanding of the code and design choices. **17-20** | Most questions are answered, but the rationale lacks a genuine alternative or justification, the challenge/proud moment is vague or missing, or explanations are thin. **10-16** | Not submitted or insufficient. **0-9** | 20 |

**Total: 100 marks (worth 5% of the final grade)**

---

**END OF ASSESSMENT**
