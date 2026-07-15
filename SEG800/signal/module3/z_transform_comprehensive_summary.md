# SEG800 Digital Signal and Image Processing  
## Comprehensive Summary: The z-Transform

**Source:** Seneca College, SEG800, *The z-Transform* deck  
**Coverage:** Direct z-transform, region of convergence, properties, transform pairs, rational transforms, poles and zeros, inverse z-transform, and LTI-system analysis in the z-domain.

---

## 1. Why the z-Transform Matters

The z-transform is the discrete-time counterpart of the Laplace transform used for continuous-time signals.

It is especially useful because it:

1. Converts convolution in the time domain into multiplication in the z-domain.
2. Represents discrete-time LTI systems through their poles, zeros, and region of convergence.
3. Makes it easier to analyze causality, stability, transient behavior, and steady-state behavior.
4. Converts constant-coefficient difference equations into algebraic equations.

For an LTI system,

$$
y[n] = x[n] * h[n]
$$

becomes

$$
Y(z)=X(z)H(z)
$$

where $H(z)$ is the system function.

---

# Part I - The Direct z-Transform

## 2. Definition of the z-Transform

For a discrete-time signal $x[n]$, the bilateral z-transform is

$$
X(z)=\sum_{n=-\infty}^{\infty}x[n]z^{-n}
$$

Notation:

$$
X(z)=\mathcal{Z}\{x[n]\}
$$

or

$$
x[n]\;\xleftrightarrow{\mathcal Z}\;X(z)
$$

The complex variable $z$ may be written as

$$
z=re^{j\omega}
$$

so each point in the z-plane has:

- a magnitude $r=|z|$
- an angle $\omega=\arg(z)$

---

## 3. Region of Convergence

The **region of convergence**, or **ROC**, is the set of values of $z$ for which

$$
\sum_{n=-\infty}^{\infty}x[n]z^{-n}
$$

converges to a finite value.

The algebraic expression $X(z)$ alone is not always enough to identify $x[n]$. The ROC is part of the transform specification.

### Fundamental ROC rules

- The ROC cannot contain a pole.
- For rational transforms, the ROC is usually a ring or annulus centered at the origin.
- A right-sided infinite-duration signal normally has an ROC outside its outermost pole.
- A left-sided infinite-duration signal normally has an ROC inside its innermost pole.
- A two-sided infinite-duration signal normally has an annular ROC between poles.
- The same rational expression can describe different time-domain signals when paired with different ROCs.

---

## 4. ROC and Signal Support

### 4.1 Infinite-duration causal or right-sided signal

For a causal sequence such as

$$
x[n]=a^n u[n]
$$

the transform is

$$
X(z)=\sum_{n=0}^{\infty}a^n z^{-n}
    =\frac{1}{1-az^{-1}}
    =\frac{z}{z-a}
$$

with

$$
\boxed{|z|>|a|}
$$

The pole is at $z=a$, and the ROC is the exterior of the circle passing through the pole.

---

### 4.2 Infinite-duration anticausal or left-sided signal

For

$$
x[n]=-a^n u[-n-1]
$$

the algebraic transform is also

$$
X(z)=\frac{1}{1-az^{-1}}
$$

but the ROC is

$$
\boxed{|z|<|a|}
$$

The different ROC causes the inverse transform to be left-sided instead of right-sided.

---

### 4.3 Infinite-duration two-sided signal

A two-sided signal contains both right-sided and left-sided components.

For example,

$$
x[n]=\alpha^n u[n]+b^n u[-n-1]
$$

the right-sided component requires

$$
|z|>|\alpha|
$$

while the left-sided component requires

$$
|z|<|b|
$$

Therefore, a valid common ROC exists only when

$$
|\alpha|<|b|
$$

and the ROC is

$$
\boxed{|\alpha|<|z|<|b|}
$$

If the two component ROCs do not overlap, the bilateral z-transform does not exist.

---

### 4.4 Finite-duration signals

Typical ROC patterns are:

| Signal type | Typical ROC |
|---|---|
| Finite-duration causal | Entire z-plane except possibly $z=0$ |
| Finite-duration anticausal | Entire z-plane except possibly $z=\infty$ |
| Finite-duration two-sided | Entire z-plane except possibly $z=0$ and $z=\infty$ |
| Infinite-duration causal | Exterior of a circle |
| Infinite-duration anticausal | Interior of a circle |
| Infinite-duration two-sided | Annulus between two circles |

A special finite-duration signal such as $\delta[n]$ has transform $1$, with all $z$ in its ROC.

---

# Part II - Properties of the z-Transform

Assume

$$
x[n]\xleftrightarrow{\mathcal Z}X(z),
\qquad
\text{ROC}: r_2<|z|<r_1
$$

and similarly for $x_1[n]$ and $x_2[n]$.

---

## 5. Linearity

If

$$
x_1[n]\xleftrightarrow{\mathcal Z}X_1(z)
$$

and

$$
x_2[n]\xleftrightarrow{\mathcal Z}X_2(z),
$$

then

$$
a_1x_1[n]+a_2x_2[n]
\xleftrightarrow{\mathcal Z}
a_1X_1(z)+a_2X_2(z)
$$

The ROC contains at least the intersection of the individual ROCs, although pole-zero cancellation may make it larger.

---

## 6. Time Shifting

$$
x[n-k]\xleftrightarrow{\mathcal Z}z^{-k}X(z)
$$

Interpretation:

- A delay by $k>0$ samples multiplies the transform by $z^{-k}$.
- An advance by $k$ samples multiplies it by a positive power of $z$.

The ROC is generally unchanged except for possible changes at $z=0$ or $z=\infty$.

---

## 7. Exponential Scaling

$$
a^n x[n]\xleftrightarrow{\mathcal Z}X(a^{-1}z)
$$

If the original ROC is

$$
r_2<|z|<r_1,
$$

the new ROC is

$$
|a|r_2<|z|<|a|r_1
$$

Multiplying by $a^n$ radially scales the pole and zero locations.

---

## 8. Time Reversal

$$
x[-n]\xleftrightarrow{\mathcal Z}X(z^{-1})
$$

The ROC is inverted:

$$
\frac{1}{r_1}<|z|<\frac{1}{r_2}
$$

A right-sided sequence becomes left-sided, and vice versa.

---

## 9. Conjugation, Real Part, and Imaginary Part

### Conjugation

$$
x^*[n]\xleftrightarrow{\mathcal Z}X^*(z^*)
$$

### Real part

$$
\operatorname{Re}\{x[n]\}
\xleftrightarrow{\mathcal Z}
\frac{1}{2}\left[X(z)+X^*(z^*)\right]
$$

### Imaginary part

$$
\operatorname{Im}\{x[n]\}
\xleftrightarrow{\mathcal Z}
\frac{1}{2j}\left[X(z)-X^*(z^*)\right]
$$

---

## 10. Differentiation in the z-Domain

$$
n\,x[n]\xleftrightarrow{\mathcal Z}
-z\frac{dX(z)}{dz}
$$

This property is useful for finding transforms of sequences that include a factor of $n$, $n^2$, and similar polynomial terms.

For example, differentiating the transform of $a^n u[n]$ leads to the transform of $na^n u[n]$.

---

## 11. Convolution

$$
x_1[n]*x_2[n]
\xleftrightarrow{\mathcal Z}
X_1(z)X_2(z)
$$

This is one of the most important z-transform properties.

The ROC contains at least the intersection of the two original ROCs, subject to possible pole-zero cancellations.

---

## 12. Correlation

For the convention shown in the deck,

$$
r_{x_1x_2}[\ell]
=
x_1[\ell]*x_2[-\ell]
$$

and

$$
R_{x_1x_2}(z)=X_1(z)X_2(z^{-1})
$$

The ROC includes at least the overlap between the ROC of $X_1(z)$ and the ROC of $X_2(z^{-1})$.

---

## 13. Initial-Value Theorem

For a causal signal,

$$
\boxed{x[0]=\lim_{z\to\infty}X(z)}
$$

This works because all delayed terms vanish as $z\to\infty$.

---

## 14. Multiplication in Time

Multiplication in the time domain becomes a contour-convolution operation in the z-domain:

$$
x_1[n]x_2[n]
\xleftrightarrow{\mathcal Z}
\frac{1}{2\pi j}
\oint_C
X_1(v)X_2\left(\frac{z}{v}\right)v^{-1}\,dv
$$

---

## 15. Parseval's Relation

A z-domain form of Parseval's relation is

$$
\sum_{n=-\infty}^{\infty}x_1[n]x_2^*[n]
=
\frac{1}{2\pi j}
\oint_C
X_1(v)X_2^*\left(\frac{1}{v^*}\right)v^{-1}\,dv
$$

It relates an inner product in the time domain to a contour integral in the z-domain.

---

# Part III - Common z-Transform Pairs

## 16. Basic Transform Pairs

| Signal $x[n]$ | Transform $X(z)$ | ROC |
|---|---|---|
| $\delta[n]$ | $1$ | All $z$ |
| $u[n]$ | $\dfrac{1}{1-z^{-1}}$ | $|z|>1$ |
| $a^n u[n]$ | $\dfrac{1}{1-az^{-1}}$ | $|z|>|a|$ |
| $na^n u[n]$ | $\dfrac{az^{-1}}{(1-az^{-1})^2}$ | $|z|>|a|$ |
| $-a^n u[-n-1]$ | $\dfrac{1}{1-az^{-1}}$ | $|z|<|a|$ |
| $-na^n u[-n-1]$ | $\dfrac{az^{-1}}{(1-az^{-1})^2}$ | $|z|<|a|$ |

The causal and anticausal exponentials have the same algebraic transform but different ROCs.

---

## 17. Sinusoidal Transform Pairs

### Causal cosine

$$
(\cos\omega_0n)u[n]
\xleftrightarrow{\mathcal Z}
\frac{1-z^{-1}\cos\omega_0}
{1-2z^{-1}\cos\omega_0+z^{-2}}
$$

with

$$
|z|>1
$$

### Causal sine

$$
(\sin\omega_0n)u[n]
\xleftrightarrow{\mathcal Z}
\frac{z^{-1}\sin\omega_0}
{1-2z^{-1}\cos\omega_0+z^{-2}}
$$

with

$$
|z|>1
$$

---

## 18. Exponentially Weighted Sinusoids

### Damped cosine

$$
(a^n\cos\omega_0n)u[n]
\xleftrightarrow{\mathcal Z}
\frac{1-az^{-1}\cos\omega_0}
{1-2az^{-1}\cos\omega_0+a^2z^{-2}}
$$

with

$$
|z|>|a|
$$

### Damped sine

$$
(a^n\sin\omega_0n)u[n]
\xleftrightarrow{\mathcal Z}
\frac{az^{-1}\sin\omega_0}
{1-2az^{-1}\cos\omega_0+a^2z^{-2}}
$$

with

$$
|z|>|a|
$$

The denominator contains a complex-conjugate pole pair at

$$
z=ae^{\pm j\omega_0}
$$

---

# Part IV - Convolution and LTI-System Output

## 19. z-Domain Workflow for an LTI System

To find the output of an LTI system:

1. Find the system function:

   $$
   H(z)=\mathcal Z\{h[n]\}
   $$

2. Transform the input:

   $$
   X(z)=\mathcal Z\{x[n]\}
   $$

3. Multiply:

   $$
   Y(z)=H(z)X(z)
   $$

4. Find the inverse transform:

   $$
   y[n]=\mathcal Z^{-1}\{Y(z)\}
   $$

The system transform $H(z)$ normally needs to be derived only once. It can then be used with different inputs.

---

# Part V - Rational z-Transforms, Poles, and Zeros

## 20. Rational z-Transform Form

An important family of transforms is

$$
X(z)=\frac{B(z)}{A(z)}
=
\frac{b_0+b_1z^{-1}+\cdots+b_Mz^{-M}}
{a_0+a_1z^{-1}+\cdots+a_Nz^{-N}}
$$

It can also be written in factored form as

$$
X(z)
=
Gz^{N-M}
\frac{\displaystyle\prod_{k=1}^{M}(z-z_k)}
{\displaystyle\prod_{k=1}^{N}(z-p_k)}
$$

where:

- $z_k$ are zeros
- $p_k$ are poles
- $G$ is a gain constant

---

## 21. Poles and Zeros

### Zeros

A zero is a value of $z$ for which

$$
X(z)=0
$$

Zeros are roots of the numerator polynomial.

### Poles

A pole is a value of $z$ for which

$$
|X(z)|\to\infty
$$

Poles are roots of the denominator polynomial.

### Pole-zero plot notation

- A zero is normally plotted as an open circle: $o$
- A pole is normally plotted as a cross: $x$

### Important ROC rule

$$
\boxed{\text{The ROC never contains a pole}}
$$

---

## 22. Pole and Zero Counting

For

$$
X(z)
=
Gz^{N-M}
\frac{\prod_{k=1}^{M}(z-z_k)}
{\prod_{k=1}^{N}(z-p_k)},
$$

a rational transform has:

- $M$ finite zeros from the numerator
- $N$ finite poles from the denominator
- $N-M$ zeros at $z=0$ when $N>M$
- $M-N$ poles at $z=0$ when $M>N$
- possible poles or zeros at infinity

---

## 23. Example: Causal Exponential

For

$$
x[n]=a^n u[n],
$$

$$
X(z)=\frac{1}{1-az^{-1}}=\frac{z}{z-a}
$$

Therefore:

- zero at $z=0$
- pole at $z=a$
- ROC:

$$
|z|>|a|
$$

---

## 24. Example: Finite-Duration Exponential

Let

$$
x[n]
=
\begin{cases}
a^n, & 0\le n\le M-1\\
0, & \text{otherwise}
\end{cases}
$$

Then

$$
X(z)=\sum_{n=0}^{M-1}(az^{-1})^n
$$

Using the finite geometric-series formula,

$$
X(z)=\frac{1-(az^{-1})^M}{1-az^{-1}}
$$

or

$$
X(z)=\frac{z^M-a^M}{z^{M-1}(z-a)}
$$

The equation

$$
z^M=a^M
$$

has roots

$$
z_k=ae^{j2\pi k/M},
\qquad
k=0,1,\ldots,M-1
$$

The root at $z=a$ cancels the factor $z-a$, leaving:

- $M-1$ nontrivial zeros uniformly spaced on the circle $|z|=a$
- $M-1$ poles at the origin due to the delays in the finite sequence

---

## 25. Example: Complex-Conjugate Poles

Suppose the poles are

$$
p_1=re^{j\omega_0},
\qquad
p_2=re^{-j\omega_0}
$$

and the zeros are

$$
z_1=0,
\qquad
z_2=r\cos\omega_0
$$

Then

$$
X(z)
=
G\frac{z(z-r\cos\omega_0)}
{(z-re^{j\omega_0})(z-re^{-j\omega_0})}
$$

or

$$
X(z)
=
G\frac{1-rz^{-1}\cos\omega_0}
{1-2rz^{-1}\cos\omega_0+r^2z^{-2}}
$$

For the causal ROC $|z|>r$,

$$
x[n]=G(r^n\cos\omega_0n)u[n]
$$

The magnitude surface $|X(z)|$:

- becomes very large near poles
- becomes zero at zeros
- changes continuously elsewhere in the ROC

---

# Part VI - Pole Location and Time-Domain Behavior

## 26. Single Real Pole

For

$$
x[n]=a^n u[n],
$$

the pole is at $z=a$.

### Positive pole

- $0<a<1$: positive, exponentially decaying sequence
- $a=1$: constant sequence
- $a>1$: positive, exponentially growing sequence

### Negative pole

- $-1<a<0$: alternating-sign sequence with decaying magnitude
- $a=-1$: alternating sequence with constant magnitude
- $a<-1$: alternating-sign sequence with growing magnitude

Therefore:

- pole magnitude controls decay or growth
- pole sign controls whether the sequence alternates

---

## 27. Repeated Real Poles

A pole of multiplicity $m$ produces terms containing a polynomial factor approximately proportional to

$$
n^{m-1}p^n
$$

For a double pole,

$$
x[n]\propto np^n u[n]
$$

Consequences:

- $|p|<1$: the exponential eventually dominates and the signal decays
- $|p|=1$: the polynomial factor causes growth
- $|p|>1$: the signal grows rapidly
- $p<0$: the sequence also alternates in sign

A repeated pole on the unit circle is not bounded, even though a simple pole on the unit circle can produce a bounded sustained signal.

---

## 28. Complex-Conjugate Poles

A real-valued signal with complex poles must normally contain conjugate pairs:

$$
p_{1,2}=re^{\pm j\omega_0}
$$

These poles create oscillatory time-domain behavior.

- $r<1$: decaying oscillation
- $r=1$: sustained oscillation for simple poles
- $r>1$: growing oscillation
- $\omega_0$: oscillation frequency
- $r$: exponential envelope and rate of decay or growth

For repeated complex-conjugate poles, an additional polynomial factor appears. A double pair on the unit circle creates a linearly growing oscillation.

---

## 29. Role of Zeros

Poles strongly determine the natural modes, decay, growth, and oscillation of a signal or system.

Zeros also affect the response by changing:

- amplitude
- phase
- cancellation of particular modes or frequency components

The deck specifically notes that zero locations can affect the phase of sinusoidal signals.

---

# Part VII - Rational System Functions of LTI Systems

## 30. Difference Equation to System Function

Consider the constant-coefficient difference equation

$$
y[n]
=
-\sum_{k=1}^{N}a_k y[n-k]
+
\sum_{k=0}^{M}b_k x[n-k]
$$

For a relaxed system, meaning zero initial conditions, take the z-transform:

$$
Y(z)
=
-\sum_{k=1}^{N}a_kY(z)z^{-k}
+
\sum_{k=0}^{M}b_kX(z)z^{-k}
$$

Collecting the $Y(z)$ terms gives

$$
Y(z)
\left(
1+\sum_{k=1}^{N}a_kz^{-k}
\right)
=
X(z)
\left(
\sum_{k=0}^{M}b_kz^{-k}
\right)
$$

Therefore,

$$
\boxed{
H(z)=\frac{Y(z)}{X(z)}
=
\frac{\displaystyle\sum_{k=0}^{M}b_kz^{-k}}
{\displaystyle 1+\sum_{k=1}^{N}a_kz^{-k}}
}
$$

A constant-coefficient difference equation therefore produces a rational system function.

---

## 31. Types of Rational LTI Systems

### All-zero system

- Only nontrivial zeros
- Only trivial poles, normally at the origin
- Finite-duration impulse response
- Called an **FIR** or **moving-average** system

### All-pole system

- Only nontrivial poles
- Only trivial zeros
- Infinite-duration impulse response
- Called an **IIR** system

### Pole-zero system

- Contains nontrivial poles and zeros
- Generally has an infinite-duration impulse response
- Also an **IIR** system

---

# Part VIII - The Inverse z-Transform

## 32. Three Main Inverse Methods

The deck presents three approaches:

1. Direct contour integration
2. Power-series expansion
3. Partial-fraction expansion

The best method depends on the form of $X(z)$ and the requested result.

---

## 33. Contour-Integration Formula

The formal inverse z-transform is

$$
\boxed{
x[n]
=
\frac{1}{2\pi j}
\oint_C X(z)z^{n-1}\,dz
}
$$

The closed contour $C$ must lie inside the ROC and encircle the origin.

This method is mathematically general but is often less convenient for routine calculations than power-series or partial-fraction methods.

---

## 34. Power-Series Expansion

Write $X(z)$ as

$$
X(z)=\sum_{n=-\infty}^{\infty}c_nz^{-n}
$$

Then

$$
\boxed{x[n]=c_n}
$$

The ROC determines which series expansion is valid.

### Exterior ROC

When the ROC is outside a circle, expand in powers of $z^{-1}$. This normally produces a causal or right-sided sequence.

### Interior ROC

When the ROC is inside a circle, expand in positive powers of $z$. This normally produces an anticausal or left-sided sequence.

### Best use cases

Power-series expansion is useful when:

- the signal has short duration
- only the first few samples are required
- polynomial division is straightforward
- a recurrence can generate the coefficients

---

## 35. Linearity of the Inverse Transform

If

$$
X(z)=\alpha_1X_1(z)+\alpha_2X_2(z)+\cdots+\alpha_KX_K(z)
$$

and

$$
X_k(z)\xleftrightarrow{\mathcal Z}x_k[n],
$$

then

$$
x[n]
=
\alpha_1x_1[n]
+\alpha_2x_2[n]
+\cdots
+\alpha_Kx_K[n]
$$

This is the basis for using transform tables and partial-fraction decomposition.

---

## 36. Basic Partial-Fraction Pair

For a pole $p_k$,

$$
\mathcal Z^{-1}
\left\{
\frac{1}{1-p_kz^{-1}}
\right\}
=
\begin{cases}
 p_k^n u[n], & |z|>|p_k|\\[4pt]
-p_k^n u[-n-1], & |z|<|p_k|
\end{cases}
$$

Once again, the ROC decides whether the inverse is causal or anticausal.

---

## 37. Distinct-Pole Partial Fractions

Suppose

$$
X(z)
=
\frac{A_1}{1-p_1z^{-1}}
+
\frac{A_2}{1-p_2z^{-1}}
+\cdots+
\frac{A_N}{1-p_Nz^{-1}}
$$

If the ROC is outside every pole,

$$
|z|>p_{\max},
$$

then

$$
x[n]
=
\left(
A_1p_1^n+A_2p_2^n+\cdots+A_Np_N^n
\right)u[n]
$$

For an interior or annular ROC, each term must be interpreted as right-sided or left-sided according to the specified ROC.

---

## 38. Procedure for Partial-Fraction Expansion

### Step 1: Make the rational function proper

Write

$$
X(z)
=
\frac{b_0+b_1z^{-1}+\cdots+b_Mz^{-M}}
{1+a_1z^{-1}+\cdots+a_Nz^{-N}}
$$

A proper rational function has

$$
M<N
$$

If the function is improper, first use polynomial division.

---

### Step 2: Eliminate negative powers

Multiply numerator and denominator by $z^N$:

$$
X(z)
=
\frac{
b_0z^N+b_1z^{N-1}+\cdots+b_Mz^{N-M}
}{
z^N+a_1z^{N-1}+\cdots+a_N
}
$$

---

### Step 3: Find the poles

Factor the denominator or find its roots:

$$
p_1,p_2,\ldots,p_N
$$

For distinct poles, write

$$
\frac{X(z)}{z}
=
\frac{A_1}{z-p_1}
+
\frac{A_2}{z-p_2}
+\cdots+
\frac{A_N}{z-p_N}
$$

---

### Step 4: Find the coefficients

For distinct poles,

$$
\boxed{
A_k
=
\left.
\frac{(z-p_k)X(z)}{z}
\right|_{z=p_k}
}
$$

Then rewrite the result in standard transform-pair form and use the ROC to select the correct sidedness.

---

## 39. Proper and Improper Rational Functions

For

$$
X(z)=\frac{B(z)}{A(z)},
$$

the transform is proper when the numerator degree is less than the denominator degree.

An improper function can always be written as

$$
X(z)=\text{polynomial}+\text{proper rational function}
$$

The polynomial terms correspond to shifted impulses in the time domain.

---

## 40. Useful Repeated and Complex-Pole Inverses

### Repeated pole

$$
\mathcal Z^{-1}
\left\{
\frac{pz^{-1}}{(1-pz^{-1})^2}
\right\}
=
np^n u[n],
\qquad |z|>|p|
$$

### Complex-conjugate pair

Let

$$
A_k=|A_k|e^{j\alpha_k},
\qquad
p_k=r_ke^{j\beta_k}
$$

Then

$$
\mathcal Z^{-1}
\left\{
\frac{A_k}{1-p_kz^{-1}}
+
\frac{A_k^*}{1-p_k^*z^{-1}}
\right\}
$$

is

$$
2|A_k|r_k^n
\cos(\beta_kn+\alpha_k)u[n]
$$

for the causal ROC

$$
|z|>|p_k|=r_k
$$

Complex conjugate terms combine into a real sinusoid.

---

# Part IX - LTI-System Analysis in the z-Domain

## 41. Natural and Forced Responses

For a relaxed system,

$$
H(z)=\frac{B(z)}{A(z)}
$$

and an input

$$
X(z)=\frac{N(z)}{Q(z)},
$$

the output is

$$
Y(z)=H(z)X(z)
=
\frac{B(z)N(z)}{A(z)Q(z)}
$$

Assume the system poles $p_k$ and input poles $q_k$ are distinct. A partial-fraction form is

$$
Y(z)
=
\sum_{k=1}^{N}
\frac{A_k}{1-p_kz^{-1}}
+
\sum_{k=1}^{L}
\frac{Q_k}{1-q_kz^{-1}}
$$

For a causal output,

$$
y[n]
=
\sum_{k=1}^{N}A_kp_k^n u[n]
+
\sum_{k=1}^{L}Q_kq_k^n u[n]
$$

The two parts are:

$$
\boxed{
y[n]
=
\text{natural response}
+
\text{forced response}
}
$$

### Natural response

- determined by the poles of $H(z)$
- represents the system's own modes
- depends on system dynamics

### Forced response

- determined by the poles of the input $X(z)$
- represents the behavior imposed by the input

---

## 42. Transient and Steady-State Responses

If every system pole satisfies

$$
|p_k|<1,
$$

the natural response decays to zero as $n\to\infty$. It is then called the **transient response**.

If a causal input is sinusoidal and the stable system is driven continuously, the forced response remains sinusoidal. This persistent part is called the **steady-state response**.

Thus, in a stable system:

- natural response $\rightarrow$ transient
- persistent forced response $\rightarrow$ steady state

---

# Part X - Causality and Stability

## 43. Causality Condition

An LTI system is causal if and only if its impulse response is right-sided.

In terms of the system function:

$$
\boxed{
\text{Causal}
\iff
\text{ROC of }H(z)\text{ is outside a circle and includes }z=\infty
}
$$

For a causal rational system, the ROC lies outside the outermost pole.

---

## 44. BIBO Stability Condition

An LTI system is BIBO stable if and only if its impulse response is absolutely summable.

In the z-domain:

$$
\boxed{
\text{BIBO stable}
\iff
\text{ROC of }H(z)\text{ includes the unit circle }|z|=1
}
$$

---

## 45. Causal and Stable Rational Systems

A causal rational system has an ROC outside its outermost pole.

For that ROC to include the unit circle, every uncancelled pole must satisfy

$$
\boxed{|p_k|<1}
$$

Therefore,

$$
\boxed{
\text{Causal rational system is stable}
\iff
\text{all poles are inside the unit circle}
}
$$

A causal system with a pole on or outside the unit circle is not BIBO stable.

---

# Part XI - Stability of a Second-Order System

## 46. Second-Order Difference Equation

Consider

$$
y[n]
=
-a_1y[n-1]
-a_2y[n-2]
+b_0x[n]
$$

The system function is

$$
H(z)
=
\frac{b_0}
{1+a_1z^{-1}+a_2z^{-2}}
$$

or

$$
H(z)
=
\frac{b_0z^2}
{z^2+a_1z+a_2}
$$

The poles are

$$
p_{1,2}
=
-\frac{a_1}{2}
\pm
\sqrt{\frac{a_1^2-4a_2}{4}}
$$

---

## 47. Stability Triangle

For a causal second-order system to be BIBO stable, both poles must be inside the unit circle.

The coefficient conditions shown in the deck are

$$
|a_2|<1
$$

and

$$
|a_1|<1+a_2
$$

Equivalently,

$$
-1<a_2<1
$$

and

$$
-(1+a_2)<a_1<1+a_2
$$

These inequalities define the **stability triangle** in the $(a_1,a_2)$ coefficient plane.

Important boundaries include:

- $a_2=1$
- $a_2=a_1-1$
- $a_2=-a_1-1$

The curve

$$
a_2=\frac{a_1^2}{4}
$$

separates real poles from complex-conjugate poles.

---

## 48. Real and Distinct Poles

When

$$
a_1^2>4a_2,
$$

the poles $p_1$ and $p_2$ are real and distinct.

The system function can be written as

$$
H(z)
=
\frac{A_1}{1-p_1z^{-1}}
+
\frac{A_2}{1-p_2z^{-1}}
$$

where

$$
A_1=\frac{b_0p_1}{p_1-p_2}
$$

and

$$
A_2=-\frac{b_0p_2}{p_1-p_2}
$$

The causal impulse response is

$$
\boxed{
h[n]
=
\frac{b_0}{p_1-p_2}
\left(
p_1^{n+1}-p_2^{n+1}
\right)u[n]
}
$$

If both poles are inside the unit circle, this is the difference of two decaying exponential sequences.

The deck illustrates this with

$$
p_1=0.5,
\qquad
p_2=0.75
$$

which produces a response that decays toward zero.

---

## 49. Real and Equal Poles

When

$$
a_1^2=4a_2,
$$

the two poles are equal:

$$
p_1=p_2=p
$$

The system function is

$$
H(z)=\frac{b_0}{(1-pz^{-1})^2}
$$

and the causal impulse response is

$$
\boxed{
h[n]=b_0(n+1)p^n u[n]
}
$$

The repeated pole introduces the ramp factor $n+1$.

The deck illustrates this with

$$
p=\frac{3}{4}
$$

The response initially rises because of the $n+1$ factor, but eventually decays because $|p|<1$.

---

## 50. Complex-Conjugate Poles

When

$$
a_1^2<4a_2,
$$

the poles form a complex-conjugate pair:

$$
p_{1,2}=re^{\pm j\omega_0}
$$

The impulse response is oscillatory.

For the second-order all-pole example in the deck,

$$
\boxed{
h[n]
=
\frac{b_0r^n}{\sin\omega_0}
\sin\left((n+1)\omega_0\right)u[n]
}
$$

Interpretation:

- $\omega_0$ determines the oscillation frequency.
- $r$ determines the exponential envelope.
- $r<1$ produces a decaying oscillation.
- $r=1$ produces a sustained oscillation for simple poles.
- $r>1$ produces a growing oscillation.

The deck illustrates a stable decaying response using

$$
b_0=1,
\qquad
\omega_0=\frac{\pi}{4},
\qquad
r=0.9
$$

---

# Part XII - Key Conceptual Connections

## 51. Signal Sidedness, ROC, and Poles

| Signal or system property | z-domain interpretation |
|---|---|
| Causal/right-sided | ROC is outside the outermost pole |
| Anticausal/left-sided | ROC is inside the innermost pole |
| Two-sided | ROC lies between poles |
| BIBO stable | ROC includes the unit circle |
| Causal and stable | All poles lie inside the unit circle |
| Decaying mode | Pole magnitude less than 1 |
| Sustained simple mode | Pole magnitude equal to 1 |
| Growing mode | Pole magnitude greater than 1 |
| Oscillation | Complex-conjugate poles |
| Alternating real sequence | Negative real pole |
| Polynomially weighted exponential | Repeated pole |

---

## 52. What Pole Radius and Angle Mean

For a pole

$$
p=re^{j\omega_0},
$$

- $r$ controls decay or growth.
- $\omega_0$ controls oscillation frequency.

A pole closer to the origin creates a faster-decaying causal mode.

A pole closer to the unit circle creates a slower-decaying, longer-lasting mode.

A pole outside the unit circle creates a growing causal mode.

---

## 53. What Pole Multiplicity Means

A pole of multiplicity $m$ produces a term of the form

$$
n^{m-1}p^n
$$

Therefore, repeated poles add polynomial growth to the exponential mode.

This explains why:

- a simple pole on the unit circle can be bounded
- a repeated pole on the unit circle is unbounded

---

## 54. Why the ROC Must Always Be Included

For example,

$$
X(z)=\frac{1}{1-az^{-1}}
$$

can represent either

$$
a^n u[n]
$$

when

$$
|z|>|a|
$$

or

$$
-a^n u[-n-1]
$$

when

$$
|z|<|a|
$$

Therefore, writing only $X(z)$ is incomplete whenever multiple ROCs are possible.

---

# Part XIII - Recommended Problem-Solving Workflows

## 55. Finding a Direct z-Transform

1. Write the definition:

   $$
   X(z)=\sum x[n]z^{-n}
   $$

2. Insert the support limits of the sequence.
3. Simplify the sum using a known series.
4. Determine the convergence condition.
5. State both the transform and the ROC.
6. Identify poles and verify that none lie in the ROC.

---

## 56. Finding an Inverse z-Transform

1. Factor the denominator.
2. Identify all poles.
3. Read the ROC carefully.
4. Decide whether each component is causal or anticausal.
5. Make the rational function proper if necessary.
6. Apply partial fractions or a power-series expansion.
7. Use standard transform pairs.
8. Check that the resulting sidedness agrees with the ROC.

---

## 57. Analyzing an LTI System

Given a difference equation:

1. Assume zero initial conditions if the system is relaxed.
2. Take the z-transform of both sides.
3. Solve for

   $$
   H(z)=\frac{Y(z)}{X(z)}
   $$

4. Factor numerator and denominator.
5. Draw or identify the pole-zero plot.
6. Determine the causal ROC.
7. Check whether the unit circle is included.
8. Conclude whether the system is stable.
9. Use the poles to predict transient behavior.
10. Multiply $H(z)$ by $X(z)$ to find the output.

---

# Part XIV - Common Mistakes to Avoid

1. **Leaving out the ROC.**  
   The transform expression and ROC together identify the signal.

2. **Including a pole in the ROC.**  
   The transform is infinite at a pole.

3. **Assuming causal means stable.**  
   A causal system is stable only when its ROC also includes the unit circle.

4. **Assuming every pole on the unit circle gives a bounded signal.**  
   This is true only for simple poles. Repeated poles on the unit circle produce polynomial growth.

5. **Using the causal inverse pair without checking the ROC.**  
   An interior ROC produces a left-sided sequence.

6. **Forgetting to make an improper rational function proper.**  
   Perform polynomial division before partial-fraction expansion.

7. **Ignoring pole-zero cancellation when discussing the ROC.**  
   Cancellation can alter the visible rational form, although system realizations and hidden modes may require additional care.

8. **Confusing pole angle and pole radius.**  
   Radius controls decay or growth; angle controls oscillation frequency.

---

# Final Takeaways

- The z-transform converts discrete-time convolution into multiplication.
- The ROC is essential and determines signal sidedness.
- Poles determine the fundamental modes of a signal or system.
- Pole radius predicts decay, sustained behavior, or growth.
- Pole angle predicts oscillation frequency.
- Repeated poles introduce polynomial factors in time.
- Zeros modify amplitude and phase and can cancel modes.
- Difference equations lead to rational system functions.
- Inverse transforms are commonly found using power series or partial fractions.
- A system is causal when its ROC is outside the outermost pole.
- A system is stable when its ROC contains the unit circle.
- A causal rational system is stable when all uncancelled poles lie inside the unit circle.

---

## Reference Used in the Deck

Proakis, J. G., and Manolakis, D. G., *Digital Signal Processing: Principles, Algorithms, and Applications*, Pearson, 5th edition, 2022.
