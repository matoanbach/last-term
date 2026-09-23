# Image Processing in the Frequency Domain — Combined Notes

**Course:** SEG800 — Digital Signal and Image Processing  
**Combined sources:** `slides10_IP_Frequency(1) (1)(1).pdf` and `Week 8 Lecture.pdf`  
**Topics:** Sampling, 2-D DFT/IDFT, Fourier properties, circular convolution, zero-padding, and frequency-domain filtering

---

## Table of Contents

1. [Why Process Images in the Frequency Domain?](#1-why-process-images-in-the-frequency-domain)
2. [Fourier Transform Review](#2-fourier-transform-review)
3. [Computational Cost: Spatial Domain vs. Frequency Domain](#3-computational-cost-spatial-domain-vs-frequency-domain)
4. [Sampling and the Impulse Function](#4-sampling-and-the-impulse-function)
5. [Sampling Theorem and Aliasing](#5-sampling-theorem-and-aliasing)
6. [Two-Dimensional Sampling](#6-two-dimensional-sampling)
7. [The 1-D and 2-D DFT/IDFT](#7-the-1-d-and-2-d-dftidft)
8. [Worked 1-D DFT Example from the Lecture](#8-worked-1-d-dft-example-from-the-lecture)
9. [Spatial and Frequency Sampling Intervals](#9-spatial-and-frequency-sampling-intervals)
10. [Properties of the 2-D DFT](#10-properties-of-the-2-d-dft)
11. [Fourier Magnitude, Phase, Power, and DC Component](#11-fourier-magnitude-phase-power-and-dc-component)
12. [Two-Dimensional Circular Convolution](#12-two-dimensional-circular-convolution)
13. [Wraparound Error and Zero-Padding](#13-wraparound-error-and-zero-padding)
14. [Frequency-Domain Filtering Procedure](#14-frequency-domain-filtering-procedure)
15. [Low-Pass Filters](#15-low-pass-filters)
16. [High-Pass Filters](#16-high-pass-filters)
17. [Filter Behaviour and Applications](#17-filter-behaviour-and-applications)
18. [Spatial-Domain and Frequency-Domain Connections](#18-spatial-domain-and-frequency-domain-connections)
19. [Common Mistakes](#19-common-mistakes)
20. [Exam Cheat Sheet](#20-exam-cheat-sheet)

---

# 1. Why Process Images in the Frequency Domain?

An image can be represented in two main ways:

- **Spatial domain:** the image is represented directly by pixel values, $f(x,y)$.
- **Frequency domain:** the image is represented by its spatial-frequency components, $F(u,v)$.

A general transform-domain workflow is

```text
Spatial image f(x,y)
        ↓ transform
Frequency representation F(u,v)
        ↓ operation/filter H(u,v)
Modified spectrum G(u,v)
        ↓ inverse transform
Output image g(x,y)
```

Mathematically:

$$
F(u,v)=\mathcal{F}\{f(x,y)\}
$$

$$
G(u,v)=H(u,v)F(u,v)
$$

$$
g(x,y)=\mathcal{F}^{-1}\{G(u,v)\}
$$

Frequency-domain processing is useful because:

- Convolution in the spatial domain becomes multiplication in the frequency domain.
- Large filters can be applied efficiently using the FFT.
- Low-frequency and high-frequency image information can be controlled directly.
- Periodic patterns and interference can be easier to detect in the Fourier spectrum.

## 1.1 Meaning of spatial frequency

Spatial frequency describes how quickly image intensity changes with position.

- **Low spatial frequencies:** slowly changing regions, smooth backgrounds, gradual shading.
- **High spatial frequencies:** edges, fine details, narrow lines, and often noise.

Therefore:

- A **low-pass filter** smooths an image.
- A **high-pass filter** emphasizes edges and details.

---

# 2. Fourier Transform Review

## 2.1 Fourier series

A periodic signal can be represented as a sum of sine and cosine components with different frequencies and coefficients.

## 2.2 Fourier transform

A nonperiodic function can be represented using a continuous collection of sinusoidal components.

The Fourier transform answers the question:

> Which frequencies are present, and how much of each frequency is present?

## 2.3 Convolution theorem

The most important reason frequency-domain filtering works is the convolution theorem.

If

$$
g(x,y)=f(x,y)*h(x,y),
$$

then

$$
G(u,v)=F(u,v)H(u,v).
$$

Therefore:

$$
f*h \quad \Longleftrightarrow \quad FH.
$$

Conversely:

$$
\mathcal{F}^{-1}\{F(u,v)H(u,v)\}=f(x,y)*h(x,y).
$$

This means that instead of sliding a large kernel over every pixel, we may:

1. Transform the image and kernel.
2. Multiply their transforms element by element.
3. Apply the inverse transform.

### Product theorem

Multiplication in the spatial domain corresponds to scaled circular convolution in the frequency domain:

$$
f(x,y)h(x,y)
\quad\Longleftrightarrow\quad
\frac{1}{MN}\left[F(u,v)\circledast H(u,v)\right].
$$

Here, $\circledast$ denotes circular convolution.

---

# 3. Computational Cost: Spatial Domain vs. Frequency Domain

Suppose:

- The image has size $M\times N$.
- The kernel has size $m\times n$.

The approximate operation counts are:

| Method | Approximate number of operations |
|---|---:|
| Direct spatial filtering | $MNmn$ |
| Spatial filtering with a separable kernel | $MN(m+n)$ |
| Frequency-domain filtering using FFT | $2MN\log_2(MN)$ |

The factor of 2 represents approximately one forward FFT and one inverse FFT. In practice, there are also elementwise multiplications and padding costs.

## 3.1 Square-image comparison

Assume:

- Image size: $M\times M$
- Kernel size: $m\times m$

The computational advantage of FFT filtering over direct spatial filtering is approximately

$$
C_n(m)
=
\frac{M^2m^2}{2M^2\log_2(M^2)}
=
\frac{m^2}{4\log_2M}.
$$

The advantage over a separable spatial filter is approximately

$$
C_s(m)
=
\frac{2M^2m}{2M^2\log_2(M^2)}
=
\frac{m}{2\log_2M}.
$$

## 3.2 Interpretation

- A small spatial kernel is often faster to apply directly.
- A large nonseparable kernel can make FFT filtering much faster.
- If a kernel is separable, spatial filtering remains competitive for larger kernel sizes.
- The FFT is an efficient algorithm for calculating the DFT; it does not change the mathematical DFT result.

### Complexity reminder

For a one-dimensional sequence containing $M$ samples:

- Direct DFT: approximately $O(M^2)$
- FFT: approximately $O(M\log_2M)$

For an $M\times N$ image:

- Direct 2-D DFT: approximately $O(M^2N^2)$
- 2-D FFT: approximately $O(MN\log(MN))$

---

# 4. Sampling and the Impulse Function

A continuous image must be sampled before it can be processed digitally.

## 4.1 Continuous unit impulse

The Dirac delta function is defined conceptually by

$$
\delta(t)=
\begin{cases}
\infty, & t=0,\\
0, & t\neq 0,
\end{cases}
$$

with

$$
\int_{-\infty}^{\infty}\delta(t)\,dt=1.
$$

Its sifting property is

$$
\int_{-\infty}^{\infty}f(t)\delta(t-t_0)\,dt=f(t_0).
$$

## 4.2 Impulse train

A one-dimensional impulse train with sampling interval $\Delta T$ is

$$
s_{\Delta T}(t)=\sum_{k=-\infty}^{\infty}\delta(t-k\Delta T).
$$

Sampling a continuous function is modelled by multiplication:

$$
\tilde{f}(t)=f(t)s_{\Delta T}(t).
$$

Therefore,

$$
\tilde{f}(t)
=
\sum_{n=-\infty}^{\infty}
f(t)\delta(t-n\Delta T).
$$

The impulses select the values of $f(t)$ at the sampling positions.

## 4.3 Discrete impulse

For discrete variables:

$$
\delta[x]=
\begin{cases}
1, & x=0,\\
0, & x\neq 0.
\end{cases}
$$

Also,

$$
\sum_{x=-\infty}^{\infty}\delta[x]=1
$$

and the discrete sifting property is

$$
\sum_{x=-\infty}^{\infty}f[x]\delta[x-x_0]=f[x_0].
$$

---

# 5. Sampling Theorem and Aliasing

## 5.1 Fourier transform of a sampled function

Sampling a continuous function creates repeated copies of its spectrum.

If the sampling interval is $\Delta T$, the spectral copies are separated by

$$
F_s=\frac{1}{\Delta T}.
$$

- A small $\Delta T$ means a high sampling frequency and widely separated spectral copies.
- A large $\Delta T$ means a low sampling frequency and closely spaced spectral copies.

## 5.2 Nyquist sampling theorem

A continuous band-limited function can be reconstructed from its samples when

$$
F_s>2F_{\max}.
$$

The value

$$
F_N=2F_{\max}
$$

is called the **Nyquist rate**.

Some texts state the condition as $F_s\geq 2F_{\max}$, but sampling exactly at the boundary is fragile. In practice, the sampling frequency is chosen above the Nyquist rate.

## 5.3 Oversampling, critical sampling, and undersampling

| Condition | Relationship | Result |
|---|---|---|
| Oversampling | $F_s>2F_{\max}$ | Spectral copies remain separated. |
| Critical sampling | $F_s=2F_{\max}$ | Copies just touch. |
| Undersampling | $F_s<2F_{\max}$ | Copies overlap, causing aliasing. |

## 5.4 Aliasing

**Aliasing** occurs when the sampling rate is too low to represent the original frequency content.

High-frequency components then appear as incorrect lower-frequency components.

In images, aliasing may appear as:

- False checkerboard patterns
- Jagged edges
- Repeating bands
- Incorrect line orientation
- Moiré patterns

Aliasing is dangerous because the aliased image may look plausible even though it does not represent the original scene correctly.

## 5.5 Moiré effect

A moiré pattern is a visible low-frequency pattern produced by the interaction of two fine periodic patterns.

Examples include:

- Photographing a display or printed screen
- Scanning halftone images
- Overlapping line grids with slightly different angles
- Fine clothing patterns captured by a digital camera

An anti-aliasing low-pass filter reduces high frequencies before sampling.

---

# 6. Two-Dimensional Sampling

For a continuous function $f(t,z)$, a 2-D impulse train is

$$
s_{\Delta T,\Delta Z}(t,z)
=
\sum_{m=-\infty}^{\infty}
\sum_{n=-\infty}^{\infty}
\delta(t-m\Delta T,z-n\Delta Z).
$$

The sampled image is obtained by multiplying the continuous image by this impulse train.

## 6.1 Band-limited 2-D function

A 2-D function is band-limited when its Fourier transform is zero outside finite frequency limits:

$$
F(\mu,\nu)=0
$$

outside the region bounded by $\mu_{\max}$ and $\nu_{\max}$.

## 6.2 Two-dimensional sampling theorem

The sampling rates must satisfy the Nyquist condition independently in both directions:

$$
F_T=\frac{1}{\Delta T}>2\mu_{\max}
$$

and

$$
F_Z=\frac{1}{\Delta Z}>2\nu_{\max}.
$$

Equivalently, the sampling intervals must satisfy

$$
\Delta T<\frac{1}{2\mu_{\max}}
$$

and

$$
\Delta Z<\frac{1}{2\nu_{\max}}.
$$

Failing the condition in either direction can cause 2-D aliasing.

---

# 7. The 1-D and 2-D DFT/IDFT

## 7.1 One-dimensional DFT

For a sequence $f(x)$ containing $M$ samples:

$$
F(u)=\sum_{x=0}^{M-1}f(x)e^{-j2\pi ux/M},
\qquad u=0,1,\ldots,M-1.
$$

## 7.2 One-dimensional IDFT

$$
f(x)=\frac{1}{M}\sum_{u=0}^{M-1}F(u)e^{j2\pi ux/M},
\qquad x=0,1,\ldots,M-1.
$$

Notice the differences:

| DFT | IDFT |
|---|---|
| Negative exponent | Positive exponent |
| No $1/M$ factor in this convention | Includes $1/M$ |
| Converts samples to frequency coefficients | Reconstructs the samples |

## 7.3 Two-dimensional DFT

For an image $f(x,y)$ of size $M\times N$:

$$
F(u,v)
=
\sum_{x=0}^{M-1}
\sum_{y=0}^{N-1}
f(x,y)
e^{-j2\pi\left(\frac{ux}{M}+\frac{vy}{N}\right)}.
$$

The indices are

$$
u=0,1,\ldots,M-1,
\qquad
v=0,1,\ldots,N-1.
$$

## 7.4 Two-dimensional IDFT

$$
f(x,y)
=
\frac{1}{MN}
\sum_{u=0}^{M-1}
\sum_{v=0}^{N-1}
F(u,v)
e^{j2\pi\left(\frac{ux}{M}+\frac{vy}{N}\right)}.
$$

## 7.5 Separability of the 2-D DFT

The 2-D DFT can be calculated using two sets of 1-D transforms:

1. Calculate a 1-D DFT across every row.
2. Calculate a 1-D DFT down every column of the result.

The order may be reversed:

- Columns first, then rows
- Rows first, then columns

Both produce the same 2-D DFT.

---

# 8. Worked 1-D DFT Example from the Lecture

The annotated lecture uses the four-sample sequence

$$
f(x)=[1,2,4,4].
$$

Here,

$$
M=4.
$$

The DFT is

$$
F(u)=\sum_{x=0}^{3}f(x)e^{-j2\pi ux/4}.
$$

## 8.1 Calculate $F(0)$

When $u=0$, every exponential is 1:

$$
F(0)=1+2+4+4=11.
$$

This is the DC component and equals the sum of all samples.

## 8.2 Calculate $F(1)$

$$
F(1)
=1+2e^{-j\pi/2}+4e^{-j\pi}+4e^{-j3\pi/2}.
$$

Using

$$
e^{-j\pi/2}=-j,
\qquad
e^{-j\pi}=-1,
\qquad
e^{-j3\pi/2}=j,
$$

we obtain

$$
F(1)=1-2j-4+4j=-3+2j.
$$

## 8.3 Calculate $F(2)$

$$
F(2)=1-2+4-4=-1.
$$

## 8.4 Calculate $F(3)$

Because the input sequence is real, the DFT is conjugate symmetric:

$$
F(3)=F^*(1)=-3-2j.
$$

Therefore,

$$
\boxed{F(u)=[11,-3+2j,-1,-3-2j]}.
$$

## 8.5 Recover $f(0)$ using the IDFT

$$
f(0)=\frac{1}{4}\sum_{u=0}^{3}F(u)e^{j2\pi u(0)/4}.
$$

Since all exponential terms equal 1:

$$
f(0)
=
\frac{1}{4}
\left[11+(-3+2j)-1+(-3-2j)\right].
$$

The imaginary components cancel:

$$
f(0)=\frac{4}{4}=1.
$$

This matches the original first sample.

---

# 9. Spatial and Frequency Sampling Intervals

Suppose a continuous function is sampled $M$ times with spatial or time interval $\Delta T$.

The total record length is

$$
T=M\Delta T.
$$

The spacing between DFT frequency samples is

$$
\Delta u=\frac{1}{M\Delta T}=\frac{1}{T}.
$$

The total frequency range represented by the DFT is

$$
R=M\Delta u=\frac{1}{\Delta T}.
$$

This gives two important inverse relationships:

1. **Longer record length $T$ gives finer frequency resolution.**

   $$
   \Delta u=\frac{1}{T}
   $$

2. **Smaller sampling interval $\Delta T$ gives a larger frequency range.**

   $$
   R=\frac{1}{\Delta T}
   $$

## 9.1 Two-dimensional intervals

For an $M\times N$ image sampled with intervals $\Delta T$ and $\Delta Z$:

$$
\Delta u=\frac{1}{M\Delta T}
$$

and

$$
\Delta v=\frac{1}{N\Delta Z}.
$$

A larger image extent gives more closely spaced frequency samples.

---

# 10. Properties of the 2-D DFT

## 10.1 Linearity

If

$$
g(x,y)=a f(x,y)+b h(x,y),
$$

then

$$
G(u,v)=aF(u,v)+bH(u,v).
$$

## 10.2 Translation in the spatial domain

Shifting an image changes the Fourier phase but does not change its magnitude spectrum:

$$
f(x-x_0,y-y_0)
\quad\Longleftrightarrow\quad
F(u,v)e^{-j2\pi\left(\frac{ux_0}{M}+\frac{vy_0}{N}\right)}.
$$

Therefore:

$$
\left|\mathcal{F}\{f(x-x_0,y-y_0)\}\right|=|F(u,v)|.
$$

This explains why a centered rectangle and a translated rectangle have the same Fourier magnitude spectrum.

## 10.3 Translation in the frequency domain

Multiplying the image by a complex exponential shifts its spectrum:

$$
f(x,y)e^{j2\pi\left(\frac{u_0x}{M}+\frac{v_0y}{N}\right)}
\quad\Longleftrightarrow\quad
F(u-u_0,v-v_0).
$$

## 10.4 Rotation

Using polar coordinates,

$$
x=r\cos\theta,
\qquad
y=r\sin\theta,
$$

and

$$
u=\omega\cos\phi,
\qquad
v=\omega\sin\phi.
$$

If an image is rotated by $\theta_0$, its Fourier transform rotates by the same angle:

$$
f(r,\theta+\theta_0)
\quad\Longleftrightarrow\quad
F(\omega,\phi+\theta_0).
$$

## 10.5 Periodicity

The DFT is periodic in both frequency directions:

$$
F(u,v)
=
F(u+k_1M,v)
=
F(u,v+k_2N)
=
F(u+k_1M,v+k_2N),
$$

where $k_1$ and $k_2$ are integers.

The IDFT image is also treated as periodic:

$$
f(x,y)
=
f(x+k_1M,y)
=
f(x,y+k_2N)
=
f(x+k_1M,y+k_2N).
$$

This periodic interpretation is the cause of circular convolution and wraparound error.

## 10.6 Centering the Fourier transform

Without centering, the zero-frequency component appears at the top-left corner of the DFT array.

Multiplying the image by

$$
(-1)^{x+y}
$$

before applying the DFT shifts the spectrum by $(M/2,N/2)$:

$$
f(x,y)(-1)^{x+y}
\quad\Longleftrightarrow\quad
F\left(u-\frac{M}{2},v-\frac{N}{2}\right).
$$

After centering:

- DC and low frequencies appear near the centre.
- Higher frequencies appear farther from the centre.
- Radially symmetric filters are easier to construct.

In software, this operation is commonly performed using an FFT-shift operation.

## 10.7 Even and odd components

Any function can be decomposed into even and odd components:

$$
w(x,y)=w_e(x,y)+w_o(x,y),
$$

where

$$
w_e(x,y)=\frac{w(x,y)+w(-x,-y)}{2}
$$

and

$$
w_o(x,y)=\frac{w(x,y)-w(-x,-y)}{2}.
$$

- The even component is symmetric.
- The odd component is antisymmetric.

## 10.8 Conjugate symmetry for real images

For a real-valued image:

$$
F^*(u,v)=F(-u,-v).
$$

In periodic DFT indexing, this may also be written as

$$
F^*(u,v)=F(M-u,N-v).
$$

Consequences:

- The magnitude spectrum is even.
- The phase spectrum is odd, except where phase is undefined.
- Roughly half the transform contains redundant information.

---

# 11. Fourier Magnitude, Phase, Power, and DC Component

The Fourier transform is generally complex:

$$
F(u,v)=R(u,v)+jI(u,v).
$$

It can also be written in polar form:

$$
F(u,v)=|F(u,v)|e^{j\phi(u,v)}.
$$

## 11.1 Magnitude spectrum

$$
|F(u,v)|
=
\sqrt{R^2(u,v)+I^2(u,v)}.
$$

The magnitude indicates the amount of each spatial frequency.

For display, the dynamic range is often compressed with

$$
S(u,v)=\log\left(1+|F(u,v)|\right).
$$

Without logarithmic scaling, a strong DC component can make most other frequencies appear almost black.

## 11.2 Phase spectrum

$$
\phi(u,v)
=
\operatorname{atan2}\left(I(u,v),R(u,v)\right).
$$

The slides write the basic relationship as

$$
\phi(u,v)=\arctan\left(\frac{I(u,v)}{R(u,v)}\right),
$$

but `atan2` is preferred in computation because it determines the correct quadrant.

Phase carries important structural and positional information.

- Translating an object changes its phase.
- Translating an object does not change its magnitude spectrum.
- Rotating an object rotates its magnitude and phase patterns.

## 11.3 Power spectrum

$$
P(u,v)=|F(u,v)|^2.
$$

The power spectrum represents frequency energy.

## 11.4 DC component

At $u=v=0$:

$$
F(0,0)
=
\sum_{x=0}^{M-1}
\sum_{y=0}^{N-1}
f(x,y).
$$

The mean image intensity is

$$
\bar{f}=\frac{F(0,0)}{MN}.
$$

Therefore,

$$
F(0,0)=MN\bar{f}.
$$

Removing the DC component removes the image average and usually produces an image centred around zero intensity.

---

# 12. Two-Dimensional Circular Convolution

Because the DFT treats its input arrays as periodic, multiplication of DFTs corresponds to **circular convolution**, not automatically to ordinary linear convolution.

## 12.1 One-dimensional circular convolution

For two length-$M$ sequences:

$$
(f\circledast h)(x)
=
\sum_{m=0}^{M-1}f(m)h((x-m)\bmod M).
$$

## 12.2 Two-dimensional circular convolution

For two arrays of size $M\times N$:

$$
(f\circledast h)(x,y)
=
\sum_{m=0}^{M-1}
\sum_{n=0}^{N-1}
f(m,n)
h((x-m)\bmod M,(y-n)\bmod N).
$$

## 12.3 Circular convolution theorem

$$
f(x,y)\circledast h(x,y)
\quad\Longleftrightarrow\quad
F(u,v)H(u,v).
$$

Therefore,

$$
f\circledast h
=
\mathcal{F}^{-1}\{FH\}.
$$

To make the circular convolution equal the desired linear convolution, the inputs must be padded sufficiently.

---

# 13. Wraparound Error and Zero-Padding

## 13.1 Why wraparound occurs

The DFT assumes that an array repeats forever.

During circular convolution, content leaving one side of the image returns from the opposite side. This causes **wraparound error**.

The result may contain:

- False structures near borders
- Overlapping copies
- Edge interference
- A result different from direct linear convolution

## 13.2 One-dimensional padding condition

Suppose:

- $f$ contains $A$ samples.
- $h$ contains $B$ samples.

To obtain linear convolution using the DFT, choose the padded length $P$ such that

$$
P\geq A+B-1.
$$

## 13.3 Two-dimensional padding condition

Suppose:

- $f$ has size $A\times B$.
- $h$ has size $C\times D$.

Choose

$$
P\geq A+C-1
$$

and

$$
Q\geq B+D-1.
$$

The padded functions are

$$
f_p(x,y)=
\begin{cases}
f(x,y), & 0\leq x\leq A-1,\ 0\leq y\leq B-1,\\
0, & \text{otherwise},
\end{cases}
$$

and

$$
h_p(x,y)=
\begin{cases}
h(x,y), & 0\leq x\leq C-1,\ 0\leq y\leq D-1,\\
0, & \text{otherwise}.
\end{cases}
$$

## 13.4 Equal-size arrays

If both arrays have size $M\times N$, the mathematical minimum is

$$
P\geq 2M-1,
\qquad
Q\geq 2N-1.
$$

The slides use the convenient smallest even choices

$$
P=2M,
\qquad
Q=2N.
$$

FFT implementations may choose an even larger size that is computationally convenient.

## 13.5 Padding methods

- **Zero padding:** fill new pixels with zero.
- **Replicate padding:** extend border pixel values.
- **Mirror padding:** reflect the image at its borders.

Zero padding is the standard method for ensuring correct linear convolution. Mirror or replicate padding may reduce visual border discontinuities, depending on the application.

---

# 14. Frequency-Domain Filtering Procedure

Suppose the original image $f(x,y)$ has size $M\times N$.

## Step 1: Select padded dimensions

A common choice is

$$
P=2M,
\qquad
Q=2N.
$$

For a kernel with a different size, use the more general linear-convolution padding conditions.

## Step 2: Pad the image

Create a padded image $f_p(x,y)$ of size $P\times Q$.

## Step 3: Centre the transform

Multiply the padded image by

$$
(-1)^{x+y}.
$$

Define

$$
f_c(x,y)=f_p(x,y)(-1)^{x+y}.
$$

## Step 4: Calculate the DFT

$$
F(u,v)=\mathcal{F}\{f_c(x,y)\}.
$$

## Step 5: Construct the filter transfer function

Construct $H(u,v)$ with size $P\times Q$ and centre it at

$$
\left(\frac{P}{2},\frac{Q}{2}\right).
$$

For a radial filter, define the distance from the frequency centre:

$$
D(u,v)
=
\sqrt{
\left(u-\frac{P}{2}\right)^2
+
\left(v-\frac{Q}{2}\right)^2
}.
$$

For a real output and zero-phase filtering, $H(u,v)$ is normally chosen to be real and symmetric.

## Step 6: Multiply element by element

$$
G(u,v)=H(u,v)F(u,v).
$$

This is ordinary pointwise multiplication, not matrix multiplication.

## Step 7: Apply the IDFT and undo centering

$$
g_p(x,y)
=
\operatorname{Re}\left\{
\mathcal{F}^{-1}[G(u,v)]
\right\}(-1)^{x+y}.
$$

The real part is used because small imaginary values may appear from numerical round-off.

## Step 8: Crop the result

Extract the original $M\times N$ region:

$$
g(x,y)=g_p(x,y),
\qquad
0\leq x<M,
\quad
0\leq y<N.
$$

## 14.1 Complete pipeline

```text
Original image f(x,y)
        ↓
Pad to P × Q
        ↓
Multiply by (-1)^(x+y)
        ↓
DFT → F(u,v)
        ↓
Construct H(u,v)
        ↓
G(u,v) = H(u,v)F(u,v)
        ↓
IDFT
        ↓
Multiply by (-1)^(x+y)
        ↓
Take real part and crop
        ↓
Filtered image g(x,y)
```

---

# 15. Low-Pass Filters

A low-pass filter keeps low frequencies and reduces high frequencies.

Typical effects:

- Smoothing
- Noise reduction
- Removal of fine detail
- Edge blurring

Let

$$
D(u,v)
=
\sqrt{
\left(u-\frac{P}{2}\right)^2
+
\left(v-\frac{Q}{2}\right)^2
}
$$

and let $D_0$ be the cutoff frequency.

## 15.1 Ideal low-pass filter — ILPF

$$
H_{ILPF}(u,v)=
\begin{cases}
1, & D(u,v)\leq D_0,\\
0, & D(u,v)>D_0.
\end{cases}
$$

### Behaviour

- Perfectly passes frequencies inside the cutoff circle.
- Completely removes frequencies outside the circle.
- Has an abrupt transition.
- Produces ringing in the spatial domain because its spatial kernel oscillates.

This ringing is related to the Gibbs phenomenon.

## 15.2 Gaussian low-pass filter — GLPF

$$
H_{GLPF}(u,v)
=
\exp\left[-\frac{D^2(u,v)}{2D_0^2}\right].
$$

### Behaviour

- Smooth transition from passband to stopband.
- No sharp cutoff.
- Produces little or no ringing.
- Usually gives natural-looking smoothing.

A smaller $D_0$ passes a smaller low-frequency region and causes stronger blurring.

A larger $D_0$ preserves more detail and causes weaker blurring.

## 15.3 Butterworth low-pass filter — BLPF

For order $n$:

$$
H_{BLPF}(u,v)
=
\frac{1}{1+\left[\frac{D(u,v)}{D_0}\right]^{2n}}.
$$

### Behaviour

- Provides a controllable transition.
- $n=1$ gives a gradual transition.
- Increasing $n$ makes the transition sharper.
- Very high $n$ approaches the ideal filter and increases ringing.

## 15.4 Low-pass comparison

| Filter | Transition | Ringing | Main advantage | Main disadvantage |
|---|---|---|---|---|
| Ideal | Abrupt | Strong | Exact cutoff | Strong spatial ringing |
| Gaussian | Very smooth | Minimal | Natural smoothing | No exact cutoff |
| Butterworth | Adjustable | Depends on $n$ | Flexible transition | High order may ring |

---

# 16. High-Pass Filters

A high-pass filter keeps high frequencies and reduces low frequencies.

Typical effects:

- Edge enhancement
- Sharpening
- Fine-detail extraction
- Background suppression

A high-pass filter can be created from its low-pass equivalent:

$$
H_{HP}(u,v)=1-H_{LP}(u,v).
$$

## 16.1 Ideal high-pass filter — IHPF

$$
H_{IHPF}(u,v)=
\begin{cases}
0, & D(u,v)\leq D_0,\\
1, & D(u,v)>D_0.
\end{cases}
$$

### Behaviour

- Completely rejects low frequencies inside the cutoff circle.
- Passes all frequencies outside the circle.
- Produces strong ringing because of the abrupt cutoff.

## 16.2 Gaussian high-pass filter — GHPF

$$
H_{GHPF}(u,v)
=
1-
\exp\left[-\frac{D^2(u,v)}{2D_0^2}\right].
$$

### Behaviour

- Smoothly suppresses low frequencies.
- Produces less ringing than an ideal high-pass filter.
- Often gives more visually natural sharpening.

## 16.3 Butterworth high-pass filter — BHPF

$$
H_{BHPF}(u,v)
=
\frac{1}{1+\left[\frac{D_0}{D(u,v)}\right]^{2n}}.
$$

At $D(u,v)=0$, define

$$
H_{BHPF}(0,0)=0.
$$

### Behaviour

- Transition sharpness is controlled by $n$.
- Higher order gives a sharper transition.
- Excessively high order can cause ringing.

## 16.4 High-pass comparison

| Filter | Transition | Ringing | Typical use |
|---|---|---|---|
| Ideal | Abrupt | Strong | Theoretical analysis |
| Gaussian | Smooth | Minimal | Natural edge enhancement |
| Butterworth | Adjustable | Moderate depending on $n$ | Tunable sharpening |

---

# 17. Filter Behaviour and Applications

## 17.1 Removing the DC component

Setting only the centred DC term to zero removes the image average:

$$
H\left(\frac{P}{2},\frac{Q}{2}\right)=0.
$$

All other values of $H(u,v)$ remain 1.

The output retains variation and edges but loses the constant brightness level.

## 17.2 Low-pass applications

- Denoising
- Skin smoothing
- Reducing fine texture
- Preprocessing before downsampling
- Suppressing high-frequency interference

The lecture images show that reducing $D_0$ in a Gaussian low-pass filter removes progressively more fine facial detail.

## 17.3 High-pass applications

- Fingerprint ridge enhancement
- Edge extraction
- Sharpening blurry images
- Emphasizing anatomical structures
- Detecting defects or narrow structures

## 17.4 Thresholding after high-pass filtering

A common feature-extraction workflow is

```text
Image → high-pass filter → threshold → binary edge/detail image
```

For example, high-pass filtering can enhance fingerprint ridges before thresholding.

## 17.5 Laplacian sharpening in the frequency domain

For the continuous 2-D Fourier transform:

$$
\mathcal{F}\{\nabla^2f(x,y)\}
=
-4\pi^2(u^2+v^2)F(u,v).
$$

Thus, a Laplacian filter emphasizes frequencies according to their squared distance from the origin.

A sharpened image is formed by combining the original image with a scaled Laplacian result. The sign depends on the Laplacian convention used.

## 17.6 Offset high-pass and high-frequency emphasis

Pure high-pass filtering removes much of the low-frequency image structure and can make the result too dark or edge-like.

An offset high-pass filter retains part of the original image:

$$
H_{offset}(u,v)=a+H_{HP}(u,v),
$$

where $a>0$.

A more general high-frequency-emphasis filter is

$$
H_{HFE}(u,v)=a+bH_{HP}(u,v),
$$

where typically

$$
a>0,
\qquad
b>1.
$$

- $a$ preserves low-frequency background information.
- $b$ strengthens high-frequency details.

Contrast enhancement, such as histogram equalization, may be applied after high-frequency emphasis.

---

# 18. Spatial-Domain and Frequency-Domain Connections

## 18.1 Equivalent filtering results

When padding and kernel alignment are handled correctly:

$$
\text{spatial convolution}
=
\text{frequency multiplication followed by IDFT}.
$$

The two methods should produce the same result, apart from small numerical differences.

## 18.2 Filter transfer function and spatial kernel

A frequency-domain transfer function $H(u,v)$ and a spatial-domain kernel $h(x,y)$ form a Fourier transform pair:

$$
h(x,y)
\quad\Longleftrightarrow\quad
H(u,v).
$$

Examples:

- A smooth Gaussian in frequency has a smooth Gaussian-like kernel in space.
- A sharp ideal cutoff in frequency produces a long oscillating spatial kernel.
- A high-pass transfer function produces a kernel with a strong centre and surrounding negative or oscillating values.

## 18.3 Why ideal filters ring

A perfectly sharp boundary in one domain requires a widely spread oscillatory function in the other domain.

Therefore:

- Abrupt frequency cutoff $\rightarrow$ oscillating spatial kernel
- Oscillating spatial kernel $\rightarrow$ ringing near image edges

Gaussian filters avoid this problem because they are smooth in both domains.

## 18.4 Frequency orientation

A spatial structure and its spectrum have a useful orientation relationship:

- A long vertical object changes quickly in the horizontal direction.
- Its spectrum spreads mainly along the horizontal frequency direction.
- Rotating the object rotates its spectrum by the same angle.

---

# 19. Common Mistakes

## Mistake 1: Treating frequency multiplication as matrix multiplication

The filtering operation is elementwise:

$$
G(u,v)=H(u,v)F(u,v).
$$

Each frequency coefficient is multiplied by the filter value at the same location.

## Mistake 2: Forgetting zero-padding

Without sufficient padding, DFT multiplication gives circular convolution and wraparound artifacts.

## Mistake 3: Forgetting centering

If the spectrum was centred using $(-1)^{x+y}$ before the DFT, the centering operation must be undone after the IDFT.

## Mistake 4: Constructing $H(u,v)$ around the wrong origin

After centering, a radial filter must be centred at

$$
(P/2,Q/2),
$$

not at $(0,0)$.

## Mistake 5: Reversing DFT and IDFT signs

- DFT exponent: negative
- IDFT exponent: positive
- IDFT scale: $1/(MN)$

## Mistake 6: Confusing $D_0$ with image dimensions

$D_0$ is a cutoff radius in the frequency plane. It controls how much frequency content passes.

## Mistake 7: Assuming a larger $D_0$ always means stronger filtering

- For a low-pass filter, larger $D_0$ means **less** smoothing.
- For a high-pass filter, larger $D_0$ removes a larger low-frequency region and usually creates a stronger high-pass effect.

## Mistake 8: Ignoring phase

Magnitude describes frequency strength, but phase contains essential structural and positional information.

## Mistake 9: Displaying the raw magnitude directly

The DC term can dominate the display. Use

$$
\log(1+|F|)
$$

for visualization.

## Mistake 10: Assuming all high frequencies are noise

Edges and fine image details are also high-frequency components. Strong low-pass filtering reduces both noise and useful detail.

---

# 20. Exam Cheat Sheet

## 20.1 Core DFT equations

### 1-D DFT

$$
F(u)=\sum_{x=0}^{M-1}f(x)e^{-j2\pi ux/M}
$$

### 1-D IDFT

$$
f(x)=\frac{1}{M}\sum_{u=0}^{M-1}F(u)e^{j2\pi ux/M}
$$

### 2-D DFT

$$
F(u,v)
=
\sum_{x=0}^{M-1}
\sum_{y=0}^{N-1}
f(x,y)e^{-j2\pi(ux/M+vy/N)}
$$

### 2-D IDFT

$$
f(x,y)
=
\frac{1}{MN}
\sum_{u=0}^{M-1}
\sum_{v=0}^{N-1}
F(u,v)e^{j2\pi(ux/M+vy/N)}
$$

## 20.2 Sampling

$$
F_s=\frac{1}{\Delta T}>2F_{\max}
$$

For two dimensions:

$$
\frac{1}{\Delta T}>2\mu_{\max},
\qquad
\frac{1}{\Delta Z}>2\nu_{\max}
$$

## 20.3 Frequency intervals

$$
T=M\Delta T
$$

$$
\Delta u=\frac{1}{M\Delta T}=\frac{1}{T}
$$

$$
R=\frac{1}{\Delta T}
$$

For two dimensions:

$$
\Delta u=\frac{1}{M\Delta T},
\qquad
\Delta v=\frac{1}{N\Delta Z}
$$

## 20.4 Spectrum quantities

$$
F=R+jI=|F|e^{j\phi}
$$

$$
|F|=\sqrt{R^2+I^2}
$$

$$
\phi=\operatorname{atan2}(I,R)
$$

$$
P=|F|^2
$$

$$
F(0,0)=MN\bar{f}
$$

## 20.5 Translation and centering

$$
f(x-x_0,y-y_0)
\Longleftrightarrow
F(u,v)e^{-j2\pi(ux_0/M+vy_0/N)}
$$

$$
f(x,y)(-1)^{x+y}
\Longleftrightarrow
F(u-M/2,v-N/2)
$$

## 20.6 Convolution theorem

$$
f\circledast h
\Longleftrightarrow
FH
$$

With sufficient padding, the circular convolution becomes the desired linear convolution.

## 20.7 Padding

For $A\times B$ convolved with $C\times D$:

$$
P\geq A+C-1,
\qquad
Q\geq B+D-1
$$

For two equal $M\times N$ arrays:

$$
P\geq2M-1,
\qquad
Q\geq2N-1
$$

Common convenient choice:

$$
P=2M,
\qquad
Q=2N
$$

## 20.8 Radial distance

$$
D(u,v)
=
\sqrt{
\left(u-\frac{P}{2}\right)^2
+
\left(v-\frac{Q}{2}\right)^2
}
$$

## 20.9 Low-pass filters

### Ideal

$$
H_{ILPF}=
\begin{cases}
1,&D\leq D_0,\\
0,&D>D_0
\end{cases}
$$

### Gaussian

$$
H_{GLPF}=e^{-D^2/(2D_0^2)}
$$

### Butterworth

$$
H_{BLPF}=\frac{1}{1+(D/D_0)^{2n}}
$$

## 20.10 High-pass filters

$$
H_{HP}=1-H_{LP}
$$

### Gaussian

$$
H_{GHPF}=1-e^{-D^2/(2D_0^2)}
$$

### Butterworth

$$
H_{BHPF}=\frac{1}{1+(D_0/D)^{2n}}
$$

## 20.11 Key conceptual comparisons

| Question | Answer |
|---|---|
| What causes aliasing? | Sampling below the Nyquist rate |
| What does low-pass filtering do? | Smooths and removes fine detail/high-frequency noise |
| What does high-pass filtering do? | Emphasizes edges and fine detail |
| Why pad before DFT filtering? | To prevent circular wraparound error |
| Why multiply by $(-1)^{x+y}$? | To move the DC component to the centre |
| What does a smaller LPF $D_0$ do? | Stronger smoothing |
| What does a higher Butterworth order do? | Sharper transition and potentially more ringing |
| Which filter has the least ringing? | Gaussian |
| Does translation change Fourier magnitude? | No; it changes phase |
| What is $F(0,0)$? | Sum of all image pixels |
| What is the image mean? | $F(0,0)/(MN)$ |
| When is FFT filtering attractive? | Large images and large nonseparable kernels |

---

# Final Summary

The frequency-domain image-processing workflow is based on four major ideas:

1. **Sampling:** A continuous image must be sampled above the Nyquist rates in both spatial directions to avoid aliasing.
2. **Fourier representation:** The 2-D DFT separates the image into spatial-frequency components with magnitude and phase.
3. **Convolution theorem:** Spatial convolution can be performed by multiplying the image and filter transforms.
4. **Correct implementation:** Padding prevents wraparound, centering places DC in the middle, and the IDFT returns the filtered spatial image.

The three principal low-pass and high-pass families are:

- Ideal
- Gaussian
- Butterworth

The ideal filter has the sharpest cutoff but the strongest ringing. The Gaussian filter has the smoothest transition and least ringing. The Butterworth filter provides a tunable compromise through its order $n$.
