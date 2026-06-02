# Solutions

## P3.1

### (a)

Given

$$
x(n)=\left(\tfrac{4}{3}\right)^n u(1-n)
$$

Using the definition,

$$
\begin{aligned}
X(z)
&=\sum_{n=-\infty}^{1} x(n)z^{-n}
=\sum_{n=-\infty}^{1}\left(\tfrac{4}{3}\right)^n z^{-n}
=\sum_{n=-\infty}^{1}\left(\tfrac{4}{3z}\right)^n \\
=\sum_{m=0}^{\infty}\left(\tfrac{4}{3}\right)^{1-m} z^{-(1-m)}
=\left(\tfrac{4}{3}\right) z^{-1}\sum_{m=0}^{\infty}\left(\left(\tfrac{3}{4}\right)z\right)^m
=\frac{\tfrac{4}{3}z^{-1}}{1-\left(\tfrac{3}{4}\right)z}
=\frac{-16/9}{z\left(z-\tfrac{4}{3}\right)}
\end{aligned}
$$

ROC (left-sided):

$$
|z|<\tfrac{4}{3}
$$

MATLAB verification notes: the sequence is left-sided, so the difference equation (filter) should be run backward in time. For verification, advance $x(n)$ by one sample and simulate $zX(z)$:

$$
zX(z)=\frac{\tfrac{4}{3}}{1-\left(\tfrac{3}{4}\right)z}
$$

```matlab
% (c) x(n) = (4/3)^n u(1-n)
b = [4/3];
a = [1, -3/4];     % Difference equation
delta = [1, zeros(1,7)];   % Input sequence

% filter solution
x = filter(b,a,delta)

% simulation of x(n)
n = [-1:-1:-6];
x = (4/3).^n
```

### (b)

Given

$$
x(n)=2^{-|n|}+3^{-|n|}
$$

Rearrange into right-sided and left-sided parts:

$$
x(n)=2^{-n}u(n)-\big[-2^n u(-n-1)\big] + 3^{-n}u(n)-\big[-3^n u(-n-1)\big]
$$

i) Z-transform (with ROCs for each term):

$$
\begin{aligned}
X(z)
&=\underbrace{\frac{1}{1-2^{-1}z^{-1}}}_{|z|>2^{-1}}
-\underbrace{\frac{1}{1-2z^{-1}}}_{|z|<2}
+\underbrace{\frac{1}{1-3^{-1}z^{-1}}}_{|z|>3^{-1}}
-\underbrace{\frac{1}{1-3z^{-1}}}_{|z|<3} \\
&=\underbrace{\frac{-2+5z^{-1}}{1-5z^{-1}+6z^{-2}}}_{|z|<2}
+\underbrace{\frac{2-\left(\tfrac{5}{6}\right)z^{-1}}{1-\left(\tfrac{5}{6}\right)z^{-1}+\left(\tfrac{1}{6}\right)z^{-2}}}_{|z|>2^{-1}}
\end{aligned}
$$

After simplification:

$$
X(z)=\frac{-4.1667z^{-1}+11.6667z^{-2}-4.1667z^{-3}+0.5z^{-4}}{1-5.8333z^{-1}+10.3333z^{-2}-5.8333z^{-3}+1.0000z^{-4}}
$$

Overall ROC (two-sided sequence):

$$
0.5<|z|<2
$$

ii) MATLAB verification note: since the sequence is two-sided, it is not possible to derive a single difference equation (filter) valid in both directions. Verification can be done by generating positive-time and negative-time components and checking the reconstruction.

```matlab
% (d) x(n) = 2^(-|n|) + 3^(-|n|)
R = [1; -1; 1; -1];      % residues
p = [1/2; 2; 1/3; 3];    % poles
[b,a] = residuez(R,p,[]) % Difference equation coefficients

% Forward difference equation
Rf = [1; 1];
pf = [1/2; 1/3];
[bf,af] = residuez(Rf,pf,[])

[delta,nf] = impseq(0,0,30);
xf = filter(bf,af,delta).';

% Backward difference equation
Rb = [-1; -1];
pb = [2; 3];
[bb,ab] = residuez(Rb,pb,[])

[delta,nb] = impseq(0,0,29);
xb = filter(fliplr(bb), fliplr(ab), delta).';

% Total solution
x1 = [fliplr(xb), xf];

% simulation of x(n)
n = [-fliplr(nb+1), nf];
x2 = 2.^(-abs(n)) + 3.^(-abs(n));

% difference
diff = max(abs(x1-x2))
```

## P3.2

### (a)

Given

$$
x(n)=\left(\tfrac{1}{3}\right)^n u(n-2) + (0.9)^{n-3}u(n)
$$

Rearrange:

$$
\begin{aligned}
x(n)
&=\left(\tfrac{1}{3}\right)^2\left(\tfrac{1}{3}\right)^{n-2}u(n-2) + (0.9)^{-3}(0.9)^n u(n)\\
&=\tfrac{1}{9}\left(\tfrac{1}{3}\right)^{n-2}u(n-2) + \tfrac{1000}{729}(0.9)^n u(n)
\end{aligned}
$$

Z-transform (table/properties):

$$
\begin{aligned}
X(z)
&=\tfrac{1}{9}z^{-2}\,\mathcal{Z}\{\left(\tfrac{1}{3}\right)^n u(n)\} + \tfrac{1000}{729}\,\mathcal{Z}\{(0.9)^n u(n)\}\\
&=\tfrac{1}{9}z^{-2}\left(\frac{1}{1-\tfrac{1}{3}z^{-1}}\right) + \tfrac{1000}{729}\left(\frac{1}{1-0.9z^{-1}}\right)
\end{aligned}
$$

After simplification:

$$
X(z)=\frac{\tfrac{1000}{729}-\tfrac{1000}{2187}z^{-1}+\tfrac{1}{9}z^{-2}-0.1z^{-3}}{1-\tfrac{37}{30}z^{-1}+0.3z^{-2}}
$$

MATLAB verification:

```matlab
% Sequence:
% x(n) = (1/3)^n*u(n-2) + (0.9)^(n-3)*u(n)

% Analytical Expression of X(z)
% X(z) = ((1000/729) - (1000/2187)*z^(-1) + (1/9)*z^(-2) - 0.1*z^(-3))
%        -----------------------------------------------------------------
%                1 - (37/30)*z^(-1) + 0.3*z^(-2)

% Matlab verification
b = [1000/729, -1000/2187, 1/9, -0.1];
a = [1, -37/30, 0.3];
delta = impseq(0,0,7);
format long
xb1 = filter(b,a,delta)

% check
n = 0:7;
xb2 = ((1/3).^n).*stepseq(2,0,7) + ((0.9).^(n-3)).*stepseq(0,0,7)

error = abs(max(xb1-xb2))
format short
```

### (b)

Given

$$
x(n)=\left(\tfrac{1}{2}\right)^n\cos\!\left(\tfrac{\pi n}{4}-45^\circ\right)u(n-1)
$$

Rewrite:

$$
\begin{aligned}
x(n)
&=\left(\tfrac{1}{2}\right)^n\cos\!\left(\tfrac{\pi n}{4}-\tfrac{\pi}{4}\right)u(n-1)
=\tfrac{1}{2}\left(\tfrac{1}{2}\right)^{n-1}\cos\!\left(\tfrac{\pi}{4}(n-1)\right)u(n-1)
\end{aligned}
$$

Z-transform:

$$
\begin{aligned}
X(z)
&=\tfrac{1}{2}z^{-1}\,\mathcal{Z}\left\{\left(\tfrac{1}{2}\right)^n\cos\!\left(\tfrac{\pi n}{4}\right)u(n)\right\}\\
&=\tfrac{1}{2}z^{-1}\left(\frac{1-\tfrac{1}{2}z^{-1}\cos(\pi/4)}{1-z^{-1}\cos(\pi/4)+\tfrac{1}{4}z^{-2}}\right)
\end{aligned}
$$

After simplification:

$$
X(z)=\frac{0.5z^{-1}-\tfrac{1}{4\sqrt{2}}z^{-2}}{1-\tfrac{1}{\sqrt{2}}z^{-1}+0.25z^{-2}},\quad |z|>0.5
$$

MATLAB verification:

```matlab
% Sequence:
% x(n) = (1/2)^n*cos(pi*n/4-pi/4)*u(n-1)

% Analytical Expression of X(z)
% X(z) = 0.5*z^(-1) - 1/(4*sqrt(2))*z^(-2)
%        -----------------------------------
%           1 - 1/sqrt(2)*z^(-1) + 0.25*z^(-2)

% Matlab verification
b = [0, 0.5, -1/(4*sqrt(2))];
a = [1, -1/sqrt(2), 0.25];
delta = impseq(0,0,7);
format long
xb1 = filter(b,a,delta)

% check
n = 0:7;
xb2 = ((1/2).^n).*cos(pi*n/4-pi/4).*stepseq(1,0,7)

error = abs(max(xb1-xb2))
format short
```

## P3.3

Given $X(z)=\mathcal{Z}\{x(n)\}=1+2z^{-1}$, with $|z|\neq 0$.

### (a)

$$
x_2(n)=(1+n+n^2)x(n)=x(n)+n\,x(n)+n[n\,x(n)]
$$

Using the property $\mathcal{Z}\{n\,x(n)\}=-z\,\frac{d}{dz}X(z)$, we get

$$
\begin{aligned}
X_2(z)
&=X(z)+\left\{-z\frac{d}{dz}X(z)\right\}+\left\{-z\frac{d}{dz}\left[-z\frac{d}{dz}X(z)\right]\right\}\\
&=X(z)-z\frac{d}{dz}X(z)+z\frac{d}{dz}\left\{z\frac{d}{dz}X(z)\right\}
\end{aligned}
$$

With $X(z)=1+2z^{-1}$:

$$
\frac{d}{dz}X(z)=-2z^{-2},\qquad z\frac{d}{dz}X(z)=-2z^{-1}
$$

Hence

$$
X_2(z)=(1+2z^{-1})-z(-2z^{-2})+2z^{-1}=1+6z^{-1},\quad z\neq 0.
$$

### (b)

Let

$$
x_3(n)=\left(\tfrac{1}{2}\right)^n x(n-2)
$$

Time shift:

$$
\mathcal{Z}\{x(n-2)\}=z^{-2}X(z)=z^{-2}+2z^{-3}
$$

Frequency scaling (multiplication by $a^n$ corresponds to $z\to z/a$):

$$
\mathcal{Z}\left\{\left(\tfrac{1}{2}\right)^n x(n-2)\right\}
=X_3(z)=\left[z^{-2}+2z^{-3}\right]_{z\to 2z}
=(2z)^{-2}+2(2z)^{-3}
=0.25z^{-2}+0.25z^{-3}
$$

ROC: scaled by $\tfrac{1}{2}$. Since the original ROC is $|z|>0$, the new ROC is also $|z|>0$.

## P3.4

Given $x(n)=\mathcal{Z}^{-1}\{X(z)\}=2^{-n}u(n)$. Then

$$
\mathcal{Z}^{-1}\{zX(z^{-1})\}=x(-n-1)=2^{-(-n-1)}u(-n-1)=2^{n+1}u(-n-1).
$$

## P3.5

### (a)

Given

$$
X(z)=\frac{1-z^{-1}-4z^{-2}+4z^{-3}}{1-\tfrac{11}{4}z^{-1}+\tfrac{13}{8}z^{-2}-0.25z^{-3}}
$$

Absolutely summable sequence. Use partial-fraction expansion (`residuez`).

```matlab
b = [1, -1, -4, 4];
a = [1, -11/4, 13/8, -1/4];
[R,p,k] = residuez(b,a)
```

From the computed residues/poles:

$$
X(z)=-16+\frac{0}{1-2z^{-1}}+\frac{10}{1-0.5z^{-1}}+\frac{27}{1-0.25z^{-1}},\quad 0.5<|z|<2
$$

Hence (z-transform table):

$$
x(n)=-16\,\delta(n)-10(0.5)^n u(n)+27(0.25)^n u(n)
$$

MATLAB verification:

```matlab
[delta,n] = impseq(0,0,7);
xb1 = filter(b,a,delta)

xb2 = -16*delta - 10*(0.5).^n + 27*(0.25).^n

error = abs(max(xb1-xb2))
```

### (b)

Given

$$
X(z)=\frac{z}{z^3+2z^2+1.25z+0.25},\quad |z|>1
$$

Use partial-fraction expansion (`residuez`).

```matlab
b = [0, 0, 1];
a = [1, 2, 1.25, 0.25];
[R,p,k] = residuez(b,a)  % echo on
```

From the computed expansion:

$$
X(z)=\frac{4}{1+z^{-1}}+\frac{0}{1+0.5z^{-1}}+\frac{-4}{(1+0.5z^{-1})^2}
$$

Hence (z-transform table):

$$
\begin{aligned}
x(n)
&=4(-1)^n u(n)+8(n+1)(-0.5)^{n+1}u(n)
\end{aligned}
$$

MATLAB verification:

```matlab
[delta,n] = impseq(0,0,7);
xd1 = filter(b,a,delta)

xd2 = 4*(-1).^n + (8*(n+1)).*((-0.5).^(n+1))

error = abs(max(xd1-xd2))
```

## P3.7

### (a)

Given

$$
h(n)=2(0.5)^n u(n)
$$

System function:

$$
H(z)=\mathcal{Z}\{h(n)\}=\frac{2}{1-0.5z^{-1}},\quad |z|>0.5
$$

Difference equation:

$$
\frac{Y(z)}{X(z)}=\frac{2}{1-0.5z^{-1}}\ \Rightarrow\ Y(z)-0.5z^{-1}Y(z)=2X(z)
$$

so

$$
y(n)=2x(n)+0.5y(n-1)
$$

Pole-zero description: a zero at $z=0$ and a pole at $z=0.5$.

For input $x(n)=\left(\tfrac{1}{4}\right)^n u(n)$, use the z-transform (ROCs overlap):

$$
\begin{aligned}
Y(z)
&=H(z)X(z)=\frac{2}{1-0.5z^{-1}}\cdot\frac{1}{1-0.25z^{-1}}\\
&=\frac{4}{1-0.5z^{-1}}-\frac{2}{1-0.25z^{-1}},\quad |z|>0.5
\end{aligned}
$$

Hence

$$
y(n)=4(0.5)^n u(n)-2(0.25)^n u(n)
$$

### (b)

Given

$$
h(n)=n\,[u(n)-u(n-10)]=[0,1,2,\ldots,9]
$$

i) System-function representation:

$$
H(z)=z^{-1}+2z^{-2}+\cdots+9z^{-9}=\sum_{k=1}^{9}kz^{-k}
$$

ii) Difference-equation representation:

$$
y(n)=\sum_{k=1}^{9}k\,x(n-k)
$$

iii) Pole-zero plot (MATLAB script):

```matlab
clear, close all;
hb = [0:9];
ha = [1,0];
zplane(hb,ha);
```

iv) Output $y(n)$ when $x(n)=\left(\tfrac{1}{4}\right)^n u(n)$:

$$
\begin{aligned}
Y(z)
&=H(z)X(z)
=\left(z^{-1}+2z^{-2}+\cdots+9z^{-9}\right)\frac{1}{1-0.25z^{-1}},\quad |z|>0.25
\end{aligned}
$$

After PFE (performed using MATLAB):

$$
Y(z)=\frac{3029220}{1-0.25z^{-1}}-3029220-757304z^{-1}-189324z^{-2}-47328z^{-3}-11828z^{-4}-2952z^{-5}-732z^{-6}-176z^{-7}-36z^{-8}
$$

MATLAB (PFE) script:

```matlab
clear, close all;
hb = [0:9];
ha = [1,0];

xb = [1];
xa = [1,-0.25];

yb = hb;
ya = xa;

[R,p,k] = residuez(yb,ya)
```

## P3.8

A stable system has pole-zero locations:

$$
z_1=j,\quad z_2=-j,\quad p_1=-\tfrac{1}{2}+j\tfrac{1}{2},\quad p_2=-\tfrac{1}{2}-j\tfrac{1}{2}
$$

and $H(e^{j\omega})$ evaluated at $\omega=0$ is

$$
H(e^{j0})=H(1)=0.8.
$$

### (a) System function $H(z)$ and ROC

Write

$$
H(z)=K\,\frac{(z-j)(z+j)}{(z+0.5-j0.5)(z+0.5+j0.5)}
=K\,\frac{z^2+1}{z^2+z+0.5}
$$

Since $z=e^{j0}=1$ at $\omega=0$:

$$
0.8=H(1)=K\frac{1+1}{1+1+0.5}=K\frac{2}{2.5}\ \Rightarrow\ K=1.
$$

Therefore

$$
H(z)=\frac{z^2+1}{z^2+z+0.5},\quad |z|>\frac{1}{\sqrt{2}}.
$$

### (b) Difference equation

$$
H(z)=\frac{z^2+1}{z^2+z+0.5}=\frac{1+z^{-2}}{1+z^{-1}+0.5z^{-2}}=\frac{Y(z)}{X(z)}
$$

Cross-multiplying and inverse z-transforming:

$$
y(n)+y(n-1)+0.5y(n-2)=x(n)+x(n-1).
$$

### (c) Steady-state response $y_{ss}(n)$

Input:

$$
x(n)=\frac{1}{\sqrt{2}}\sin\!\left(\frac{\pi n}{2}\right)u(n)
$$

From the z-transform table:

$$
X(z)=\left(\frac{1}{\sqrt{2}}\right)\frac{z}{z^2+1},\quad |z|>1.
$$

Then

$$
\begin{aligned}
Y(z)
&=H(z)X(z)=\frac{z^2+1}{z^2+z+0.5}\left(\frac{1}{\sqrt{2}}\right)\frac{z}{z^2+1}
=\left(\frac{1}{\sqrt{2}}\right)\frac{z}{z^2+z+0.5},\quad |z|>\frac{1}{\sqrt{2}}.
\end{aligned}
$$

Thus, the poles of $Y(z)$ are the poles of $H(z)$, which are inside the unit circle. Therefore, there is no steady-state response:

$$
y_{ss}(n)=0.
$$

### (d) Transient response $y_{tr}(n)$

Since $y_{ss}(n)=0$, the total response is transient: $y(n)=y_{tr}(n)$. From part (c):

$$
Y(z)=\left(\frac{1}{\sqrt{2}}\right)\frac{z}{z^2+z+0.5}
=\sqrt{2}\,\frac{\left(\tfrac{1}{\sqrt{2}}\right)\left(\tfrac{1}{\sqrt{2}}\right)z}{1+z^{-1}+\left(\tfrac{1}{\sqrt{2}}\right)^2 z^{-2}},\quad |z|>\frac{1}{\sqrt{2}}.
$$

By table lookup:

$$
y(n)=y_{tr}(n)=\sqrt{2}\left(\frac{1}{\sqrt{2}}\right)^n\sin(0.75\pi n)\,u(n).
$$
