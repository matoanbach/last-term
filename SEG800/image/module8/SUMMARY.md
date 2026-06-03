Slide 8 matches many of the missing Test 1 topics. Here are the formulas, concepts, and definitions from **slides08_Image Transforms** that appear in **Test 1**. 

## Test 1 topics covered by Slide 8

| Test Q | Topic                                  | Slide 8 match                                           |
| ------ | -------------------------------------- | ------------------------------------------------------- |
| Q4     | Affine transformation preserves what?  | **Parallelism** is preserved in affine transformations. |
| Q9     | Point / pixel operation                | Output pixel depends only on the same input pixel.      |
| Q10    | Photographic negative                  | Negative transformation.                                |
| Q11    | Neighborhood operation                 | Smoothing / blurring is a neighborhood operation.       |
| Q12    | Geometric transformation affects what? | It changes **pixel locations**, not intensity values.   |
| Q13    | Histogram equalization                 | Enhances image by flattening / spreading histogram.     |
| Q14    | Gamma correction                       | Affects brightness / intensity perception.              |
| Q15    | Translation formula                    | (u = x + t_x,\ v = y + t_y)                             |
| Q18    | Homography matrix                      | 3×3 matrix for geometric transformations.               |

---

## Point / pixel operation

Definition from Slide 8:

```text
A point operation is a transform where each output pixel depends only
on the value of the same pixel in the input image.
```

Formula:

```text
Iout(i, j) = f(Iin(i, j))
```

Examples:

```text
Brightness adjustment:
Iout(i, j) = Iin(i, j) + b

Contrast adjustment:
Iout(i, j) = a Iin(i, j)
```

This directly matches **Q9**. 

---

## Neighborhood operation

Definition:

```text
A neighborhood operation is a transform where each output pixel depends
on the value of the pixel and its neighbors in the input image.
```

Example:

```text
Smoothing / blurring
```

This directly matches **Q11**, where the correct neighborhood operation example is **image smoothing**. 

---

## Negative transformation

Slide 8 shows the photographic negative transformation for an 8-bit image.

Formula:

```text
s = 255 - z
```

Meaning:

```text
z = input intensity
s = output intensity
```

This directly matches **Q10**.

---

## Gamma correction

Slide 8 gives the gamma equation:

```text
s = c r^γ
```

Meaning:

```text
r = input intensity
s = output intensity
c = constant
γ = gamma value
```

Main idea:

```text
Gamma correction changes brightness / intensity perception.
```

This matches **Q14**. 

---

## Geometric transformation

Definition:

```text
A geometric transformation maps a source pixel at location (x, y)
to a destination location (u, v).
```

Important idea:

```text
It changes pixel locations, not pixel intensity/color values.
```

This directly matches **Q12**. 

---

## Translation formula

```text
u = x + tx
v = y + ty
```

Meaning:

```text
tx = horizontal translation
ty = vertical translation
```

This directly matches **Q15**.

---

## Scaling formula

```text
u = x * sx
v = y * sy
```

Meaning:

```text
sx = scale factor in x direction
sy = scale factor in y direction
```

This appears in **Q18(a)**.

For scale factor 1.5 in both dimensions:

```text
u = 1.5x
v = 1.5y
```

Homography matrix:

```text
[ 1.5   0    0 ]
[  0   1.5   0 ]
[  0    0    1 ]
```

---

## Rotation formula

Slide 8 gives:

```text
u = x cosθ - y sinθ
v = y sinθ + x cosθ
```

Usually written as:

```text
u = x cosθ - y sinθ
v = x sinθ + y cosθ
```

This appears in **Q18(b)**.

For (30^\circ):

```text
cos(30°) = √3 / 2
sin(30°) = 1 / 2
```

Rotation matrix:

```text
[ cosθ   -sinθ   0 ]
[ sinθ    cosθ   0 ]
[  0       0     1 ]
```

For (30^\circ):

```text
[ √3/2   -1/2    0 ]
[ 1/2     √3/2   0 ]
[  0       0     1 ]
```

---

## Shear formula

Slide 8 also includes shear:

```text
u = x + y * shx
v = y + x * shy
```

Matrix form:

```text
[  1   shx   0 ]
[ shy   1    0 ]
[  0    0    1 ]
```

This was **not directly tested** in Test 1 except as one wrong option in Q15.

---

## Homography matrix

Slide 8 says a transform can be modeled by a **3×3 matrix**, called a **homography matrix**.

General form:

```text
[ u ]   [ h11  h12  h13 ] [ x ]
[ v ] = [ h21  h22  h23 ] [ y ]
[ 1 ]   [ h31  h32  h33 ] [ 1 ]
```

This directly matches **Q18**.

---

## Affine transformation

Important idea from Slide 8:

```text
In affine transformations, parallelism is preserved.
```

This directly matches **Q4**.

Examples of affine transformations:

```text
Translation
Scaling
Rotation
Shear
```

---

## Histogram

Definition:

```text
A histogram counts the number of pixels at each intensity value.
```

For grayscale image:

```text
X-axis: intensity values, usually 0 to 255
Y-axis: number of pixels with that intensity
```

Normalized histogram:

```text
p(rk) = h(rk) / MN
```

where:

```text
h(rk) = number of pixels with intensity rk
M × N = image size
```

And:

```text
Σ p(rk) = 1
```

---

## Histogram equalization

Definition:

```text
Histogram equalization transforms intensities so the histogram becomes
more spread out / closer to uniform.
```

Purpose:

```text
To enhance image contrast.
```

This directly matches **Q13**. 

Formula from Slide 8:

```text
sk = T(rk) = (L - 1) Σ p(rj)
```

where the sum is from:

```text
j = 0 to k
```

Meaning:

```text
L = number of intensity levels
rk = input intensity level
sk = output intensity level
p(rj) = normalized histogram value
```

---

## For Test 1, Slide 8 is very important for these answers

```text
Q4  → Parallelism
Q9  → Point operation
Q10 → Negative transformation: s = 255 - z
Q11 → Image smoothing
Q12 → Pixel locations
Q13 → Enhance contrast by flattening/spreading histogram
Q14 → Image brightness perception
Q15 → u = x + tx, v = y + ty
Q18 → Scale, rotate, translate using homography matrices
```

So Slide 8 covers almost all the transformation and histogram questions that Slide 7 did not cover.

----

# EXTRA
Yes — for **Slide 8: Image Transforms**, these are the extra definitions, formulas, and concepts you should add to your notes. 

## 1. Linear operation

```text
A linear operation satisfies:

H[a f1(x,y) + b f2(x,y)] = aH[f1(x,y)] + bH[f2(x,y)]
```

Meaning: if you combine two images first and then process them, it gives the same result as processing each image separately and then combining the results.

Common image arithmetic:

```text
Addition:       s(x,y) = f(x,y) + g(x,y)
Subtraction:    d(x,y) = f(x,y) - g(x,y)
Multiplication: p(x,y) = f(x,y) × g(x,y)
Division:       v(x,y) = f(x,y) ÷ g(x,y)
```

---

## 2. Linear blend / weighted image addition

```text
dst = α img1 + β img2 + γ
```

Meaning:

```text
α = weight for first image
β = weight for second image
γ = brightness offset
```

Special case:

```text
If α = 0.6 and β = 0.4,
the output is 60% image 1 and 40% image 2.
```

---

## 3. Spatial operations

There are three important types:

```text
Point / pixel operation:
Each output pixel depends only on the same input pixel.

Neighborhood operation:
Each output pixel depends on the pixel and its surrounding neighbors.

Geometric transformation:
Changes where pixels are located.
```

Examples:

```text
Point operation → brightness adjustment
Neighborhood operation → smoothing / blurring
Geometric transformation → rotation / translation
```

---

## 4. Point / pixel transform

```text
Iout(i,j) = f(Iin(i,j))
```

Meaning: the output pixel value is calculated from the input pixel at the same location.

Examples:

```text
Brightness adjustment:
Iout(i,j) = Iin(i,j) + b

Contrast adjustment:
Iout(i,j) = a Iin(i,j)
```

Quick idea:

```text
Add constant → changes brightness
Multiply by constant → changes contrast
```

---

## 5. Negative transformation

For an 8-bit image:

```text
s = 255 - z
```

Meaning:

```text
z = input intensity
s = output intensity
```

Example:

```text
If z = 0, then s = 255
If z = 255, then s = 0
```

This creates a photographic negative.

---

## 6. Contrast stretching and thresholding

```text
Contrast stretching:
Expands intensity values to improve contrast.

Thresholding:
Turns pixels into two groups, usually dark and light.
```

Simple threshold idea:

```text
If pixel >= threshold → white
If pixel < threshold → black
```

---

## 7. Gamma correction

Formula:

```text
s = c r^γ
```

Meaning:

```text
r = input intensity
s = output intensity
c = constant
γ = gamma value
```

Main concept:

```text
Gamma correction changes brightness perception.
```

Useful rule:

```text
γ < 1 → image becomes brighter
γ > 1 → image becomes darker
```

---

## 8. Neighborhood operation

```text
Sxy = neighborhood of pixel (x,y)
```

A common example is averaging/smoothing:

```text
Output pixel = average of nearby pixels
```

Purpose:

```text
Smoothing reduces noise but can blur edges.
```

---

## 9. Geometric transformation

```text
A pixel at source location (x,y) is mapped to destination location (u,v).
```

Important:

```text
Geometric transformations change pixel locations,
not the pixel intensity/color values.
```

---

## 10. Translation

```text
u = x + tx
v = y + ty
```

Meaning:

```text
tx = movement in x direction
ty = movement in y direction
```

Homography matrix:

```text
[ 1   0   tx ]
[ 0   1   ty ]
[ 0   0   1  ]
```

---

## 11. Scaling / resizing

```text
u = x sx
v = y sy
```

Meaning:

```text
sx = scale factor in x direction
sy = scale factor in y direction
```

Homography matrix:

```text
[ sx   0   0 ]
[ 0   sy   0 ]
[ 0    0   1 ]
```

---

## 12. Rotation

```text
u = x cosθ - y sinθ
v = x sinθ + y cosθ
```

Matrix:

```text
[ cosθ   -sinθ   0 ]
[ sinθ    cosθ   0 ]
[  0       0     1 ]
```

For 30 degrees:

```text
cos(30°) = √3/2
sin(30°) = 1/2
```

So:

```text
[ √3/2   -1/2    0 ]
[ 1/2     √3/2   0 ]
[  0       0     1 ]
```

---

## 13. Shear

```text
u = x + y shx
v = y + x shy
```

Matrix:

```text
[  1   shx   0 ]
[ shy   1    0 ]
[  0    0    1 ]
```

Meaning:

```text
Shear slants the image.
```

---

## 14. Affine vs projective transformation

```text
Affine transformation:
Preserves parallelism.

Projective transformation:
Preserves straight lines, but parallel lines may no longer stay parallel.
```

Good exam memory:

```text
Translation → preserves orientation
Rigid / Euclidean → preserves lengths
Similarity → preserves angles
Affine → preserves parallelism
Projective → preserves straight lines
```

---

## 15. Homography matrix

```text
A homography matrix is a 3×3 matrix used to represent 2D transformations.
```

General form:

```text
[ u ]   [ h11  h12  h13 ] [ x ]
[ v ] = [ h21  h22  h23 ] [ y ]
[ 1 ]   [ h31  h32  h33 ] [ 1 ]
```

Used for:

```text
Translation
Scaling
Rotation
Shear
Perspective/projective transformation
```

---

## 16. Interpolation

When rotating/scaling, new pixel locations may not land exactly on integer coordinates. Interpolation decides what intensity value to assign.

Types shown:

```text
Nearest-neighbor interpolation:
Uses closest pixel. Fast but blocky.

Bilinear interpolation:
Uses nearby pixels. Smoother.

Bicubic interpolation:
Uses more neighboring pixels. Usually smoother but slower.
```

---

## 17. Histogram

```text
Histogram:
Counts how many pixels have each intensity value.
```

For grayscale:

```text
X-axis: intensity values, usually 0 to 255
Y-axis: number of pixels with that intensity
```

Formula:

```text
h(rk) = nk
```

Meaning:

```text
rk = intensity level
nk = number of pixels with intensity rk
```

---

## 18. Normalized histogram

```text
p(rk) = h(rk) / MN = nk / MN
```

Meaning:

```text
M × N = image size
p(rk) = probability of intensity rk
```

Important rule:

```text
Σ p(rk) = 1
```

---

## 19. Histogram equalization

```text
Histogram equalization:
Transforms intensities to spread them out more evenly.
```

Purpose:

```text
Enhance image contrast.
```

Main idea:

```text
It tries to flatten the histogram into a more uniform distribution.
```

Formula:

```text
sk = T(rk) = (L - 1) Σ p(rj)
```

where:

```text
j = 0 to k
L = number of intensity levels
rk = input intensity
sk = output intensity
p(rj) = normalized histogram value
```

---

## Best extra things to add from Slide 8

```text
1. Linear operation definition
2. Image arithmetic: add, subtract, multiply, divide
3. Linear blend formula
4. Point operation definition
5. Brightness and contrast formulas
6. Negative transformation: s = 255 - z
7. Gamma correction: s = c r^γ
8. Neighborhood operation and smoothing
9. Geometric transformation definition
10. Translation, scaling, rotation, shear formulas
11. Homography matrix
12. Affine preserves parallelism
13. Projective preserves straight lines
14. Interpolation types
15. Histogram and normalized histogram
16. Histogram equalization
```
