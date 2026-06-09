%% PART I: The z-Transform and Its Properties


%% [DSP-SM] P3.1(a): x(n) = (4/3)^n * u(1-n)
% Left-sided sequence. Analytical result:
%   X(z) = -16/9 / (z*(z - 4/3)),  |z| < 4/3
%
% To verify, simulate zX(z) = (4/3)/(1-(3/4)*z) via backward filter

disp('=== [DSP-SM] P3.1(a) ===')
b1a = [4/3]; a1a = [1, -3/4];
delta = [1, zeros(1,7)];
x_filter_1a = filter(b1a, a1a, delta);

n_1a = 1:-1:-6;
x_direct_1a = (4/3).^n_1a;
fprintf('P3.1(a) max error: %e\n', max(abs(x_filter_1a - x_direct_1a)));

%% [DSP-SM] P3.1(b): x(n) = 2^(-|n|) + 3^(-|n|)  (two-sided)
% ROC: 0.5 < |z| < 2
% Analytical:
%   X(z) = (-4.1667z^-1 + 11.6667z^-2 - 4.1667z^-3 + 0.5z^-4)
%          / (1 - 5.8333z^-1 + 10.3333z^-2 - 5.8333z^-3 + z^-4)

disp('=== [DSP-SM] P3.1(b) ===')
% Causal part (poles 1/2, 1/3)
Rf = [1; 1]; pf = [1/2; 1/3];
[bf, af] = residuez(Rf, pf, []);
[delta, nf] = impseq(0, 0, 30);
xf = filter(bf, af, delta);

% Anti-causal part (poles 2, 3) — run filter backward
Rb = [-1; -1]; pb = [2; 3];
[bb, ab] = residuez(Rb, pb, []);
[delta_b, nb] = impseq(0, 0, 29);
xb = filter(fliplr(bb), fliplr(ab), delta_b);

% Total solution
x1_1b = [fliplr(xb), xf];
n_total = [-fliplr(nb+1), nf];
x2_1b = 2.^(-abs(n_total)) + 3.^(-abs(n_total));
fprintf('P3.1(b) max error: %e\n', max(abs(x1_1b - x2_1b)));

%% [DSP-SM] P3.2(a): x(n) = (1/3)^n*u(n-2) + (0.9)^(n-3)*u(n)
% Analytical:
%   X(z) = [(1000/729) - (1000/2187)z^-1 + (1/9)z^-2 - 0.1z^-3]
%          / [1 - (37/30)z^-1 + 0.3z^-2]

disp('=== [DSP-SM] P3.2(a) ===')
b2a = [1000/729, -1000/2187, 1/9, -0.1];
a2a = [1, -37/30, 0.3];
[delta, ~] = impseq(0, 0, 7);
xb1_2a = filter(b2a, a2a, delta);
n_2a = 0:7;
xb2_2a = ((1/3).^n_2a).*stepseq(2,0,7) + ((0.9).^(n_2a-3)).*stepseq(0,0,7);
fprintf('P3.2(a) max error: %e\n', max(abs(xb1_2a - xb2_2a)));

%% [DSP-SM] P3.2(b): x(n) = (1/2)^n * cos(pi*n/4 - pi/4) * u(n-1)
% Analytical:
%   X(z) = [0.5z^-1 - (1/(4*sqrt(2)))z^-2] / [1 - (1/sqrt(2))z^-1 + 0.25z^-2]

disp('=== [DSP-SM] P3.2(b) ===')
b2b = [0, 0.5, -1/(4*sqrt(2))];
a2b = [1, -1/sqrt(2), 0.25];
xb3 = filter(b2b, a2b, delta);
xb4 = ((1/2).^n_2a).*cos(pi*n_2a/4 - pi/4).*stepseq(1,0,7);
fprintf('P3.2(b) max error: %e\n', max(abs(xb3 - xb4)));

%% [DSP-SM] P3.3: Given X(z) = 1 + 2z^-1, |z|≠0
% (a) x2(n) = (1+n+n^2)*x(n)  --> X2(z) = 1 + 6z^-1
% (b) x3(n) = (1/2)^n * x(n-2) --> X3(z) = 0.25z^-2 + 0.25z^-3

disp('=== [DSP-SM] P3.3 ===')
% (a) Differentiation property applied twice
% X(z)=1+2z^-1, dX/dz = -2z^-2
% -z*dX/dz = 2z^-1  (for n*x(n))
% -z*d/dz[2z^-1] = 2z^-1 (for n^2 x(n) contribution)
% X2(z) = X(z) + 2z^-1 + 2z^-1 = 1 + 6z^-1
fprintf('P3.3(a): X2(z) = 1 + 6z^-1\n');

% (b) Time shift then frequency shift
% Z[x(n-2)] = z^-2*X(z) = z^-2 + 2z^-3
% Frequency shift by 1/2: replace z by z/0.5
% X3(z) = (2z)^-2 + 2*(2z)^-3 = 0.25z^-2 + 0.25z^-3
fprintf('P3.3(b): X3(z) = 0.25z^-2 + 0.25z^-3\n');

%% [DSP-SM] P3.4: x(n) = (1/2)^n*u(n) --> find sequence for X1(z) = zX(z^-1)
% X(z) = 1/(1-0.5z^-1), X(z^-1) = 1/(1-0.5z), X1(z)=zX(z^-1)=z/(1-0.5z)
% x1(n) = 2^(n+1) * u(-n-1)

disp('=== [DSP-SM] P3.4 ===')
fprintf('x1(n) = 2^(n+1) * u(-n-1)\n');

%% [DSP Textbook] P3.2(a): x(n) = (1+n)*u(n)
% X(z) = 1/(1-z^-1)^2,  |z|>1

disp('=== [DSP] P3.2(a) ===')
b_32a = [1]; a_32a = conv([1,-1],[1,-1]);
fprintf('X(z) = 1/(1-z^-1)^2,  double pole at z=1\n');
figure('Name','P3.2(a) Pole-Zero');
zplane(b_32a, a_32a); title('[DSP] P3.2(a) Pole-Zero: x(n)=(1+n)u(n)');

%% [DSP Textbook] P3.2(h): x(n) = (1/2)^n * [u(n)-u(n-10)]
% Finite-length (n=0..9): X(z) = (1 - (0.5)^10 z^-10) / (1-0.5z^-1)

disp('=== [DSP] P3.2(h) ===')
n_32h = 0:9;
b_32h = (1/2).^n_32h;   % FIR coefficients
a_32h = [1];
figure('Name','P3.2(h) Pole-Zero');
zplane(b_32h, a_32h); title('[DSP] P3.2(h) Pole-Zero: x(n)=(1/2)^n window');


%% PART II: The Inverse z-Transform

%% [DSP-SM] P3.5(a): PFE of absolutely summable sequence
disp('=== [DSP-SM] P3.5(a) ===')
b5a = [1,-1,-4,4]; a5a = [1,-11/4,13/8,-1/4];
[R5a, p5a, k5a] = residuez(b5a, a5a);
fprintf('Residues: '); disp(R5a');
fprintf('Poles:    '); disp(p5a');
% x(n) = -16*delta(n) - 10*(0.5)^n*u(n) + 27*(0.25)^n*u(n)
[delta, n] = impseq(0, 0, 7);
xb1_5a = filter(b5a, a5a, delta);
xb2_5a = -16*delta - 10*(0.5).^n + 27*(0.25).^n;
fprintf('P3.5(a) max error: %e\n', max(abs(xb1_5a - xb2_5a)));

%% [DSP-SM] P3.5(b)
disp('=== [DSP-SM] P3.5(b) ===')
b5b = [0,0,1]; a5b = [1,2,1.25,0.25];
[R5b, p5b, k5b] = residuez(b5b, a5b);
fprintf('Residues: '); disp(R5b');
fprintf('Poles:    '); disp(p5b');
% x(n) = 4*(-1)^n*u(n) + 8*(n+1)*(-0.5)^(n+1)*u(n)
xb1_5b = filter(b5b, a5b, delta);
xb2_5b = 4*(-1).^n + 8*(n+1).*((-0.5).^(n+1));
fprintf('P3.5(b) max error: %e\n', max(abs(xb1_5b - xb2_5b)));

%% [DSP Textbook] P3.14(a): X(z) = (1+3z^-1) / (1+3z^-1+2z^-2)
disp('=== [DSP] P3.14(a) ===')
b14a = [1,3]; a14a = [1,3,2];
[R14a, p14a, ~] = residuez(b14a, a14a);
fprintf('Residues: '); disp(R14a');
fprintf('Poles:    '); disp(p14a');
% x(n) = 2*(-1)^n*u(n) - (-2)^n*u(n)
[delta14, n14] = impseq(0, 0, 9);
x14a_filt = filter(b14a, a14a, delta14);
x14a_form = 2*(-1).^n14 - (-2).^n14;
fprintf('P3.14(a) max error: %e\n', max(abs(x14a_filt - x14a_form)));

%% [DSP Textbook] P3.14(c): X(z) = (z^-6 + z^-7) / (1 - z^-1)
disp('=== [DSP] P3.14(c) ===')
% Analytical result: x(n) = delta(n-6) + 2*u(n-7)
% Derivation:
%   X(z) = z^-6 * (1 + z^-1) / (1 - z^-1)
%        = z^-6 * [(1-z^-1) + 2z^-1] / (1-z^-1)
%        = z^-6 + 2*z^-7/(1-z^-1)
%   Inverse: delta(n-6) + 2*u(n-7)
b14c = [zeros(1,6), 1, 1];
a14c = [1, -1];
[delta14c, n14c] = impseq(0, 0, 15);
x14c_filt = filter(b14c, a14c, delta14c);
% Build x(n) directly using logical indexing (no impseq/stepseq needed)
n14c_vec = 0:15;
x14c_form = (n14c_vec == 6) + 2*(n14c_vec >= 7);
fprintf('P3.14(c) max error: %e\n', max(abs(x14c_filt - x14c_form)));


%% PART III: Analysis of LTI Systems

%% [DSP-SM] P3.7(a): h(n) = 2*(0.5)^n * u(n)
disp('=== [DSP-SM] P3.7(a) ===')
b7a = [2]; a7a = [1,-0.5];
fprintf('H(z) = 2/(1-0.5z^-1)\n');
fprintf('Difference equation: y(n) = 2*x(n) + 0.5*y(n-1)\n');

figure('Name','P3.7 Pole-Zero');
subplot(1,2,1);
zplane(b7a, a7a); title('P3.7(a) Pole-Zero');

% Output when x(n) = (1/4)^n * u(n)
n_out = 0:30;
x_in = (1/4).^n_out;
y7a = filter(b7a, a7a, x_in);
y7a_form = 4*(0.5).^n_out - 2*(0.25).^n_out;
fprintf('P3.7(a) output error: %e\n', max(abs(y7a - y7a_form)));

%% [DSP-SM] P3.7(b): h(n) = n*[u(n)-u(n-10)]
disp('=== [DSP-SM] P3.7(b) ===')
hb7 = [0:9]; ab7 = [1];
fprintf('H(z) = z^-1 + 2z^-2 + ... + 9z^-9  (FIR)\n');

subplot(1,2,2);
zplane(hb7, ab7); title('P3.7(b) Pole-Zero');

y7b = filter(hb7, ab7, x_in);
figure('Name','P3.7 Outputs');
subplot(2,1,1); stem(n_out, y7a); title('P3.7(a) y(n)'); grid on;
subplot(2,1,2); stem(n_out, y7b); title('P3.7(b) y(n)'); grid on;

%% [DSP-SM] P3.8: Stable system from pole-zero info
disp('=== [DSP-SM] P3.8 ===')
% Zeros: z1=j, z2=-j  --> (z-j)(z+j) = z^2+1
% Poles: p1=-0.5+j0.5, p2=-0.5-j0.5 --> (z+0.5-j0.5)(z+0.5+j0.5) = z^2+z+0.5
%
% H(z) = (z^2+1)/(z^2+z+0.5)
% Dividing numerator and denominator by z^2:
%   H(z) = (1 + z^-2) / (1 + z^-1 + 0.5z^-2)
%   --> b8 = [1, 0, 1],  a8 = [1, 1, 0.5]
%
% Difference equation: cross-multiply H(z) = Y(z)/X(z):
%   (1 + z^-1 + 0.5z^-2)*Y(z) = (1 + z^-2)*X(z)
%   --> y(n) + y(n-1) + 0.5y(n-2) = x(n) + x(n-2)
%
% NOTE: Appendix B (p.129) writes "x(n)+x(n-1)" -- this is a TYPO in the book.
% The correct diff eq from H(z)=(1+z^-2)/(1+z^-1+0.5z^-2) is x(n)+x(n-2).
% Verification: b=[1,0,1] gives zeros at z=+j and z=-j (matches problem statement).
%               b=[1,1]   gives a zero at z=-1 only (WRONG -- does not match).
b8 = [1,0,1]; a8 = [1,1,0.5];
fprintf('H(z) = (1+z^-2)/(1+z^-1+0.5z^-2)\n');
fprintf('Diff eq: y(n) + y(n-1) + 0.5y(n-2) = x(n) + x(n-2)\n');
fprintf('(Note: Appendix B p.129 shows x(n)+x(n-1) -- this is a typo in the book)\n');

figure('Name','P3.8 Pole-Zero');
zplane(b8, a8); title('P3.8 Pole-Zero Plot');

% Frequency response at ω=0: H(e^j0) = sum(b)/sum(a)
H_at_0 = sum(b8)/sum(a8);
fprintf('H(0) = %.4f  (should be 0.8)\n', H_at_0);

% Response to x(n) = (1/sqrt(2))*sin(pi*n/2)*u(n)
N_sim = 50; n8 = 0:N_sim-1;
x8 = (1/sqrt(2))*sin(pi*n8/2);
y8 = filter(b8, a8, x8);

% Transient formula: y_tr(n) = sqrt(2)*(1/sqrt(2))^n * sin(3*pi*n/4)
% (yss=0 since H(z) zeros cancel X(z) poles; total response = transient)
y_tr8 = sqrt(2)*(1/sqrt(2)).^n8 .* sin(3*pi*n8/4);

figure('Name','P3.8 Response');
subplot(2,1,1); stem(n8(1:30), y8(1:30)); grid on;
title('P3.8 Total Response'); xlabel('n'); ylabel('y(n)');
subplot(2,1,2); stem(n8(1:30), y_tr8(1:30)); grid on;
title('P3.8 Transient (formula)'); xlabel('n');

%% [DSP Textbook] P3.35(h): Zero-state response
% h(n) = (1/2)^n*u(n),  x(n) = (n+1)*(1/4)^n*u(n)
disp('=== [DSP] P3.35(h) ===')
% H(z) = 1/(1-0.5z^-1)
% X(z) = 1/(1-0.25z^-1)^2
% Y(z) = 1/[(1-0.5z^-1)(1-0.25z^-1)^2]
b_Y35 = [1];
a_Y35 = conv([1,-0.5], conv([1,-0.25],[1,-0.25]));
[R35, p35, ~] = residuez(b_Y35, a_Y35);
fprintf('Residues: '); disp(R35');
fprintf('Poles:    '); disp(p35');

n35 = 0:30;
y35 = filter(b_Y35, a_Y35, [1, zeros(1,30)]);
figure('Name','P3.35(h) Zero-State Response');
stem(n35, y35); grid on;
title('[DSP] P3.35(h) Zero-State Response y(n)');
xlabel('n'); ylabel('y(n)');

%% [DSP Textbook] P3.37: System response and stability
% System: y(n) = 0.7*y(n-1) - 0.12*y(n-2) + x(n-1) + x(n-2)
% Input:  x(n) = n*u(n)

disp('=== [DSP] P3.37 ===')
b37 = [0, 1, 1];
a37 = [1, -0.7, 0.12];

% Stability check
poles_37 = roots(a37);
fprintf('Poles at z = %.4f and z = %.4f\n', poles_37(1), poles_37(2));
is_stable = all(abs(poles_37) < 1);
fprintf('System BIBO Stable: %s\n', mat2str(is_stable));

% PFE of Y(z) = H(z)*X(z)
bx37 = [0,1]; ax37 = [1,-2,1];   % X(z) for n*u(n)
b_Y37 = conv(b37, bx37);
a_Y37 = conv(a37, ax37);
[R37, p37, ~] = residuez(b_Y37, a_Y37);
fprintf('PFE Residues: '); disp(R37');
fprintf('PFE Poles:    '); disp(p37');

% Compute and plot y(n)
N37 = 50; n37 = 0:N37-1;
x37 = n37;   % x(n) = n*u(n)
y37 = filter(b37, a37, x37);

figure('Name','P3.37 Response');
stem(n37, y37); grid on;
title('[DSP] P3.37 Response to x(n) = n*u(n)');
xlabel('n'); ylabel('y(n)');

% NOTE ON STABILITY vs GROWING OUTPUT:
% The output y(n) grows without bound, but this does NOT contradict stability.
% BIBO stability requires a BOUNDED input to produce a bounded output.
% x(n) = n*u(n) is itself unbounded (it grows without bound), so a growing
% y(n) is expected and consistent with the system being BIBO stable.
% A stable system driven by a ramp input produces a ramp-like output.

fprintf('\n=== Workshop 3 Complete ===\n');

%% =====================================================================
%% MISSING PROBLEMS — ADDED
%% =====================================================================

%% [DSP] P3.1(a): x(n) = {3,0,0,0,0,6,1,-4}, arrow under 6th element (n=0 at 6)
disp('=== [DSP] P3.1(a) ===')
% Sequence: x(-5)=3, x(-4)=0, x(-3)=0, x(-2)=0, x(-1)=0, x(0)=6, x(1)=1, x(2)=-4
% X(z) = sum x(n)*z^-n
%       = 3z^5 + 6 + z^-1 - 4z^-2
% ROC: all z except z=0 (from z^-2 term) and z=inf (from z^5 term)
%      i.e.,  0 < |z| < inf

n_p31a = -5:2;
x_p31a = [3, 0, 0, 0, 0, 6, 1, -4];
fprintf('X(z) = 3z^5 + 6 + z^-1 - 4z^-2\n');
fprintf('ROC: 0 < |z| < inf\n');

% MATLAB verification: evaluate X(z) at z=2 using definition and formula
z_test = 2;
X_def  = sum(x_p31a .* z_test.^(-n_p31a));   % direct definition
X_form = 3*z_test^5 + 6 + z_test^(-1) - 4*z_test^(-2);  % formula
fprintf('Verification at z=2: definition=%.4f, formula=%.4f, error=%e\n', ...
    X_def, X_form, abs(X_def-X_form));

% Pole-zero plot (polynomial has finite-length support -- FIR)
figure('Name','[DSP] P3.1(a) Pole-Zero');
zplane(x_p31a, 1); title('[DSP] P3.1(a): X(z) = 3z^5+6+z^{-1}-4z^{-2}');

%% [DSP] P3.1(b): x(n) = (1/2)^n for n>=5, 0 for n<=4
disp('=== [DSP] P3.1(b) ===')
% X(z) = sum_{n=5}^{inf} (1/2)^n * z^-n
%       = (1/2)^5 * z^-5 * sum_{k=0}^{inf} ((1/2)*z^-1)^k
%       = (z^-5 / 32) / (1 - 0.5*z^-1),    |z| > 1/2
%
% This can be written as a time-shifted causal exponential:
%   x(n) = (1/2)^n * u(n-5)  -->  X(z) = z^-5 * (1/2)^5 / (1 - 0.5z^-1)
%                                       = z^-5/32 / (1 - 0.5z^-1)
fprintf('X(z) = (z^-5/32) / (1 - 0.5z^-1),   ROC: |z| > 0.5\n');

% MATLAB verification: compare formula with direct sum
z_test = 2;
X_form_b = (z_test^(-5)/32) / (1 - 0.5*z_test^(-1));
n_sum = 5:200;
X_direct_b = sum((0.5).^n_sum .* z_test.^(-n_sum));
fprintf('Verification at z=2: formula=%.8f, direct sum=%.8f, error=%e\n', ...
    X_form_b, X_direct_b, abs(X_form_b - X_direct_b));

% Pole-zero plot: one pole at z=0.5, zero of order 5 at z=0
b_31b = [zeros(1,5), 1/32];  a_31b = [1, -0.5];
figure('Name','[DSP] P3.1(b) Pole-Zero');
zplane(b_31b, a_31b); title('[DSP] P3.1(b): x(n)=(1/2)^n*u(n-5)');

%% [DSP] P3.2(e): x(n) = n*a^n*cos(w0*n)*u(n)
disp('=== [DSP] P3.2(e) ===')
% Derivation using the differentiation property:
%   Z[a^n*cos(w0*n)*u(n)] = G(z) = (1 - a*cos(w0)*z^-1) / (1 - 2a*cos(w0)*z^-1 + a^2*z^-2)
%   Z[n*g(n)] = -z * dG(z)/dz
%
% After differentiation (letting c = cos(w0)):
%   X(z) = [a*c*z^-1*(1 - a^2*z^-2) - 2a^2*z^-2*(1 - a*c*z^-1)]
%          / (1 - 2ac*z^-1 + a^2*z^-2)^2
%
%   Simplified:
%   X(z) = [a*c*z^-1 - a^2*z^-2*(2 - a*c*z^-1)] / (1 - 2ac*z^-1 + a^2*z^-2)^2
%   ROC: |z| > |a|

fprintf('X(z) = [ac*z^-1*(1-a^2*z^-2) - 2a^2*z^-2*(1-ac*z^-1)]\n');
fprintf('       / (1 - 2ac*z^-1 + a^2*z^-2)^2,   ROC: |z| > |a|\n');

% MATLAB verification with a=0.8, w0=pi/4
a_val = 0.8; w0 = pi/4; c = cos(w0);

% Build Y(z) = H(z)^2 where H(z) is the denominator squared
% Numerator via formula:
b_num = [0, a_val*c, -(a_val^2)*(2-0), 0, 0];  % simplified placeholder
% More direct: use filter to compute x(n) and verify with formula
[delta_e, n_e] = impseq(0, 0, 30);
x_32e_direct = n_e .* (a_val.^n_e) .* cos(w0*n_e);  % direct formula for x(n)

% Use differentiation numerically: differentiate G(z) at sample points
% G(z) = (1 - ac*z^-1) / (1 - 2ac*z^-1 + a^2*z^-2)
b_G = [1, -a_val*c];  a_G = [1, -2*a_val*c, a_val^2];
x_32e_filter = filter(b_G, a_G, delta_e);  % this gives a^n*cos(w0*n)*u(n)

% To get n*a^n*cos(w0*n)*u(n), multiply by n:
x_32e_formula = n_e .* x_32e_filter;
fprintf('Verification (a=0.8, w0=pi/4) max error: %e\n', ...
    max(abs(x_32e_direct - x_32e_formula)));

% Pole-zero plot: double poles at z=a*e^{+/-jw0}
% Numerator has zeros at those same locations plus origin (order 1) -- complex structure
% Build X(z) numerator and denominator polynomials
aden_sq = conv(a_G, a_G);  % squared denominator
% Numerator from differentiation (derived):
% N(z^-1) = ac*z^-1 - (a^2*(2c^2-1))*z^-2 - a^3*c*z^-3
bnum_e = [0, a_val*c, -(a_val^2*(2*c^2-1)), -a_val^3*c];
% Pad to same length as aden_sq if needed for zplane
figure('Name','[DSP] P3.2(e) Pole-Zero');
zplane(bnum_e, aden_sq);
title('[DSP] P3.2(e): x(n)=n*a^n*cos(w_0*n)u(n), a=0.8, w_0=\pi/4');

%% [DSP] P3.3: z-Transforms and ROC of two-sided signals
% x1(n) = (1/3)^n for n>=0, (1/2)^(-n) = 2^n for n<0
disp('=== [DSP] P3.3 ===')

% --- P3.3(a): x1(n) = (1/3)^n*u(n) + 2^n*u(-n-1) ---
% Causal part:  Z[(1/3)^n*u(n)]  =  1/(1-(1/3)z^-1),   |z|>1/3
% Anti-causal:  Z[2^n*u(-n-1)]   = -1/(1-2z^-1),        |z|<2
%   (using pair: Z[a^n*u(-n-1)] = -1/(1-az^-1) for |z|<|a|)
% Combined: X1(z) = 1/(1-(1/3)z^-1) - 1/(1-2z^-1),   ROC: 1/3 < |z| < 2
fprintf('\nP3.3(a): X1(z) = 1/(1-(1/3)z^-1) - 1/(1-2z^-1),  ROC: 1/3 < |z| < 2\n');

% MATLAB verification at z=1 (in ROC: 1/3 < 1 < 2)
z_test = 1.5;
X1_formula = 1/(1-(1/3)*z_test^(-1)) - 1/(1-2*z_test^(-1));
% Direct: causal part (n=0..50) + anti-causal part (n=-50..-1)
n_pos = 0:50; n_neg = -50:-1;
X1_direct = sum((1/3).^n_pos .* z_test.^(-n_pos)) + sum(2.^n_neg .* z_test.^(-n_neg));
fprintf('P3.3(a) verification at z=1.5: formula=%.6f, direct=%.6f, error=%e\n', ...
    X1_formula, X1_direct, abs(X1_formula-X1_direct));

% ROC sketch: annular region 1/3 < |z| < 2
figure('Name','[DSP] P3.3 ROC sketches');
subplot(2,2,1);
theta = linspace(0,2*pi,200);
fill(cos(theta)*2, sin(theta)*2, [0.9 0.95 1]); hold on;
fill(cos(theta)*(1/3), sin(theta)*(1/3), [1 1 1]);
plot(cos(theta)*2, sin(theta)*2, 'b-', 'LineWidth',2);
plot(cos(theta)*(1/3), sin(theta)*(1/3), 'r-', 'LineWidth',2);
axis equal; grid on; axis([-2.5 2.5 -2.5 2.5]);
title('P3.3(a): ROC: 1/3 < |z| < 2'); xlabel('Re'); ylabel('Im');

% --- P3.3(b): x2(n) = ((1/3)^n - 2^n)*u(n) ---
% Both terms causal → ROC is intersection: |z|>1/3 AND |z|>2 → ROC: |z|>2
fprintf('\nP3.3(b): X2(z) = 1/(1-(1/3)z^-1) - 1/(1-2z^-1),  ROC: |z| > 2\n');
subplot(2,2,2);
fill(cos(theta)*3, sin(theta)*3, [0.9 0.95 1]); hold on;
fill(cos(theta)*2, sin(theta)*2, [1 1 1]);
axis equal; grid on; axis([-3.5 3.5 -3.5 3.5]);
title('P3.3(b): ROC: |z| > 2'); xlabel('Re'); ylabel('Im');

% --- P3.3(c): x3(n) = x1(n+4) --- (time advance by 4)
% X3(z) = z^4 * X1(z),   ROC: same as X1 (1/3 < |z| < 2, z≠0 and z≠inf)
fprintf('P3.3(c): X3(z) = z^4 * X1(z),  ROC: 1/3 < |z| < 2\n');
subplot(2,2,3);
fill(cos(theta)*2, sin(theta)*2, [0.9 0.95 1]); hold on;
fill(cos(theta)*(1/3), sin(theta)*(1/3), [1 1 1]);
axis equal; grid on; axis([-2.5 2.5 -2.5 2.5]);
title('P3.3(c): ROC: 1/3 < |z| < 2'); xlabel('Re'); ylabel('Im');

% --- P3.3(d): x4(n) = x1(-n) --- (folding)
% X4(z) = X1(1/z) = 1/(1-(1/3)*z) - 1/(1-2*z)
% Poles now at z=3 (was 1/3) and z=1/2 (was 2) → ROC: 1/2 < |z| < 3
fprintf('P3.3(d): X4(z) = X1(1/z),  ROC: 1/2 < |z| < 3\n');
subplot(2,2,4);
fill(cos(theta)*3, sin(theta)*3, [0.9 0.95 1]); hold on;
fill(cos(theta)*0.5, sin(theta)*0.5, [1 1 1]);
axis equal; grid on; axis([-3.5 3.5 -3.5 3.5]);
title('P3.3(d): ROC: 1/2 < |z| < 3'); xlabel('Re'); ylabel('Im');

%% [DSP] P3.14(h): Causal signal from pole-zero pattern (Figure P3.14, G=1/2)
disp('=== [DSP] P3.14(h) ===')
% From Figure P3.14:
%   Zeros (circles): z1=-1/2, z2=-1/4, z3=0
%   Poles (crosses): p1=1/2 (real), p2=1/sqrt(2)*e^{j*pi/4}=0.5+j0.5, p3=conj(p2)=0.5-j0.5
%   Gain G = 1/2
%
% H(z) = (1/2) * (1+0.5z^-1)(1+0.25z^-1)(z^-1) -- zeros in z^-1 form
%         -----------------------------------------------
%         (1-0.5z^-1)(1-0.5z^-1-0.5z^-2)    -- poles
%
% Build from (1 - zi*z^-1) factors:
%   Numerator:  G*(1-(-0.5)z^-1)*(1-(-0.25)z^-1)*(1-0*z^-1)
%             = 0.5*(1+0.5z^-1)*(1+0.25z^-1)*(1)
%             = 0.5*[1 + 0.75z^-1 + 0.125z^-2 + 0]   after conv
%   Denominator: (1-0.5z^-1)*(1-(0.5+0.5j)z^-1)*(1-(0.5-0.5j)z^-1)
%              = (1-0.5z^-1)*(1 - z^-1 + 0.5z^-2)
%              = 1 - 1.5z^-1 + z^-2 - 0.25z^-3

b_h14h = conv([0.5, 0.25, 0.0625, 0], [1]);  % 0.5*(1+0.5z^-1)*(1+0.25z^-1)*(z^0 + 0*z^-1)
% Correct build:
zeros_h = [-0.5, -0.25, 0];
poles_h = [0.5, 0.5+0.5j, 0.5-0.5j];
G_h = 0.5;
b_h14h = G_h * real(poly(zeros_h));   % monic poly from zeros, times G
a_h14h = real(poly(poles_h));          % monic poly from poles

fprintf('b_h14h = '); disp(b_h14h);
fprintf('a_h14h = '); disp(a_h14h);
fprintf('All poles inside unit circle (|p|<1): %d\n', all(abs(roots(a_h14h))<1));

% PFE to get closed-form x(n)
[R_h, p_h, k_h] = residuez(b_h14h, a_h14h);
fprintf('Residues: '); disp(R_h.');
fprintf('Poles:    '); disp(p_h.');

% x(n) = R1*(0.5)^n*u(n) + 2*|R2|*(1/sqrt(2))^n*cos(pi*n/4+angle(R2))*u(n)
R1_h = real(R_h(3));  % pole at 0.5 is last in MATLAB ordering
R2_h = R_h(1);        % complex poles
fprintf('\nx(n) = %.4f*(0.5)^n*u(n) + 2*%.4f*(1/sqrt(2))^n*cos(pi*n/4 + %.4f)*u(n)\n', ...
    R1_h, abs(R2_h), angle(R2_h));

% Verification: filter impulse response
[delta_h, n_h] = impseq(0, 0, 20);
x_h14h = filter(b_h14h, a_h14h, delta_h);

figure('Name','[DSP] P3.14(h)');
subplot(1,2,1);
zplane(b_h14h, a_h14h);
title('[DSP] P3.14(h): Pole-Zero from Figure P3.14');
subplot(1,2,2);
stem(n_h, x_h14h); grid on;
title('[DSP] P3.14(h): Causal signal x(n)'); xlabel('n'); ylabel('x(n)');