# SEG800 Digital Signal and Image Processing  
## Comprehensive Summary: Frequency-Domain Analysis and Filter Design

**Source:** Seneca College, SEG800, *Filter Design* deck  
**Main lecture:** Slides 1-44  
**Supplemental appendix and exercise figures:** Slides 45-61

> The deck uses \(x(n)\) and \(y(n)\). This summary uses the equivalent notation \(x[n]\) and \(y[n]\).

---

# 1. Main Idea of the Deck

A discrete-time LTI system can be studied in two equivalent domains:

### Time domain

\[
y[n]=h[n]*x[n]
\]

where \(h[n]\) is the impulse response.

### Frequency domain

\[
Y(\omega)=H(\omega)X(\omega)
\]

where

\[
H(\omega)=\sum_{n=-\infty}^{\infty}h[n]e^{-j\omega n}
\]

is the system's **frequency response**.

The central filter-design idea is:

- frequencies near poles are emphasized
- frequencies near zeros are attenuated
- a zero directly on the unit circle forces an exact frequency null
- pole radius controls resonance sharpness
- pole and zero angles determine the frequencies they affect

The deck focuses mainly on direct pole-zero design and specialized filters:

- lowpass, highpass, and bandpass filters
- digital resonators
- notch filters
- comb filters
- reverberation filters
- all-pass filters
- digital sinusoidal oscillators

---

# Part I - Frequency-Domain Analysis of LTI Systems

## 2. Complex Exponentials Are Eigenfunctions of LTI Systems

For an LTI system,

\[
y[n]=\sum_{k=-\infty}^{\infty}h[k]x[n-k]
\]

Let the input be a complex exponential:

\[
x[n]=Ae^{j\omega n}
\]

Then

\[
\begin{aligned}
y[n]
&=
\sum_{k=-\infty}^{\infty}
h[k]Ae^{j\omega(n-k)}\\
&=
Ae^{j\omega n}
\sum_{k=-\infty}^{\infty}
h[k]e^{-j\omega k}
\end{aligned}
\]

Define

\[
\boxed{
H(\omega)
=
\sum_{k=-\infty}^{\infty}
h[k]e^{-j\omega k}
}
\]

Therefore,

\[
\boxed{
y[n]=AH(\omega)e^{j\omega n}
}
\]

The output has the same frequency as the input. The system changes only its complex amplitude.

### Eigenfunction

An eigenfunction is an input that passes through a system without changing shape, except for multiplication by a constant.

For an LTI system:

\[
\boxed{e^{j\omega n}\text{ is an eigenfunction}}
\]

### Eigenvalue

The associated eigenvalue is

\[
\boxed{H(\omega)}
\]

evaluated at the input frequency.

This is why complex exponentials are the natural building blocks for analyzing LTI systems.

---

## 3. Frequency Response in Polar Form

Write

\[
\boxed{
H(\omega)=|H(\omega)|e^{j\Theta(\omega)}
}
\]

where:

- \(H(\omega)\): frequency response
- \(|H(\omega)|\): magnitude response
- \(\Theta(\omega)=\angle H(\omega)\): phase response

### Magnitude response

\[
|H(\omega)|
\]

tells us how much the system amplifies or attenuates frequency \(\omega\).

### Phase response

\[
\Theta(\omega)
\]

tells us how much phase shift is applied at frequency \(\omega\).

---

## 4. Response to a Real Sinusoid

For

\[
x[n]=A\cos(\omega_0n+\phi),
\]

a real LTI system produces

\[
\boxed{
y[n]
=
A|H(\omega_0)|
\cos\left(
\omega_0n+\phi+\Theta(\omega_0)
\right)
}
\]

Similarly, for

\[
x[n]=A\sin(\omega_0n+\phi),
\]

\[
\boxed{
y[n]
=
A|H(\omega_0)|
\sin\left(
\omega_0n+\phi+\Theta(\omega_0)
\right)
}
\]

The output frequency remains \(\omega_0\).

The filter changes:

1. amplitude by \(|H(\omega_0)|\)
2. phase by \(\Theta(\omega_0)\)

---

## 5. Response to a Sum of Sinusoids

Suppose

\[
x[n]
=
\sum_{i=1}^{L}
A_i\cos(\omega_in+\phi_i)
\]

By linearity,

\[
\boxed{
y[n]
=
\sum_{i=1}^{L}
A_i|H(\omega_i)|
\cos\left(
\omega_in+\phi_i+\Theta(\omega_i)
\right)
}
\]

Each sinusoidal component is processed independently.

If

\[
H(\omega_i)=0,
\]

the component at \(\omega_i\) is completely removed.

This is the basis of frequency-selective filtering.

---

## 6. Time-Domain and Frequency-Domain Views

For an LTI system:

\[
\boxed{
y[n]=h[n]*x[n]
}
\]

and

\[
\boxed{
Y(\omega)=H(\omega)X(\omega)
}
\]

These are equivalent descriptions.

| Domain | Operation |
|---|---|
| Time | Convolution |
| Frequency | Multiplication |

Filter design is often easier in the frequency or z-domain because the desired amplification and suppression can be described directly.

---

# Part II - Frequency-Selective Filters

## 7. What a Filter Does

An LTI system acts as a filter when it changes the spectral content of a signal.

Applications listed in the deck include:

- noise removal
- communication-channel equalization
- radar and sonar signal detection
- spectral analysis
- removal of periodic interference
- enhancement of selected frequency bands

A filter normally divides frequency into:

- **passband:** frequencies preserved
- **stopband:** frequencies strongly attenuated
- **transition band:** region between passband and stopband

---

## 8. Ideal Filter Types

### 8.1 Ideal lowpass filter

Passes frequencies near

\[
\omega=0
\]

and rejects higher frequencies.

\[
|H(\omega)|
=
\begin{cases}
1, & |\omega|<\omega_c\\
0, & \omega_c<|\omega|\le\pi
\end{cases}
\]

---

### 8.2 Ideal highpass filter

Rejects frequencies near zero and passes frequencies near

\[
\omega=\pm\pi
\]

---

### 8.3 Ideal bandpass filter

Passes frequencies in a band centered around a nonzero frequency:

\[
\omega_1<|\omega|<\omega_2
\]

and rejects frequencies outside the band.

---

### 8.4 Ideal bandstop filter

Rejects a selected frequency band while passing frequencies below and above it.

A narrow bandstop filter is called a **notch filter**.

---

### 8.5 Ideal all-pass filter

Passes all frequencies with equal magnitude:

\[
\boxed{|H(\omega)|=1}
\]

but changes phase.

---

# Part III - Ideal Magnitude and Phase Behavior

## 9. Ideal Passband Form

A distortion-free ideal passband can be written as

\[
H(\omega)
=
\begin{cases}
Ce^{-j\omega n_0},
& \omega_1<\omega<\omega_2\\
0,
& \text{otherwise}
\end{cases}
\]

Inside the passband:

\[
|H(\omega)|=|C|
\]

and

\[
\Theta(\omega)=-\omega n_0+\angle C
\]

For unity gain and real positive \(C\),

\[
\boxed{|H(\omega)|=1}
\]

and

\[
\boxed{\Theta(\omega)=-\omega n_0}
\]

The output is then a delayed version of the passband input, without waveform distortion.

---

## 10. Phase Delay

The phase-delay function is

\[
\boxed{
\tau_{pd}(\omega)
=
-\frac{\Theta(\omega)}{\omega}
}
\]

It describes the apparent delay of an individual sinusoidal component.

For

\[
\Theta(\omega)=-\omega n_0,
\]

\[
\boxed{\tau_{pd}(\omega)=n_0}
\]

---

## 11. Group Delay

The group delay, also called envelope delay, is

\[
\boxed{
\tau_g(\omega)
=
-\frac{d\Theta(\omega)}{d\omega}
}
\]

It describes the delay of a narrowband signal envelope or group of nearby frequencies.

For linear phase,

\[
\Theta(\omega)=-\omega n_0,
\]

\[
\boxed{\tau_g(\omega)=n_0}
\]

When group delay varies significantly across the passband, different frequency components are delayed by different amounts, causing phase distortion.

---

# Part IV - Why Ideal Filters Cannot Be Implemented Exactly

## 12. Unrealizability of Ideal Filters

An ideal lowpass frequency response is rectangular.

Its inverse DTFT is an infinite sinc sequence:

\[
h[n]
=
\begin{cases}
\dfrac{\omega_c}{\pi},
& n=0\\[6pt]
\dfrac{\sin(\omega_cn)}{\pi n},
& n\ne0
\end{cases}
\]

This impulse response is:

- infinitely long
- two-sided
- noncausal without an infinite shift
- not absolutely summable in the ideal case

Therefore, the ideal filter cannot be implemented exactly as a causal, stable, finite physical system.

Practical design approximates the ideal response.

The deck emphasizes approximation through direct placement of poles and zeros.

---

# Part V - z-Plane Interpretation of Frequency Response

## 13. Frequency Response as the z-Transform on the Unit Circle

The system function is

\[
H(z)
=
b_0
\frac{
\displaystyle\prod_{k=1}^{M}(1-z_kz^{-1})
}{
\displaystyle\prod_{k=1}^{N}(1-p_kz^{-1})
}
\]

The frequency response is obtained by evaluating on the unit circle:

\[
\boxed{z=e^{j\omega}}
\]

Therefore,

\[
\boxed{
H(\omega)=H(z)\big|_{z=e^{j\omega}}
}
\]

Equivalently,

\[
H(\omega)
=
b_0e^{j\omega(N-M)}
\frac{
\displaystyle\prod_{k=1}^{M}(e^{j\omega}-z_k)
}{
\displaystyle\prod_{k=1}^{N}(e^{j\omega}-p_k)
}
\]

Each frequency \(\omega\) corresponds to the point \(e^{j\omega}\) on the unit circle.

---

## 14. Geometric Magnitude Interpretation

For a point \(e^{j\omega}\) on the unit circle, measure:

- the distance from \(e^{j\omega}\) to every zero
- the distance from \(e^{j\omega}\) to every pole

Then

\[
\boxed{
|H(\omega)|
=
|b_0|
\frac{
\displaystyle\prod_k
|e^{j\omega}-z_k|
}{
\displaystyle\prod_k
|e^{j\omega}-p_k|
}
}
\]

### Effect of a zero

If the unit-circle point is close to a zero, the numerator distance becomes small:

\[
|H(\omega)|\downarrow
\]

A zero on the unit circle at angle \(\omega_0\) produces

\[
\boxed{|H(\omega_0)|=0}
\]

### Effect of a pole

If the unit-circle point is close to a pole, the denominator distance becomes small:

\[
|H(\omega)|\uparrow
\]

A pole directly on the unit circle produces an unbounded response at that angle and prevents BIBO stability for a causal system.

---

## 15. Geometric Phase Interpretation

The phase is the sum of zero-vector angles minus the sum of pole-vector angles:

\[
\boxed{
\angle H(\omega)
=
\angle b_0
+
(N-M)\omega
+
\sum_k\angle(e^{j\omega}-z_k)
-
\sum_k\angle(e^{j\omega}-p_k)
}
\]

Each zero adds phase.

Each pole subtracts phase.

Placing a pole and zero very close to one another approximately cancels both their magnitude and phase effects.

---

## 16. Basic Pole-Zero Design Rules

To emphasize a frequency:

- place a pole close to the unit circle at the corresponding angle

To suppress a frequency:

- place a zero close to or directly on the unit circle at that angle

To keep a causal rational filter stable:

\[
\boxed{\text{all uncancelled poles must lie inside the unit circle}}
\]

For real filter coefficients, complex poles and zeros must occur in conjugate pairs.

---

# Part VI - Simple Lowpass, Highpass, and Bandpass Filters

## 17. First-Order Lowpass Filter

A simple first-order lowpass system is

\[
H(z)=\frac{1}{1-az^{-1}},
\qquad 0<a<1
\]

It has a pole at

\[
z=a
\]

near the positive real axis, corresponding to

\[
\omega=0
\]

The magnitude response is

\[
\boxed{
|H(\omega)|
=
\frac{1}{
\sqrt{1+a^2-2a\cos\omega}
}
}
\]

The response is largest at \(\omega=0\).

For \(a=0.8\),

\[
|H(0)|=\frac{1}{1-0.8}=5
\]

which matches the strong low-frequency peak shown in the deck.

As \(a\) moves closer to 1:

- the low-frequency peak becomes stronger
- the response becomes narrower
- the impulse response decays more slowly

---

## 18. Unity-DC-Gain First-Order Lowpass

A normalized version is

\[
\boxed{
H_1(z)
=
\frac{1-a}{1-az^{-1}}
}
\]

At DC,

\[
H_1(1)=1
\]

so the filter has unity gain at \(\omega=0\).

Its difference equation is

\[
\boxed{
y[n]=ay[n-1]+(1-a)x[n]
}
\]

This is an exponentially weighted smoother.

---

## 19. Adding a Zero at \(\omega=\pi\)

The deck compares the single-pole lowpass with

\[
\boxed{
H_2(z)
=
\frac{1-a}{2}
\frac{1+z^{-1}}{1-az^{-1}}
}
\]

The factor

\[
1+z^{-1}
\]

creates a zero at

\[
z=-1=e^{j\pi}
\]

Therefore,

\[
H_2(\pi)=0
\]

The zero forces complete rejection at the highest discrete-time frequency while the pole near \(z=1\) preserves low frequencies.

This improves the lowpass behavior near \(\omega=\pi\).

---

## 20. Simple Highpass Filter

The deck gives

\[
\boxed{
H(z)
=
\frac{1-a}{2}
\frac{1-z^{-1}}{1+az^{-1}}
}
\]

with \(a=0.9\).

The numerator has a zero at

\[
z=1
\]

so

\[
H(0)=0
\]

and DC is removed.

The pole is near

\[
z=-1
\]

which emphasizes frequencies near \(\omega=\pi\).

The scaling makes the gain at \(\omega=\pi\) equal to 1.

---

## 21. Simple Bandpass Filter

The deck gives

\[
\boxed{
H(z)
=
0.15
\frac{1-z^{-2}}
{1+0.7z^{-2}}
}
\]

### Zeros

\[
1-z^{-2}=0
\]

gives

\[
z=\pm1
\]

Therefore, the filter has zeros at:

- \(\omega=0\)
- \(\omega=\pi\)

It suppresses both DC and the highest frequency.

### Poles

\[
1+0.7z^{-2}=0
\]

or

\[
z^2=-0.7
\]

so the poles are approximately

\[
z=\pm j\sqrt{0.7}
\]

Their angles are

\[
\pm\frac{\pi}{2}
\]

Therefore, the response peaks near

\[
\omega=\pm\frac{\pi}{2}
\]

which creates a bandpass response.

---

# Part VII - Digital Resonators

## 22. Purpose of a Resonator

A digital resonator strongly emphasizes a narrow frequency region around

\[
\omega=\pm\omega_0
\]

A standard second-order resonator has poles at

\[
\boxed{
p_{1,2}=re^{\pm j\omega_0}
}
\]

A standard system function matching this pole pattern is

\[
\boxed{
H_R(z)
=
\frac{b_0}
{
1-2r\cos\omega_0z^{-1}
+r^2z^{-2}
}
}
\]

The two apparent zeros at the origin in a pole-zero plot are trivial zeros arising when the expression is written using positive powers of \(z\).

---

## 23. Effect of Resonator Pole Angle

The pole angles determine the resonance frequency.

Poles at

\[
re^{\pm j\omega_0}
\]

create magnitude peaks near

\[
\boxed{\omega=\pm\omega_0}
\]

The deck illustrates a resonator with

\[
\omega_0=\frac{\pi}{3}
\]

so the peaks occur near \(\pm\pi/3\).

---

## 24. Effect of Resonator Pole Radius

The radius \(r\) controls resonance sharpness.

### Smaller \(r\)

- poles farther from the unit circle
- wider resonance
- faster decay in time
- smaller and broader group-delay peak

### \(r\) closer to 1

- poles closer to the unit circle
- narrower resonance
- higher selectivity or quality factor
- slower decay in time
- large group delay near resonance

The deck compares

\[
r=0.8
\]

and

\[
r=0.95
\]

The \(r=0.95\) resonator is much sharper.

---

## 25. Resonator with Zeros at DC and Nyquist

A bandpass resonator can add zeros at

\[
z=1
\quad\text{and}\quad
z=-1
\]

using the numerator

\[
1-z^{-2}
\]

A standard form is

\[
\boxed{
H_{BP}(z)
=
b_0
\frac{1-z^{-2}}
{
1-2r\cos\omega_0z^{-1}
+r^2z^{-2}
}
}
\]

This creates:

- zero response at \(\omega=0\)
- zero response at \(\omega=\pi\)
- peaks near \(\pm\omega_0\)

The poles determine the resonance, while the zeros cleanly suppress the band edges.

---

# Part VIII - Notch Filters

## 26. Purpose of a Notch Filter

A notch filter removes one selected sinusoidal frequency while leaving most other frequencies nearly unchanged.

Typical uses include removing:

- electrical hum
- mechanical vibration
- seasonal patterns
- a known interfering tone
- narrowband communication interference

For a real system, a notch at \(+\omega_0\) also requires a notch at \(-\omega_0\).

---

## 27. FIR Notch Filter

Place zeros directly on the unit circle:

\[
z_{1,2}=e^{\pm j\omega_0}
\]

The numerator is

\[
(z-e^{j\omega_0})(z-e^{-j\omega_0})
\]

which produces the causal FIR form

\[
\boxed{
H(z)
=
G
\left(
1-2\cos\omega_0z^{-1}+z^{-2}
\right)
}
\]

At

\[
\omega=\pm\omega_0,
\]

\[
\boxed{H(\omega)=0}
\]

The deck's example uses

\[
\omega_0=\frac{\pi}{4}
\]

or normalized frequency

\[
f_0=\frac{\omega_0}{2\pi}=\frac18
\]

The filter is a three-tap symmetric FIR filter and therefore has linear phase and constant group delay:

\[
\boxed{\tau_g=1\text{ sample}}
\]

except at the exact zeros where phase is undefined.

---

## 28. IIR Notch Filter

To make the notch narrow while keeping the response close to 1 elsewhere, add poles at the same angles but slightly inside the unit circle:

\[
p_{1,2}=re^{\pm j\omega_0}
\]

The system function is

\[
\boxed{
H(z)
=
b_0
\frac{
1-2\cos\omega_0z^{-1}+z^{-2}
}{
1-2r\cos\omega_0z^{-1}+r^2z^{-2}
}
}
\]

where \(0<r<1\).

### Role of the zeros

The zeros produce the exact null at

\[
\pm\omega_0
\]

### Role of the poles

The poles compensate for attenuation away from the null and control the notch width.

### Effect of increasing \(r\)

As \(r\to1\):

- the poles move closer to the zeros and unit circle
- the notch becomes narrower
- the transition around the notch becomes sharper
- phase changes become more abrupt
- group delay near the notch becomes much larger

The deck compares \(r=0.85\) and \(r=0.95\).

---

## 29. Seasonal-Component Removal

The deck applies a notch filter to daily minimum temperature data from Melbourne.

The original signal contains a strong yearly periodic component.

A notch is placed at the digital frequency corresponding to one cycle per year.

The filtered result removes the regular yearly variation, leaving shorter-term fluctuations and irregular components.

The example shows that notch filtering is not limited to audio; it can remove periodicity from general time-series data.

---

# Part IX - Comb Filters

## 30. Moving-Average Filter

The moving-average structure illustrated with \(M=5\) uses \(M+1\) equally weighted samples:

\[
\boxed{
H_{MA}(z)
=
\frac{1}{M+1}
\sum_{k=0}^{M}z^{-k}
}
\]

Using the geometric-series formula,

\[
\boxed{
H_{MA}(z)
=
\frac{
1-z^{-(M+1)}
}{
(M+1)(1-z^{-1})
}
}
\]

The factor at \(z=1\) cancels, leaving \(M\) zeros uniformly spaced around the unit circle.

For \(M=5\):

- six coefficients are averaged
- five nontrivial zeros appear on the unit circle
- the magnitude has a main lowpass lobe around \(\omega=0\)
- regularly spaced nulls occur across the spectrum

---

## 31. Comb Filter by Spacing the Taps

Replace each one-sample delay with an \(L\)-sample delay:

\[
\boxed{
H_C(z)
=
\frac{1}{M+1}
\sum_{k=0}^{M}z^{-kL}
}
\]

Equivalently,

\[
\boxed{
H_C(z)
=
\frac{
1-z^{-(M+1)L}
}{
(M+1)(1-z^{-L})
}
}
\]

This creates a repeated, comb-shaped magnitude response.

For the deck's example:

\[
M=5,
\qquad
L=3
\]

the taps occur at

\[
0,3,6,9,12,15
\]

and the spectrum has repeated passband peaks spaced by

\[
\boxed{\frac{2\pi}{L}}
\]

For \(L=3\), the main peaks occur at approximately

\[
0,\quad \pm\frac{2\pi}{3}
\]

The pole-zero plot shows many equally spaced zeros around the unit circle.

---

## 32. Comb-Filter Applications

Comb filters are useful when unwanted or desired components occur at regularly spaced frequencies.

Applications include:

- removal of periodic interference and harmonics
- separation of solar and lunar periodicities
- pitch and musical-signal processing
- echo and reverberation structures
- periodic-noise suppression

The electron-content example in the deck uses comb-like filters to separate solar and lunar spectral components.

---

# Part X - Reverberation Filters

## 33. Basic Reverberation Concept

Reverberation is created by adding delayed, decaying copies of a signal.

A simple echo train can be represented as

\[
h[n]
=
c
\sum_{m=0}^{\infty}
g^m
\delta[n-(m+1)L]
\]

where:

- \(L\) is the echo spacing in samples
- \(g\) is the feedback or decay factor
- \(c\) scales the first echo

The corresponding transfer function is

\[
\boxed{
H(z)
=
\frac{cz^{-L}}
{1-gz^{-L}}
}
\]

The impulse response contains echoes at

\[
L,\ 2L,\ 3L,\ldots
\]

with geometrically decreasing amplitudes.

---

## 34. Pole Pattern of a Basic Reverberator

The denominator

\[
1-gz^{-L}=0
\]

gives \(L\) poles equally spaced in angle.

Their radius controls decay.

The repeated frequency-response peaks occur because the feedback delay creates a periodic frequency structure.

A longer delay produces more closely spaced resonances.

---

## 35. General Feedback Reverberator in the Deck

The deck shows a delay-gain block \(rz^{-L}\) with a feedback filter \(G(z)\).

From the block diagram,

\[
Y(z)
=
rz^{-L}
\left[
X(z)+G(z)Y(z)
\right]
\]

Therefore,

\[
\boxed{
H(z)
=
\frac{Y(z)}{X(z)}
=
\frac{rz^{-L}}
{1-rz^{-L}G(z)}
}
\]

When

\[
G(z)=1,
\]

the system produces regularly spaced copies with the same spectral decay at all frequencies.

---

## 36. Lowpass Reverberator

Real rooms often absorb high frequencies more strongly than low frequencies.

To model this, place a lowpass filter in the feedback path:

\[
G(z)=\text{lowpass feedback filter}
\]

Each successive echo is then:

- weaker
- more spread in time
- lower in high-frequency content
- perceptually darker

The deck's lowpass reverberator shows that after each main delayed impulse, additional samples form a decaying tail.

Its frequency response has stronger low-frequency resonances than high-frequency resonances.

---

# Part XI - All-Pass Filters

## 37. Definition

An all-pass filter has

\[
\boxed{|H(\omega)|=1}
\]

for every \(\omega\).

It does not change the magnitude spectrum.

It changes only:

- phase
- phase delay
- group delay
- waveform timing

All-pass filters are useful for phase equalization and delay shaping.

---

## 38. First-Order All-Pass Filter

For real \(|a|<1\), a first-order all-pass filter can be written as

\[
\boxed{
H_{AP,1}(z)
=
\frac{a-z^{-1}}
{1-az^{-1}}
}
\]

It has:

- a pole at \(z=a\), inside the unit circle
- a zero at \(z=1/a\), outside the unit circle

The zero is the reciprocal of the pole.

On the unit circle, the numerator and denominator magnitudes are equal, so

\[
|H_{AP,1}(\omega)|=1
\]

---

## 39. Second-Order All-Pass Filter

The deck gives

\[
\boxed{
H_{AP,2}(z)
=
\frac{
r^2-2r\cos\omega_0z^{-1}+z^{-2}
}{
1-2r\cos\omega_0z^{-1}+r^2z^{-2}
}
}
\]

The poles are

\[
re^{\pm j\omega_0}
\]

and the zeros are

\[
\frac1r e^{\pm j\omega_0}
\]

Each zero is the reciprocal conjugate of a pole.

The deck's example uses

\[
r=0.9,
\qquad
\omega_0=\frac{\pi}{4}
\]

The magnitude remains exactly 1, but the phase changes rapidly around \(\pm\omega_0\).

The group delay peaks around those same frequencies.

---

## 40. Effect of All-Pass Pole Radius

As \(r\) approaches 1:

- poles move closer to the unit circle
- zeros move closer to the unit circle from outside
- the magnitude remains 1
- phase transition becomes sharper
- group-delay peak becomes larger and narrower

This allows all-pass filters to add substantial delay to selected frequency regions without changing spectral magnitude.

---

# Part XII - Digital Sinusoidal Oscillators

## 41. Second-Order Recursive Oscillator

A sinusoid satisfies the recurrence

\[
\sin((n+1)\omega_0)
=
2\cos\omega_0\sin(n\omega_0)
-
\sin((n-1)\omega_0)
\]

Therefore, a sinusoidal oscillator can use

\[
\boxed{
y[n]
=
2\cos\omega_0\,y[n-1]
-
y[n-2]
+
A\sin\omega_0\,\delta[n]
}
\]

The deck expresses the denominator coefficients as

\[
a_1=-2\cos\omega_0,
\qquad
a_2=1
\]

and produces

\[
\boxed{
y[n]=A\sin((n+1)\omega_0)
}
\]

for the causal sequence generated from the impulse initialization.

The poles are

\[
\boxed{e^{\pm j\omega_0}}
\]

directly on the unit circle.

---

## 42. Stability Meaning of an Oscillator

A pole pair on the unit circle produces a sustained sinusoid in ideal arithmetic.

The system is marginal rather than BIBO stable:

- it can sustain an oscillation
- it does not produce a decaying impulse response
- finite-precision arithmetic can slowly change amplitude or frequency
- pole radii slightly below 1 create decaying oscillations
- pole radii slightly above 1 create growing oscillations

---

## 43. Coupled-Form Oscillator

The deck also shows a coupled cosine-sine realization.

The state update is a rotation:

\[
\boxed{
\begin{bmatrix}
y_c[n]\\
y_s[n]
\end{bmatrix}
=
\begin{bmatrix}
\cos\omega_0 & -\sin\omega_0\\
\sin\omega_0 & \cos\omega_0
\end{bmatrix}
\begin{bmatrix}
y_c[n-1]\\
y_s[n-1]
\end{bmatrix}
}
\]

With initial conditions

\[
y_c[0]=1,
\qquad
y_s[0]=0,
\]

the outputs are

\[
\boxed{
y_c[n]=\cos(\omega_0n)
}
\]

and

\[
\boxed{
y_s[n]=\sin(\omega_0n)
}
\]

Each iteration rotates the state vector by \(\omega_0\).

---

# Part XIII - FIR and IIR Design Perspective

## 44. FIR Filters

An FIR filter has

\[
H(z)=\sum_{k=0}^{M}b_kz^{-k}
\]

and no nontrivial poles.

Advantages:

- always BIBO stable
- can achieve exact linear phase
- simple implementation
- no recursive feedback

Disadvantages:

- a sharp response may require many coefficients
- potentially greater computation and delay

Deck examples with FIR behavior include:

- the three-tap notch filter
- moving-average filters
- comb filters

---

## 45. IIR Filters

An IIR filter has a denominator:

\[
H(z)
=
\frac{
\sum_{k=0}^{M}b_kz^{-k}
}{
1+\sum_{k=1}^{N}a_kz^{-k}
}
\]

Advantages:

- sharp selectivity with fewer coefficients
- efficient resonators and narrow notches
- natural recursive realization

Disadvantages:

- stability must be checked
- phase is usually nonlinear
- feedback makes finite-precision behavior more sensitive

Deck examples include:

- first-order lowpass and highpass filters
- second-order bandpass filter
- digital resonator
- IIR notch filter
- reverberator
- all-pass filter

---

# Part XIV - Practical Pole-Zero Design Workflow

## 46. Step 1: Define Desired Frequency Behavior

Identify:

- frequencies to pass
- frequencies to attenuate
- exact interference frequencies
- acceptable bandwidth
- desired phase or delay behavior

---

## 47. Step 2: Place Zeros

Place zeros:

- at \(z=1\) to reject DC
- at \(z=-1\) to reject \(\omega=\pi\)
- at \(e^{\pm j\omega_0}\) to reject \(\pm\omega_0\)
- uniformly around the unit circle for comb-type nulls

Zeros directly on the unit circle create exact nulls.

---

## 48. Step 3: Place Poles

Place poles near desired passband frequencies.

For a resonant frequency \(\omega_0\), use

\[
p_{1,2}=re^{\pm j\omega_0}
\]

Choose

\[
r<1
\]

for causal stability.

Larger \(r\) gives a narrower, sharper peak.

---

## 49. Step 4: Choose the Gain

Select \(b_0\) so that the response has a desired normalization, such as:

\[
H(0)=1
\]

for a lowpass filter,

\[
H(\pi)=1
\]

for a highpass filter, or

\[
|H(\omega_0)|=1
\]

for a resonator or bandpass filter.

---

## 50. Step 5: Verify the Response

Check:

1. pole-zero plot
2. magnitude response
3. phase response
4. group delay
5. impulse response
6. stability
7. effect on representative input signals

---

# Part XV - Key Design Patterns to Memorize

| Desired behavior | Useful pole-zero placement |
|---|---|
| Reject DC | Zero at \(z=1\) |
| Reject Nyquist frequency | Zero at \(z=-1\) |
| Reject \(\omega_0\) | Zeros at \(e^{\pm j\omega_0}\) |
| Emphasize low frequencies | Pole near \(z=1\) |
| Emphasize high frequencies | Pole near \(z=-1\) |
| Emphasize \(\omega_0\) | Poles near \(e^{\pm j\omega_0}\) |
| Narrow notch | Unit-circle zeros plus nearby inside poles |
| Repeated spectral nulls | Uniformly spaced unit-circle zeros |
| Repeated resonances | Feedback delay |
| Change phase only | Reciprocal pole-zero all-pass pairs |
| Generate a sinusoid | Poles at \(e^{\pm j\omega_0}\) |

---

# Part XVI - Supplemental Appendix Slides

The main lecture ends with the summary and reference slides. The PDF also includes supplemental textbook figures concerning inverse systems, homomorphic processing, and practice problems.

## 51. Inverse Systems

If a direct system \(T\) is followed by its inverse \(T^{-1}\), the cascade should be the identity:

\[
T^{-1}\{T\{x[n]\}\}=x[n]
\]

In the transform domain,

\[
\boxed{
H^{-1}(z)=\frac{1}{H(z)}
}
\]

The poles of the inverse are the zeros of the original system.

The zeros of the inverse are the poles of the original system.

A stable causal inverse therefore requires the original zeros to be inside the unit circle.

Such a causal stable system is called **minimum phase**.

---

## 52. ROC and Invertibility

The appendix shows that the same rational expression can have different ROCs.

For example,

\[
H(z)=\frac{z}{z-\frac12}
\]

can represent:

- a causal sequence with \(|z|>\frac12\)
- an anticausal sequence with \(|z|<\frac12\)

The ROC changes the time-domain sidedness and phase behavior even when the algebraic expression is unchanged.

A mathematically valid inverse is not automatically causal and stable.

---

## 53. Cepstrum and Homomorphic Processing

If

\[
y[n]=x[n]*h[n],
\]

then

\[
Y(z)=X(z)H(z)
\]

Taking a complex logarithm converts multiplication into addition:

\[
\boxed{
\log Y(z)=\log X(z)+\log H(z)
}
\]

Taking an inverse z-transform gives the complex cepstrum:

\[
\boxed{
c_y[n]=c_x[n]+c_h[n]
}
\]

This is called homomorphic processing because convolution has been transformed into addition.

---

## 54. Cepstral Separation

If \(x[n]\) and \(h[n]\) occupy different cepstral regions, windows can separate them:

- a low-quefrency window for one component
- a high-quefrency window for the other component

The filtered cepstra are transformed back by:

1. z-transform
2. complex exponential
3. inverse z-transform

to estimate the original convolved components.

Applications include:

- deconvolution
- speech analysis
- source-filter separation
- echo detection
- spectral-envelope estimation

---

## 55. Final Exercise Figures

The last PDF pages contain figures for textbook problems rather than new lecture theory.

They provide practice with:

- reading delay-and-feedback block diagrams
- deriving transfer functions
- interpreting pole-zero plots
- recognizing repeated poles and zeros
- analyzing cascade and parallel systems
- inferring a filter from input and output spectra
- applying coefficient tables to signal-processing structures

---

# Part XVII - Common Mistakes

## 56. Confusing \(H(z)\) and \(H(\omega)\)

\[
H(z)
\]

is the system function over the z-plane.

\[
H(\omega)
\]

is the system function evaluated on the unit circle:

\[
H(\omega)=H(e^{j\omega})
\]

The frequency response exists only when the unit circle lies in the ROC.

---

## 57. Ignoring Pole Radius

The pole angle determines the affected frequency.

The pole radius determines:

- sharpness
- decay time
- bandwidth
- group delay
- stability margin

---

## 58. Placing a Pole on the Unit Circle in a Stable Filter

A causal BIBO-stable rational filter must have poles strictly inside the unit circle.

Poles on the unit circle are appropriate for ideal oscillators, but not for ordinary BIBO-stable filters.

---

## 59. Forgetting Conjugate Pairs

For real-valued coefficients, any complex pole or zero must have its complex conjugate.

A notch at \(+\omega_0\) therefore also produces a notch at \(-\omega_0\).

---

## 60. Treating All-Pass as “No Effect”

An all-pass filter does not change magnitude, but it can significantly change:

- phase
- waveform shape
- phase delay
- group delay

---

## 61. Assuming a Narrower Notch Has No Cost

Moving notch-filter poles closer to the unit circle narrows the notch, but also:

- increases ringing
- lengthens the impulse response
- increases group delay near the notch
- increases coefficient sensitivity

---

## 62. Forgetting Gain Normalization

Pole-zero locations determine the response shape, but a gain constant is still needed to set the desired passband amplitude.

---

# Final Takeaways

- Complex exponentials are eigenfunctions of LTI systems.
- \(H(\omega)\) tells how an LTI system changes each frequency.
- Magnitude controls amplification; phase controls phase shift.
- Convolution in time becomes multiplication in frequency.
- The frequency response is the z-transform evaluated on the unit circle.
- Zeros suppress nearby frequencies.
- A zero on the unit circle produces an exact null.
- Poles emphasize nearby frequencies.
- Pole angle controls resonance frequency.
- Pole radius controls selectivity and decay.
- A causal stable rational filter must have all poles inside the unit circle.
- Lowpass filters place poles near \(z=1\).
- Highpass filters use a zero at \(z=1\) and poles near \(z=-1\).
- Bandpass filters use complex pole pairs and zeros at unwanted bands.
- Resonators use poles near \(e^{\pm j\omega_0}\).
- Notch filters use zeros at \(e^{\pm j\omega_0}\).
- Nearby poles make a notch narrower.
- Comb filters create regularly spaced passbands and stopbands.
- Reverberators use delay and feedback to create decaying echoes.
- All-pass filters alter phase and group delay while keeping unit magnitude.
- Digital oscillators use unit-circle poles to generate sustained sinusoids.
- Exact ideal filters are unrealizable; practical filters approximate the desired response.

---

## Reference Used in the Deck

Proakis, J. G., and Manolakis, D. G., *Digital Signal Processing: Principles, Algorithms, and Applications*, Pearson, 5th edition, 2022.
