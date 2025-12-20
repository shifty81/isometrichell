#include "utils/NoiseGenerator.h"
#include <cmath>
#include <algorithm>

NoiseGenerator::NoiseGenerator(uint32_t seed)
    : seed(seed)
{
    initPermutation();
}

void NoiseGenerator::setSeed(uint32_t newSeed) {
    seed = newSeed;
    initPermutation();
}

void NoiseGenerator::initPermutation() {
    // Initialize permutation table with values 0-255
    permutation.resize(512);
    
    // Fill first 256 values
    for (int i = 0; i < 256; ++i) {
        permutation[i] = i;
    }
    
    // Shuffle using seed
    uint32_t rng = seed;
    for (int i = 255; i > 0; --i) {
        // Simple LCG random number generator
        rng = (1103515245 * rng + 12345) & 0x7fffffff;
        int j = rng % (i + 1);
        std::swap(permutation[i], permutation[j]);
    }
    
    // Duplicate for overflow handling
    for (int i = 0; i < 256; ++i) {
        permutation[256 + i] = permutation[i];
    }
}

float NoiseGenerator::fade(float t) const {
    // Smoothstep function: 6t^5 - 15t^4 + 10t^3
    return t * t * t * (t * (t * 6 - 15) + 10);
}

float NoiseGenerator::lerp(float t, float a, float b) const {
    return a + t * (b - a);
}

float NoiseGenerator::grad(int hash, float x, float y) const {
    // Convert low 4 bits of hash into gradient direction
    int h = hash & 15;
    float u = h < 8 ? x : y;
    float v = h < 4 ? y : h == 12 || h == 14 ? x : 0;
    return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
}

float NoiseGenerator::noise2D(float x, float y) const {
    // Find unit square that contains point
    int X = static_cast<int>(std::floor(x)) & 255;
    int Y = static_cast<int>(std::floor(y)) & 255;
    
    // Find relative x, y in square
    x -= std::floor(x);
    y -= std::floor(y);
    
    // Compute fade curves
    float u = fade(x);
    float v = fade(y);
    
    // Hash coordinates of square corners
    int aa = permutation[permutation[X] + Y];
    int ab = permutation[permutation[X] + Y + 1];
    int ba = permutation[permutation[X + 1] + Y];
    int bb = permutation[permutation[X + 1] + Y + 1];
    
    // Blend results from corners
    float result = lerp(v,
        lerp(u, grad(aa, x, y), grad(ba, x - 1, y)),
        lerp(u, grad(ab, x, y - 1), grad(bb, x - 1, y - 1))
    );
    
    // Map from [-1, 1] to [0, 1]
    return (result + 1.0f) * 0.5f;
}

float NoiseGenerator::fractalNoise2D(float x, float y, int octaves, float persistence) const {
    float total = 0.0f;
    float frequency = 1.0f;
    float amplitude = 1.0f;
    float maxValue = 0.0f;
    
    for (int i = 0; i < octaves; ++i) {
        total += noise2D(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2.0f;
    }
    
    return total / maxValue;
}

float NoiseGenerator::noiseRange(float x, float y, float min, float max) const {
    float n = noise2D(x, y);
    return min + n * (max - min);
}
