# Week 9 - Image Filtering in the Spatial Domain

**Course:** SEG800 - Digital Signal and Image Processing  
**Topic:** Noise, spatial filtering, separable kernels, smoothing, and spatial sharpening

---

## Table of Contents

1. [Noise in Digital Images](#1-noise-in-digital-images)
2. [Correcting Noise by Smoothing](#2-correcting-noise-by-smoothing)
3. [Spatial Filtering Fundamentals](#3-spatial-filtering-fundamentals)
4. [Averaging and Box Filters](#4-averaging-and-box-filters)
5. [Correlation and Convolution](#5-correlation-and-convolution)
6. [Separable Filter Kernels](#6-separable-filter-kernels)
7. [Gaussian Filtering](#7-gaussian-filtering)
8. [Bilinear Filtering](#8-bilinear-filtering)
9. [Nonlinear Filtering and the Median Filter](#9-nonlinear-filtering-and-the-median-filter)
10. [Applications of Smoothing](#10-applications-of-smoothing)
11. [Spatial Sharpening](#11-spatial-sharpening)
12. [First and Second Derivatives](#12-first-and-second-derivatives)
13. [Sharpening with the Laplacian](#13-sharpening-with-the-laplacian)
14. [Unsharp Masking and Highboost Filtering](#14-unsharp-masking-and-highboost-filtering)
15. [Gradient-Based Sharpening](#15-gradient-based-sharpening)
16. [Filter Comparison](#16-filter-comparison)
17. [Exam Cheat Sheet](#17-exam-cheat-sheet)

---

# 1. Noise in Digital Images

## 1.1 Definition of noise

**Noise** is anything that degrades an ideal image.

Common sources include:

- The environment
- The imaging device or sensor
- Electrical interference
- The digitization process
- Communication or transmission errors

A common additive-noise model is

$$
\hat{I}(i,j)=I(i,j)+n(i,j)
$$

where:

- $I(i,j)$ is the ideal image pixel.
- $n(i,j)$ is the noise added at that location.
- $\hat{I}(i,j)$ is the observed noisy pixel.

Noise is usually treated as random.

---

## 1.2 Gaussian noise

Gaussian noise is a useful approximation of many real-world noise sources.

It is modelled using a normal distribution:

$$
n \sim \mathcal{N}(\mu=0,\sigma)
$$

where:

- $\mu=0$ means the noise has no average positive or negative bias.
- $\sigma$ controls the amount of variation.
- A larger $\sigma$ produces stronger visible noise.

Gaussian noise typically appears as small random brightness variations distributed throughout the image.

---

## 1.3 Impulsive noise: salt-and-pepper noise

Impulsive noise consists of sudden intensity peaks or spikes.

**Salt-and-pepper noise** randomly replaces some image pixels with unusually bright or dark values:

- **Salt:** bright or white pixels
- **Pepper:** dark or black pixels

The parameter $p$ represents the probability or proportion of corrupted pixels.

- Small $p$: only a few corrupted pixels
- Large $p$: many corrupted pixels

---

# 2. Correcting Noise by Smoothing

Natural image regions usually change gradually, so most ordinary image content is associated with relatively **low spatial frequencies**.

Noise often causes sudden pixel changes, which behave like **high spatial frequencies**.

Therefore, noise can often be reduced by replacing each pixel with a value calculated from its neighbours.

The simplest approach is averaging:

$$
g(i,j)=\frac{1}{mn}\sum_{(s,t)\in\mathcal{N}} f(i+s,j+t)
$$

where the neighbourhood contains $m\times n$ pixels.

This is a form of **low-pass filtering**.

### Main disadvantage

Smoothing does not distinguish perfectly between noise and real edges. Both contain rapid intensity changes, so smoothing also blurs edges and fine details.

---

# 3. Spatial Filtering Fundamentals

## 3.1 Spatial filtering

Spatial filtering begins with an input image $f(x,y)$ and calculates a new image $g(x,y)$ using a neighbourhood around each pixel.

A small matrix called a **kernel** defines:

- The neighbourhood size
- The weight assigned to every neighbouring pixel
- The operation applied to that neighbourhood

Other names for a kernel include:

- Mask
- Template
- Window
- Filter kernel

---

## 3.2 Linear filtering

A filter is **linear** when each output pixel is a weighted sum of the input pixels in its neighbourhood.

For a kernel $w(s,t)$ extending from $-a$ to $a$ horizontally and from $-b$ to $b$ vertically:

$$
g(x,y)=\sum_{s=-a}^{a}\sum_{t=-b}^{b}w(s,t)f(x+s,y+t)
$$

For a $3\times3$ kernel, the output is calculated by:

1. Centering the kernel on the current image pixel.
2. Multiplying each kernel coefficient by the image pixel underneath it.
3. Adding all products.
4. Storing the result at the corresponding output location.
5. Moving the kernel to the next location.

The image origin is normally at the top-left corner, while the kernel origin is normally at its centre.

---

## 3.3 Kernel normalization

A smoothing kernel is normally normalized so that its coefficients sum to 1:

$$
\sum_s\sum_t w(s,t)=1
$$

This preserves the average brightness of a constant image region.

If the coefficients sum to a value other than 1, the output may become brighter or darker.

---

# 4. Averaging and Box Filters

Averaging is equivalent to filtering with a **box kernel**.

All pixels inside the box have equal weight.

## 4.1 Normalized $3\times3$ box kernel

$$
w=\frac{1}{9}
\begin{bmatrix}
1&1&1\\
1&1&1\\
1&1&1
\end{bmatrix}
$$

Each output pixel becomes the average of the nine pixels in the corresponding neighbourhood.

---

## 4.2 Normalized $5\times5$ box kernel

$$
w=\frac{1}{25}
\begin{bmatrix}
1&1&1&1&1\\
1&1&1&1&1\\
1&1&1&1&1\\
1&1&1&1&1\\
1&1&1&1&1
\end{bmatrix}
$$

---

## 4.3 Effect of kernel size

| Kernel size | Smoothing strength | Detail preservation | Computational cost |
|---|---:|---:|---:|
| $3\times3$ | Mild | Better | Lower |
| $5\times5$ | Moderate | Lower | Higher |
| $11\times11$ | Strong | Much lower | Much higher |
| $21\times21$ | Very strong | Poor | Very high |

A larger box filter removes more noise, but it also causes stronger blur.

### Important observation

A box filter can reduce salt-and-pepper noise, but the corrupted extreme values still influence the average. A median filter is generally more suitable for this type of noise.

---

# 5. Correlation and Convolution

Correlation and convolution both slide a kernel across an image and calculate weighted sums.

The main difference is whether the kernel is rotated before it is applied.

## 5.1 Correlation

For an $m\times n$ kernel, let

$$
a=\frac{m-1}{2}, \qquad b=\frac{n-1}{2}
$$

The correlation of $w$ with $f$ is

$$
(w \star f)(x,y)=
\sum_{s=-a}^{a}\sum_{t=-b}^{b}
w(s,t)f(x+s,y+t)
$$

In correlation, the kernel is used in its original orientation.

---

## 5.2 Convolution

The convolution of $w$ with $f$ is

$$
(w*f)(x,y)=
\sum_{s=-a}^{a}\sum_{t=-b}^{b}
w(s,t)f(x-s,y-t)
$$

The negative signs are equivalent to rotating the kernel by $180^\circ$ before sliding it across the image.

An equivalent implementation is:

1. Rotate the kernel by $180^\circ$.
2. Perform the same sliding operation used for correlation.

---

## 5.3 When are correlation and convolution identical?

They produce the same result when the kernel is symmetric under a $180^\circ$ rotation.

Examples include:

- Box kernels
- Gaussian kernels
- Many Laplacian kernels

They may differ for asymmetric kernels such as directional edge detectors.

---

## 5.4 Properties

| Property | Convolution | Correlation |
|---|---|---|
| Commutative | $f*g=g*f$ | Does not generally hold |
| Associative | $f*(g*h)=(f*g)*h$ | Does not generally hold |
| Distributive | $f*(g+h)=f*g+f*h$ | $f\star(g+h)=f\star g+f\star h$ |

---

## 5.5 Padding and output size

When a kernel is centred near an image border, part of the kernel extends beyond the available image.

Common boundary strategies include:

- **Zero padding:** treat missing values as 0.
- **Replication:** repeat the closest border pixel.
- **Reflection:** mirror the image at the boundary.
- **Valid filtering:** calculate outputs only where the full kernel fits.

For full correlation or convolution, extra padding is required so that every partial overlap is included.

---

# 6. Separable Filter Kernels

A 2-D kernel is **separable** when it can be decomposed into a horizontal 1-D kernel and a vertical 1-D kernel.

If

$$
w=w_1*w_2
$$

then filtering with $w$ can be replaced by filtering with $w_1$ and then with $w_2$:

$$
w*f=(w_1*w_2)*f
$$

Using associativity of convolution:

$$
w*f=w_1*(w_2*f)=w_2*(w_1*f)
$$

The order of the horizontal and vertical passes can be exchanged.

---

## 6.1 Example: separable $5\times5$ box filter

The 2-D box kernel

$$
\frac{1}{25}
\begin{bmatrix}
1&1&1&1&1\\
1&1&1&1&1\\
1&1&1&1&1\\
1&1&1&1&1\\
1&1&1&1&1
\end{bmatrix}
$$

can be separated into

$$
\frac{1}{5}
\begin{bmatrix}
1&1&1&1&1
\end{bmatrix}
$$

followed by

$$
\frac{1}{5}
\begin{bmatrix}
1\\1\\1\\1\\1
\end{bmatrix}
$$

The first pass averages horizontally, and the second pass averages vertically.

---

## 6.2 Computational advantage

Assume:

- Image size: $M\times N$
- Kernel size: $m\times n$

A direct 2-D implementation requires approximately

$$
MNmn
$$

multiplications and additions.

A separable implementation requires approximately

$$
MN(m+n)
$$

operations.

### Example

For a $5\times5$ kernel:

- Direct 2-D filtering: $25$ weighted operations per output pixel
- Separable filtering: $5+5=10$ weighted operations per output pixel

Therefore, separability gives a major speed improvement.

---

# 7. Gaussian Filtering

A Gaussian filter is a smoothing filter whose weights follow a 2-D bell-shaped Gaussian function.

## 7.1 Continuous Gaussian function

$$
w(s,t)=G(s,t)=K e^{-\frac{s^2+t^2}{2\sigma^2}}
$$

Using radial distance

$$
r^2=s^2+t^2
$$

we can write

$$
G(r)=K e^{-\frac{r^2}{2\sigma^2}}
$$

where:

- $K$ is a scale or normalization constant.
- $\sigma$ is the standard deviation.
- $s$ and $t$ are distances from the kernel centre.

A normalized continuous Gaussian often uses

$$
K=\frac{1}{2\pi\sigma^2}
$$

For a finite discrete kernel, it is common to sample the Gaussian first and then divide all values by their sum so that the kernel coefficients sum to 1.

---

## 7.2 Important properties

The Gaussian filter is:

- A low-pass smoothing filter
- Circularly symmetric
- Isotropic, meaning its response does not depend on orientation
- Separable into horizontal and vertical 1-D Gaussian filters

---

## 7.3 Effect of $\sigma$

- Small $\sigma$: narrow Gaussian, weaker smoothing, better detail preservation
- Large $\sigma$: wide Gaussian, stronger smoothing, more blur

The kernel must be large enough to represent the Gaussian properly. A common practical rule is to extend about $3\sigma$ from the centre on each side:

$$
\text{kernel size} \approx 2\lceil3\sigma\rceil+1
$$

This produces an odd-sized kernel with a clear centre pixel.

---

## 7.4 Discrete $3\times3$ Gaussian example for $\sigma=1$

Sampling the Gaussian with $K=1$ gives approximately

$$
\begin{bmatrix}
0.3679&0.6065&0.3679\\
0.6065&1.0000&0.6065\\
0.3679&0.6065&0.3679
\end{bmatrix}
$$

The sum is approximately $4.8976$, so the normalized kernel is

$$
w=\frac{1}{4.8976}
\begin{bmatrix}
0.3679&0.6065&0.3679\\
0.6065&1.0000&0.6065\\
0.3679&0.6065&0.3679
\end{bmatrix}
$$

Approximately:

$$
w\approx
\begin{bmatrix}
0.0751&0.1238&0.0751\\
0.1238&0.2042&0.1238\\
0.0751&0.1238&0.0751
\end{bmatrix}
$$

The centre pixel receives the largest weight, and nearby pixels receive progressively smaller weights.

---

## 7.5 Gaussian versus box filtering

| Feature | Box filter | Gaussian filter |
|---|---|---|
| Weight distribution | Equal weights | Largest at centre, smaller farther away |
| Shape | Rectangular/flat | Smooth bell curve |
| Smoothing profile | Abrupt | Smooth |
| Isotropic | Square support may introduce directional effects | Yes |
| Separable | Yes | Yes |
| Typical visual quality | More artificial blur | More natural blur |

A Gaussian produces a smoother intensity transition than a box kernel.

---


## 7.6 Frequency-domain interpretation of low-pass filtering

An ideal one-dimensional low-pass filter has a rectangular transfer function in the frequency domain:

- Frequencies below the cutoff are in the **passband**.
- Frequencies above the cutoff are in the **stopband**.

The corresponding spatial-domain kernel is an oscillating sinc-like function rather than a compact box. This illustrates that a sharp cutoff in one domain produces a widely spread, oscillatory response in the other domain. Truncating such a kernel in practice can introduce ringing near sharp edges.

---

## 7.7 Product and convolution of Gaussian functions

For two 1-D Gaussian functions $f$ and $g$:

### Product

The product is proportional to another Gaussian with mean

$$
m_{f\times g}=
\frac{m_f\sigma_g^2+m_g\sigma_f^2}
{\sigma_f^2+\sigma_g^2}
$$

and standard deviation

$$
\sigma_{f\times g}=
\sqrt{\frac{\sigma_f^2\sigma_g^2}
{\sigma_f^2+\sigma_g^2}}
$$

### Convolution

The convolution is another Gaussian with

$$
m_{f*g}=m_f+m_g
$$

and

$$
\sigma_{f*g}=\sqrt{\sigma_f^2+\sigma_g^2}
$$

This means that convolving Gaussian blurs combines their variances.

---

# 8. Bilinear Filtering

A bilinear kernel is another smoothing kernel.

It is equivalent to convolving with two separable **tent functions**.

## 8.1 One-dimensional tent kernel

$$
w_1=\frac{1}{4}
\begin{bmatrix}
1&2&1
\end{bmatrix}
$$

## 8.2 Two-dimensional bilinear kernel

The outer product of the horizontal and vertical tent kernels gives

$$
w=\frac{1}{16}
\begin{bmatrix}
1&2&1\\
2&4&2\\
1&2&1
\end{bmatrix}
$$

This kernel gives the centre pixel the largest weight and neighbouring pixels smaller weights.

It is smoother than a same-sized box filter and is computationally efficient because it is separable.

---

# 9. Nonlinear Filtering and the Median Filter

A filter is nonlinear when the output is not a weighted linear combination of the input pixel values.

## 9.1 Median filter

The median filter replaces the centre pixel with the median of the values in its neighbourhood.

### Procedure

1. Collect all pixel values under the kernel.
2. Sort them from smallest to largest.
3. Select the middle value.
4. Store that value in the output image.

### Example

For the neighbourhood

$$
[10,11,12,12,13,14,15,16,255]
$$

the median is

$$
13
$$

The extreme noisy value $255$ has almost no influence on the result.

The average, however, would be

$$
\frac{10+11+12+12+13+14+15+16+255}{9}\approx38.7
$$

which is strongly distorted by the outlier.

---

## 9.2 Advantages of median filtering

- Very effective for salt-and-pepper noise
- Removes isolated extreme pixels
- Usually preserves edges better than averaging
- Does not create new intensity values outside the neighbourhood values

## 9.3 Disadvantages

- Nonlinear, so convolution properties do not apply
- More computationally expensive because values must be ordered
- Large median filters can remove thin lines and small details

---

# 10. Applications of Smoothing

## 10.1 Noise reduction

Low-pass filters suppress rapid intensity variations caused by noise.

For salt-and-pepper noise:

- Gaussian filtering reduces noise but also blurs the image.
- Median filtering normally removes impulsive noise more effectively while preserving boundaries.

---

## 10.2 Object detection by smoothing and thresholding

A noisy image may first be smoothed with a Gaussian kernel. Thresholding can then separate bright objects from the background.

General workflow:

$$
\text{Noisy image}
\rightarrow
\text{Gaussian smoothing}
\rightarrow
\text{Thresholding}
\rightarrow
\text{Binary object mask}
$$

---

## 10.3 Shading correction

Low-pass filtering can estimate slowly varying illumination or shading.

If $f(x,y)$ contains both the desired image and a shading pattern, a low-pass estimate $s(x,y)$ can be calculated. The corrected image may be obtained by division:

$$
g(x,y)=\frac{f(x,y)}{s(x,y)}
$$

The low-pass estimate represents the slowly changing background illumination.

---

# 11. Spatial Sharpening

Sharpening is the opposite of smoothing.

Its purpose is to emphasize intensity transitions such as:

- Edges
- Fine lines
- Boundaries
- Small details

Sharpening is associated with **high-pass filtering** and can be implemented using differentiation.

---

## 11.1 First derivative behaviour

A useful first derivative should:

- Be zero in regions of constant intensity
- Be nonzero at the beginning of an intensity step or ramp
- Remain nonzero along an intensity ramp

The first derivative responds strongly to the slope of an intensity transition.

---

## 11.2 Second derivative behaviour

A useful second derivative should:

- Be zero in constant regions
- Be nonzero at the beginning and end of an intensity step or ramp
- Be zero along a constant-slope ramp

A second derivative often produces positive and negative responses around an edge and may create a **zero crossing** near the edge location.

---

# 12. First and Second Derivatives

## 12.1 Discrete first derivative in one dimension

A forward-difference approximation is

$$
\frac{\partial f}{\partial x}=f(x+1)-f(x)
$$

This measures the intensity change between adjacent samples.

---

## 12.2 Discrete second derivative in one dimension

$$
\frac{\partial^2 f}{\partial x^2}
=f(x+1)+f(x-1)-2f(x)
$$

The second derivative measures how the slope itself changes.

---

## 12.3 The 2-D Laplacian

The Laplacian is an isotropic second derivative:

$$
\nabla^2 f=
\frac{\partial^2 f}{\partial x^2}
+
\frac{\partial^2 f}{\partial y^2}
$$

A discrete four-neighbour approximation is

$$
\nabla^2 f(x,y)=
 f(x+1,y)+f(x-1,y)
+f(x,y+1)+f(x,y-1)
-4f(x,y)
$$

Because it is isotropic, the Laplacian responds to intensity changes in every direction rather than only horizontally or vertically.

---

# 13. Sharpening with the Laplacian

## 13.1 Common Laplacian kernels

### Four-neighbour form with negative centre

$$
\begin{bmatrix}
0&1&0\\
1&-4&1\\
0&1&0
\end{bmatrix}
$$

### Eight-neighbour form with negative centre

$$
\begin{bmatrix}
1&1&1\\
1&-8&1\\
1&1&1
\end{bmatrix}
$$

### Four-neighbour form with positive centre

$$
\begin{bmatrix}
0&-1&0\\
-1&4&-1\\
0&-1&0
\end{bmatrix}
$$

### Eight-neighbour form with positive centre

$$
\begin{bmatrix}
-1&-1&-1\\
-1&8&-1\\
-1&-1&-1
\end{bmatrix}
$$

Every Laplacian kernel above sums to zero. Therefore, it gives zero output in a constant-intensity region.

---

## 13.2 Sharpening equation

A sharpened image can be obtained using

$$
g(x,y)=f(x,y)+c\left[\nabla^2f(x,y)\right]
$$

The value of $c$ depends on the sign of the centre kernel coefficient:

- Use $c=-1$ when the centre coefficient is negative.
- Use $c=1$ when the centre coefficient is positive.

Equivalently:

$$
c=\operatorname{sign}(w(0,0))
$$

This sign choice adds edge information to the original image rather than weakening it.

### Note about negative results

The Laplacian response can contain negative pixel values. During visualization, the response may need scaling or shifting, but the signed values should be retained during the sharpening calculation.

---

# 14. Unsharp Masking and Highboost Filtering

Unsharp masking sharpens an image by subtracting a blurred version from the original.

Let the original image be $f(x,y)$ and the blurred image be $\bar{f}(x,y)$.

## 14.1 Create the unsharp mask

$$
g_{\text{mask}}(x,y)=f(x,y)-\bar{f}(x,y)
$$

This mask contains the details and high-frequency information removed by smoothing.

## 14.2 Add the mask to the original

$$
g(x,y)=f(x,y)+k\,g_{\text{mask}}(x,y)
$$

Substituting the mask equation:

$$
g(x,y)=f(x,y)+k\left[f(x,y)-\bar{f}(x,y)\right]
$$

or

$$
g(x,y)=(1+k)f(x,y)-k\bar{f}(x,y)
$$

---

## 14.3 Meaning of $k$

| Value of $k$ | Result |
|---:|---|
| $0<k<1$ | Reduced sharpening effect |
| $k=1$ | Standard unsharp masking |
| $k>1$ | Highboost filtering |

Larger $k$ values emphasize high-frequency details more strongly, but they may also amplify noise and produce halos.

---

# 15. Gradient-Based Sharpening

The image gradient is a first-derivative vector.

## 15.1 Gradient vector

$$
\nabla f
\equiv
\operatorname{grad}(f)
=
\begin{bmatrix}
g_x\\
g_y
\end{bmatrix}
=
\begin{bmatrix}
\frac{\partial f}{\partial x}\\
\frac{\partial f}{\partial y}
\end{bmatrix}
$$

where:

- $g_x$ measures the horizontal derivative.
- $g_y$ measures the vertical derivative.

The gradient vector points in the direction of the greatest increase in intensity.

---

## 15.2 Gradient magnitude

The exact magnitude is

$$
M(x,y)=\|\nabla f\|
=\sqrt{g_x^2+g_y^2}
$$

A faster approximation is

$$
M(x,y)\approx |g_x|+|g_y|
$$

Large gradient magnitudes indicate strong edges.

---

## 15.3 Roberts cross-gradient operators

Two common Roberts kernels are

$$
G_x=
\begin{bmatrix}
-1&0\\
0&1
\end{bmatrix}
$$

and

$$
G_y=
\begin{bmatrix}
0&-1\\
1&0
\end{bmatrix}
$$

The Roberts operator estimates diagonal intensity differences using a small $2\times2$ neighbourhood.

### Characteristics

- Simple and fast
- Sensitive to noise
- Less smoothing than Sobel
- Detects changes along diagonal directions

---

## 15.4 Sobel operators

A common Sobel pair is

$$
G_x=
\begin{bmatrix}
-1&0&1\\
-2&0&2\\
-1&0&1
\end{bmatrix}
$$

and

$$
G_y=
\begin{bmatrix}
-1&-2&-1\\
0&0&0\\
1&2&1
\end{bmatrix}
$$

Depending on the coordinate convention or kernel orientation, both kernels may appear with their signs reversed. The gradient magnitude is unaffected because it uses absolute values or squared values.

### Interpretation

- $G_x$ responds strongly to vertical edges because intensity changes horizontally across them.
- $G_y$ responds strongly to horizontal edges because intensity changes vertically across them.

Each Sobel kernel sums to zero, which is expected for a derivative operator.

### Why the coefficient 2 appears

The middle row or column receives extra weight. This introduces a small smoothing effect in the direction perpendicular to the derivative, making Sobel less sensitive to noise than a simple difference operator.

---

# 16. Filter Comparison

## 16.1 Smoothing filters

| Filter | Linear? | Separable? | Best use | Main weakness |
|---|---:|---:|---|---|
| Box | Yes | Yes | Simple averaging and general smoothing | Blurs edges; equal weighting is crude |
| Gaussian | Yes | Yes | Natural smoothing and Gaussian-like noise | Blurs edges; requires choosing $\sigma$ |
| Bilinear | Yes | Yes | Lightweight weighted smoothing | Limited control compared with Gaussian |
| Median | No | No | Salt-and-pepper noise | More expensive; may remove thin details |

---

## 16.2 Sharpening methods

| Method | Derivative type | Main idea | Important issue |
|---|---|---|---|
| Gradient | First derivative | Emphasize local slopes and edges | Sensitive to noise |
| Laplacian | Second derivative | Emphasize rapid changes in all directions | Produces positive and negative values |
| Unsharp masking | High-frequency mask | Add original-minus-blurred details | May create halos |
| Highboost filtering | Amplified unsharp mask | Add a stronger detail component | Can strongly amplify noise |

---

## 16.3 Choosing a filter

| Problem | Suitable first choice |
|---|---|
| Mild random Gaussian-like noise | Gaussian filter |
| Strong salt-and-pepper noise | Median filter |
| Very simple smoothing | Box filter |
| Efficient small weighted blur | Bilinear filter |
| Detecting edges | Sobel gradient |
| Sharpening in all directions | Laplacian |
| Controlled photographic sharpening | Unsharp masking |

---

# 17. Exam Cheat Sheet

## Noise model

$$
\hat{I}(i,j)=I(i,j)+n(i,j)
$$

## Linear spatial filtering

$$
g(x,y)=\sum_s\sum_t w(s,t)f(x+s,y+t)
$$

## Correlation

$$
(w\star f)(x,y)=\sum_s\sum_t w(s,t)f(x+s,y+t)
$$

## Convolution

$$
(w*f)(x,y)=\sum_s\sum_t w(s,t)f(x-s,y-t)
$$

**Convolution flips the kernel by $180^\circ$; correlation does not.**

## Box kernel

$$
w=\frac{1}{mn}\mathbf{1}_{m\times n}
$$

## Gaussian kernel

$$
G(s,t)=K e^{-\frac{s^2+t^2}{2\sigma^2}}
$$

- Larger $\sigma$ means more smoothing.
- Normalize the sampled discrete kernel so its coefficients sum to 1.
- Gaussian filters are separable and isotropic.

## Bilinear kernel

$$
\frac{1}{16}
\begin{bmatrix}
1&2&1\\
2&4&2\\
1&2&1
\end{bmatrix}
$$

## Median filter

Sort neighbourhood values and choose the middle value.

Best for salt-and-pepper noise.

## Laplacian

$$
\nabla^2 f=\frac{\partial^2f}{\partial x^2}+\frac{\partial^2f}{\partial y^2}
$$

Four-neighbour discrete form:

$$
\nabla^2 f(x,y)=f(x+1,y)+f(x-1,y)+f(x,y+1)+f(x,y-1)-4f(x,y)
$$

Sharpening:

$$
g=f+c\nabla^2f
$$

Use $c$ with the same sign as the centre coefficient of the Laplacian kernel.

## Unsharp masking

$$
g_{\text{mask}}=f-\bar f
$$

$$
g=f+k g_{\text{mask}}
$$

- $k=1$: unsharp masking
- $k>1$: highboost filtering

## Gradient

$$
\nabla f=
\begin{bmatrix}
g_x\\g_y
\end{bmatrix}
$$

$$
M(x,y)=\sqrt{g_x^2+g_y^2}
\approx |g_x|+|g_y|
$$

## Sobel kernels

$$
G_x=
\begin{bmatrix}
-1&0&1\\
-2&0&2\\
-1&0&1
\end{bmatrix}
$$

$$
G_y=
\begin{bmatrix}
-1&-2&-1\\
0&0&0\\
1&2&1
\end{bmatrix}
$$

---

# Key Takeaways

1. Noise is unwanted image variation, commonly modelled as Gaussian noise or salt-and-pepper noise.
2. Smoothing is a low-pass operation that reduces noise but may also blur real edges.
3. Linear filters calculate weighted sums; the median filter is nonlinear.
4. Correlation uses a kernel directly, while convolution first rotates it by $180^\circ$.
5. Separable filters reduce the cost of 2-D filtering from roughly $MNmn$ to $MN(m+n)$ operations.
6. Gaussian filtering gives smooth, isotropic, and separable low-pass filtering.
7. Median filtering is especially effective for impulsive noise.
8. Sharpening emphasizes high frequencies using gradients, the Laplacian, or unsharp masking.
9. Derivative kernels sum to zero because constant regions should produce zero response.
10. Sharpening can amplify noise, so light smoothing is sometimes applied before differentiation.

---

## References from the slides

- R. C. Gonzalez and R. E. Woods, *Digital Image Processing*, 4th ed., Pearson, 2018.
- R. Szeliski, *Computer Vision: Algorithms and Applications*.
- Kenneth Dawson-Howe, *A Practical Introduction to Computer Vision with OpenCV*, Wiley, 2014.
