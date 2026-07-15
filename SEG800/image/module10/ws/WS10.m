%% SEG800 - Workshop 10
% One-file MATLAB script version.
%
% How to use:
% 1. Put rose512.tif, testpattern512.tif, and blurry-moon.tif in this folder.
% 2. Open this file in MATLAB.
% 3. Run each section and verify the figures/output.
% 4. Save or convert to WS10.mlx if your submission requires a live script.
% 5. Export the live script to WS10.pdf.
%
% Group declaration:
% We, ------------ (mention your names), declare that the attached assignment
% is our own work in accordance with the Seneca Academic Policy. We have not
% copied any part of this assignment, manually or electronically, from any
% other source including web sites, unless specified as references. We have
% not distributed our work to other students.
%
% Contributions:
% Name 1: ----------------------------------------
% Name 2: ----------------------------------------
% Name 3: ----------------------------------------

clear; close all; clc;

%% Setup
% Required input images. The script checks for them before running image tests.

roseFile = 'rose512.tif';
testPatternFile = 'testpattern512.tif';
moonFile = 'blurry-moon.tif';

fprintf('SEG800 Workshop 10 started.\n');
fprintf('Current folder: %s\n\n', pwd);

%% Part I - Project 4.1: minusOne4e
% The function minusOne4e multiplies an input array by (-1)^(x+y). This is
% used to center the Fourier transform so that the origin appears at the
% middle of the displayed spectrum.

demo = reshape(single(1:16), 4, 4);
disp('Demo input for minusOne4e:');
disp(demo);
disp('Demo output for minusOne4e:');
disp(minusOne4e(demo));

%% Part I - Project 4.2(a,b): 2-D DFT and Inverse DFT
% dft2D4e computes the 2-D transform by applying MATLAB's 1-D fft along rows
% and columns. idft2D4e uses the conjugate identity and the forward transform.

smallImage = single(magic(4));
Fsmall = dft2D4e(smallImage);
reconstructedSmall = real(idft2D4e(Fsmall));
disp('Maximum reconstruction error for a 4x4 demo image:');
disp(max(abs(smallImage(:) - reconstructedSmall(:))));

%% Part I - Project 4.2(c): Test DFT and inverse DFT on rose512.tif

if isfile(roseFile)
    f = readGrayDouble(roseFile);
    F = dft2D4e(f);
    g = real(idft2D4e(F));
    d = f - g;

    figure('Name', 'Part 2(c): DFT Reconstruction');
    subplot(1, 3, 1), imshow(f, []), title('Original f');
    subplot(1, 3, 2), imshow(g, []), title('Reconstructed g');
    subplot(1, 3, 3), imshow(d, []), title('Difference f - g');

    fprintf('Part 2(c): min(d) = %.12g\n', min(d(:)));
    fprintf('Part 2(c): max(d) = %.12g\n\n', max(d(:)));
else
    warning('Missing %s. Put the image in this folder to run Part 2(c).', roseFile);
end

%% Part I - Project 4.2(d): Centered spectrum

if isfile(roseFile)
    f = readGrayDouble(roseFile);
    Fc = dft2D4e(minusOne4e(f));
    S = log(1 + abs(Fc));
    S = scaleFull(S);

    figure('Name', 'Part 2(d): Centered Spectrum');
    imshow(S, []);
    title('Centered Spectrum log(1 + |F|)');
else
    warning('Missing %s. Put the image in this folder to run Part 2(d).', roseFile);
end

%% Part II - Project 4.3: Lowpass filter transfer functions
% The three required lowpass transfer functions are ideal, Gaussian, and
% Butterworth. All are generated on a centered P x Q distance grid.

P = 512;
Q = 512;
D0 = 96;
n = 2;

HlpIdeal = lpFilterTF4e('ideal', P, Q, D0);
HlpGaussian = lpFilterTF4e('gaussian', P, Q, D0);
HlpButterworth = lpFilterTF4e('butterworth', P, Q, [D0, n]);

figure('Name', 'Part 3: Lowpass Filter Transfer Functions');
subplot(1, 3, 1), imshow(HlpIdeal, []), title('Ideal LPF');
subplot(1, 3, 2), imshow(HlpGaussian, []), title('Gaussian LPF');
subplot(1, 3, 3), imshow(HlpButterworth, []), title('Butterworth LPF');

%% Part II - Project 4.4: Highpass filter transfer functions
% Highpass filters are generated as the complement of the corresponding
% lowpass filters: H_hp = 1 - H_lp.

HhpIdeal = hpFilterTF4e('ideal', P, Q, D0);
HhpGaussian = hpFilterTF4e('gaussian', P, Q, D0);
HhpButterworth = hpFilterTF4e('butterworth', P, Q, [D0, n]);

figure('Name', 'Part 4: Highpass Filter Transfer Functions');
subplot(1, 3, 1), imshow(HhpIdeal, []), title('Ideal HPF');
subplot(1, 3, 2), imshow(HhpGaussian, []), title('Gaussian HPF');
subplot(1, 3, 3), imshow(HhpButterworth, []), title('Butterworth HPF');

%% Part III - Project 4.5: Frequency-domain filtering package
% dftFiltering4e implements frequency-domain filtering with optional post
% padding. For padded filtering, H must have the padded image size.

if isfile(testPatternFile)
    f = readGrayDouble(testPatternFile);
    [M, N] = size(f);
    H = lpFilterTF4e('butterworth', 2*M, 2*N, [32, 2]);
    g = dftFiltering4e(f, H, 'replicate', 'full');

    figure('Name', 'Part 5(b): Butterworth Lowpass Filtering');
    subplot(1, 2, 1), imshow(f, []), title('Original');
    subplot(1, 2, 2), imshow(g, []), title('Butterworth LPF, D0=32, n=2');
else
    warning('Missing %s. Put the image in this folder to run Part 5(b).', testPatternFile);
end

%% Part III - Project 4.8: Laplacian transfer function and sharpening
% The Laplacian transfer function enhances high-frequency content. The raw
% filtered result is kept unscaled, then subtracted from the original image
% and scaled for display.

if isfile(moonFile)
    f = readGrayDouble(moonFile);
    [M, N] = size(f);
    H = laplacianTF4e(2*M, 2*N);
    lap = dftFiltering4e(f, H, 'replicate', 'no');
    g = scaleFull(f - lap);

    figure('Name', 'Part 6(c): Laplacian Sharpening');
    subplot(1, 3, 1), imshow(f, []), title('Original');
    subplot(1, 3, 2), imshow(lap, []), title('Laplacian Result');
    subplot(1, 3, 3), imshow(g, []), title('Sharpened');
else
    warning('Missing %s. Put the image in this folder to run Part 6(c).', moonFile);
end

%% Notes for the written submission
% Include the following observations in the exported PDF after running:
% 1. In Part 2(c), f and g should look identical. The difference image should
%    be essentially black, and min(d)/max(d) should be close to zero.
% 2. In Part 2(d), centering moves the low-frequency content to the center.
% 3. Ideal filters have abrupt transitions, Gaussian filters are smooth, and
%    Butterworth filters provide a controllable transition using order n.
% 4. The lowpass-filtered test pattern is smoother because high frequencies
%    are attenuated.
% 5. The Laplacian emphasizes rapid intensity changes and can sharpen the
%    blurry moon image when combined with the original image.

fprintf('\nSEG800 Workshop 10 script finished.\n');

%% Local functions

function g = minusOne4e(f)
    if ~isfloat(f)
        error('minusOne4e:InputType', 'Input must be floating point.');
    end

    if isvector(f)
        k = 0:numel(f)-1;
        mask = (-1).^k;
        if iscolumn(f)
            mask = mask.';
        end
        g = f .* mask;
        return;
    end

    if ~ismatrix(f)
        error('minusOne4e:InputDimension', 'Input must be 1-D or 2-D.');
    end

    [M, N] = size(f);
    [x, y] = ndgrid(0:M-1, 0:N-1);
    mask = (-1).^(x + y);
    g = f .* mask;
end

function F = dft2D4e(f)
    F = fft(fft(f, [], 1), [], 2);
end

function f = idft2D4e(F)
    [M, N] = size(F);
    f = conj(dft2D4e(conj(F))) / (M * N);
end

function H = lpFilterTF4e(type, P, Q, param)
    validateattributes(P, {'numeric'}, {'scalar', 'integer', 'positive'});
    validateattributes(Q, {'numeric'}, {'scalar', 'integer', 'positive'});

    D = distanceGrid(P, Q);

    switch lower(char(type))
        case 'ideal'
            D0 = param;
            H = double(D <= D0);

        case 'gaussian'
            D0 = param;
            H = exp(-(D.^2) ./ (2 * D0^2));

        case 'butterworth'
            D0 = param(1);
            n = param(2);
            H = 1 ./ (1 + (D ./ D0).^(2*n));

        otherwise
            error('lpFilterTF4e:UnknownType', 'Unknown lowpass filter type.');
    end
end

function H = hpFilterTF4e(type, P, Q, param)
    H = 1 - lpFilterTF4e(type, P, Q, param);
end

function g = dftFiltering4e(f, H, padmode, scaling)
    if nargin < 3 || isempty(padmode)
        padmode = 'replicate';
    end
    if nargin < 4 || isempty(scaling)
        scaling = 'full';
    end

    if ~isfloat(f)
        f = im2double(f);
    end

    [M, N] = size(f);

    switch lower(char(padmode))
        case 'none'
            fp = f;

        case 'replicate'
            fp = postPadReplicate(f, [2*M, 2*N]);

        case 'zeros'
            fp = postPadZeros(f, [2*M, 2*N]);

        otherwise
            error('dftFiltering4e:UnknownPadmode', 'Unknown padmode.');
    end

    if ~isequal(size(H), size(fp))
        error('dftFiltering4e:FilterSize', 'H size must match the padded image size.');
    end

    fp = minusOne4e(fp);
    F = dft2D4e(fp);
    G = H .* F;
    gp = real(idft2D4e(G));
    gp = minusOne4e(gp);
    g = gp(1:M, 1:N);

    switch lower(char(scaling))
        case 'full'
            g = scaleFull(g);
        case {'no', 'none'}
            % Keep raw values. This is needed for Laplacian sharpening.
        otherwise
            error('dftFiltering4e:UnknownScaling', 'Unknown scaling option.');
    end
end

function H = laplacianTF4e(P, Q)
    validateattributes(P, {'numeric'}, {'scalar', 'integer', 'positive'});
    validateattributes(Q, {'numeric'}, {'scalar', 'integer', 'positive'});

    D = distanceGrid(P, Q);
    H = -4 * pi^2 * (D.^2);
end

function D = distanceGrid(P, Q)
    [u, v] = meshgrid(0:Q-1, 0:P-1);
    D = sqrt((u - floor(Q/2)).^2 + (v - floor(P/2)).^2);
end

function img = readGrayDouble(filename)
    img = imread(filename);
    if ndims(img) == 3
        img = rgb2gray(img);
    end
    img = im2double(img);
end

function g = scaleFull(f)
    minValue = min(f(:));
    maxValue = max(f(:));

    if maxValue == minValue
        g = zeros(size(f), 'like', f);
    else
        g = (f - minValue) ./ (maxValue - minValue);
    end
end

function fp = postPadZeros(f, outputSize)
    P = outputSize(1);
    Q = outputSize(2);
    [M, N] = size(f);

    if P < M || Q < N
        error('postPadZeros:OutputSize', 'Output size must be at least the input size.');
    end

    fp = zeros(P, Q, 'like', f);
    fp(1:M, 1:N) = f;
end

function fp = postPadReplicate(f, outputSize)
    P = outputSize(1);
    Q = outputSize(2);
    [M, N] = size(f);

    if P < M || Q < N
        error('postPadReplicate:OutputSize', 'Output size must be at least the input size.');
    end

    fp = zeros(P, Q, 'like', f);
    fp(1:M, 1:N) = f;

    if Q > N
        fp(1:M, N+1:Q) = repmat(f(:, N), 1, Q-N);
    end
    if P > M
        fp(M+1:P, :) = repmat(fp(M, :), P-M, 1);
    end
end
