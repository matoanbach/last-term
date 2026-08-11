# Lecture 2026-08-05 - Review

> Transcribed from the handwritten lecture review PDF. Mathematical notation has been standardized into Markdown/LaTeX while preserving the structure and content of the notes.

---

## Page 1 - LTI System / Convolution Problem

Given the system:

- Input: $x(n)$
- Upper branch: $h(n)$
- Lower branch: delay by 2 samples, then $h(n)$
- The upper branch is added and the lower branch is subtracted.

The impulse response is:

$$
h(n)=a^n u(n), \qquad -1<a<1
$$

The input is:

$$
x(n)=u(n+5)-u(n-10)
$$

Find:

$$
y(n)=?
$$

From the block diagram,

$$
y(n)=x(n)*h(n)-x(n-2)*h(n)
$$

where $*$ denotes convolution.

---

## Page 2 - Step Response

If

$$
x(n)=u(n)
$$

define the step response:

$$
s(n)=u(n)*h(n)
$$

Using convolution,

$$
s(n)=\sum_{k=-\infty}^{\infty}u(k)h(n-k)
$$

Since $u(k)$ is nonzero for $k\ge 0$,

$$
s(n)=\sum_{k=0}^{n}h(n-k)
$$

With

$$
h(n)=a^n u(n),
$$

we obtain

$$
s(n)=\sum_{k=0}^{n}a^{n-k}
$$

so

$$
s(n)=a^n+a^{n-1}+a^{n-2}+\cdots+a^0
$$

Using the finite geometric-series formula,

$$
\boxed{
s(n)=\frac{a^{n+1}-1}{a-1}, \qquad n\ge0
}
$$

or, including the unit step,

$$
\boxed{
s(n)=\frac{a^{n+1}-1}{a-1}u(n)
}
$$

---

## Page 3 - Apply the Step Response to the Input

Recall:

$$
s(n)=x(n)*h(n)
$$

For a unit-step input,

$$
x(n)=u(n)
$$

we found

$$
s(n)=\frac{a^{n+1}-1}{a-1}u(n)
$$

Now use

$$
x(n)=u(n+5)-u(n-10)
$$

By linearity and shifting,

$$
x(n)*h(n)=s(n+5)-s(n-10)
$$

Therefore,

$$
s(n+5)
=
\frac{a^{n+6}-1}{a-1}u(n+5)
$$

and

$$
s(n-10)
=
\frac{a^{n-9}-1}{a-1}u(n-10)
$$

Hence,

$$
\boxed{
x(n)*h(n)
=
\frac{a^{n+6}-1}{a-1}u(n+5)
-
\frac{a^{n-9}-1}{a-1}u(n-10)
}
$$

---

## Page 4 - Output of the Two-Branch System

From the block diagram,

$$
y(n)=x(n)*h(n)-x(n-2)*h(n)
$$

Using the convolution shift property,

$$
x(n-2)*h(n)=x(n)*h(n-2)
$$

so

$$
\boxed{
y(n)=x(n)*h(n)-x(n)*h(n-2)
}
$$

### Term 1

$$
x(n)*h(n)
=
\frac{a^{n+6}-1}{a-1}u(n+5)
-
\frac{a^{n-9}-1}{a-1}u(n-10)
$$

### Term 2

$$
x(n)*h(n-2)
=
\frac{a^{n+4}-1}{a-1}u(n+3)
-
\frac{a^{n-11}-1}{a-1}u(n-12)
$$

Thus the output is Term 1 minus Term 2.

---

## Page 5 - Shift Relationship

Define

$$
t(n)=x(n)*h(n)
$$

Then

$$
t(n-2)=x(n)*h(n-2)
$$

Therefore, the system output may be written as

$$
\boxed{
y(n)=t(n)-t(n-2)
}
$$

---

## Page 6 - Magnitude and Phase Response

Find the magnitude and phase response for

$$
y(n)=x(n)+x(n-4)
$$

Take the DTFT:

$$
Y(\omega)=X(\omega)+X(\omega)e^{-j4\omega}
$$

Factor out $X(\omega)$:

$$
Y(\omega)=\left(1+e^{-j4\omega}\right)X(\omega)
$$

Therefore,

$$
\boxed{
H(\omega)=\frac{Y(\omega)}{X(\omega)}
=1+e^{-j4\omega}
}
$$

The notes begin rewriting the exponential using Euler's identity:

$$
e^{-j4\omega}
=
\cos(4\omega)-j\sin(4\omega)
$$

and also factor the expression as

$$
1+e^{-j4\omega}
=
e^{-j2\omega}
\left(
e^{j2\omega}+e^{-j2\omega}
\right)
$$

---

## Page 7 - Speedup from Separable Kernels

### Question

Assuming an $m\times m$ kernel is separable, could we ever get a speedup of $10\times$ or higher by using two 1D separable kernels instead of the original 2D kernel?

### Operation-count comparison

For an $M\times N$ image:

- Direct 2D convolution costs approximately

$$
MN(m\times m)=MNm^2
$$

- Using two 1D separable kernels costs approximately

$$
MN(m+m)=2MNm
$$

For at least a $10\times$ speedup,

$$
\frac{MNm^2}{MN(m+m)}\ge10
$$

Cancel $MN$:

$$
\frac{m^2}{2m}\ge10
$$

Therefore,

$$
\frac{m}{2}\ge10
$$

so

$$
\boxed{m\ge20}
$$

Thus, according to the notes, a theoretical speedup of at least $10\times$ is possible when

$$
\boxed{m\ge20}
$$
