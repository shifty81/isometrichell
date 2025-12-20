#ifndef NOISEGENERATOR_H
#define NOISEGENERATOR_H

#include <vector>
#include <cstdint>

/**
 * Simple Noise Generator
 * Implements Perlin-like noise for procedural generation
 */
class NoiseGenerator {
public:
    NoiseGenerator(uint32_t seed = 0);
    
    // Generate 2D noise value (0.0 to 1.0)
    float noise2D(float x, float y) const;
    
    // Generate fractal noise (multiple octaves)
    float fractalNoise2D(float x, float y, int octaves = 4, float persistence = 0.5f) const;
    
    // Generate value in range [min, max]
    float noiseRange(float x, float y, float min, float max) const;
    
    // Set seed for reproducible generation
    void setSeed(uint32_t seed);
    
private:
    uint32_t seed;
    std::vector<int> permutation;
    
    // Initialize permutation table
    void initPermutation();
    
    // Helper functions
    float fade(float t) const;
    float lerp(float t, float a, float b) const;
    float grad(int hash, float x, float y) const;
};

#endif // NOISEGENERATOR_H
