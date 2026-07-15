# SEG800 Digital Signal and Image Processing  
## Comprehensive Summary: The Fourier Transform

**Source:** Seneca College, SEG800, *The Fourier Transform* deck  
**Coverage:** Sinusoids, sampling and aliasing, Nyquist rate, Fourier series, continuous-time and discrete-time Fourier transforms, convergence, Parseval's relation, power and energy spectra, bandwidth, symmetry, transform properties, and common DTFT pairs.

> The deck writes discrete-time signals as $x(n)$. This summary uses the equivalent notation $x[n]$.

---

# 1. Big Picture

Frequency analysis represents a signal as a combination of sinusoidal or complex-exponential components.

The main tools depend on whether a signal is periodic or aperiodic and whether it is continuous-time or discrete-time:

| Signal type | Frequency-analysis tool |
|---|---|
| Continuous-time periodic | Continuous-Time Fourier Series (CTFS) |
| Discrete-time periodic | Discrete-Time Fourier Series (DTFS) |
| Continuous-time aperiodic | Continuous-Time Fourier Transform (CTFT) |
| Discrete-time aperiodic | Discrete-Time Fourier Transform (DTFT) |

The **analysis equation** decomposes a signal into frequency components.

The **synthesis equation** recombines those components to recover the original signal.

A frequency-domain representation is useful because it reveals:

- which frequencies are present
- how strongly each frequency is present
- the phase associated with each frequency
- where a signal's energy or power is concentrated
- whether a signal is lowpass, highpass, or bandpass
- how sampling and filtering affect the signal

---

# Part I - Sinusoidal Signals

## 2. Continuous-Time Sinusoids

A continuous-time sinusoid can be written as

$$
x_a(t)=A\cos(2\pi Ft+\theta)
$$

or equivalently,

$$
x_a(t)=A\cos(\Omega t+\theta)
$$

where:

- $A$ is the amplitude
- $F$ is frequency in hertz, or cycles per second
- $\Omega$ is angular frequency in radians per second
- $\theta$ is phase in radians

The frequency variables are related by

$$
\boxed{\Omega=2\pi F}
$$

The period is

$$
\boxed{T_p=\frac{1}{F}}
$$

### Important continuous-time sinusoid properties

1. Every nonzero-frequency continuous-time sinusoid is periodic.
2. Different frequencies produce distinct continuous-time signals.
3. Increasing $F$ increases the rate of oscillation.
4. Continuous-time frequency is not inherently limited to a finite interval:

$$
-\infty<F<\infty,
\qquad
-\infty<\Omega<\infty
$$

---

## 3. Phasor Representation

Euler's identity gives

$$
\cos\phi=\frac{1}{2}e^{j\phi}+\frac{1}{2}e^{-j\phi}
$$

Therefore,

$$
A\cos(\Omega t+\theta)
=
\frac{A}{2}e^{j(\Omega t+\theta)}
+
\frac{A}{2}e^{-j(\Omega t+\theta)}
$$

A real cosine is thus the sum of two equal-amplitude complex-conjugate rotating vectors, called **phasors**.

- Positive frequency corresponds to counterclockwise rotation.
- Negative frequency corresponds to clockwise rotation.
- The two phasors combine to produce a real sinusoidal signal.

This explains why real sinusoidal signals normally produce frequency components at both positive and negative frequencies.

---

## 4. Discrete-Time Sinusoids

A discrete-time sinusoid is

$$
x[n]=A\cos(\omega n+\theta)
$$

or

$$
x[n]=A\cos(2\pi fn+\theta)
$$

where:

- $\omega$ is angular frequency in radians per sample
- $f$ is normalized frequency in cycles per sample

The relation is

$$
\boxed{\omega=2\pi f}
$$

Unlike continuous-time sinusoids, a discrete-time sinusoid is **not always periodic**.

---

## 5. Periodicity of a Discrete-Time Sinusoid

For

$$
x[n]=A\cos(\omega_0n+\theta)
$$

to be periodic with integer period $N>0$, there must be an integer $k$ such that

$$
\omega_0N=2\pi k
$$

Therefore,

$$
\frac{\omega_0}{2\pi}=\frac{k}{N}
$$

or

$$
\boxed{f_0=\frac{\omega_0}{2\pi}\text{ must be rational}}
$$

If $f_0$ is irrational, no integer $N$ satisfies the periodicity condition, so the sequence is not periodic.

### Finding the fundamental period

Write

$$
\frac{\omega_0}{2\pi}=\frac{k}{N}
$$

in lowest terms. The denominator $N$ is normally the fundamental period.

Example:

$$
\omega_0=\frac{\pi}{6}
$$

Then

$$
\frac{\omega_0}{2\pi}
=
\frac{1}{12}
$$

so the fundamental period is

$$
N=12
$$

---

## 6. Frequency Periodicity and Aliasing in Discrete Time

For any integer $k$,

$$
e^{j(\omega+2\pi k)n}
=
e^{j\omega n}e^{j2\pi kn}
=
e^{j\omega n}
$$

because $e^{j2\pi kn}=1$ for integer $n$.

Therefore,

$$
\boxed{\omega\text{ and }\omega+2\pi k\text{ represent the same discrete-time frequency}}
$$

The same applies to sinusoids:

$$
\cos[(\omega+2\pi k)n+\theta]
=
\cos(\omega n+\theta)
$$

Thus, discrete-time frequency is periodic with period $2\pi$.

A standard fundamental range is

$$
\boxed{-\pi\le\omega\le\pi}
$$

or, in cycles per sample,

$$
\boxed{-\frac12\le f\le\frac12}
$$

An equivalent interval is $0\le\omega<2\pi$.

### Highest discrete-time oscillation rate

The highest distinguishable oscillation rate occurs at

$$
\omega=\pi
$$

because

$$
\cos(\pi n)=(-1)^n
$$

which changes sign at every sample.

Frequencies beyond $\pi$ fold back into the fundamental range and become aliases of lower frequencies.

---

# Part II - Sampling

## 7. Uniform Sampling

An analog signal $x_a(t)$ sampled every $T$ seconds produces

$$
\boxed{x[n]=x_a(nT)}
$$

The sampling rate is

$$
\boxed{F_s=\frac{1}{T}}
$$

where:

- $T$ is the sampling interval in seconds
- $F_s$ is the sampling frequency in hertz

Sampling converts a continuous-time signal into a discrete-time sequence.

---

## 8. Sampling an Analog Sinusoid

Suppose

$$
x_a(t)=A\cos(2\pi Ft+\theta)
$$

Sampling at $t=nT$ gives

$$
x[n]
=
A\cos(2\pi FnT+\theta)
$$

Since $T=1/F_s$,

$$
x[n]
=
A\cos\left(2\pi\frac{F}{F_s}n+\theta\right)
$$

Therefore,

$$
\boxed{f=\frac{F}{F_s}}
$$

and

$$
\boxed{\omega=2\pi\frac{F}{F_s}}
$$

The full set of frequency relations is

$$
\boxed{
\Omega=2\pi F,\qquad
\omega=\Omega T,\qquad
f=FT=\frac{F}{F_s},\qquad
\omega=2\pi f
}
$$

The inverse relationships are

$$
\boxed{
F=fF_s=\frac{\omega F_s}{2\pi}
}
$$

and

$$
\boxed{
\Omega=\frac{\omega}{T}=\omega F_s
}
$$

---

## 9. Why Sampling Creates Aliasing

Suppose two analog frequencies differ by an integer multiple of the sampling rate:

$$
F_2=F_1+kF_s
$$

After sampling,

$$
2\pi\frac{F_2}{F_s}n
=
2\pi\frac{F_1}{F_s}n+2\pi kn
$$

The additional $2\pi kn$ does not change the sample values, so both analog sinusoids produce the same discrete-time frequency.

Thus,

$$
\boxed{F,\ F+kF_s\text{ produce identical sampled complex exponentials}}
$$

For real cosines, positive and negative frequencies are also related through cosine symmetry. Frequencies outside the interval

$$
-\frac{F_s}{2}\le F\le\frac{F_s}{2}
$$

fold into this interval.

The frequency

$$
\boxed{\frac{F_s}{2}}
$$

is called the **folding frequency** or **Nyquist frequency**.

---

## 10. Sampling Theorem

Assume an analog baseband signal has no frequency content above $B$ hertz:

$$
X_a(F)=0
\qquad \text{for }|F|>B
$$

The signal can be recovered from its samples when the sampling frequency is at least twice the highest signal frequency:

$$
\boxed{F_s\ge 2B}
$$

In practice, a margin above $2B$ is normally used.

The ideal reconstruction formula is

$$
x_a(t)
=
\sum_{n=-\infty}^{\infty}
x_a\left(\frac{n}{F_s}\right)
g\left(t-\frac{n}{F_s}\right)
$$

where, for the limiting baseband case,

$$
g(t)=\frac{\sin(2\pi Bt)}{2\pi Bt}
$$

Each sample weights a shifted sinc interpolation function. Adding all shifted sinc functions reconstructs the original bandlimited analog waveform.

---

## 11. Nyquist Rate versus Nyquist Frequency

These terms are related but not identical.

### Nyquist rate

For a signal whose highest frequency is $B$,

$$
\boxed{F_N=2B}
$$

This is the minimum theoretical sampling rate needed to avoid aliasing.

### Nyquist frequency

For a system sampling at $F_s$,

$$
\boxed{F_{\text{Nyquist}}=\frac{F_s}{2}}
$$

This is the highest analog frequency that can be uniquely represented at that sampling rate.

---

# Part III - Frequency Analysis and Fourier Series

## 12. Analysis and Synthesis

Frequency analysis breaks a signal into complex exponentials or sinusoids.

Fourier synthesis reconstructs the signal by adding those components.

The prism analogy used in the deck illustrates this:

- a prism separates white light into frequency-dependent colors
- a second prism can recombine the colors into white light

Similarly:

- Fourier analysis separates a signal into frequency components
- Fourier synthesis recombines the components

---

## 13. Continuous-Time Fourier Series

For a continuous-time periodic signal with fundamental period $T_p$,

$$
F_0=\frac{1}{T_p}
$$

and

$$
\Omega_0=2\pi F_0
$$

The harmonically related complex exponentials are

$$
s_k(t)=e^{jk\Omega_0t}
=
e^{j2\pi kF_0t},
\qquad
k=0,\pm1,\pm2,\ldots
$$

### CTFS synthesis equation

$$
\boxed{
x(t)
=
\sum_{k=-\infty}^{\infty}
c_ke^{j2\pi kF_0t}
}
$$

### CTFS analysis equation

$$
\boxed{
c_k
=
\frac{1}{T_p}
\int_{T_p}
x(t)e^{-j2\pi kF_0t}\,dt
}
$$

The integral may be taken over any complete period.

### Interpretation

- $c_0$ is the DC or average component.
- $c_k$ gives the complex amplitude of the $k$-th harmonic.
- The $k$-th harmonic has frequency $kF_0$.
- A continuous-time periodic signal can require infinitely many harmonic components.

The Fourier spectrum of a periodic signal is therefore a **line spectrum** at discrete harmonic frequencies.

---

## 14. Discrete-Time Fourier Series

Let $x[n]$ be periodic with fundamental period $N$:

$$
x[n+N]=x[n]
$$

Its fundamental normalized angular frequency is

$$
\omega_0=\frac{2\pi}{N}
$$

The harmonically related exponentials are

$$
s_k[n]
=
e^{j2\pi kn/N}
$$

Because

$$
s_{k+N}[n]=s_k[n],
$$

there are only $N$ distinct harmonics.

### DTFS synthesis equation

$$
\boxed{
x[n]
=
\sum_{k=0}^{N-1}
c_ke^{j2\pi kn/N}
}
$$

### DTFS analysis equation

$$
\boxed{
c_k
=
\frac{1}{N}
\sum_{n=0}^{N-1}
x[n]e^{-j2\pi kn/N}
}
$$

Both the signal and the coefficient sequence are periodic:

$$
x[n+N]=x[n]
$$

and

$$
c_{k+N}=c_k
$$

### Key difference from CTFS

- CTFS may contain infinitely many distinct harmonics.
- DTFS has only $N$ distinct frequency components for a period-$N$ sequence because discrete-time frequency is $2\pi$-periodic.

---

## 15. Parseval's Relation for Periodic Discrete-Time Signals

For a period-$N$ sequence,

$$
\boxed{
P_x
=
\frac{1}{N}
\sum_{n=0}^{N-1}|x[n]|^2
=
\sum_{k=0}^{N-1}|c_k|^2
}
$$

This says that the average signal power equals the sum of the powers of its frequency components.

The **power-density spectrum** for the DTFS representation is the sequence

$$
\boxed{|c_k|^2}
$$

The energy over one period is

$$
\boxed{
E_N
=
\sum_{n=0}^{N-1}|x[n]|^2
=
N\sum_{k=0}^{N-1}|c_k|^2
}
$$

---

# Part IV - Fourier Transforms of Aperiodic Signals

## 16. Continuous-Time Fourier Transform

For an aperiodic continuous-time signal, the deck uses frequency $F$ in hertz.

### CTFT analysis equation

$$
\boxed{
X(F)
=
\int_{-\infty}^{\infty}
x(t)e^{-j2\pi Ft}\,dt
}
$$

### CTFT synthesis equation

$$
\boxed{
x(t)
=
\int_{-\infty}^{\infty}
X(F)e^{j2\pi Ft}\,dF
}
$$

Unlike the line spectrum of a periodic signal, an aperiodic continuous-time signal normally has a continuous spectrum.

---

## 17. Discrete-Time Fourier Transform

For an aperiodic discrete-time sequence,

### DTFT analysis equation

$$
\boxed{
X(\omega)
=
\sum_{n=-\infty}^{\infty}
x[n]e^{-j\omega n}
}
$$

### Inverse DTFT

$$
\boxed{
x[n]
=
\frac{1}{2\pi}
\int_{-\pi}^{\pi}
X(\omega)e^{j\omega n}\,d\omega
}
$$

Any interval of length $2\pi$ may be used in the inverse integral.

The DTFT maps:

- a discrete sequence $x[n]$
- to a continuous function of frequency $X(\omega)$

Although the frequency variable is continuous, the spectrum is periodic.

---

## 18. DTFT Periodicity

$$
X(\omega+2\pi k)
=
\sum_{n=-\infty}^{\infty}
x[n]e^{-j(\omega+2\pi k)n}
$$

Since $e^{-j2\pi kn}=1$,

$$
\boxed{X(\omega+2\pi k)=X(\omega)}
$$

The DTFT always repeats every $2\pi$.

This is why it is sufficient to display or integrate over a single interval such as

$$
-\pi\le\omega\le\pi
$$

---

# Part V - DTFT Convergence

## 19. Absolute Summability

A sufficient condition for uniform DTFT convergence is

$$
\boxed{
\sum_{n=-\infty}^{\infty}|x[n]|<\infty
}
$$

Then

$$
|X(\omega)|
=
\left|
\sum_{n=-\infty}^{\infty}x[n]e^{-j\omega n}
\right|
\le
\sum_{n=-\infty}^{\infty}|x[n]|
<\infty
$$

Absolute summability guarantees that the DTFT exists as an ordinary bounded continuous function.

---

## 20. Finite-Energy Signals

Some sequences are not absolutely summable but have finite energy:

$$
\boxed{
E_x
=
\sum_{n=-\infty}^{\infty}|x[n]|^2<\infty
}
$$

Their Fourier transform may still be defined in a mean-square sense by considering finite-length approximations $X_N(\omega)$.

The approximation error can decrease as more time-domain samples are included.

---

## 21. Gibbs Phenomenon

When a Fourier approximation represents a spectrum with a jump discontinuity, oscillations appear near the discontinuity.

As the number of terms increases:

- the oscillations become concentrated closer to the discontinuity
- the approximation improves away from the jump
- the maximum overshoot does not completely disappear

This behavior is called the **Gibbs phenomenon**.

The deck illustrates it using an ideal rectangular lowpass spectrum and increasingly long approximations.

---

# Part VI - Magnitude, Phase, and Energy Spectra

## 22. Rectangular Spectrum and Sinc Sequence

Suppose one period of the DTFT is

$$
X(\omega)
=
\begin{cases}
1, & |\omega|\le\omega_c\\
0, & \omega_c<|\omega|\le\pi
\end{cases}
$$

Using the inverse DTFT,

$$
x[n]
=
\frac{1}{2\pi}
\int_{-\omega_c}^{\omega_c}
e^{j\omega n}\,d\omega
$$

For $n\ne0$,

$$
x[n]=\frac{\sin(\omega_cn)}{\pi n}
$$

At $n=0$,

$$
x[0]=\frac{\omega_c}{\pi}
$$

Thus,

$$
\boxed{
x[n]
=
\begin{cases}
 \dfrac{\omega_c}{\pi}, & n=0\\[6pt]
\dfrac{\sin(\omega_cn)}{\pi n}, & n\ne0
\end{cases}
}
$$

This is the impulse response of an ideal discrete-time lowpass filter.

It demonstrates a fundamental time-frequency tradeoff:

- a perfectly limited rectangular frequency response
- requires an infinitely long sinc-shaped time-domain sequence

---

## 23. Parseval's Relation for Aperiodic Discrete-Time Signals

For a finite-energy sequence,

$$
\boxed{
E_x
=
\sum_{n=-\infty}^{\infty}|x[n]|^2
=
\frac{1}{2\pi}
\int_{-\pi}^{\pi}|X(\omega)|^2\,d\omega
}
$$

Energy is preserved between the time and frequency domains.

---

## 24. Magnitude and Phase Spectrum

The DTFT is generally complex:

$$
X(\omega)=X_R(\omega)+jX_I(\omega)
$$

It can also be written in polar form:

$$
\boxed{
X(\omega)
=
|X(\omega)|e^{j\Theta(\omega)}
}
$$

where

$$
|X(\omega)|
=
\sqrt{X_R^2(\omega)+X_I^2(\omega)}
$$

and

$$
\Theta(\omega)
=
\angle X(\omega)
$$

The magnitude spectrum describes the strength of each frequency component.

The phase spectrum describes the phase shift associated with each component.

Both are required in general to reconstruct the original signal.

---

## 25. Energy-Density Spectrum

The energy-density spectrum is

$$
\boxed{
S_{xx}(\omega)=|X(\omega)|^2
}
$$

It describes how the signal's energy is distributed over frequency.

Parseval's relation can then be written as

$$
E_x
=
\frac{1}{2\pi}
\int_{-\pi}^{\pi}
S_{xx}(\omega)\,d\omega
$$

---

# Part VII - Important DTFT Examples

## 26. Causal Exponential

For

$$
x[n]=a^n u[n],
\qquad |a|<1,
$$

$$
X(\omega)
=
\sum_{n=0}^{\infty}a^ne^{-j\omega n}
$$

This is a geometric series:

$$
\boxed{
X(\omega)=\frac{1}{1-ae^{-j\omega}}
}
$$

### Spectral interpretation

- If $a>0$, the energy is concentrated near $\omega=0$, so the sequence behaves as a low-frequency signal.
- If $a<0$, the alternating sign shifts the energy concentration toward $\omega=\pm\pi$, producing high-frequency behavior.

For $a=\pm 0.5$, the deck shows:

- $a=0.5$: energy-density spectrum peaks at zero
- $a=-0.5$: energy-density spectrum peaks near $\pm\pi$

---

## 27. Finite Rectangular Pulse Starting at Zero

Let

$$
x[n]
=
\begin{cases}
A, & 0\le n\le L-1\\
0, & \text{otherwise}
\end{cases}
$$

Then

$$
X(\omega)
=
A\sum_{n=0}^{L-1}e^{-j\omega n}
$$

Using the finite geometric-series formula,

$$
X(\omega)
=
A\frac{1-e^{-j\omega L}}{1-e^{-j\omega}}
$$

A useful linear-phase form is

$$
\boxed{
X(\omega)
=
Ae^{-j\omega(L-1)/2}
\frac{\sin(L\omega/2)}
{\sin(\omega/2)}
}
$$

The magnitude is

$$
\boxed{
|X(\omega)|
=
|A|
\left|
\frac{\sin(L\omega/2)}
{\sin(\omega/2)}
\right|
}
$$

The time shift of the pulse creates the linear phase term

$$
-\frac{L-1}{2}\omega
$$

with additional phase jumps where the real sinc-like factor changes sign.

At $\omega=0$,

$$
X(0)=AL
$$

which equals the sum of all samples.

---

## 28. Symmetric Rectangular Pulse

Let

$$
x[n]
=
\begin{cases}
A, & |n|\le M\\
0, & |n|>M
\end{cases}
$$

The pulse has length $2M+1$ and is real and even.

Its DTFT is

$$
X(\omega)
=
A\sum_{n=-M}^{M}e^{-j\omega n}
$$

which simplifies to

$$
\boxed{
X(\omega)
=
A
\frac{\sin\left((M+\frac12)\omega\right)}
{\sin(\omega/2)}
}
$$

Because the sequence is real and even, $X(\omega)$ is also real and even.

Its magnitude is the absolute value of this function, while its phase is normally either $0$ or $\pi$, depending on the sign of $X(\omega)$.

---

## 29. Two-Sided Exponential

For

$$
x[n]=a^{|n|},
\qquad |a|<1,
$$

the sequence is real and even.

Its DTFT is

$$
\boxed{
X(\omega)
=
\frac{1-a^2}
{1-2a\cos\omega+a^2}
}
$$

The transform is real, even, nonnegative, and $2\pi$-periodic.

At $\omega=0$,

$$
X(0)
=
\frac{1+a}{1-a}
$$

For $a=0.8$, the spectrum is sharply concentrated near $\omega=0$, reflecting the slowly decaying, smooth time-domain sequence.

---

# Part VIII - Signals in the Frequency Domain

## 30. Low-Frequency, High-Frequency, and Bandpass Signals

A signal may be described according to where its power or energy spectrum is concentrated.

### Low-frequency or lowpass signal

Most energy is near

$$
\omega=0
$$

Such signals usually change slowly from sample to sample.

### High-frequency or highpass signal

Most energy is near

$$
\omega=\pm\pi
$$

Such signals often alternate rapidly between samples.

### Medium-frequency or bandpass signal

Most energy is concentrated around a nonzero frequency band away from both $0$ and $\pi$.

Such signals often exhibit oscillatory behavior with an intermediate frequency.

---

## 31. Bandwidth

The deck defines a practical percentage bandwidth.

If 90% of a signal's power or energy is concentrated in

$$
[F_1,F_2],
$$

then the 90% bandwidth is

$$
\boxed{
B_{90}=F_2-F_1
}
$$

A signal is **bandlimited** if its spectrum is exactly zero outside a finite frequency interval.

Many practical signals are not perfectly bandlimited, so percentage bandwidths such as the 90% bandwidth are used.

---

## 32. Example Signal Frequency Ranges

The deck gives examples showing that useful signal bands vary greatly across applications.

### Biological signals

| Signal | Approximate frequency range |
|---|---:|
| Electroretinogram | 0-20 Hz |
| Electronystagmogram | 0-20 Hz |
| Pneumogram | 0-40 Hz |
| Electrocardiogram (ECG) | 0-100 Hz |
| Electroencephalogram (EEG) | 0-100 Hz |
| Electromyogram | 10-200 Hz |
| Blood-pressure recording | 0-200 Hz |
| Speech | 100-4000 Hz |

### Seismic signals

| Signal | Approximate frequency range |
|---|---:|
| Wind noise | 100-1000 Hz |
| Seismic-exploration signals | 10-100 Hz |
| Earthquake and nuclear-explosion signals | 0.01-10 Hz |
| Seismic noise | 0.1-1 Hz |

### Electromagnetic signals

The electromagnetic spectrum spans many orders of magnitude:

- radio broadcasting: approximately $3\times10^4$ to $3\times10^6$ Hz
- shortwave radio: approximately $3\times10^6$ to $3\times10^{10}$ Hz
- microwave/radar/satellite communication: approximately $3\times10^8$ to $3\times10^{10}$ Hz
- infrared: approximately $3\times10^{11}$ to $3\times10^{14}$ Hz
- visible light: approximately $3.7\times10^{14}$ to $7.7\times10^{14}$ Hz
- ultraviolet: approximately $3\times10^{15}$ to $3\times10^{16}$ Hz
- X rays and gamma rays: approximately $3\times10^{17}$ to $3\times10^{18}$ Hz

These examples emphasize that the appropriate sampling rate and analysis scale depend on the application.

---

# Part IX - DTFT Symmetry

## 33. Conjugation and Reversal Identities

If

$$
x[n]\xleftrightarrow{\mathcal F}X(\omega),
$$

then

$$
\boxed{
x^*[n]\xleftrightarrow{\mathcal F}X^*(-\omega)
}
$$

and

$$
\boxed{
x^*[-n]\xleftrightarrow{\mathcal F}X^*(\omega)
}
$$

---

## 34. Conjugate-Even and Conjugate-Odd Decomposition

A complex signal may be decomposed as

$$
x_e[n]
=
\frac12
\left[
x[n]+x^*[-n]
\right]
$$

and

$$
x_o[n]
=
\frac12
\left[
x[n]-x^*[-n]
\right]
$$

where:

- $x_e[n]$ is conjugate-even
- $x_o[n]$ is conjugate-odd

These correspond to the real and imaginary parts of the transform:

$$
\boxed{
x_e[n]\xleftrightarrow{\mathcal F}X_R(\omega)
}
$$

and

$$
\boxed{
x_o[n]\xleftrightarrow{\mathcal F}jX_I(\omega)
}
$$

---

## 35. Symmetry for Real Signals

If $x[n]$ is real,

$$
\boxed{
X(\omega)=X^*(-\omega)
}
$$

This is called **conjugate symmetry**.

It implies:

$$
\boxed{
X_R(\omega)=X_R(-\omega)
}
$$

so the real part is even, and

$$
\boxed{
X_I(\omega)=-X_I(-\omega)
}
$$

so the imaginary part is odd.

It also implies:

$$
\boxed{
|X(\omega)|=|X(-\omega)|
}
$$

so magnitude is even, and

$$
\boxed{
\angle X(\omega)
=
-\angle X(-\omega)
}
$$

so phase is odd, apart from phase-wrapping and points where the magnitude is zero.

---

## 36. Real and Even Signals

If

$$
x[n]=x[-n]
$$

and $x[n]$ is real, then the DTFT is real and even:

$$
X_I(\omega)=0
$$

and

$$
X_R(\omega)
=
x[0]
+
2\sum_{n=1}^{\infty}x[n]\cos(\omega n)
$$

The inverse relation reduces to a cosine integral:

$$
\boxed{
x[n]
=
\frac{1}{\pi}
\int_0^\pi
X_R(\omega)\cos(\omega n)\,d\omega
}
$$

---

## 37. Real and Odd Signals

If

$$
x[-n]=-x[n]
$$

and $x[n]$ is real, then the DTFT is imaginary and odd:

$$
X_R(\omega)=0
$$

and

$$
X_I(\omega)
=
-2\sum_{n=1}^{\infty}x[n]\sin(\omega n)
$$

The inverse relation reduces to

$$
\boxed{
x[n]
=
-\frac{1}{\pi}
\int_0^\pi
X_I(\omega)\sin(\omega n)\,d\omega
}
$$

---

## 38. Useful Real-Signal Formulas

For any real sequence,

$$
\boxed{
X_R(\omega)
=
\sum_{n=-\infty}^{\infty}
x[n]\cos(\omega n)
}
$$

and

$$
\boxed{
X_I(\omega)
=
-\sum_{n=-\infty}^{\infty}
x[n]\sin(\omega n)
}
$$

The cosine term creates the even real part, while the sine term creates the odd imaginary part.

---

# Part X - DTFT Properties

Assume

$$
x[n]\xleftrightarrow{\mathcal F}X(\omega)
$$

and similarly for $x_1[n]$ and $x_2[n]$.

## 39. Linearity

$$
\boxed{
a_1x_1[n]+a_2x_2[n]
\xleftrightarrow{\mathcal F}
a_1X_1(\omega)+a_2X_2(\omega)
}
$$

---

## 40. Time Shifting

$$
\boxed{
x[n-k]
\xleftrightarrow{\mathcal F}
e^{-j\omega k}X(\omega)
}
$$

A time shift changes the phase but does not change the magnitude:

$$
|e^{-j\omega k}X(\omega)|=|X(\omega)|
$$

This is why a delayed pulse can have the same magnitude spectrum as a centered pulse but a different phase spectrum.

---

## 41. Time Reversal

$$
\boxed{
x[-n]
\xleftrightarrow{\mathcal F}
X(-\omega)
}
$$

---

## 42. Convolution

$$
\boxed{
x_1[n]*x_2[n]
\xleftrightarrow{\mathcal F}
X_1(\omega)X_2(\omega)
}
$$

Time-domain convolution becomes multiplication in frequency.

This is a central reason Fourier analysis is useful for LTI systems.

If

$$
y[n]=x[n]*h[n],
$$

then

$$
\boxed{
Y(\omega)=X(\omega)H(\omega)
}
$$

---

## 43. Correlation

Using the convention in the deck,

$$
r_{x_1x_2}[\ell]
=
x_1[\ell]*x_2[-\ell]
$$

and

$$
\boxed{
S_{x_1x_2}(\omega)
=
X_1(\omega)X_2(-\omega)
}
$$

If $x_2[n]$ is real,

$$
X_2(-\omega)=X_2^*(\omega)
$$

so

$$
\boxed{
S_{x_1x_2}(\omega)
=
X_1(\omega)X_2^*(\omega)
}
$$

---

## 44. Wiener-Khinchin Theorem

The autocorrelation

$$
r_{xx}[\ell]
$$

and power or energy spectrum form a Fourier-transform pair.

In particular,

$$
\boxed{
r_{xx}[\ell]
\xleftrightarrow{\mathcal F}
S_{xx}(\omega)
}
$$

For a finite-energy deterministic sequence,

$$
S_{xx}(\omega)=|X(\omega)|^2
$$

---

## 45. Frequency Shifting

$$
\boxed{
e^{j\omega_0n}x[n]
\xleftrightarrow{\mathcal F}
X(\omega-\omega_0)
}
$$

Multiplying by a complex exponential shifts the spectrum by $\omega_0$.

---

## 46. Modulation by a Cosine

Since

$$
\cos(\omega_0n)
=
\frac12e^{j\omega_0n}
+
\frac12e^{-j\omega_0n},
$$

$$
\boxed{
x[n]\cos(\omega_0n)
\xleftrightarrow{\mathcal F}
\frac12X(\omega-\omega_0)
+
\frac12X(\omega+\omega_0)
}
$$

Cosine modulation creates two shifted copies of the original spectrum.

---

## 47. Multiplication in Time

$$
\boxed{
x_1[n]x_2[n]
\xleftrightarrow{\mathcal F}
\frac{1}{2\pi}
\int_{-\pi}^{\pi}
X_1(\lambda)
X_2(\omega-\lambda)\,d\lambda
}
$$

Multiplication in time becomes periodic convolution in frequency.

---

## 48. Differentiation in Frequency

$$
\boxed{
nx[n]
\xleftrightarrow{\mathcal F}
j\frac{dX(\omega)}{d\omega}
}
$$

This property is useful for transforms involving a factor of $n$.

---

## 49. Conjugation

$$
\boxed{
x^*[n]
\xleftrightarrow{\mathcal F}
X^*(-\omega)
}
$$

---

## 50. Parseval's Theorem

For two sequences,

$$
\boxed{
\sum_{n=-\infty}^{\infty}
x_1[n]x_2^*[n]
=
\frac{1}{2\pi}
\int_{-\pi}^{\pi}
X_1(\omega)X_2^*(\omega)\,d\omega
}
$$

Setting $x_1=x_2=x$ gives the energy form.

---

# Part XI - Common DTFT Pairs

## 51. Unit Impulse

$$
\boxed{
\delta[n]
\xleftrightarrow{\mathcal F}
1
}
$$

The impulse contains all discrete-time frequencies equally.

---

## 52. Finite Symmetric Rectangular Pulse

$$
x[n]
=
\begin{cases}
A, & |n|\le L\\
0, & |n|>L
\end{cases}
$$

has

$$
\boxed{
X(\omega)
=
A
\frac{\sin\left((L+\frac12)\omega\right)}
{\sin(\omega/2)}
}
$$

---

## 53. Ideal Lowpass Spectrum

$$
X(\omega)
=
\begin{cases}
1, & |\omega|<\omega_c\\
0, & \omega_c\le|\omega|\le\pi
\end{cases}
$$

corresponds to

$$
\boxed{
x[n]
=
\begin{cases}
 \dfrac{\omega_c}{\pi}, & n=0\\[6pt]
\dfrac{\sin(\omega_cn)}{\pi n}, & n\ne0
\end{cases}
}
$$

---

## 54. Causal Exponential

$$
\boxed{
a^nu[n]
\xleftrightarrow{\mathcal F}
\frac{1}{1-ae^{-j\omega}},
\qquad |a|<1
}
$$

> **Deck typo note:** In the final transform-pair table, the zero-valued branch of this sequence should be interpreted as $n<0$, not $n>0$.

---

# Part XII - Connections to LTI Systems

## 55. Frequency Response

For an LTI system with impulse response $h[n]$,

$$
H(\omega)
=
\sum_{n=-\infty}^{\infty}
h[n]e^{-j\omega n}
$$

is the system's frequency response.

If the input has transform $X(\omega)$, then

$$
\boxed{
Y(\omega)=H(\omega)X(\omega)
}
$$

The output magnitude and phase are

$$
|Y(\omega)|
=
|H(\omega)||X(\omega)|
$$

and

$$
\angle Y(\omega)
=
\angle H(\omega)+\angle X(\omega)
$$

Thus:

- $|H(\omega)|$ controls how much each frequency is amplified or attenuated.
- $\angle H(\omega)$ controls the phase shift applied to each frequency.

---

## 56. Sinusoids as Eigenfunctions of LTI Systems

A complex exponential input

$$
x[n]=e^{j\omega_0n}
$$

produces an output

$$
y[n]
=
H(\omega_0)e^{j\omega_0n}
$$

The system does not change the input frequency. It changes only its amplitude and phase.

This is the key reason sinusoids and complex exponentials are natural building blocks for LTI-system analysis.

---

# Part XIII - Recommended Problem-Solving Workflows

## 57. Testing Whether a Discrete-Time Sinusoid Is Periodic

Given

$$
x[n]=A\cos(\omega_0n+\theta),
$$

1. Compute

   $$
   \frac{\omega_0}{2\pi}
   $$

2. Determine whether it is rational.
3. Write it in lowest terms:

   $$
   \frac{\omega_0}{2\pi}=\frac{k}{N}
   $$

4. The denominator $N$ is the fundamental period.

---

## 58. Converting Analog Frequency to Digital Frequency

Given $F$ and $F_s$,

$$
f=\frac{F}{F_s}
$$

and

$$
\omega=2\pi\frac{F}{F_s}
$$

If $\omega$ is outside $[-\pi,\pi]$, add or subtract integer multiples of $2\pi$ until it lies in the fundamental interval.

---

## 59. Checking for Aliasing

1. Identify the highest analog frequency $B$.
2. Compare the sampling rate with $2B$.
3. If

   $$
   F_s<2B,
   $$

   aliasing is possible.
4. Fold a frequency into the Nyquist interval using

   $$
   F_{\text{alias}}=F-kF_s
   $$

   for an integer $k$ chosen so that

   $$
   -\frac{F_s}{2}\le F_{\text{alias}}\le\frac{F_s}{2}
   $$

5. For a real cosine, use the equivalent positive frequency when appropriate because $\cos(-\omega n)=\cos(\omega n)$.

---

## 60. Finding a DTFS

For a period-$N$ signal:

1. Select one complete period.
2. Use

   $$
   c_k
   =
   \frac1N
   \sum_{n=0}^{N-1}
   x[n]e^{-j2\pi kn/N}
   $$

3. Compute $k=0,\ldots,N-1$.
4. Use symmetry when the signal is real or even.
5. Reconstruct using

   $$
   x[n]
   =
   \sum_{k=0}^{N-1}
   c_ke^{j2\pi kn/N}
   $$

---

## 61. Finding a DTFT

1. Start with

   $$
   X(\omega)
   =
   \sum_{n=-\infty}^{\infty}
   x[n]e^{-j\omega n}
   $$

2. Substitute the support limits.
3. Recognize geometric or finite geometric series.
4. Simplify into a magnitude-friendly or phase-friendly form.
5. Confirm $2\pi$-periodicity.
6. Apply symmetry checks.
7. Evaluate

   $$
   X(0)=\sum_nx[n]
   $$

   as a useful verification.

---

## 62. Finding an Inverse DTFT

Use

$$
x[n]
=
\frac{1}{2\pi}
\int_{-\pi}^{\pi}
X(\omega)e^{j\omega n}\,d\omega
$$

or:

1. identify a known transform pair
2. use linearity
3. use time or frequency shifting
4. use modulation
5. use symmetry
6. use convolution properties

---

## 63. Sketching Magnitude and Phase

1. Write

   $$
   X(\omega)=X_R(\omega)+jX_I(\omega)
   $$

2. Compute

   $$
   |X(\omega)|
   =
   \sqrt{X_R^2(\omega)+X_I^2(\omega)}
   $$

3. Compute the phase with the correct quadrant:

   $$
   \angle X(\omega)
   =
   \operatorname{atan2}(X_I,X_R)
   $$

4. Mark frequencies where $X(\omega)=0$; phase may be undefined there.
5. Account for phase wrapping between $-\pi$ and $\pi$.
6. Use expected symmetry:
   - real $x[n]$: even magnitude and odd phase
   - real-even $x[n]$: real-even transform
   - real-odd $x[n]$: imaginary-odd transform

---

# Part XIV - Common Mistakes

## 64. Confusing Analog and Digital Frequency

Do not mix:

- $F$: hertz
- $\Omega$: radians per second
- $f$: cycles per sample
- $\omega$: radians per sample

Use

$$
\Omega=2\pi F
$$

and

$$
\omega=2\pi f=2\pi\frac{F}{F_s}
$$

---

## 65. Assuming Every Discrete-Time Sinusoid Is Periodic

A discrete-time sinusoid is periodic only when

$$
\frac{\omega_0}{2\pi}
$$

is rational.

---

## 66. Treating Frequencies Separated by $2\pi$ as Different

For discrete-time signals,

$$
\omega,\ \omega+2\pi,\ \omega-2\pi
$$

represent the same frequency.

---

## 67. Confusing Nyquist Rate and Nyquist Frequency

- Nyquist rate for a signal: $2B$
- Nyquist frequency for a sampler: $F_s/2$

---

## 68. Ignoring Phase

Two signals can have identical magnitude spectra but different phase spectra and therefore different time-domain shapes or locations.

A time delay changes phase but not magnitude.

---

## 69. Forgetting DTFT Periodicity

Every DTFT is periodic with period $2\pi$, even when the time-domain sequence is aperiodic.

---

## 70. Forgetting the $1/(2\pi)$ in the Inverse DTFT

The correct inverse formula is

$$
x[n]
=
\frac{1}{2\pi}
\int_{-\pi}^{\pi}
X(\omega)e^{j\omega n}\,d\omega
$$

---

## 71. Confusing Power Signals and Energy Signals

- Periodic signals generally have finite average power but infinite total energy.
- Aperiodic decaying signals often have finite energy.
- DTFS power spectra use $|c_k|^2$.
- DTFT energy spectra use $|X(\omega)|^2$.

---

# Final Takeaways

- A sinusoid is characterized by amplitude, frequency, and phase.
- Continuous-time sinusoids of different frequencies are distinct.
- Discrete-time frequencies repeat every $2\pi$.
- A discrete-time sinusoid is periodic only when its normalized frequency is rational.
- Sampling maps analog frequency $F$ to digital frequency

  $$
  \omega=2\pi F/F_s
  $$

- Frequencies that differ by integer multiples of $F_s$ become aliases after sampling.
- A baseband signal with maximum frequency $B$ requires a sampling rate of at least $2B$ for ideal recovery.
- Fourier series describe periodic signals using discrete harmonics.
- Fourier transforms describe aperiodic signals using continuous spectra.
- The DTFT is continuous in $\omega$ and periodic with period $2\pi$.
- Parseval's relation equates time-domain energy or power with its frequency-domain representation.
- The magnitude spectrum describes component strengths; the phase spectrum describes their phase relationships.
- A rectangular frequency response corresponds to an infinite sinc sequence in time.
- A rectangular time-domain pulse produces a sinc-like periodic spectrum.
- Real signals have conjugate-symmetric spectra.
- Real-even signals have real-even spectra.
- Real-odd signals have imaginary-odd spectra.
- Convolution in time becomes multiplication in frequency.
- Multiplication in time becomes periodic convolution in frequency.
- Modulation shifts and duplicates spectra.
- An LTI system acts on each frequency through its frequency response $H(\omega)$.

---

## Reference Used in the Deck

Proakis, J. G., and Manolakis, D. G., *Digital Signal Processing: Principles, Algorithms, and Applications*, Pearson, 5th edition, 2022.
