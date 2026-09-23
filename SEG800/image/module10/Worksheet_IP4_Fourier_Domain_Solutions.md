# Worksheet IP.4 — Image Processing in Fourier Domain

## Solutions

---

## Question 1 — Two-Dimensional Sampling and Aliasing

A two-dimensional continuous function has maximum frequency components of:

- **60 Hz** in the horizontal direction
- **45 Hz** in the vertical direction

The function is sampled at:

- **100 samples/s** horizontally
- **80 samples/s** vertically

1. Determine whether aliasing will occur.
2. If aliasing occurs, suggest new sampling rates that avoid it.

### Solution

According to the sampling theorem, the sampling frequency must be greater than twice the highest frequency in each direction:

$$
f_s > 2f_{\max}
$$

#### 1. Nyquist rates

**Horizontal direction:**

$$
f_{s_x}=2(60)=120\ \text{Hz}
$$

**Vertical direction:**

$$
f_{s_y}=2(45)=90\ \text{Hz}
$$

#### 2. Compare with the given sampling rates

| Direction | Required Nyquist rate | Given sampling rate | Result |
|---|---:|---:|---|
| Horizontal | $120$ Hz | $100$ Hz | Below Nyquist; aliasing occurs |
| Vertical | $90$ Hz | $80$ Hz | Below Nyquist; aliasing occurs |

Therefore, **aliasing occurs in both directions**.

#### 3. Suggested sampling rates

To avoid aliasing, choose:

$$
f_{s_x}>120\ \text{Hz}
$$

$$
f_{s_y}>90\ \text{Hz}
$$

---

## Question 2 — Spatial Filtering vs. FFT Filtering

A $2048\times2048$ image is filtered using a $201\times201$ non-separable kernel. Estimate the number of operations required for:

1. Direct spatial filtering
2. Frequency-domain filtering using the FFT

### Solution

Let:

$$
M=N=2048
$$

and

$$
m=n=201
$$

### 1. Direct spatial filtering

The approximate number of operations is:

$$
MNmn
$$

Therefore:

$$
\begin{aligned}
MNmn
&=2048^2\times201^2\\
&\approx1.695\times10^{11}\ \text{operations}
\end{aligned}
$$

### 2. Frequency-domain filtering using the FFT

The approximate number of operations is:

$$
2MN\log_2(MN)
$$

Since:

$$
\log_2(2048^2)=22
$$

we obtain:

$$
\begin{aligned}
2MN\log_2(MN)
&=2(2048^2)\log_2(2048^2)\\
&=2(2048^2)(22)\\
&\approx1.84\times10^8\ \text{operations}
\end{aligned}
$$

### Speed-up

$$
\text{Speed-up}
=\frac{1.695\times10^{11}}{1.84\times10^8}
\approx918
$$

Therefore, frequency-domain filtering is approximately **918 times faster** for this example.

---

## Question 3 — Minimum Zero Padding for DFT Convolution

Two two-dimensional discrete signals have sizes:

$$
128\times128
$$

and

$$
64\times64
$$

What is the minimum zero-padding size required to avoid wraparound error when convolving them using the DFT?

### Solution

For an $M\times N$ signal convolved with an $m\times n$ signal, the minimum padded size is:

$$
P=M+m-1
$$

$$
Q=N+n-1
$$

Substituting the given dimensions:

$$
P=128+64-1=191
$$

$$
Q=128+64-1=191
$$

Therefore, both signals must be zero-padded to at least:

$$
\boxed{191\times191}
$$

This prevents circular-convolution wraparound from corrupting the desired linear-convolution result.

---

## Question 4 — Butterworth Lowpass Filter

Design a Butterworth lowpass filter with:

- Order: $n=2$
- Cutoff frequency: $D_0=50$
- Original image size: $256\times256$

Compute the filter value at:

$$
(u,v)=(60,60)
$$

### Solution

### 1. Padded image and filter size

For frequency-domain filtering, the $256\times256$ image is padded to:

$$
2M\times2N=512\times512
$$

The frequency-domain filter must be defined on the same grid. Therefore, the Butterworth filter has size:

$$
\boxed{512\times512}
$$

The center of the padded frequency grid is:

$$
\left(\frac{M}{2},\frac{N}{2}\right)=(256,256)
$$

where $M=N=512$ for the padded array.

### 2. Butterworth lowpass-filter equation

The Butterworth lowpass filter is:

$$
H(u,v)=\frac{1}{1+\left(\frac{D(u,v)}{D_0}\right)^{2n}}
$$

where the distance from the center of the frequency rectangle is:

$$
D(u,v)=\sqrt{\left(u-\frac{M}{2}\right)^2+
                 \left(v-\frac{N}{2}\right)^2}
$$

### 3. Distance from the center

At $(u,v)=(60,60)$:

$$
\begin{aligned}
D(60,60)
&=\sqrt{(60-256)^2+(60-256)^2}\\
&=\sqrt{(-196)^2+(-196)^2}\\
&\approx277.19
\end{aligned}
$$

### 4. Filter value

Using $D_0=50$ and $n=2$:

$$
\begin{aligned}
H(60,60)
&=\frac{1}{1+\left(\frac{277.19}{50}\right)^{2(2)}}\\
&=\frac{1}{1+\left(\frac{277.19}{50}\right)^4}\\
&\approx\frac{1}{1+944.50}\\
&\approx0.0011
\end{aligned}
$$

Therefore:

$$
\boxed{H(60,60)\approx0.0011}
$$

The value is close to zero because $(60,60)$ is far from the centered low-frequency region compared with the cutoff distance $D_0=50$.
