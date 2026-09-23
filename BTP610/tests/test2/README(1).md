# BTP610 NAA — Test 2

## Academic Integrity

By beginning this test, students affirm that they will not give or receive any unauthorised help, and that all work provided will be their own. Students must agree to follow Seneca's Academic Integrity Policy. Any violation of academic integrity may be subject to the penalties outlined in the policy.

When creating the solution, students must use the coding practices and conventions demonstrated in class. A solution that does not reflect what was taught in class will not be accepted and may receive a grade of 0 and/or be subject to an academic integrity review.

## How to Create Your Project

1. Download and unzip the starter code `Test2.zip`.
2. Rename the project folder to `Test2_FIRSTNAME`.
   - Replace `FIRSTNAME` with your first name.
3. In the project, create and test your solution.

## Submission Instructions

1. Submit a zip file.
   - Rename the project folder to `Test2_FIRSTNAME` if needed before zipping.

## Academic Integrity Rules

1. This is an individual assessment.
2. Access to course material and class examples is **not permitted**.
3. The following are **not permitted**:
   - Generative AI usage
     - Websites: ChatGPT, Microsoft Copilot, etc.
     - AI extensions in Visual Studio Code: GitHub Copilot, GitHub Copilot Chat, etc.
     - Generative AI IDEs: Cursor, Windsurf, Claude Code, Zed, etc.

## Problem Description

You are assigned to develop a basic **Transaction Manager App** using:

- Expo Router
- TypeScript
- React Context API

The application must allow the user to:

1. View a list of transactions.
2. Add new transactions.
3. Share transaction data globally using Context API.

## App Features and Requirements

### 1. Transaction Object

A transaction should contain the following fields:

| Field | Type |
|---|---|
| `id` | string |
| `name` | string |
| `amount` | number |
| `location` | string |
| `date` | string |
| `description` | string |
| `type` | Deposit or Expense |
| `category` | Utilities, Transportations, Groceries, Shopping, Entertainment, Health, Payroll |

### 2. Screen 1 — Transaction List

This screen must:

- Use `useContext()` to access transactions.
- Display all transactions using `FlatList`.
- Display each row with the transaction name, amount, and type.
- Show `No transactions yet` when the list is empty.

### 3. Screen 2 — Transaction Detail

This screen must:

- Navigate to the detail screen when the user clicks a transaction from Screen 1.
- Provide more details about the selected transaction.
- Display all details of the transaction in a creative design.

### 4. Screen 3 — New Transaction

This screen must:

- Include a form with all transaction fields except `id`.
- When submitted:
  1. Validate required fields.
  2. Call `addTransaction()`.
  3. Clear the form after submission.
  4. Automatically update the Transactions screen.

### 5. Navigation

Use appropriate Expo Router navigation that provides efficient navigation around the app.

## Rubric

| Criteria | Points |
|---|---:|
| Transaction List & Detail | 30 |
| New Transaction | 15 |
| Navigation and Data Exchange between screens | 15 |
| UI/UX | 20 |
| Overall app look & feel, behaviour and functionalities | 20 |

## Submission Checklist

- [ ] Project folder is named `Test2_FIRSTNAME`.
- [ ] App uses Expo Router, TypeScript, and React Context API.
- [ ] Transaction list screen displays transactions with `FlatList`.
- [ ] Empty transaction list shows `No transactions yet`.
- [ ] Transaction detail screen shows all transaction information.
- [ ] New transaction form includes all fields except `id`.
- [ ] Form validates required fields.
- [ ] Form calls `addTransaction()` on submit.
- [ ] Form clears after submission.
- [ ] Transactions screen updates after adding a transaction.
- [ ] Navigation between screens works correctly.
- [ ] Project is zipped before submission.

---

**End of Assessment**
