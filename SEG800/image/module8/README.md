# Slide 8 Pixel Point Transforms

Point or pixel transforms are the simplest way to change an image. They work one pixel at a time: the output value at position `(i, j)` depends only on the input value at that same position. That makes them good for basic intensity changes like brightness and contrast, but not for blur or moving pixels around. fileciteturn0file0

## Main heading and one-sentence summary

- **Main heading:** `Pixel (Point) Transforms`
- **One-sentence summary:** Each output pixel is computed from the input pixel at the same location, assuming one color channel for simplicity. fileciteturn0file0

## Core formulas

```text
I_out(i, j) = f(I_in(i, j))
```

This is the main idea of the slide. You look at one input pixel, apply a rule `f`, and get one output pixel at the same location. fileciteturn0file0

- `I_in(i, j)`: the input pixel value
- `I_out(i, j)`: the output pixel value
- `(i, j)`: the pixel position
- `f`: the rule used to change the value
- **one color channel**: the slide keeps the idea simple by using one channel only fileciteturn0file0

The slide gives two core examples:

```text
Brightness:
I_out(i, j) = I_in(i, j) + b
```

- `b`: a constant added to every pixel
- If `b > 0`, the image gets brighter
- If `b < 0`, the image gets darker fileciteturn0file0

```text
Contrast:
I_out(i, j) = a * I_in(i, j)
```

- `a`: a constant that scales every pixel
- If `a > 1`, intensity differences get stronger
- If `0 < a < 1`, intensity differences get weaker fileciteturn0file0

## Short examples

```text
Brightness:
I_out = I_in + 30
```

Adds 30 to every pixel, so the whole image looks brighter. fileciteturn0file0

```text
Contrast:
I_out = 1.4 * I_in
```

Multiplies every pixel by 1.4, so bright parts become brighter and the image looks more intense. fileciteturn0file0

```text
Thresholding:
I_out(i, j) = 255, if I_in(i, j) >= k
I_out(i, j) = 0,   if I_in(i, j) <  k
```

Uses a cutoff `k` to split pixels into two groups, usually black and white. This is a common point transform shown as an intensity transformation in the same slide deck. fileciteturn0file0

## What makes point operators different

The key property is simple: **each output pixel depends only on the input pixel at the same location**. It does not use neighboring pixels. It also does not move the pixel to a new place. Neighborhood operators use nearby pixels, and geometric operators change pixel locations. fileciteturn0file0

## Tiny 3×3 numeric example

Start with this input image:

```text
Input =
[ [10, 20, 30],
  [40, 50, 60],
  [70, 80, 90] ]
```

Brightness with `b = 20`:

```text
Output =
[ [30, 40, 50],
  [60, 70, 80],
  [90,100,110] ]
```

Effect: every value goes up by 20, so the image gets brighter. fileciteturn0file0

Contrast with `a = 2`:

```text
Output =
[ [20, 40, 60],
  [80,100,120],
  [140,160,180] ]
```

Effect: every value is multiplied by 2, so differences between dark and bright values become larger. fileciteturn0file0