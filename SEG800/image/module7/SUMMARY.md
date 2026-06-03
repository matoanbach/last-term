I went through **slides07_Intro_Image_Processing.pdf** and matched it with **Test 1**. These are the concepts, definitions, and formulas from Slide 7 that appear in the test. 

## Appears in Test 1

| Test Q | Topic                      | From slides                                                                                |
| ------ | -------------------------- | ------------------------------------------------------------------------------------------ |
| Q1     | Digital Image Processing   | Processing a digital image with a digital computer.                                        |
| Q2     | Human eye: cones           | Cones are responsible for bright-light/color vision.                                       |
| Q3     | Enhancement vs restoration | Enhancement is subjective; restoration uses mathematical/probabilistic degradation models. |
| Q5     | Quantization               | Converts continuous brightness values into discrete digital values.                        |
| Q6     | Weber ratio                | Measures brightness discrimination.                                                        |
| Q8     | Image energy source        | Main source is electromagnetic spectrum.                                                   |
| Q16    | m-adjacency                | Uses 4-neighbor and diagonal-neighbor rules.                                               |
| Q17    | Optics / focal length      | Uses lens formula/object-image distance idea.                                              |

## Important definitions to study

```text
Image:
A 2D function f(x, y), where x and y are spatial coordinates,
and f(x, y) is the intensity or gray level.

Digital image:
An image where x, y, and intensity values are finite and discrete.

Pixel:
One element of a digital image with location (x, y) and intensity f(x, y).

Digital Image Processing:
Processing a digital image with a digital computer.
```

From slides: these are directly in the Basic Definitions section. 

## Enhancement vs restoration

```text
Image enhancement:
Makes an image more suitable for a specific application.
It is based on subjective human preference.

Image restoration:
Improves image appearance using objective mathematical or probabilistic models.
```

This matches **Q3**. 

## Human vision concepts

```text
Cones:
Used for photopic / bright-light vision.
Sensitive to color.

Rods:
Used for scotopic / dim-light vision.
Sensitive to low illumination.

Blind spot:
Area with optic nerve and no receptors.
```

This matches **Q2**. 

## Weber ratio formula

```text
Weber ratio = ΔIc / I
```

Meaning:

```text
ΔIc = minimum change in illumination that can be detected
I = background illumination
```

Used to measure **brightness discrimination**, which is **Q6**. 

## Sampling and quantization

```text
Sampling:
Converts a continuous image into discrete spatial elements.
Related to spatial resolution.

Quantization:
Converts continuous brightness values into discrete digital values.
Related to intensity resolution.
```

Formula:

```text
Number of brightness levels = 2^b
```

where `b` is the number of bits. For example:

```text
8 bits → 2^8 = 256 levels
```

This matches **Q5**. 

## Optics formula

The slide gives the lens formula:

```text
1/zo + 1/zi = 1/f
```

where:

```text
zo = object distance
zi = image distance
f  = focal length
```

This matches **Q17**, where they give focal length and image distance and ask for object distance. 

## Pixel adjacency formulas

For a pixel:

```text
p = (x, y)
```

4-neighbors:

```text
N4(p) = {(x+1,y), (x-1,y), (x,y+1), (x,y-1)}
```

Diagonal neighbors:

```text
ND(p) = {(x+1,y+1), (x+1,y-1), (x-1,y+1), (x-1,y-1)}
```

8-neighbors:

```text
N8(p) = N4(p) ∪ ND(p)
```

m-adjacency rule:

```text
Two pixels p and q are m-adjacent if:

1. q is in N4(p), or

2. q is in ND(p), and N4(p) ∩ N4(q)
   has no pixels with values from V.
```

This matches **Q16**. 

## Distance formulas from the slides

These appear in Slide 7, but I do **not** see them directly tested in your Test 1 images.

```text
Euclidean distance:
De(p, q) = [(x - u)^2 + (y - v)^2]^(1/2)

City-block / Manhattan distance:
D4(p, q) = |x - u| + |y - v|

Chessboard distance:
D8(p, q) = max(|x - u|, |y - v|)
```

## Test topics not really covered in Slide 7

These appear in Test 1, but I do **not** see them clearly covered in this Slide 7 deck:

```text
Q4  Affine transformation preserves parallelism
Q9  Point / pixel operation
Q10 Negative transformation: s = 255 - z
Q11 Neighborhood operation example: smoothing
Q12 Geometric transformation affects pixel locations
Q13 Histogram equalization
Q14 Gamma correction
Q15 Translation formula
Q18 Homography matrix: scale, rotate, translate
```

So for Test 1, Slide 7 covers mostly **intro image processing, human vision, acquisition, sampling/quantization, optics, and adjacency**. The transformation and histogram questions likely come from another slide set or lecture.



-----

# EXTRA

## 1. Core image definitions

```text
Image:
A 2D function f(x, y), where x and y are spatial coordinates,
and f(x, y) is the intensity or gray level.

Digital image:
An image where x, y, and intensity values are finite and discrete.

Pixel:
One element of a digital image with a specific location (x, y)
and intensity f(x, y).
```

Add this because it supports many basic questions about digital images.

---

## 2. Processing levels

```text
Image processing:
Input = image
Output = image
Example: noise reduction, contrast enhancement, sharpening

Image analysis:
Input = image
Output = attributes/features
Example: edges, contours, objects

Computer vision:
Higher-level understanding of an image, similar to human vision.
```

This is good extra theory because the test may ask the difference between image processing, analysis, and computer vision.

---

## 3. Image acquisition

```text
Image acquisition:
Obtaining an image through sensors or reading an image file.
It may include preprocessing such as scaling.
```

Also add the basic image acquisition pipeline:

```text
Energy source → Scene/object → Imaging system → Image plane → Digitized image
```

---

## 4. Image categories by energy source

```text
Most images use energy from the electromagnetic spectrum.
Examples: visible light, X-ray, infrared, ultraviolet, microwave, radio waves.

Other sources:
Acoustic, ultrasonic, electron beams, and synthetic computer-generated images.
```

This connects directly to the test question about the main source of energy for images.

---

## 5. Human eye concepts

```text
Lens:
Focuses light. It absorbs infrared, ultraviolet, and some visible light.

Retina:
Contains rods and cones.

Cones:
Used for bright-light vision.
Sensitive to color.
Mostly in the fovea.

Rods:
Used for dim-light vision.
Sensitive to low illumination.
Used for overall image perception.

Blind spot:
Area where the optic nerve leaves the eye.
There are no receptors there.
```

---

## 6. Brightness adaptation

```text
Brightness adaptation:
The human eye changes sensitivity depending on the current light level.

Brightness adaptation level:
The current sensitivity level of the eye.

Subjective brightness range:
The small range of brightness the eye can perceive around the current adaptation level.
```

Also add:

```text
The eye can adapt to a very large range of light intensity,
but not all at the same time.
```

---

## 7. Weber ratio

```text
Weber ratio:
Measures brightness discrimination.

Formula:
ΔIc / I
```

Meaning:

```text
ΔIc = smallest detectable change in illumination
I = background illumination
```

Key idea:

```text
Large Weber ratio → poor brightness discrimination
Small Weber ratio → better brightness discrimination
```

---

## 8. Visual perception effects

These may not be directly tested, but good extra concepts:

```text
Mach band effect:
Perceived intensity is not always the same as actual intensity.

Simultaneous contrast:
The same gray value can look darker or lighter depending on the background.

Optical illusions:
Show that human visual perception can be misleading.
```

---

## 9. Sampling vs quantization

```text
Sampling:
Converts continuous image coordinates into discrete pixels.
Related to spatial resolution.

Quantization:
Converts continuous brightness values into discrete intensity levels.
Related to intensity resolution.
```

Formula:

```text
Number of intensity levels = 2^b
```

Example:

```text
8 bits → 2^8 = 256 intensity levels
```

---

## 10. Digital image types

```text
Binary image:
A 2D array of 0s and 1s.

Grayscale image:
A 2D array of brightness values.
Usually 0 to 255, or normalized from 0 to 1.

Color image:
Usually three 2D arrays/maps, such as R, G, and B.
So a color image can be treated as a 3D array.

Multispectral image:
An image that may include frequencies beyond visible light.

Depth map:
Stores distance/depth information.
Can be created using sensors like Kinect or LiDAR.
```

---

## 11. Saturation and noise

```text
Saturation:
The highest intensity value beyond which values are clipped.
A saturated area has a high constant intensity.

Noise:
Random unwanted variation in image intensity.
It can appear as grainy texture.
```

---

## 12. Pixel neighbors

For pixel:

```text
p = (x, y)
```

4-neighbors:

```text
N4(p) = {(x+1,y), (x-1,y), (x,y+1), (x,y-1)}
```

Diagonal neighbors:

```text
ND(p) = {(x+1,y+1), (x+1,y-1), (x-1,y+1), (x-1,y-1)}
```

8-neighbors:

```text
N8(p) = N4(p) ∪ ND(p)
```

Small correction from the slide wording: it should be:

```text
N8(p) = N4(p) ∪ ND(p)
```

not `N4(p) ∪ N8(p)`.

---

## 13. Connectivity / adjacency

```text
V:
Set of intensity values used to define adjacency.
For binary images, V is often {1}.

4-adjacency:
Two pixels are adjacent if one is in the 4-neighborhood of the other.

8-adjacency:
Two pixels are adjacent if one is in the 8-neighborhood of the other.

m-adjacency:
Used to avoid ambiguous diagonal connections.
```

m-adjacency rule:

```text
Two pixels p and q are m-adjacent if:

1. q is in N4(p), or

2. q is in ND(p), and N4(p) ∩ N4(q)
   has no pixels with values from V.
```

---

## 14. Region, path, and boundary

```text
Path:
A sequence of connected pixels.

Connected set / region:
A set of pixels where any two pixels are connected by a path inside the set.

Boundary / border / contour:
Pixels in a region that are adjacent to pixels outside the region.
```

This is useful if they ask about connected components or object boundaries.

---

## 15. Distance measures

Euclidean distance:

```text
De(p, q) = sqrt((x - u)^2 + (y - v)^2)
```

City-block / Manhattan distance:

```text
D4(p, q) = |x - u| + |y - v|
```

Chessboard distance:

```text
D8(p, q) = max(|x - u|, |y - v|)
```

Where:

```text
p = (x, y)
q = (u, v)
```

---

## Best extra things to add to your notes

```text
1. Image, digital image, pixel
2. Image processing vs image analysis vs computer vision
3. Image acquisition pipeline
4. EM spectrum as main image energy source
5. Cones, rods, retina, blind spot
6. Brightness adaptation and Weber ratio
7. Sampling vs quantization
8. Binary, grayscale, color, multispectral, depth images
9. Saturation and noise
10. 4-neighbors, 8-neighbors, m-adjacency
11. Region, path, boundary
12. Distance formulas
```
