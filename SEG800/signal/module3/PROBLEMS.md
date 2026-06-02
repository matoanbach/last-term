# Problems

## P3.1

Determine the z-transform of the following sequences, using the definition (3.1). Indicate the region of convergence for each sequence, and verify the z-transform expression by using MATLAB.

1. (a) $x(n) = \left(\tfrac{4}{3}\right)^n\,u(1-n)$
2. (b) $x(n) = 2^{-|n|} + \left(\tfrac{1}{3}\right)^{|n|}$

## P3.2

Determine the z-transform of the following sequences, using the z-transform table and the z-transform properties. Express $X(z)$ as a rational function in $z^{-1}$. Verify your results using MATLAB. Indicate the region of convergence in each case, and provide a pole-zero plot.

1. (a) $x(n) = \left(\tfrac{1}{3}\right)^n u(n-2) + (0.9)^{n-3} u(n)$
2. (b) $x(n) = \left(\tfrac{1}{2}\right)^n \cos\!\left(\tfrac{\pi n}{4} - 45^\circ\right) u(n-1)$

## P3.3

The z-transform of $x(n)$ is $X(z) = (1 + 2z^{-1})$, $|z| \neq 0$. Find the z-transforms of the following sequences, and indicate their region of convergence.

1. (a) $x_2(n) = (1 + n + n^2)\,x(n)$
2. (b) $x_3(n) = \left(\tfrac{1}{2}\right)^n x(n-2)$

## P3.4

The inverse z-transform of $X(z)$ is $x(n) = \left(\tfrac{1}{2}\right)^n u(n)$. Using the z-transform properties, determine the sequence corresponding to:

$$
X_1(z) = z\,X\!\left(z^{-1}\right)
$$

## P3.5

Determine the following inverse z-transforms, using the partial-fraction expansion method.

1. (a)

   $$
   X_2(z) = \dfrac{1 - z^{-1} - 4z^{-2} + 4z^{-3}}{1 - \tfrac{11}{4}z^{-1} + \tfrac{13}{8}z^{-2} - \tfrac{1}{4}z^{-3}}
   $$

   The sequence is absolutely summable.

2. (b)

   $$
   X_4(z) = \dfrac{z}{z^3 + 2z^2 + 1.25z + 0.25},\quad |z| > 1
   $$

## DSP P3.14

Include analytical solutions (with explanations) to the following problem:

[DSP] P3.14 Determine the causal signal $x(n)$ if its z-transform $X(z)$ is given by:

1. (a)

   $$
   X(z) = \dfrac{1 + 3z^{-1}}{1 + 3z^{-1} + 2z^{-2}}
   $$

2. (c)

   $$
   X(z) = \dfrac{z^{-6} + z^{-7}}{1 - z^{-1}}
   $$

3. (h) $X(z)$ is specified by a pole-zero pattern in Fig. P3.14. The constant $G = \tfrac{1}{2}$.

## P3.7

For the linear and shift-invariant systems described by the following impulse responses, determine:

1. (i) the system-function representation
2. (ii) the difference-equation representation
3. (iii) the pole-zero plot
4. (iv) the output $y(n)$ if the input is $x(n) = \left(\tfrac{1}{4}\right)^n u(n)$

Impulse responses:

1. (a) $h(n) = 2\left(\tfrac{1}{2}\right)^n u(n)$
2. (b) $h(n) = n\,[u(n) - u(n-10)]$

## P3.8

A stable system has the following pole-zero locations:

$$
z_1 = j,\quad z_2 = -j,\quad p_1 = -\tfrac{1}{2} + j\tfrac{1}{2},\quad p_2 = -\tfrac{1}{2} - j\tfrac{1}{2}
$$

It is known that the frequency response function $H(\omega)$ evaluated at $\omega = 0$ is equal to 0.8, that is,

$$
H(0) = 0.8
$$

1. (a) Determine the system function $H(z)$, and indicate its region of convergence.
2. (b) Determine the difference-equation representation.
3. (c) Determine the steady-state response $y_{ss}(n)$ if the input is $x(n) = \tfrac{1}{\sqrt{2}}\sin\!\left(\tfrac{\pi n}{2}\right)u(n)$.
4. (d) Determine the transient response $y_{tr}(n)$ if the input is $x(n) = \tfrac{1}{\sqrt{2}}\sin\!\left(\tfrac{\pi n}{2}\right)u(n)$.

## DSP P3.35

Include analytical solutions (with explanations) to the following problem:

[DSP] P3.35 Compute the zero-state response for the following pairs of systems and input signals.

1. (h) $h(n) = \left(\tfrac{1}{2}\right)^n u(n)$, $x(n) = (n+1)\left(\tfrac{1}{4}\right)^n u(n)$

## DSP P3.37

Include solutions (with explanations) to the following problem:

[DSP] P3.37 Compute the response of the system

$$
y(n) = 0.7y(n-1) - 0.12y(n-2) + x(n-1) + x(n-2)
$$

to the input $x(n) = n\,u(n)$. Is the system stable?
