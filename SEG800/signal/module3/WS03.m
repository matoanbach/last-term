%% SEG800 - Workshop 3 (WS03)
% Z-Transform, ROC, Pole-Zero Plots, and LTI System Analysis
%
% Notes:
% - DSP Student Package functions (impseq/stepseq/etc.) are assumed available.
% - This script is intended to be opened in MATLAB and saved as WS03.mlx,
%   then exported to WS03.pdf.

clear; close all; clc;

%% Learning Objectives
% - Evaluate z-transforms using definition/properties.
% - Determine regions of convergence (ROC).
% - Plot pole-zero patterns using MATLAB.

%% Part I: The Z-transform and its properties

%% [DSP-SM] P3.1
% P3.1 (a)
%   x(n) = (4/3)^n u(1-n)
%   X(z) = \sum_{n=-\infty}^{1} (4/3)^n z^{-n}
%        = (4/3) z^{-1} \sum_{m=0}^{\infty} ((3/4)z)^m
%        = (4/3) z^{-1} / (1-(3/4)z)
%        = -16/(3 z (3z-4))
%   ROC: |z| < 4/3
%
% P3.1 (b)
%   x(n) = 2^{-|n|} + (1/3)^{|n|}
%   X(z) = 1/(1-2^{-1}z^{-1}) - 1/(1-2z^{-1}) + 1/(1-(1/3)z^{-1}) - 1/(1-3z^{-1})
%   ROC: 0.5 < |z| < 2

% MATLAB verification (P3.1(a))
% Left-sided sequence: run filter "backward" by advancing one sample and simulating zX(z)
b = [4/3];
a = [1, -3/4];
delta = [1, zeros(1,7)];
x_check = filter(b,a,delta);

% MATLAB verification (P3.1(b))
% Two-sided sequence verification via construction can be done by generating x(n) directly.

%% [DSP-SM] P3.2
% P3.2 (a)
%   x(n)=(1/3)^n u(n-2) + (0.9)^{n-3} u(n)
%   X(z)= (1/9) z^{-2} / (1-(1/3)z^{-1}) + (1000/729) / (1-0.9 z^{-1})
%   Simplified:
%     X(z) = ((1000/729) - (1000/2187)z^{-1} + (1/9)z^{-2} - 0.1 z^{-3}) / (1 - (37/30)z^{-1} + 0.3 z^{-2})
%
% P3.2 (b)
%   x(n)=(1/2)^n cos(pi n/4 - pi/4) u(n-1)
%   Simplified:
%     X(z) = (0.5 z^{-1} - (1/(4\sqrt{2})) z^{-2}) / (1 - (1/\sqrt{2}) z^{-1} + 0.25 z^{-2}), ROC |z|>0.5

% MATLAB verification (P3.2(a))
b = [1000/729, -1000/2187, 1/9, -0.1];
a = [1, -37/30, 0.3];
delta = impseq(0,0,7);
xb1 = filter(b,a,delta);
n = 0:7;
xb2 = ((1/3).^n).*stepseq(2,0,7) + ((0.9).^(n-3)).*stepseq(0,0,7);
err32a = max(abs(xb1 - xb2))

% MATLAB verification (P3.2(b))
b = [0, 0.5, -1/(4*sqrt(2))];
a = [1, -1/sqrt(2), 0.25];
delta = impseq(0,0,7);
xb1 = filter(b,a,delta);
n = 0:7;
xb2 = ((1/2).^n).*cos(pi*n/4-pi/4).*stepseq(1,0,7);
err32b = max(abs(xb1 - xb2))

%% [DSP-SM] P3.3
% Given X(z)=1+2z^{-1}, |z|\neq 0
% (a) x2(n)=(1+n+n^2)x(n)
%     Use Z{n x(n)}=-z d/dz X(z) repeatedly
%     => X2(z)=1+6z^{-1}
% (b) x3(n)=(1/2)^n x(n-2)
%     Z{x(n-2)}=z^{-2}X(z)=z^{-2}+2z^{-3}
%     Multiply by (1/2)^n => substitute z->2z
%     => X3(z)=0.25 z^{-2} + 0.25 z^{-3}, ROC |z|>0

%% [DSP-SM] P3.4
% Given x(n)=(1/2)^n u(n) (equivalently 2^{-n}u(n))
% X1(z)=z X(z^{-1}) => x1(n)=x(-n-1)=2^{n+1} u(-n-1)

%% [DSP] P3.1 (Z-transform of given signals)
%
% a) x(n) = {3, 0, 0, 0, 0, 6, 1, -4} with n = 0 at the entry 6.
%    So: x(-5)=3, x(0)=6, x(1)=1, x(2)=-4.
%
%    x(n) = 3*delta(n+5) + 6*delta(n) + 1*delta(n-1) - 4*delta(n-2)
%    X(z) = 3*z^5 + 6 + z^{-1} - 4*z^{-2}
%
% b) x(n) = (1/2)^n for n >= 5, and 0 for n <= 4.
%    x(n) = (1/2)^n u(n-5)
%    X(z) = sum_{n=5..inf} (1/2)^n z^{-n} = (1/2)^5 z^{-5} / (1 - (1/2)z^{-1})
%    ROC: |z| > 1/2

% (a) Verify by direct sequence samples
n = -6:6;
xa = zeros(size(n));
xa(n==-5) = 3;
xa(n==0)  = 6;
xa(n==1)  = 1;
xa(n==2)  = -4;

% (b) Verify by direct sequence samples
xb = (0.5).^n .* stepseq(5, min(n), max(n));

figure('Name','[DSP] P3.1 Sequences');
subplot(2,1,1); stem(n,xa,'filled'); grid on; title('[DSP] P3.1(a) x(n)'); xlabel('n');
subplot(2,1,2); stem(n,xb,'filled'); grid on; title('[DSP] P3.1(b) x(n)'); xlabel('n');

%% [DSP] P3.2 (Z-transforms + pole-zero sketches)
% Determine X(z) and pole-zero patterns.
%
% a) x(n) = (1+n) u(n)
%    Z{u(n)} = 1/(1-z^{-1}), |z|>1
%    Z{n u(n)} = z^{-1}/(1-z^{-1})^2, |z|>1
%    X(z) = 1/(1-z^{-1}) + z^{-1}/(1-z^{-1})^2 = 1/(1-z^{-1})^2
%    Poles: double pole at z=1; zeros: none.

% e) x(n) = n a^n cos(omega0 n) u(n)
%    First: X0(z)=Z{a^n cos(omega0 n) u(n)}
%         = (1 - a cos(omega0) z^{-1}) / (1 - 2 a cos(omega0) z^{-1} + a^2 z^{-2}), |z|>|a|
%    Then: X(z)=Z{n x0(n)} = -z d/dz X0(z) (ROC unchanged).
%    Poles of X(z): double poles at z = a e^{+j omega0}, a e^{-j omega0}.
%    Closed form (in z^{-1}):
%      X(z) = \frac{a\cos(\omega_0)z^{-1} - 2a^2 z^{-2} + a^3\cos(\omega_0) z^{-3}}{\left(1 - 2a\cos(\omega_0)z^{-1} + a^2 z^{-2}\right)^2},\ \ \ |z|>|a|
%    Pole-zero sketch (general):
%      Poles: double poles at z = a e^{\pm j\omega_0}
%      Zeros: one zero at z=0; remaining zeros are roots of
%        \cos(\omega_0) z^2 - 2a z + a^2 \cos(\omega_0) = 0

% h) x(n) = (1/2)^n [u(n) - u(n-10)]
%    Finite-length right-sided sequence: sum_{n=0..9} (1/2)^n z^{-n}
%    X(z) = \sum_{n=0}^{9}(1/2)^n z^{-n} = (1 - (1/2)^{10} z^{-10}) / (1 - (1/2) z^{-1})
%    ROC (finite-length right-sided): all z except z=0. (The pole at z=1/2 in the closed form is removable.)

% (a) pole-zero plot for X(z)=1/(1-z^{-1})^2
b = 1;
a = [1 -2 1]; % (1 - z^{-1})^2
figure('Name','[DSP] P3.2(a) zplane');
zplane(b,a); grid on; title('[DSP] P3.2(a) X(z) = 1/(1-z^{-1})^2');

% (h) pole-zero plot for X(z) = sum_{n=0..9} (1/2)^n z^{-n}
bh = (0.5).^(0:9);
ah = 1;
figure('Name','[DSP] P3.2(h) zplane');
zplane(bh,ah); grid on; title('[DSP] P3.2(h) finite-length sequence');

% (e) pole locations are at z=a e^{\pm j\omega_0} (double poles). Zeros are given by the numerator.

%% [DSP] P3.3 (Z-transforms and ROC)
% Given signals:
%
% a) x1(n) = (1/3)^n for n >= 0, and (1/2)^{-n} for n < 0.
%    x1(n) = (1/3)^n u(n) + (1/2)^{-n} u(-n-1)
%    X1(z) = 1/(1 - (1/3)z^{-1}) + 1/( (1/2)z^{-1} - 1 )
%          = 1/(1 - (1/3)z^{-1}) - 1/(1 - 2 z^{-1})
%    ROC: 1/3 < |z| < 2
%
% b) x2(n) = (1/3)^n - 2^n for n >= 0, and 0 for n < 0
%    x2(n) = [(1/3)^n - 2^n] u(n)
%    X2(z) = 1/(1-(1/3)z^{-1}) - 1/(1-2z^{-1})
%    ROC: |z| > 2
%
% c) x3(n) = x1(n+4)  (advance by 4)
%    X3(z) = z^4 X1(z)
%    ROC unchanged: 1/3 < |z| < 2
%
% d) x4(n) = x1(-n) (time reversal)
%    X4(z) = X1(z^{-1})
%    ROC inverted: 1/2 < |z| < 3

% Quick numeric verification by generating samples and comparing with inverse-z via filter is not
% straightforward for two-sided sequences; verify by direct construction of the sequences.
n = -10:10;
x1 = (1/3).^n .* stepseq(0,min(n),max(n)) + (1/2).^(-n) .* (1-stepseq(0,min(n),max(n)));
x2 = ((1/3).^n - 2.^n) .* stepseq(0,min(n),max(n));
x3 = (1/3).^(n+4) .* stepseq(-4,min(n),max(n)) + (1/2).^(-(n+4)) .* (1-stepseq(-4,min(n),max(n)));
x4 = (1/3).^(-n) .* stepseq(0,min(n),max(n)) + (1/2).^(n) .* (1-stepseq(0,min(n),max(n)));

figure('Name','[DSP] P3.3 Sequences');
subplot(4,1,1); stem(n,x1,'filled'); grid on; title('[DSP] P3.3(a) x_1(n)');
subplot(4,1,2); stem(n,x2,'filled'); grid on; title('[DSP] P3.3(b) x_2(n)');
subplot(4,1,3); stem(n,x3,'filled'); grid on; title('[DSP] P3.3(c) x_3(n)=x_1(n+4)');
subplot(4,1,4); stem(n,x4,'filled'); grid on; title('[DSP] P3.3(d) x_4(n)=x_1(-n)');

%% Part II: The inverse z-transform

%% [DSP-SM] P3.5
% P3.5 (a)
%   Given X(z) = (1 - z^{-1} - 4z^{-2} + 4z^{-3}) / (1 - (11/4)z^{-1} + (13/8)z^{-2} - (1/4)z^{-3})
%   PFE (via residuez) gives:
%     X(z) = -16 + 0/(1-2z^{-1}) + 10/(1-0.5z^{-1}) + 27/(1-0.25z^{-1}), ROC 0.5<|z|<2
%   => x(n) = -16 delta(n) - 10(0.5)^n u(n) + 27(0.25)^n u(n)
%
% P3.5 (b)
%   Given X(z) = z/(z^3+2z^2+1.25z+0.25), |z|>1
%   PFE gives:
%     X(z)= 4/(1+z^{-1}) + 0/(1+0.5z^{-1}) - 4/(1+0.5z^{-1})^2
%   => x(n)=4(-1)^n u(n) + 8(n+1)(-0.5)^{n+1}u(n)

%% [DSP] P3.14 (Analytical solutions)
% Determine the causal x(n).
%
% a) X(z) = (1 + 3 z^{-1})/(1 + 3 z^{-1} + 2 z^{-2})
%    Factor: 1 + 3 z^{-1} + 2 z^{-2} = (1 + z^{-1})(1 + 2 z^{-1})
%    PFE:
%      (1+3z^{-1})/((1+z^{-1})(1+2z^{-1})) = A/(1+z^{-1}) + B/(1+2z^{-1})
%    Solve: A=-2, B=3
%    x(n) = -2(-1)^n u(n) + 3(-2)^n u(n)
%
% c) X(z) = (z^{-6}+z^{-7})/(1-z^{-1})
%    = z^{-6}(1+z^{-1})/(1-z^{-1})
%    For causal: 1/(1-z^{-1}) <-> u(n)
%    z^{-6} <-> shift by 6 samples.
%    So x(n) = u(n-6) + u(n-7)
%
% h) Use pole-zero plot in Fig. P3.14 with G=1/2.
%    Zeros: z = 0, -1/4, -1/2
%    Poles: z = 1/2, and z = (1/\sqrt{2})e^{\pm j\pi/4} = 1/2 \pm j/2
%    With G = 1/2:
%      X(z) = (1/2) * (z - 0)(z + 1/4)(z + 1/2) / ((z - 1/2)(z - (1/2+j/2))(z - (1/2-j/2)))
%          = (1/2) * z (z + 1/4)(z + 1/2) / ((z - 1/2)(z^2 - z + 1/2))
%    For causal x(n), choose ROC |z| > max{|p_k|} = 1/\sqrt{2}.
%    Then compute x(n) by PFE (use residuez on the z^{-1} rational form).

%% [DSP] P3.14 MATLAB checks (a,c,h)
% Part (a)
% X(z)= -2/(1+z^{-1}) + 3/(1+2z^{-1})
N = 20;
n = 0:N;
xa = -2*((-1).^n) + 3*((-2).^n);

% Part (c)
xc = stepseq(6,0,N) + stepseq(7,0,N);

% Part (h) PFE from pole-zero plot (G=1/2)
% X(z) in z^{-1} form:
%   X(z) = (-z^{-2} - 6 z^{-1} - 8) / (4 z^{-3} - 16 z^{-2} + 24 z^{-1} - 16)
bh = [-8, -6, -1];
ah = [-16, 24, -16, 4];
[Rh,ph,kh] = residuez(bh,ah);

% Build x_h(n) from residues/poles assuming causal ROC (right-sided)
% residuez gives terms Rh(k)/(1 - ph(k) z^{-1}) -> Rh(k)*ph(k)^n u(n)
% plus direct terms kh (polynomial in z^{-1}).
xh = zeros(size(n));
for k = 1:length(Rh)
    xh = xh + (Rh(k))*(ph(k)).^n;
end
% Add direct terms from k(z): kh(1) + kh(2) z^{-1} + ... -> kh(m) delta(n-(m-1))
for m = 1:length(kh)
    xh(n==(m-1)) = xh(n==(m-1)) + kh(m);
end

xh = real(xh); % small numerical imag parts may appear

figure('Name','[DSP] P3.14 sequences');
subplot(3,1,1); stem(n,xa,'filled'); grid on; title('[DSP] P3.14(a) x(n)');
subplot(3,1,2); stem(n,xc,'filled'); grid on; title('[DSP] P3.14(c) x(n)');
subplot(3,1,3); stem(n,xh,'filled'); grid on; title('[DSP] P3.14(h) x(n) from PFE');

%% Part III: Analysis of LTI Systems

%% [DSP-SM] P3.7
% P3.7 (a) h(n)=2(0.5)^n u(n)
%   H(z)=2/(1-0.5z^{-1}), ROC |z|>0.5
%   Difference eq: y(n)=2x(n)+0.5y(n-1)
%   For x(n)=(1/4)^n u(n): y(n)=4(0.5)^n u(n) - 2(0.25)^n u(n)
%
% P3.7 (b) h(n)=n[u(n)-u(n-10)]=[0,1,...,9]
%   H(z)=\sum_{k=1}^9 k z^{-k}
%   y(n)=\sum_{k=1}^9 k x(n-k)

%% [DSP-SM] P3.8
% Given zeros at z=\pm j and poles at -1/2 \pm j/2, with H(1)=0.8.
%   H(z)=K (z^2+1)/(z^2+z+0.5)
%   K from H(1)=0.8 => K=1
%   H(z)=(z^2+1)/(z^2+z+0.5), ROC |z|>1/sqrt(2)
%   Difference eq: y(n)+y(n-1)+0.5y(n-2)=x(n)+x(n-1)
%   For x(n)=(1/sqrt(2))sin(pi n/2)u(n): y_ss(n)=0 and y_tr(n)=sqrt(2)(1/sqrt(2))^n sin(0.75 pi n)u(n)

%% [DSP] P3.35 (Analytical solution)
% h) h(n) = (1/2)^n u(n), x(n)=(n+1)(1/4)^n u(n)
%
% H(z) = 1/(1 - 0.5 z^{-1}), |z|>0.5
% X(z) = 1/(1 - 0.25 z^{-1})^2, |z|>0.25
% Y(z) = H(z)X(z)
%      = 1/((1-0.5z^{-1})(1-0.25z^{-1})^2)
% Do PFE:
%   Y(z)= A/(1-0.5z^{-1}) + B/(1-0.25z^{-1}) + C/(1-0.25z^{-1})^2
% Solving gives A=4, B=-2, C=-1.
% Therefore:
%   y(n)=4(0.5)^n u(n) - 2(0.25)^n u(n) - (n+1)(0.25)^n u(n)
%       = 4(0.5)^n u(n) - (n+3)(0.25)^n u(n)

% MATLAB verification
N = 30;
n = 0:N;
[delta,~] = impseq(0,0,N);

% Closed form
y_closed = 4*(0.5).^n - (n+3).*(0.25).^n;

% Verify by simulating the LTI system H(z) driven by x(n)
x = (n+1).*(0.25).^n;
y_sim = filter(1,[1 -0.5], x);

err35 = max(abs(y_closed - y_sim))

figure('Name','[DSP] P3.35 y(n)');
stem(n,y_sim,'filled'); grid on; title('[DSP] P3.35 output y(n)'); xlabel('n');

% (y_sim matches y_closed up to numerical tolerance.)

%% [DSP] P3.37
% y(n)=0.7y(n-1)-0.12y(n-2)+x(n-1)+x(n-2), x(n)=n u(n)
%
% System function:
%   (1 - 0.7 z^{-1} + 0.12 z^{-2})Y(z) = (z^{-1}+z^{-2})X(z)
%   H(z)=Y/X = (z^{-1}+z^{-2})/(1 - 0.7 z^{-1} + 0.12 z^{-2})
% Poles are roots of 1 - 0.7 z^{-1} + 0.12 z^{-2} => z^2 - 0.7 z + 0.12 = 0
% Poles: 0.3 and 0.4 => stable (both inside unit circle)
%
% Input Z-transform: X(z)=Z{n u(n)} = z^{-1}/(1-z^{-1})^2
% Y(z)=H(z)X(z). Use residuez to get y(n), then compare to difference equation simulation.
%
% Closed form (from partial fractions in z^{-1}):
%   Y(z) = A/(1-0.3z^{-1}) + B/(1-0.4z^{-1}) + C/(1-z^{-1}) + D/(1-z^{-1})^2
%   with A=-1300/49, B=350/9, C=-7550/441, D=100/21
%   => y(n) = A(0.3)^n + B(0.4)^n + C + D(n+1), n>=0

% Build H(z) in z^{-1} form
bh = [0 1 1];      % z^{-1} + z^{-2}
ah = [1 -0.7 0.12];

% Build X(z) in z^{-1} form: z^{-1}/(1-z^{-1})^2 => b=[0 1], a=[1 -2 1]
bx = [0 1];
ax = [1 -2 1];

% Multiply to get Y(z)
by = conv(bh,bx);
ay = conv(ah,ax);

[Ry,py,ky] = residuez(by,ay);

% Simulate via difference equation (assume initial rest)
N = 40;
n = 0:N;
x = n; % n u(n)
y = filter(bh,ah,x);

% Closed form
y_closed = (-1300/49)*(0.3).^n + (350/9)*(0.4).^n + (-7550/441) + (100/21)*(n+1);
err37 = max(abs(y - y_closed))

figure('Name','[DSP] P3.37 response');
stem(n,y,'filled'); grid on; title('[DSP] P3.37 y(n) for x(n)=n u(n)'); xlabel('n');

%% Part IV: Group work
% We, ------------ (mention your names), declare that the attached assignment is our own work ...
%
% | # | Name | Task(s) |
% |---|------|---------|
% | 1 |      |         |
% | 2 |      |         |
% | 3 |      |         |
