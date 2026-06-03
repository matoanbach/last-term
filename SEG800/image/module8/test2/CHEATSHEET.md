# SEG800 Image Processing Cheatsheet

Based on Module 7 and Module 8 study summaries.

## Concept Study Notes

| Concept | Reminder |
|---|---|
| Digital image processing | Processing a digital image using a digital computer. |
| Human vision: cones | Cones handle bright-light and color vision. |
| Enhancement vs restoration | Enhancement is subjective; restoration uses mathematical/probabilistic models. |
| Affine transformations | Affine transformations preserve parallelism. |
| Quantization | Converts continuous brightness values into discrete levels. |
| Weber ratio | Measures brightness discrimination. |
| Digitizer | Converts analog signals into digital form. |
| Image energy source | Most digital images use energy from the electromagnetic spectrum. |
| Point operation | Depends only on the corresponding input pixel. |
| Negative transformation | For 8-bit images: $s = 255 - z$. |
| Neighborhood operation | Image smoothing uses neighboring pixels. |
| Geometric transformation | Changes pixel locations. |
| Histogram equalization | Enhances contrast by spreading/flattening the histogram. |
| Gamma correction | Mainly changes brightness/intensity perception. |
| Translation | $u = x + t_x$, $v = y + t_y$. |

## Core Definitions

Image: a 2D function $f(x, y)$, where $x$ and $y$ are spatial coordinates and $f(x, y)$ is the intensity or gray level.

Digital image: an image where $x$, $y$, and intensity values are finite and discrete.

Pixel: one element of a digital image with location $(x, y)$ and intensity $f(x, y)$.

Digital image processing: processing a digital image with a digital computer.

Image enhancement: improves an image for a specific application. It is subjective.

Image restoration: improves an image using objective mathematical/probabilistic degradation models.

Sampling: converts continuous spatial coordinates into discrete spatial coordinates. Related to spatial resolution.

Quantization: converts continuous brightness/intensity values into discrete digital values. Related to intensity resolution.

Point operation: each output pixel depends only on the same input pixel.

$$
I_{out}(i, j) = f(I_{in}(i, j))
$$

Neighborhood operation: each output pixel depends on the input pixel and its neighbors. Example: smoothing / blurring.

Geometric transformation: maps a source pixel at $(x, y)$ to a destination location $(u, v)$. It changes locations, not intensity values.

Affine transformation: a geometric transformation that preserves parallelism. Examples: translation, scaling, rotation, shear.

## Human Vision

Cones: bright-light / photopic vision; sensitive to color.

Rods: dim-light / scotopic vision; sensitive to low illumination.

Blind spot: area with optic nerve and no receptors.

## Formula Box

Weber ratio:

$$
\frac{\Delta I_c}{I}
$$

where $\Delta I_c$ is the minimum detectable change in illumination and $I$ is the background illumination.

Number of brightness levels:

$$
2^b
$$

where $b$ is the number of bits. Example: $8$ bits gives $2^8 = 256$ levels.

Negative transformation, 8-bit:

$$
s = 255 - z
$$

where $z$ is the input intensity and $s$ is the output intensity.

Gamma correction:

$$
s = c r^\gamma
$$

where $r$ is the input intensity, $s$ is the output intensity, $c$ is a constant, and $\gamma$ is the gamma value.

Lens formula:

$$
\frac{1}{z_o} + \frac{1}{z_i} = \frac{1}{f}
$$

where $z_o$ is the object distance, $z_i$ is the image distance, and $f$ is the focal length.

Histogram:

$$
h(r_k) = \text{number of pixels with intensity } r_k
$$

Normalized histogram:

$$
p(r_k) = \frac{h(r_k)}{MN}
$$

Histogram equalization:

$$
s_k = T(r_k) = (L - 1) \sum_{j=0}^{k} p(r_j)
$$

where $L$ is the number of intensity levels.

## Geometric Transform Formulas

Use homogeneous coordinates:

$$
\begin{bmatrix}
u \\
v \\
1
\end{bmatrix}
=
\begin{bmatrix}
h_{11} & h_{12} & h_{13} \\
h_{21} & h_{22} & h_{23} \\
h_{31} & h_{32} & h_{33}
\end{bmatrix}
\begin{bmatrix}
x \\
y \\
1
\end{bmatrix}
$$

Translation:

$$
u = x + t_x, \qquad v = y + t_y
$$

$$
\begin{bmatrix}
1 & 0 & t_x \\
0 & 1 & t_y \\
0 & 0 & 1
\end{bmatrix}
$$

Scaling:

$$
u = s_x x, \qquad v = s_y y
$$

$$
\begin{bmatrix}
s_x & 0 & 0 \\
0 & s_y & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

Rotation, counterclockwise:

$$
u = x\cos\theta - y\sin\theta, \qquad v = x\sin\theta + y\cos\theta
$$

$$
\begin{bmatrix}
\cos\theta & -\sin\theta & 0 \\
\sin\theta & \cos\theta & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

Shear:

$$
u = x + y \cdot sh_x, \qquad v = y + x \cdot sh_y
$$

$$
\begin{bmatrix}
1 & sh_x & 0 \\
sh_y & 1 & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

## Pixel Adjacency

For a pixel:

$$
p = (x, y)
$$

4-neighbors:

$$
N_4(p) = \{(x+1,y), (x-1,y), (x,y+1), (x,y-1)\}
$$

Diagonal neighbors:

$$
N_D(p) = \{(x+1,y+1), (x+1,y-1), (x-1,y+1), (x-1,y-1)\}
$$

8-neighbors:

$$
N_8(p) = N_4(p) \cup N_D(p)
$$

m-adjacency rule:

Two pixels $p$ and $q$ are m-adjacent if either condition is true:

$$
q \in N_4(p)
$$

or

$$
q \in N_D(p) \quad \text{and} \quad N_4(p) \cap N_4(q) \text{ has no pixels with values from } V
$$

Adjacency checklist:

1. Confirm both pixels have values in the foreground set $V$.
2. If $q$ is a 4-neighbor of $p$, they are adjacent.
3. If $q$ is diagonal, find the common 4-neighbors.
4. For m-adjacency, diagonal pixels are adjacent only when their common 4-neighbors do not contain values from $V$.

## Optics / Lens Formula

Use the thin-lens equation:

$$
\frac{1}{z_o} + \frac{1}{z_i} = \frac{1}{f}
$$

To solve for object distance:

$$
\frac{1}{z_o} = \frac{1}{f} - \frac{1}{z_i}
$$

$$
z_o = \frac{1}{\frac{1}{f} - \frac{1}{z_i}}
$$

Unit reminder:

Keep all distances in the same unit before calculating. Convert at the end if needed.

## Homography Matrices

For a geometric transformation, write the pixel as a homogeneous coordinate:

$$
\begin{bmatrix}
x \\
y \\
1
\end{bmatrix}
$$

Then multiply by the transformation matrix:

$$
\begin{bmatrix}
u \\
v \\
1
\end{bmatrix}
=
\begin{bmatrix}
h_{11} & h_{12} & h_{13} \\
h_{21} & h_{22} & h_{23} \\
h_{31} & h_{32} & h_{33}
\end{bmatrix}
\begin{bmatrix}
x \\
y \\
1
\end{bmatrix}
$$

Common matrices:

Scaling:

$$
\begin{bmatrix}
s_x & 0 & 0 \\
0 & s_y & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

Rotation:

$$
\begin{bmatrix}
\cos\theta & -\sin\theta & 0 \\
\sin\theta & \cos\theta & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

Translation:

$$
\begin{bmatrix}
1 & 0 & t_x \\
0 & 1 & t_y \\
0 & 0 & 1
\end{bmatrix}
$$

Composition order:

If applying scale $\rightarrow$ rotate $\rightarrow$ translate:

$$
H = T R S
$$

Applying the matrix:

$$
\begin{bmatrix}
u \\
v \\
1
\end{bmatrix}
=
H
\begin{bmatrix}
x \\
y \\
1
\end{bmatrix}
$$

Important: geometric transformations move pixel locations but do not directly change pixel intensity values. Practical raster images may need interpolation or rounding after the transform.

## Extra Study Topics

Processing levels:

| Level | Input | Output | Examples |
|---|---|---|---|
| Image processing | Image | Image | Noise reduction, contrast enhancement, sharpening |
| Image analysis | Image | Attributes / features | Edges, contours, objects |
| Computer vision | Image | Higher-level understanding | Recognition, scene understanding |

Image acquisition pipeline:

$$
\text{Energy source} \rightarrow \text{Scene/object} \rightarrow \text{Imaging system} \rightarrow \text{Image plane} \rightarrow \text{Digitized image}
$$

Image categories by energy source: most images use the electromagnetic spectrum, including visible light, X-ray, infrared, ultraviolet, microwave, and radio waves. Other sources include acoustic waves, ultrasonic waves, electron beams, and synthetic computer-generated images.

Digital image types:

| Type | Meaning |
|---|---|
| Binary image | 2D array of 0s and 1s |
| Grayscale image | 2D array of brightness values, usually 0 to 255 or normalized 0 to 1 |
| Color image | Usually three 2D arrays, such as R, G, and B |
| Multispectral image | Includes frequencies beyond visible light |
| Depth map | Stores distance/depth information, often from sensors like LiDAR or Kinect |

Brightness adaptation: the human eye changes sensitivity depending on the current light level. The eye can adapt to a large range of light intensity, but not all at once.

Weber ratio interpretation:

$$
\text{Large Weber ratio} \rightarrow \text{poor brightness discrimination}
$$

$$
\text{Small Weber ratio} \rightarrow \text{better brightness discrimination}
$$

Visual perception effects:

| Effect | Meaning |
|---|---|
| Mach band effect | Perceived intensity is not always the same as actual intensity |
| Simultaneous contrast | The same gray value can look different depending on its background |
| Optical illusions | Show that human visual perception can be misleading |

Saturation and noise:

| Concept | Meaning |
|---|---|
| Saturation | Highest intensity value beyond which values are clipped |
| Noise | Random unwanted variation in image intensity, often appearing as grainy texture |

Region, path, and boundary:

| Concept | Meaning |
|---|---|
| Path | A sequence of connected pixels |
| Connected set / region | A set of pixels where any two pixels are connected by a path inside the set |
| Boundary / border / contour | Pixels in a region that are adjacent to pixels outside the region |

Distance measures for $p = (x, y)$ and $q = (u, v)$:

Euclidean distance:

$$
D_e(p, q) = \sqrt{(x-u)^2 + (y-v)^2}
$$

City-block / Manhattan distance:

$$
D_4(p, q) = |x-u| + |y-v|
$$

Chessboard distance:

$$
D_8(p, q) = \max(|x-u|, |y-v|)
$$

Linear operation property:

$$
H[a f_1(x,y) + b f_2(x,y)] = aH[f_1(x,y)] + bH[f_2(x,y)]
$$

Image arithmetic:

$$
s(x,y) = f(x,y) + g(x,y)
$$

$$
d(x,y) = f(x,y) - g(x,y)
$$

$$
p(x,y) = f(x,y) \times g(x,y)
$$

$$
v(x,y) = \frac{f(x,y)}{g(x,y)}
$$

Linear blend / weighted addition:

$$
\text{dst} = \alpha\,\text{img}_1 + \beta\,\text{img}_2 + \gamma
$$

where $\alpha$ and $\beta$ are image weights, and $\gamma$ is a brightness offset.

Brightness and contrast point operations:

$$
I_{out}(i,j) = I_{in}(i,j) + b
$$

$$
I_{out}(i,j) = aI_{in}(i,j)
$$

Adding a constant changes brightness. Multiplying by a constant changes contrast.

Contrast stretching: expands intensity values to improve contrast.

Thresholding: separates pixels into two groups, usually dark and light.

$$
\text{pixel} \ge \text{threshold} \rightarrow \text{white}
$$

$$
\text{pixel} < \text{threshold} \rightarrow \text{black}
$$

Gamma correction rule:

$$
\gamma < 1 \rightarrow \text{image becomes brighter}
$$

$$
\gamma > 1 \rightarrow \text{image becomes darker}
$$

Transformation families:

| Transformation | Preserves |
|---|---|
| Translation | Orientation |
| Rigid / Euclidean | Lengths |
| Similarity | Angles |
| Affine | Parallelism |
| Projective | Straight lines, but parallel lines may not stay parallel |

Interpolation: when rotating or scaling, new pixel locations may not land exactly on integer coordinates, so interpolation decides the assigned intensity value.

| Type | Meaning |
|---|---|
| Nearest-neighbor | Uses closest pixel; fast but blocky |
| Bilinear | Uses nearby pixels; smoother |
| Bicubic | Uses more neighboring pixels; usually smoother but slower |

## Quick Memory Tips

- Enhancement = subjective
- Restoration = model-based
- Cones = color and bright light
- Rods = dim light
- Sampling = spatial coordinates
- Quantization = intensity values
- Point operation = same pixel only
- Neighborhood operation = pixel plus neighbors
- Geometric transformation = changes locations
- Affine transformation = preserves parallelism
- Histogram equalization = contrast enhancement
- Gamma correction = brightness perception
- Large Weber ratio = poor brightness discrimination
- Small Weber ratio = better brightness discrimination
- $\gamma < 1$ = brighter image
- $\gamma > 1$ = darker image
- Negative image: $s = 255 - z$
- Translation: add $t_x$ and $t_y$
- Pixel value stays the same under geometric transforms
- Affine preserves parallelism
- Projective preserves straight lines
