# Worksheet IP.3 — Spatial Filtering Solutions

## Question 1 — Convolution and Correlation with a Symmetric Kernel

Given the kernel and image:

$$
w=
\begin{bmatrix}
1 & 2 & 1\\
2 & 4 & 2\\
1 & 2 & 1
\end{bmatrix},
\qquad
f=
\begin{bmatrix}
0 & 0 & 0 & 0 & 0\\
0 & 0 & 1 & 0 & 0\\
0 & 0 & 1 & 0 & 0\\
0 & 0 & 1 & 0 & 0\\
0 & 0 & 0 & 0 & 0
\end{bmatrix}
$$

1. Compute the convolution $w \star f$ using the minimum zero padding needed.
2. Compute the correlation $w \mathbin{\text{☆}} f$ using the minimum zero padding needed.

### Solution

The kernel is symmetric, so rotating it by $180^\circ$ does not change it. Therefore, convolution and correlation produce the same result:

$$
g=w\star f=w\mathbin{\text{☆}}f=
\begin{bmatrix}
0 & 1 & 2 & 1 & 0\\
0 & 3 & 6 & 3 & 0\\
0 & 4 & 8 & 4 & 0\\
0 & 3 & 6 & 3 & 0\\
0 & 1 & 2 & 1 & 0
\end{bmatrix}
$$

---

## Question 2 — Convolution and Correlation with a Nonsymmetric Kernel

Given the kernel and image:

$$
w=
\begin{bmatrix}
1 & 2 & 1\\
0 & 4 & 1\\
0 & 0 & 2
\end{bmatrix},
\qquad
f=
\begin{bmatrix}
0 & 0 & 0 & 0 & 0\\
0 & 0 & 1 & 0 & 0\\
0 & 0 & 1 & 0 & 0\\
0 & 0 & 1 & 0 & 0\\
0 & 0 & 0 & 0 & 0
\end{bmatrix}
$$

1. Compute the convolution $w\star f$ using the minimum zero padding needed.
2. Compute the correlation $w\mathbin{\text{☆}}f$ using the minimum zero padding needed.

### Solution

#### Part A — Convolution

For convolution, rotate the kernel by $180^\circ$:

$$
w_{\text{flipped}}=
\begin{bmatrix}
2 & 0 & 0\\
1 & 4 & 0\\
1 & 2 & 1
\end{bmatrix}
$$

Therefore:

$$
g_a=w\star f=
\begin{bmatrix}
0 & 1 & 2 & 1 & 0\\
0 & 1 & 6 & 2 & 0\\
0 & 1 & 6 & 4 & 0\\
0 & 0 & 4 & 3 & 0\\
0 & 0 & 0 & 2 & 0
\end{bmatrix}
$$

#### Part B — Correlation

Correlation uses the kernel without flipping it:

$$
g_b=w\mathbin{\text{☆}}f=
\begin{bmatrix}
0 & 2 & 0 & 0 & 0\\
0 & 3 & 4 & 0 & 0\\
0 & 4 & 6 & 1 & 0\\
0 & 2 & 6 & 1 & 0\\
0 & 1 & 2 & 1 & 0
\end{bmatrix}
$$

---

## Question 3 — Separable Kernel

The following kernel is separable. Find $w_1$ and $w_2$ such that the kernel can be written as the outer product of two one-dimensional kernels:

$$
w=
\begin{bmatrix}
1 & 3 & 1\\
2 & 6 & 2
\end{bmatrix}
$$

### Solution

A separable kernel has rank 1 and can be written as the product of a column vector and a row vector.

A practical method is:

1. Choose any nonzero element in the kernel and call it $E$.
2. Let $\mathbf{c}$ be the column containing $E$.
3. Let $\mathbf{r}$ be the row containing $E$.
4. Set

$$
\mathbf{v}=\mathbf{c},
\qquad
\mathbf{w}^T=\frac{\mathbf{r}}{E}
$$

Choose the element at position $(2,1)$:

$$
E=2
$$

The corresponding column and row are:

$$
\mathbf{c}=
\begin{bmatrix}
1\\
2
\end{bmatrix},
\qquad
\mathbf{r}=
\begin{bmatrix}
2 & 6 & 2
\end{bmatrix}
$$

Therefore:

$$
w_1=\mathbf{v}=
\begin{bmatrix}
1\\
2
\end{bmatrix}
$$

and

$$
w_2=\mathbf{w}^T=rac{\mathbf{r}}{E}
=rac{1}{2}
\begin{bmatrix}
2 & 6 & 2
\end{bmatrix}
=
\begin{bmatrix}
1 & 3 & 1
\end{bmatrix}
$$

Verification:

$$
w_1w_2=
\begin{bmatrix}
1\\
2
\end{bmatrix}
\begin{bmatrix}
1 & 3 & 1
\end{bmatrix}
=
\begin{bmatrix}
1 & 3 & 1\\
2 & 6 & 2
\end{bmatrix}
=w
$$

---

## Question 4 — Gaussian Filtering

An image is corrupted by Gaussian noise with standard deviation $\sigma=10$.

1. Show the $3\times3$ Gaussian kernel for applying a Gaussian filter with $\sigma=2.0$.
2. Calculate the new pixel value at position $(2,3)$ for the following image:

$$
f=
\begin{bmatrix}
50 & 100 & 102 & 98\\
60 & 101 & 99 & 103\\
70 & 97 & 100 & 102
\end{bmatrix}
$$

### Solution

#### Part A — Construct the Gaussian Kernel

The two-dimensional Gaussian function is:

$$
G(x,y)=\exp\left(-\frac{x^2+y^2}{2\sigma^2}\right)
$$

For a $3\times3$ kernel, $x,y\in\{-1,0,1\}$. Using $\sigma=2.0$, the unnormalized values are:

$$
\begin{bmatrix}
G(-1,-1) & G(-1,0) & G(-1,1)\\
G(0,-1) & G(0,0) & G(0,1)\\
G(1,-1) & G(1,0) & G(1,1)
\end{bmatrix}
=
\begin{bmatrix}
0.7788 & 0.8825 & 0.7788\\
0.8825 & 1.0000 & 0.8825\\
0.7788 & 0.8825 & 0.7788
\end{bmatrix}
$$

The sum of the unnormalized coefficients is approximately:

$$
\sum G(x,y)=7.6452
$$

Normalize the kernel by dividing every coefficient by this sum:

$$
h=
\begin{bmatrix}
0.1019 & 0.1154 & 0.1019\\
0.1154 & 0.1308 & 0.1154\\
0.1019 & 0.1154 & 0.1019
\end{bmatrix}
$$

#### Part B — Filter the Pixel at Position $(2,3)$

The $3\times3$ neighborhood centered at $(2,3)$ is:

$$
\begin{bmatrix}
100 & 102 & 98\\
101 & 99 & 103\\
97 & 100 & 102
\end{bmatrix}
$$

The filtered value is the element-by-element weighted sum:

$$
\begin{aligned}
g(2,3)=
&100(0.1019)+102(0.1154)+98(0.1019)\\
&+101(0.1154)+99(0.1308)+103(0.1154)\\
&+97(0.1019)+100(0.1154)+102(0.1019)
\end{aligned}
$$

$$
g(2,3)\approx100.26
$$

For an integer-valued image, this can be rounded to approximately:

$$
\boxed{g(2,3)\approx100}
$$

---

## Question 5 — Speed-Up from a Separable Box Kernel

An image of size $512\times512$ is filtered using a separable $5\times5$ box kernel. Determine the speed-up obtained by using separability.

### Solution

A direct two-dimensional convolution requires:

$$
A=512\times512\times5\times5=6{,}553{,}600
$$

operations.

Using two one-dimensional kernels requires:

$$
B=512\times512\times(5+5)=2{,}621{,}440
$$

operations.

Therefore:

$$
\text{Speed-up}=\frac{A}{B}
=\frac{6{,}553{,}600}{2{,}621{,}440}
=2.5
$$

$$
\boxed{\text{Speed-up}=2.5\times}
$$

---

## Question 6 — Median Filtering

Apply a $3\times3$ median filter to the following $4\times4$ image corrupted by salt-and-pepper noise with probability $p=0.1$. Calculate the new pixel value at position $(2,2)$.

$$
f=
\begin{bmatrix}
50 & 60 & 50 & 0\\
80 & 200 & 50 & 0\\
50 & 50 & 50 & 50\\
200 & 200 & 200 & 200
\end{bmatrix}
$$

### Solution

The $3\times3$ neighborhood centered at position $(2,2)$ is:

$$
\begin{bmatrix}
50 & 60 & 50\\
80 & 200 & 50\\
50 & 50 & 50
\end{bmatrix}
$$

Sort the nine values:

$$
[50,50,50,50,50,50,60,80,200]
$$

The median is the fifth value:

$$
\boxed{50}
$$

Therefore, the new pixel value at position $(2,2)$ is 50.

---

## Question 7 — High-Boost Filtering

Apply high-boost filtering with $k=1.5$ to an image of size $128\times128$. Use a Gaussian lowpass filter with $\sigma=1.0$. Calculate the new pixel value at position $(i,j)$ for the neighborhood:

$$
\begin{bmatrix}
50 & 60 & 70\\
80 & 90 & 100\\
110 & 120 & 130
\end{bmatrix}
$$

### Solution

#### Step 1 — Blur the Image

For $\sigma=1.0$, the normalized Gaussian kernel is:

$$
h=\frac{1}{4.8976}
\begin{bmatrix}
0.3679 & 0.6065 & 0.3679\\
0.6065 & 1.0000 & 0.6065\\
0.3679 & 0.6065 & 0.3679
\end{bmatrix}
$$

$$
h=
\begin{bmatrix}
0.0751 & 0.1238 & 0.0751\\
0.1238 & 0.2042 & 0.1238\\
0.0751 & 0.1238 & 0.0751
\end{bmatrix}
$$

The blurred value is:

$$
\begin{aligned}
\bar{f}(i,j)=
&0.0751(50)+0.1238(60)+0.0751(70)\\
&+0.1238(80)+0.2042(90)+0.1238(100)\\
&+0.0751(110)+0.1238(120)+0.0751(130)
\end{aligned}
$$

$$
\bar{f}(i,j)=89.982
$$

#### Step 2 — Calculate the High-Frequency Mask

The center pixel is $f(i,j)=90$.

$$
g_{\text{mask}}(i,j)=f(i,j)-\bar{f}(i,j)
$$

$$
g_{\text{mask}}(i,j)=90-89.982=0.018
$$

#### Step 3 — Apply High-Boost Filtering

$$
g(i,j)=f(i,j)+k\,g_{\text{mask}}(i,j)
$$

$$
g(i,j)=90+1.5(0.018)=90.027
$$

After rounding:

$$
\boxed{g(i,j)\approx90}
$$

The value changes very little because the neighborhood is approximately a smooth intensity ramp and contains no strong edge or fine detail.

---

## Key Formulas

### Correlation

$$
(w\mathbin{\text{☆}}f)(x,y)=
\sum_s\sum_t w(s,t)f(x+s,y+t)
$$

### Convolution

$$
(w\star f)(x,y)=
\sum_s\sum_t w(s,t)f(x-s,y-t)
$$

### Gaussian Function

$$
G(x,y)=\exp\left(-\frac{x^2+y^2}{2\sigma^2}\right)
$$

### Separable-Filter Speed-Up

For an $M\times N$ image and an $m\times n$ kernel:

$$
\text{Direct operations}=MNmn
$$

$$
\text{Separable operations}=MN(m+n)
$$

### High-Boost Filtering

$$
g_{\text{mask}}=f-\bar{f}
$$

$$
g=f+k\,g_{\text{mask}}
$$
