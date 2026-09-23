# Week 11 — Color Fundamentals and Color Image Processing

**Course:** SEG800 — Digital Signal and Image Processing  
**Topic:** Color Fundamentals, Color Models, Pseudocolor, Color Image Processing, and Color Transformations

---

## Table of Contents

1. [Learning Objectives](#1-learning-objectives)
2. [Color Fundamentals](#2-color-fundamentals)
3. [Human Color Vision](#3-human-color-vision)
4. [Primary and Secondary Colors](#4-primary-and-secondary-colors)
5. [Chromaticity and Color Gamut](#5-chromaticity-and-color-gamut)
6. [Color Models and Color Spaces](#6-color-models-and-color-spaces)
7. [RGB Color Model](#7-rgb-color-model)
8. [CMY and CMYK Color Models](#8-cmy-and-cmyk-color-models)
9. [HSI Color Model](#9-hsi-color-model)
10. [CIE L\*a\*b\* Color Model](#10-cie-lab-color-model)
11. [Pseudocolor Image Processing](#11-pseudocolor-image-processing)
12. [Full-Color Image Processing](#12-full-color-image-processing)
13. [Color Image Smoothing and Sharpening](#13-color-image-smoothing-and-sharpening)
14. [Histogram Equalization in Color Images](#14-histogram-equalization-in-color-images)
15. [Color Transformations](#15-color-transformations)
16. [Color Complements](#16-color-complements)
17. [Color Slicing](#17-color-slicing)
18. [Tonal Correction and Color Balancing](#18-tonal-correction-and-color-balancing)
19. [Comparison Tables](#19-comparison-tables)
20. [Exam Cheat Sheet](#20-exam-cheat-sheet)

---

# 1. Learning Objectives

After studying this material, you should be able to:

- Explain the difference between radiance, luminance, brightness, and intensity.
- Describe how the human eye perceives color through red-, green-, and blue-sensitive cones.
- Distinguish additive color mixing from subtractive color mixing.
- Explain the RGB, CMY, CMYK, HSI, and CIE L\*a\*b\* color spaces.
- Convert normalized RGB values to CMY and CMYK.
- Convert between RGB and HSI using the provided equations.
- Explain chromaticity, color gamut, and the CIE chromaticity diagram.
- Describe intensity slicing and intensity-to-color transformations.
- Explain two major approaches to processing full-color images.
- Perform smoothing, sharpening, and histogram enhancement on color images.
- Explain color complements, color slicing, tonal correction, and color balancing.

---

# 2. Color Fundamentals

## 2.1 Achromatic and Chromatic Light

### Achromatic light

**Achromatic** means that the light has no color.

An achromatic image is characterized only by intensity and includes:

- Black
- Gray
- White

A grayscale image is therefore an achromatic image.

### Chromatic light

**Chromatic** light contains color information.

Visible chromatic light is part of the electromagnetic spectrum. White light can be separated into a spectrum of colors by passing it through a prism.

The visible spectrum is approximately:

\[
400\text{ nm} \leq \lambda \leq 700\text{ nm}
\]

where \(\lambda\) is wavelength.

Approximate wavelength regions:

| Color | Approximate wavelength |
|---|---:|
| Violet | 400–450 nm |
| Blue | 450–495 nm |
| Green | 495–570 nm |
| Yellow | 570–590 nm |
| Orange | 590–620 nm |
| Red | 620–700 nm |

The exact boundaries are not sharp because color perception changes gradually with wavelength.

---

## 2.2 Radiance, Luminance, Brightness, and Intensity

These terms are related but are not identical.

| Term | Meaning |
|---|---|
| **Radiance** | Physical amount of energy emitted or flowing from a light source |
| **Luminance** | Amount of light energy perceived by a human observer |
| **Brightness** | Subjective description of how bright something appears |
| **Intensity** | Measurable numerical quantity commonly used as a proxy for brightness |

### Important distinction

Brightness is subjective and cannot be measured directly in exactly the same way for every observer.

Intensity is the closest convenient numerical representation used in digital image processing.

---

# 3. Human Color Vision

The retina contains photoreceptor cells called **cones**, which are responsible for color vision.

The three broad cone types are sensitive mainly to:

- Long wavelengths — associated with red
- Medium wavelengths — associated with green
- Short wavelengths — associated with blue

The lecture gives the approximate distribution:

- 65% red-sensitive cones
- 33% green-sensitive cones
- 2% blue-sensitive cones

Although blue-sensitive cones are fewer in number, the blue response is still important to color perception.

The cone-response curves overlap. Therefore, a single wavelength may stimulate more than one cone type.

## Key idea

The human eye perceives colors as different combinations of responses from the red, green, and blue cone systems.

This is the biological motivation for the RGB color model.

---

# 4. Primary and Secondary Colors

## 4.1 Additive Primary Colors of Light

The primary colors of **light** are:

\[
R,\quad G,\quad B
\]

They are called **additive primaries** because light intensities are added together.

### Additive color combinations

\[
R + G = Y
\]

\[
G + B = C
\]

\[
R + B = M
\]

\[
R + G + B = \text{White}
\]

where:

- \(Y\) = yellow
- \(C\) = cyan
- \(M\) = magenta

### Additive mixing table

| Light combination | Result |
|---|---|
| Red + Green | Yellow |
| Green + Blue | Cyan |
| Red + Blue | Magenta |
| Red + Green + Blue | White |
| No light | Black |

Additive mixing is used in devices that **emit light**, including:

- Computer monitors
- Televisions
- Phone screens
- Projectors

---

## 4.2 Subtractive Primary Colors of Pigments

The primary colors of **pigments or inks** are:

\[
C,\quad M,\quad Y
\]

They are called **subtractive primaries** because pigments absorb, or subtract, portions of incident white light.

- Cyan absorbs red.
- Magenta absorbs green.
- Yellow absorbs blue.

### Subtractive combinations

| Pigment combination | Ideal result |
|---|---|
| Cyan + Magenta | Blue |
| Magenta + Yellow | Red |
| Cyan + Yellow | Green |
| Cyan + Magenta + Yellow | Black |

In practice, real inks are not ideal. Mixing cyan, magenta, and yellow usually produces a muddy dark color rather than a deep black. Therefore, printing commonly adds a separate black channel \(K\).

---

# 5. Chromaticity and Color Gamut

## 5.1 Tristimulus Values

A color can be represented by three quantities called **tristimulus values**:

\[
X,\quad Y,\quad Z
\]

These represent the amounts of three reference primaries needed to describe a color.

## 5.2 Trichromatic Coefficients

The normalized chromaticity coordinates are:

\[
x = \frac{X}{X+Y+Z}
\]

\[
y = \frac{Y}{X+Y+Z}
\]

\[
z = \frac{Z}{X+Y+Z}
\]

Therefore:

\[
x+y+z=1
\]

Only two values are independent. Once \(x\) and \(y\) are known:

\[
z=1-x-y
\]

This allows chromaticity to be represented in a two-dimensional diagram.

---

## 5.3 CIE Chromaticity Diagram

The CIE chromaticity diagram represents visible chromaticities using \(x\) and \(y\).

Important properties:

- Pure spectral colors are found on the curved outer boundary.
- The straight lower boundary joins the red and violet ends and is called the **line of purples**.
- The equal-energy point corresponds to equal proportions of the three reference components.
- A line segment between two colors represents all colors that can be produced by mixing those two colors.
- A triangle formed by three selected primaries contains all colors that those primaries can reproduce.

### Important limitation

No triangle formed from three fixed physical primaries can contain the entire visible chromaticity region.

Therefore, no real three-primary display can reproduce every color visible to the human eye.

---

## 5.4 Color Gamut

A device's **color gamut** is the subset of colors that the device can reproduce.

Examples:

- A monitor has one gamut.
- A printer has another gamut.
- A camera sensor has its own capture gamut.
- Two monitors may have different gamuts.

A color visible on a monitor may not be printable exactly because the printer's gamut can be smaller or differently shaped.

---

# 6. Color Models and Color Spaces

A **color model** or **color space** is a coordinate system used to represent colors numerically.

Different color spaces are useful for different tasks.

| Color model | Main application |
|---|---|
| RGB | Cameras, displays, image acquisition, electronic presentation |
| CMY | Basic subtractive printing model |
| CMYK | Practical color printing |
| HSI | Human-oriented image analysis and manipulation |
| CIE L\*a\*b\* | Device-independent and perceptually oriented color representation |

A color image is often represented as a vector-valued function:

\[
\mathbf{f}(x,y)=
\begin{bmatrix}
f_1(x,y)\\
f_2(x,y)\\
f_3(x,y)
\end{bmatrix}
\]

For an RGB image:

\[
\mathbf{f}(x,y)=
\begin{bmatrix}
R(x,y)\\
G(x,y)\\
B(x,y)
\end{bmatrix}
\]

Each spatial coordinate \((x,y)\) addresses the same pixel location in all three component images.

---

# 7. RGB Color Model

## 7.1 RGB Color Cube

Normalized RGB values satisfy:

\[
0 \leq R,G,B \leq 1
\]

The RGB color space forms a cube.

Important vertices:

| Color | Coordinates |
|---|---|
| Black | \((0,0,0)\) |
| Red | \((1,0,0)\) |
| Green | \((0,1,0)\) |
| Blue | \((0,0,1)\) |
| Yellow | \((1,1,0)\) |
| Cyan | \((0,1,1)\) |
| Magenta | \((1,0,1)\) |
| White | \((1,1,1)\) |

The main diagonal from black to white contains grayscale values:

\[
R=G=B
\]

Examples:

\[
(0,0,0)=\text{black}
\]

\[
(0.5,0.5,0.5)=\text{middle gray}
\]

\[
(1,1,1)=\text{white}
\]

---

## 7.2 24-Bit RGB Images

A common RGB image uses 8 bits for each channel.

\[
8\text{ bits for R} + 8\text{ bits for G} + 8\text{ bits for B}
=24\text{ bits/pixel}
\]

Each channel has:

\[
2^8=256
\]

possible values, from 0 to 255.

The total number of possible colors is:

\[
256^3=(2^8)^3=2^{24}=16,777,216
\]

### Example

\[
(R,G,B)=(255,0,0)
\]

is full red.

\[
(R,G,B)=(255,255,0)
\]

is yellow.

\[
(R,G,B)=(128,128,128)
\]

is gray.

---

## 7.3 Acquiring and Displaying RGB Images

A color camera may use three sensor responses:

- Red-sensitive response
- Green-sensitive response
- Blue-sensitive response

These produce three component images.

A display performs the reverse operation: the three component values control the red, green, and blue output intensities of the display.

---

# 8. CMY and CMYK Color Models

# 8.1 RGB to CMY Conversion

For normalized RGB and CMY values:

\[
\begin{bmatrix}
C\\
M\\
Y
\end{bmatrix}
=
\begin{bmatrix}
1\\
1\\
1
\end{bmatrix}
-
\begin{bmatrix}
R\\
G\\
B
\end{bmatrix}
\]

Therefore:

\[
C=1-R
\]

\[
M=1-G
\]

\[
Y=1-B
\]

The inverse conversion is the same form:

\[
R=1-C
\]

\[
G=1-M
\]

\[
B=1-Y
\]

### Example

Suppose:

\[
(R,G,B)=(0.2,0.6,0.9)
\]

Then:

\[
C=1-0.2=0.8
\]

\[
M=1-0.6=0.4
\]

\[
Y=1-0.9=0.1
\]

Thus:

\[
(C,M,Y)=(0.8,0.4,0.1)
\]

---

## 8.2 CMYK Color Model

Real cyan, magenta, and yellow inks do not produce a sufficiently deep black when mixed. The CMYK model adds a black channel \(K\).

Starting with normalized CMY:

\[
K=\min(C,M,Y)
\]

If:

\[
K=1
\]

then set:

\[
C=M=Y=0
\]

Otherwise:

\[
C'=\frac{C-K}{1-K}
\]

\[
M'=\frac{M-K}{1-K}
\]

\[
Y'=\frac{Y-K}{1-K}
\]

The CMYK result is:

\[
(C',M',Y',K)
\]

The lecture reuses the symbols \(C,M,Y\) after the update. The prime notation is used here to make the before-and-after values clearer.

### Example

Using:

\[
(C,M,Y)=(0.8,0.4,0.1)
\]

First:

\[
K=\min(0.8,0.4,0.1)=0.1
\]

Then:

\[
C'=\frac{0.8-0.1}{1-0.1}
=\frac{0.7}{0.9}
\approx0.7778
\]

\[
M'=\frac{0.4-0.1}{0.9}
\approx0.3333
\]

\[
Y'=\frac{0.1-0.1}{0.9}=0
\]

Therefore:

\[
(C',M',Y',K)
\approx(0.7778,0.3333,0,0.1)
\]

---

# 9. HSI Color Model

HSI represents color in a way that is closer to common human descriptions.

The three channels are:

- **Hue \(H\):** dominant pure color, such as red, green, or orange
- **Saturation \(S\):** purity of the color, or how much it is diluted by white
- **Intensity \(I\):** overall light intensity

## 9.1 Interpretation

### Hue

Hue identifies the basic color family.

Examples:

- Red
- Yellow
- Green
- Cyan
- Blue
- Magenta

Hue is commonly represented as an angle:

\[
0^\circ \leq H < 360^\circ
\]

Typical positions:

| Hue | Approximate angle |
|---|---:|
| Red | \(0^\circ\) |
| Yellow | \(60^\circ\) |
| Green | \(120^\circ\) |
| Cyan | \(180^\circ\) |
| Blue | \(240^\circ\) |
| Magenta | \(300^\circ\) |

### Saturation

Saturation represents color purity.

- \(S=0\): achromatic gray
- High \(S\): vivid or pure color
- Low \(S\): washed-out color

### Intensity

Intensity describes overall light level:

- Low intensity: dark
- High intensity: bright

An important advantage of HSI is that intensity is separated from hue and saturation.

---

## 9.2 RGB to HSI Conversion

Assume \(R\), \(G\), and \(B\) are normalized to \([0,1]\).

First calculate:

\[
\theta=
\cos^{-1}
\left[
\frac{
\frac{1}{2}\left[(R-G)+(R-B)\right]
}{
\sqrt{(R-G)^2+(R-B)(G-B)}
}
\right]
\]

Then:

\[
H=
\begin{cases}
\theta, & B\leq G\\
360^\circ-\theta, & B>G
\end{cases}
\]

Hue may be normalized to \([0,1]\) by:

\[
H_{\text{normalized}}=\frac{H}{360^\circ}
\]

Saturation is:

\[
S=
1-
\frac{3}{R+G+B}
\min(R,G,B)
\]

Intensity is:

\[
I=\frac{1}{3}(R+G+B)
\]

If:

\[
R+G+B=0
\]

the pixel is black, so saturation is normally defined as \(S=0\), and hue is undefined or assigned a conventional value such as 0.

---

## 9.3 HSI to RGB Conversion

The conversion depends on the hue sector.

Assume:

\[
0\leq H<360^\circ
\]

and \(S,I\in[0,1]\).

## RG sector

For:

\[
0^\circ\leq H<120^\circ
\]

\[
B=I(1-S)
\]

\[
R=
I\left[
1+
\frac{S\cos H}{\cos(60^\circ-H)}
\right]
\]

\[
G=3I-(R+B)
\]

## GB sector

For:

\[
120^\circ\leq H<240^\circ
\]

First shift the angle:

\[
H'=H-120^\circ
\]

Then:

\[
R=I(1-S)
\]

\[
G=
I\left[
1+
\frac{S\cos H'}{\cos(60^\circ-H')}
\right]
\]

\[
B=3I-(R+G)
\]

## BR sector

For:

\[
240^\circ\leq H<360^\circ
\]

First shift the angle:

\[
H'=H-240^\circ
\]

Then:

\[
G=I(1-S)
\]

\[
B=
I\left[
1+
\frac{S\cos H'}{\cos(60^\circ-H')}
\right]
\]

\[
R=3I-(G+B)
\]

> **Correction to the slide:** The BR sector is shown on the slide with the same interval as the GB sector. The correct BR interval is \(240^\circ\leq H<360^\circ\).

---

## 9.4 Why HSI Is Useful

Suppose the goal is to increase image brightness without changing the underlying colors.

In RGB, all three channels must be adjusted carefully.

In HSI, one can:

1. Convert RGB to HSI.
2. Modify only \(I\).
3. Keep \(H\) and \(S\) unchanged.
4. Convert HSI back to RGB.

This is often easier and more intuitive.

---

# 10. CIE L\*a\*b\* Color Model

CIE stands for:

**Commission Internationale de l'Éclairage**, or the International Commission on Illumination.

The L\*a\*b\* channels are:

- \(L^*\): lightness
- \(a^*\): red–green opponent dimension
- \(b^*\): yellow–blue opponent dimension

A common interpretation is:

- Positive \(a^*\): more red
- Negative \(a^*\): more green
- Positive \(b^*\): more yellow
- Negative \(b^*\): more blue

The lecture slide summarizes \(b^*\) as a green/blue difference, but the standard perceptual axis is conventionally described as yellow versus blue.

## Main characteristics

### Device-independent

The color specification is not tied directly to one particular monitor or printer.

### Colorimetric

Colors perceived as matching can be represented consistently.

### Approximately perceptually uniform

Similar numerical distances are intended to correspond roughly to similar perceived color differences.

### Broad gamut

L\*a\*b\* is designed to represent the visible color range.

## Color difference

A simple Euclidean color difference is:

\[
\Delta E_{ab}^*
=
\sqrt{
(\Delta L^*)^2+
(\Delta a^*)^2+
(\Delta b^*)^2
}
\]

This provides a numerical estimate of how different two colors appear.

---

# 11. Pseudocolor Image Processing

## 11.1 Definition

**Pseudocolor**, also called false color, assigns colors to a grayscale image.

The colors do not necessarily represent the object's real physical color.

Instead, color is used to make intensity differences easier to see.

## Why use pseudocolor?

Humans can distinguish relatively few gray levels simultaneously, but can distinguish thousands of color variations.

Pseudocolor is useful in:

- Medical images
- X-ray inspection
- Thermal images
- Weather maps
- Elevation maps
- Satellite imagery
- Scientific visualization

---

## 11.2 Intensity Slicing

Intensity slicing divides the grayscale range into intervals.

Suppose an image has intensities:

\[
0\leq f(x,y)\leq L-1
\]

Choose thresholds:

\[
l_0<l_1<\cdots<l_P
\]

Each interval is assigned a color.

For example:

\[
f(x,y)\in[0,50)
\rightarrow \text{blue}
\]

\[
f(x,y)\in[50,100)
\rightarrow \text{green}
\]

\[
f(x,y)\in[100,150)
\rightarrow \text{yellow}
\]

\[
f(x,y)\in[150,255]
\rightarrow \text{red}
\]

Mathematically:

\[
\mathbf{g}(x,y)=\mathbf{c}_k
\quad
\text{if }
l_{k-1}\leq f(x,y)<l_k
\]

where \(\mathbf{c}_k\) is an RGB color vector.

### Two-color slicing

For one threshold \(l_i\):

\[
\mathbf{g}(x,y)=
\begin{cases}
\mathbf{c}_1, & f(x,y)<l_i\\
\mathbf{c}_2, & f(x,y)\geq l_i
\end{cases}
\]

### Application example

In a weld X-ray, a narrow intensity range corresponding to cracks can be assigned yellow while the rest is assigned blue. This makes possible defects easier to locate.

---

## 11.3 Intensity-to-Color Transformations

Instead of assigning one constant color to each interval, the grayscale input can be sent through three continuous transformations:

\[
R(x,y)=T_R[f(x,y)]
\]

\[
G(x,y)=T_G[f(x,y)]
\]

\[
B(x,y)=T_B[f(x,y)]
\]

The resulting color image is:

\[
\mathbf{g}(x,y)=
\begin{bmatrix}
T_R[f(x,y)]\\
T_G[f(x,y)]\\
T_B[f(x,y)]
\end{bmatrix}
\]

Different transformation functions produce different color maps.

This is the basis of common color maps used in scientific visualization.

---

## 11.4 Multiple Grayscale Inputs

Pseudocolor can also combine multiple grayscale images.

Suppose:

\[
f_1(x,y),f_2(x,y),\ldots,f_K(x,y)
\]

represent different sensors or spectral bands.

Apply transformations:

\[
g_k(x,y)=T_k[f_k(x,y)]
\]

Then map the processed results into RGB channels:

\[
h_R(x,y),\quad h_G(x,y),\quad h_B(x,y)
\]

### Multispectral example

A satellite may provide:

- Red band
- Green band
- Blue band
- Near-infrared band

A false-color image can map near-infrared to the red display channel, making vegetation or other features easier to distinguish.

The displayed color does not necessarily match natural human vision, but it reveals useful information.

---

# 12. Full-Color Image Processing

There are two major approaches.

## Approach 1: Process each channel separately

For RGB:

1. Separate the image into \(R\), \(G\), and \(B\).
2. Apply the same or different operation to each channel.
3. Recombine the channels.

For an operation \(T\):

\[
R'=T(R)
\]

\[
G'=T(G)
\]

\[
B'=T(B)
\]

Then:

\[
\mathbf{g}(x,y)=
\begin{bmatrix}
R'(x,y)\\
G'(x,y)\\
B'(x,y)
\end{bmatrix}
\]

### Advantage

Simple and compatible with grayscale algorithms.

### Risk

If channels are modified differently or nonlinearly, unintended hue shifts may occur.

---

## Approach 2: Process the color vector or a perceptual component

One common workflow is:

1. Convert RGB to HSI.
2. Process only the intensity component.
3. Preserve hue and saturation.
4. Convert back to RGB.

This is useful when the intended operation is mainly brightness-related.

Examples:

- Smoothing
- Sharpening
- Histogram equalization
- Illumination correction

---

## Vector Interpretation

An RGB pixel is a vector:

\[
\mathbf{z}(x,y)=
\begin{bmatrix}
R(x,y)\\
G(x,y)\\
B(x,y)
\end{bmatrix}
\]

A neighborhood in a color image is therefore a neighborhood of vectors rather than scalar values.

Some operations can be defined directly on these vectors rather than on each channel independently.

---

# 13. Color Image Smoothing and Sharpening

## 13.1 Smoothing

Smoothing reduces rapid spatial variations and noise.

### Method 1: Smooth each RGB channel

Given a spatial kernel \(w(s,t)\):

\[
R'(x,y)
=
\sum_s\sum_t
w(s,t)R(x+s,y+t)
\]

\[
G'(x,y)
=
\sum_s\sum_t
w(s,t)G(x+s,y+t)
\]

\[
B'(x,y)
=
\sum_s\sum_t
w(s,t)B(x+s,y+t)
\]

Then recombine \(R'\), \(G'\), and \(B'\).

### Method 2: Smooth only HSI intensity

1. Convert RGB to HSI.
2. Filter \(I(x,y)\).
3. Preserve \(H(x,y)\) and \(S(x,y)\).
4. Convert back to RGB.

If:

\[
I'(x,y)=w\star I(x,y)
\]

the output is:

\[
(H,S,I')\rightarrow(R',G',B')
\]

### Comparison

For linear smoothing, the results of RGB-channel smoothing and intensity-only HSI smoothing may be similar, but they are not always identical because RGB-to-HSI conversion is nonlinear.

---

## 13.2 Sharpening

Sharpening emphasizes transitions and fine detail.

### RGB-channel method

Apply a sharpening operator, such as the Laplacian, independently:

\[
R'=R-c\nabla^2 R
\]

\[
G'=G-c\nabla^2 G
\]

\[
B'=B-c\nabla^2 B
\]

where the sign and value of \(c\) depend on the chosen Laplacian convention.

### HSI-intensity method

1. Convert RGB to HSI.
2. Sharpen \(I\).
3. Keep \(H\) and \(S\) unchanged.
4. Convert back to RGB.

For example:

\[
I'=I-c\nabla^2I
\]

### Practical idea

If the goal is to enhance edges without intentionally changing color, processing intensity is often conceptually cleaner.

---

# 14. Histogram Equalization in Color Images

Histogram equalization redistributes intensity values to improve contrast.

## Incorrect or risky approach

Applying histogram equalization independently to \(R\), \(G\), and \(B\) can change their ratios.

Since color depends on the ratios among RGB components, separate equalization can produce severe hue distortion.

## Preferred HSI approach

1. Convert RGB to HSI.
2. Equalize the intensity histogram.
3. Leave hue and saturation unchanged.
4. Optionally adjust saturation.
5. Convert back to RGB.

Let:

\[
I'=T_{\text{HE}}(I)
\]

Then:

\[
(H,S,I')\rightarrow(R',G',B')
\]

### Saturation adjustment

After intensity equalization, the image may appear less vivid or too vivid. Saturation can then be modified:

\[
S'=T_S(S)
\]

while preserving hue.

---

# 15. Color Transformations

A general color transformation maps input components \(r_i\) to output components \(s_i\):

\[
s_i=T_i(r_i),
\qquad
i=1,2,\ldots,n
\]

For RGB:

\[
n=3
\]

and:

\[
r_1=R,\quad r_2=G,\quad r_3=B
\]

Transformations may be used to:

- Change brightness
- Enhance contrast
- Correct color casts
- Produce complements
- Isolate selected colors
- Perform tone correction
- Balance printing channels

---

## 15.1 Multiplying Intensity by a Constant

Suppose the desired brightness factor is \(k\).

- \(0<k<1\): darkens the image
- \(k>1\): brightens the image, subject to clipping

## HSI

Only intensity is changed:

\[
I'=kI
\]

while:

\[
H'=H,\qquad S'=S
\]

In the lecture's component notation:

\[
s_3=kr_3
\]

## RGB

All three channels are scaled:

\[
R'=kR
\]

\[
G'=kG
\]

\[
B'=kB
\]

or:

\[
s_i=kr_i,
\qquad i=1,2,3
\]

If \(k=0.7\), intensities are reduced by 30%.

## CMY

Because CMY is complementary to RGB:

\[
C=1-R
\]

If RGB is scaled by \(k\), then the corresponding CMY mapping becomes:

\[
C'=kC+(1-k)
\]

\[
M'=kM+(1-k)
\]

\[
Y'=kY+(1-k)
\]

or:

\[
s_i=kr_i+(1-k),
\qquad i=1,2,3
\]

## CMYK

The lecture gives:

\[
s_i=
\begin{cases}
r_i, & i=1,2,3\\
kr_i+(1-k), & i=4
\end{cases}
\]

Thus cyan, magenta, and yellow are left unchanged, while the black component is transformed.

---

## 15.2 Clipping

After a transformation, values must remain within the permitted range.

For normalized values:

\[
s_{\text{clipped}}=
\min\left(1,\max(0,s)\right)
\]

For 8-bit images:

\[
s_{\text{clipped}}=
\min\left(255,\max(0,s)\right)
\]

---

# 16. Color Complements

A complement lies opposite the original color on a color circle.

Examples:

| Color | Complement |
|---|---|
| Red | Cyan |
| Green | Magenta |
| Blue | Yellow |
| Yellow | Blue |
| Cyan | Red |
| Magenta | Green |

## 16.1 RGB Complement

For normalized RGB:

\[
R'=1-R
\]

\[
G'=1-G
\]

\[
B'=1-B
\]

In vector form:

\[
\mathbf{s}=\mathbf{1}-\mathbf{r}
\]

For 8-bit channels:

\[
R'=255-R
\]

\[
G'=255-G
\]

\[
B'=255-B
\]

This is similar to producing a color negative.

---

## 16.2 Approximate Complement in HSI

The lecture illustrates an HSI approximation using:

- Hue shifted by half of the hue circle
- Saturation retained
- Intensity complemented

A typical normalized mapping is:

\[
H'=(H+0.5)\bmod 1
\]

\[
S'=S
\]

\[
I'=1-I
\]

If hue is measured in degrees:

\[
H'=(H+180^\circ)\bmod360^\circ
\]

This can approximate the RGB complement, although the results are not necessarily exactly identical.

---

# 17. Color Slicing

Color slicing isolates a selected range of colors and suppresses the others.

Let a pixel in RGB be:

\[
\mathbf{z}=
\begin{bmatrix}
R\\G\\B
\end{bmatrix}
\]

Let the target color be:

\[
\mathbf{a}=
\begin{bmatrix}
a_R\\a_G\\a_B
\end{bmatrix}
\]

## 17.1 Cube-Based Slicing

A pixel lies inside a cube of width \(W\) centered at \(\mathbf{a}\) when:

\[
|R-a_R|\leq\frac{W}{2}
\]

\[
|G-a_G|\leq\frac{W}{2}
\]

\[
|B-a_B|\leq\frac{W}{2}
\]

A transformation may preserve pixels inside the cube and replace all others with gray:

\[
\mathbf{g}(\mathbf{z})=
\begin{cases}
\mathbf{z}, & \mathbf{z}\text{ is inside the cube}\\
\mathbf{c}_{\text{background}}, & \text{otherwise}
\end{cases}
\]

---

## 17.2 Sphere-Based Slicing

Calculate Euclidean distance in RGB space:

\[
D(\mathbf{z},\mathbf{a})
=
\sqrt{
(R-a_R)^2+
(G-a_G)^2+
(B-a_B)^2
}
\]

Preserve the color if:

\[
D(\mathbf{z},\mathbf{a})\leq R_0
\]

where \(R_0\) is the selected radius.

### Cube versus sphere

| Region | Condition | Characteristic |
|---|---|---|
| Cube | Independent limits on R, G, and B | Easy to calculate |
| Sphere | Euclidean color distance | Treats directions more uniformly in RGB space |

RGB space is not perceptually uniform, so equal Euclidean distances in RGB do not always correspond to equal perceived color differences. L\*a\*b\* is often better for perceptually based color selection.

---

# 18. Tonal Correction and Color Balancing

## 18.1 Tonal Correction

Tonal correction modifies the distribution of image intensities.

Common cases:

### Flat image

A flat image has weak contrast.

An S-shaped contrast transformation expands differences in the middle range while compressing extremes.

### High-key image

A high-key image is dominated by light tones.

A transformation can redistribute the light values to increase visible contrast.

### Low-key image

A low-key image is dominated by dark tones.

A transformation that expands dark values can reveal shadow detail.

A general power-law transformation is:

\[
s=cr^\gamma
\]

where:

- \(\gamma<1\) brightens dark regions.
- \(\gamma>1\) darkens the image or can improve bright-region detail.
- \(c\) is a scaling constant.

### Equal RGB transformations

Applying the same monotonic transformation to all RGB channels often preserves color relationships better than applying different transformations, but nonlinear equal transformations can still alter exact channel ratios.

---

## 18.2 Color Balancing

Color balancing corrects a color cast by changing selected channels.

In CMYK, individual channel curves can be adjusted.

Examples shown in the lecture include images that are:

- Heavy in black
- Weak in black
- Heavy in cyan
- Weak in cyan
- Heavy in magenta
- Weak in magenta
- Heavy in yellow
- Weak in yellow

### Concept

If an image is too cyan, reduce cyan or increase its complementary red contribution.

If an image is too magenta, reduce magenta or increase green.

If an image is too yellow, reduce yellow or increase blue.

If an image is too dark due to excess \(K\), reduce the black component.

---

# 19. Comparison Tables

## 19.1 Color Model Comparison

| Model | Components | Main idea | Typical use |
|---|---|---|---|
| RGB | Red, Green, Blue | Additive light | Cameras and displays |
| CMY | Cyan, Magenta, Yellow | Subtractive pigments | Basic printing model |
| CMYK | Cyan, Magenta, Yellow, Black | Practical subtractive printing | Printers |
| HSI | Hue, Saturation, Intensity | Human-oriented description | Enhancement and analysis |
| L\*a\*b\* | Lightness, red–green, yellow–blue | Device-independent, approximately perceptual | Color measurement and comparison |

---

## 19.2 RGB Versus HSI Processing

| Task | RGB-channel processing | HSI-intensity processing |
|---|---|---|
| Brightness adjustment | Scale R, G, and B | Modify I only |
| Smoothing | Filter three channels | Filter I only |
| Sharpening | Sharpen three channels | Sharpen I only |
| Histogram equalization | Can distort colors if done independently | Equalize I, preserve H and S |
| Color manipulation | Less intuitive | H and S are directly meaningful |

---

## 19.3 True Color Versus Pseudocolor

| True/full color | Pseudocolor |
|---|---|
| Color is captured from the scene | Color is assigned artificially |
| Usually has actual RGB sensor information | Often begins with one or more grayscale images |
| Intended to resemble natural visual appearance | Intended to highlight information |
| Example: normal camera image | Example: thermal color map |

---

## 19.4 Additive Versus Subtractive Mixing

| Additive | Subtractive |
|---|---|
| Uses emitted light | Uses pigments or ink |
| Primaries: RGB | Primaries: CMY |
| All primaries produce white | Ideal all primaries produce black |
| No components produce black | No pigment leaves white paper |
| Used in monitors | Used in printing |

---

# 20. Exam Cheat Sheet

## Fundamental terms

- **Radiance:** physical emitted energy.
- **Luminance:** visually weighted perceived light.
- **Brightness:** subjective appearance.
- **Intensity:** numerical proxy for brightness.
- **Hue:** basic color.
- **Saturation:** color purity.
- **Gamut:** colors a device can reproduce.

---

## Additive colors

\[
R+G=Y
\]

\[
G+B=C
\]

\[
R+B=M
\]

\[
R+G+B=W
\]

---

## Chromaticity

\[
x=\frac{X}{X+Y+Z}
\]

\[
y=\frac{Y}{X+Y+Z}
\]

\[
z=\frac{Z}{X+Y+Z}
\]

\[
x+y+z=1
\]

---

## RGB cube

\[
(0,0,0)=\text{black}
\]

\[
(1,1,1)=\text{white}
\]

\[
R=G=B\Rightarrow\text{gray}
\]

For 24-bit RGB:

\[
(2^8)^3=16,777,216\text{ colors}
\]

---

## RGB and CMY

\[
C=1-R,\quad M=1-G,\quad Y=1-B
\]

\[
R=1-C,\quad G=1-M,\quad B=1-Y
\]

---

## CMYK

\[
K=\min(C,M,Y)
\]

For \(K\neq1\):

\[
C'=\frac{C-K}{1-K}
\]

\[
M'=\frac{M-K}{1-K}
\]

\[
Y'=\frac{Y-K}{1-K}
\]

---

## RGB to HSI

\[
\theta=
\cos^{-1}
\left[
\frac{
\frac12[(R-G)+(R-B)]
}{
\sqrt{(R-G)^2+(R-B)(G-B)}
}
\right]
\]

\[
H=
\begin{cases}
\theta,&B\leq G\\
360^\circ-\theta,&B>G
\end{cases}
\]

\[
S=1-\frac{3}{R+G+B}\min(R,G,B)
\]

\[
I=\frac{R+G+B}{3}
\]

---

## HSI hue sectors

- \(0^\circ\leq H<120^\circ\): RG sector
- \(120^\circ\leq H<240^\circ\): GB sector
- \(240^\circ\leq H<360^\circ\): BR sector

---

## Pseudocolor

### Intensity slicing

\[
\mathbf{g}(x,y)=\mathbf{c}_k
\quad
\text{when }
l_{k-1}\leq f(x,y)<l_k
\]

### Intensity-to-color mapping

\[
R=T_R(f),\qquad G=T_G(f),\qquad B=T_B(f)
\]

---

## Brightness scaling

### RGB

\[
R'=kR,\quad G'=kG,\quad B'=kB
\]

### HSI

\[
I'=kI
\]

### CMY

\[
C'=kC+(1-k)
\]

and similarly for \(M\) and \(Y\).

---

## RGB complement

\[
R'=1-R
\]

\[
G'=1-G
\]

\[
B'=1-B
\]

---

## Color distance in RGB

\[
D=
\sqrt{
(R-a_R)^2+
(G-a_G)^2+
(B-a_B)^2
}
\]

---

## Key conceptual answers

### Why not histogram-equalize RGB channels separately?

Because each channel receives a different nonlinear mapping. This changes the channel ratios and can distort hue.

### Why is HSI useful?

It separates intensity from chromatic information, so brightness-related processing can be applied mainly to \(I\).

### Why does CMYK use black ink?

Real CMY inks do not produce a clean deep black, and black ink improves darkness, detail, and printing efficiency.

### What is pseudocolor?

The artificial assignment of colors to grayscale values or grayscale sensor channels to make information easier to distinguish.

### What are the two main approaches to full-color processing?

1. Process each component independently and recombine.
2. Process the color vector directly or convert to a space such as HSI and process a selected component.

---

# Final Summary

- Human color vision is based mainly on combinations of red-, green-, and blue-sensitive cone responses.
- RGB is an additive model used for image capture and display.
- CMY and CMYK are subtractive models used for printing.
- HSI separates hue, saturation, and intensity, making it convenient for human-oriented enhancement.
- CIE L\*a\*b\* is device-independent and approximately perceptually uniform.
- Pseudocolor assigns artificial colors to grayscale information.
- Full-color images can be processed channel-by-channel or through color-space components.
- Smoothing, sharpening, and histogram equalization can be performed through the HSI intensity channel to reduce unwanted color changes.
- Color transformations include brightness modification, complements, color slicing, tonal correction, and color balancing.
