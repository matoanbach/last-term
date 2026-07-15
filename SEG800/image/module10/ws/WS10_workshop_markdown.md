# SEG800 - Workshop 10

**Total Mark:** 10 marks

## Submission file(s)

> **Do NOT zip files.**

- `WS10.pdf` — PDF of MATLAB live script
- Group work declaration and contributions

Please do **not** zip the files for submission.

Please work in groups to complete this lab.

This lab is worth **4% of the total course grade** and will be evaluated through your written submission, as well as the lab demo/test. During the lab demo, group members are randomly selected to explain the submitted solution. Group members absent during the lab demo will lose the demo mark.

## Learning Objectives

- Use MATLAB functions to implement two-dimensional FFT and inverse FFT for images.
- Design and implement lowpass and highpass filters in the frequency domain.
- Apply lowpass and highpass filters in the frequency domain.

## Preparation

- This workshop assumes you have already installed MATLAB in Workshop 1.
- This workshop uses projects in the DIP4E book. Please consult the solutions available at <https://www.imageprocessingplace.com/automation/login_students.htm> as reference when needed.
- Create a live script in file `WS10.mlx`. Include text and code to complete this workshop. When asked to prove or calculate analytically, feel free to include a snapshot of your handwritten solutions in a separate document if easier. Please organize your solutions.

---

# Part I: 2-D FFT and Inverse FFT

Solve the following problems. Include solutions and explanations in your script/submission.

## 1. [DIP] Project 4.1

Write a function:

```matlab
g = minusOne4e(f)
```

that multiplies `f` by `(-1)^(x+y)` to produce `g`.

Array `f` can be 1-D, either row or column, or 2-D. The input image must be floating point, so your function should perform a validation check for this.

## 2. [DIP] Project 4.2

Implementation and testing of the 2-D FFT and its inverse using a 1-D FFT algorithm.

### 2(a)

Obtain a routine that computes the 1-D FFT in the language you are using for projects. For example, excellent FFT implementations in C are available from <https://www.fftw.org>.

If you are working in MATLAB, use function `fft`.

Use the 1-D FFT routine to implement a function:

```matlab
F = dft2D4e(f)
```

that computes the 2-D forward FFT of image `f`, as explained in Section 4.11.

### 2(b)

Write a function:

```matlab
f = idft2D4e(F)
```

that computes the inverse FFT of an input transform `F`.

**Hint:** Work with the conjugate of `F` so that you can use the forward FFT function from part 2(a) to compute the inverse, as explained in Section 4.11.

### 2(c)

Read the image `rose512.tif` and scale it to the range `[0,1]` using the default settings of function `intScaling4e`. Denote the result by `f`.

Test your functions by:

1. Computing `F`, the forward FFT of `f`.
2. Obtaining `g`, the real part of the inverse FFT of `F`.
3. Displaying `f`, `g`, and the difference:

```matlab
d = f - g
```

Display the maximum and minimum values of `d`.

The displays of `f` and `g` should look identical, and `d` should appear as a black image.

### 2(d)

Compute the centered transform and display the spectrum of `F` as:

```matlab
S = log(1 + abs(F))
```

Scale `S` using the `'full'` option in function `intScaling4e` before displaying it.

---

# Part II: Filters in Frequency Domain

Solve the following problems. Include solutions and explanations in your script/submission.

## 3. [DIP] Project 4.3 — Lowpass filter transfer functions

### 3(a)

Write a function:

```matlab
H = lpFilterTF4e(type, P, Q, param)
```

to generate a `P × Q` lowpass filter transfer function `H` with the following properties:

- If `type = 'ideal'`, `param` should be a scalar equal to the cutoff frequency `D0` in Eq. (4-111).
- If `type = 'gaussian'`, `param` should be a scalar equal to the standard deviation `D0` in Eq. (4-115).
- If `type = 'butterworth'`, `param` should be a `1 × 2` array/vector containing the cutoff frequency and filter order:

```matlab
[D0, n]
```

as in Eq. (4-117).

### 3(b)

Generate a lowpass ideal filter transfer function of size `512 × 512` with:

```matlab
D0 = 96
```

Display your result as an image.

### 3(c)

Generate a lowpass Gaussian filter transfer function of size `512 × 512` with:

```matlab
D0 = 96
```

Display your result as an image.

### 3(d)

Generate a lowpass Butterworth filter transfer function of size `512 × 512`.

Use:

```matlab
D0 = 96
n = 2
```

Display your result as an image.

## 4. [DIP] Project 4.4 — Highpass filter transfer functions

### 4(a)

Write a function:

```matlab
H = hpFilterTF4e(type, P, Q, param)
```

to generate a `P × Q` highpass filter transfer function `H` with the following properties:

- If `type = 'ideal'`, `param` should be a scalar equal to the cutoff frequency `D0` in Eq. (4-119).
- If `type = 'gaussian'`, `param` should be a scalar equal to the standard deviation `D0` in Eq. (4-120).
- If `type = 'butterworth'`, `param` should be a `1 × 2` array/vector containing the cutoff frequency and filter order:

```matlab
[D0, n]
```

as in Eq. (4-121).

### 4(b)

Generate an ideal highpass filter transfer function of size `512 × 512` with:

```matlab
D0 = 96
```

Display your result as an image.

### 4(c)

Generate a highpass Gaussian filter transfer function of size `512 × 512` with:

```matlab
D0 = 96
```

Display your result as an image.

### 4(d)

Generate a highpass Butterworth filter transfer function of size `512 × 512`.

Use:

```matlab
D0 = 96
n = 2
```

Display your result as an image.

---

# Part III: Filtering in the Frequency Domain

## 5. [DIP] Project 4.5 — Frequency domain filtering package

### 5(a)

Write a function:

```matlab
g = dftFiltering4e(f, H, padmode, scaling)
```

to filter image `f` with a given filter transfer function `H`.

Your function should implement the seven steps in the filtering algorithm discussed in Section 4.7.

Padding requirements:

- If `padmode = 'replicate'`, or if `padmode` is not included, then replicate padding should be used.
- If `padmode = 'zeros'`, zero padding should be used.
- The padding used in either case should be of the `'post'` type discussed in project function `imPad4e` from Chapter 3.
- No padding should be used if `padmode = 'none'`.

### 5(b)

To test your function, read the image `testpatter512.tif`, then filter it with a Butterworth lowpass filter with:

```matlab
D0 = 32
n = 2
```

Display the result.

## 6. Adapted from [DIP] Project 4.8 — Highpass filtering in the frequency domain

### 6(b)

Write a function:

```matlab
H = laplacianTF4e(P, Q)
```

that computes the Laplacian filter transfer function `H` in the frequency domain.

`P` and `Q` are positive integers.

### 6(c)

Read the image `blurry-moon.tif` and sharpen it in the frequency domain using the Laplacian transfer function from part 6(b), as shown in Example 4.21.

Display your result.

**Hint:** Use the `'no'` scaling option in function `dftFiltering4e` so that negative values are preserved for proper scaling, as discussed in connection with Eq. (4-126).

---

# Part IV: Group Work

Complete this declaration by adding your names:

> We, ------------ (mention your names), declare that the attached assignment is our own work in accordance with the Seneca Academic Policy. We have not copied any part of this assignment, manually or electronically, from any other source including web sites, unless specified as references. We have not distributed our work to other students.

Specify what each member has done towards the completion of this work:

| Name | Task(s) |
|---|---|
| 1 | |
| 2 | |
| 3 | |

Include the declaration above in a separate document or in your MATLAB script for submission.

---

# Submission

Run your live script and export it to PDF.

Submit the following through Blackboard:

- `WS10.pdf`
- Group work declaration and contributions

Only the last submission will be marked.

Only one person must submit for the group.
