SEG800 – Test 1 – Version A

Multiple Choice questions (1 mark each):

1. What is the primary function of digital image processing?
a) To create 3D models from images
b) To process a digital image using a digital computer
c) To convert analog signals to digital
d) To enhance human vision

2. Which component of the human eye is responsible for color vision in bright light?
a) Rods
b) Retina
c) Cones
d) Optic nerve

3. What is the main difference between image enhancement and image restoration?
a) Enhancement is for medical use; restoration is for photography
b) Enhancement is subjective; restoration is based on mathematical models
c) Enhancement uses AI; restoration uses manual techniques
d) There is no difference

4. In affine transformations, which of the following is preserved?
a) Angles
b) Parallelism
c) Lengths
d) Curvature

5. What does the term “quantization” refer to in digital imaging?
a) Reducing image size
b) Sampling spatial resolution
c) Converting continuous brightness values into discrete levels
d) Enhancing image contrast

6. What is the Weber ratio used to measure?
a) Image resolution
b) Brightness discrimination
c) Color saturation
d) Image compression

7. What is the purpose of the digitizer in an image processing system?
a) To store images
b) To display images
c) To convert analog signals to digital form
d) To enhance image quality

8. What is the main source of energy for most digital images?
a) Acoustic waves
b) Electromagnetic spectrum
c) Mechanical motion
d) Thermal radiation

9. What is a point (or pixel) operation in image processing?
a) An operation that modifies the entire image at once
b) An operation that depends on the pixel and its neighbors
c) An operation where each output pixel depends only on the corresponding input pixel
d) An operation that transforms the image into the frequency domain

10. Which transformation function is used to create a photographic negative of an image?
a) Logarithmic
b) Gamma correction
c) Negative transformation (s = 255 - z)
d) Thresholding

11. Which of the following is an example of a neighborhood operation?
a) Brightness adjustment
b) Gamma correction
c) Image rotation
d) Image smoothing

12. What does a geometric transformation affect in an image?
a) Pixel intensity values
b) Color channels
c) Pixel locations
d) Histogram shape

13. What is the purpose of histogram equalization?
a) To reduce image resolution
b) To compress image data
c) To enhance image contrast by flattening the histogram
d) To convert color images to grayscale

14. What does the gamma correction transformation primarily affect?
a) Image brightness perception
b) Image sharpness
c) Image color saturation

15. Which of the following is a valid formula for image translation?
a) u = x · cos θ − y · sin θ
b) u = x + tx, v = y + ty
c) u = x · sx, v = y · sy
d) u = x + y · shx


16. (5 marks) Consider a binary digital image represented by the following 5x5 pixel matrix:

1 0 1 1 0
0 1 0 1 0
1 0 1 0 0
0 1 0 0 0

Assuming 1-based indexing, determine if the pixel at position (2, 4) is m-adjacent to the pixels:

(i) position (1, 3)
(ii) position (3, 3)

Explain your answer.


17. (5 marks) An object of height 4 meters forms an image on the retina with a focal length of 16 mm. The image distance from the lens to the retina is approximately 17 mm. Calculate the distance of the object from the eye.


18. (5 marks) Consider a 60x60 gray-scale image. Create the homography matrix for the following operations:

a) Scale the image by a factor of 1.5 (both dimensions).
b) Rotate the image by 30 degrees (counterclockwise).
c) Translate the image by (2, 5) pixels. Apply the transformation to the pixel originally at position (3, 4) with value 100. What will be the new value and location of this pixel?