/**
 * Noise Generator Class
 * Implements Perlin-like noise for procedural generation
 */
class NoiseGenerator {
    constructor(seed = Date.now()) {
        this.seed = seed;
        this.permutation = [];
        this.initPermutation();
    }
    
    /**
     * Initialize permutation table
     */
    initPermutation() {
        // Initialize with values 0-255
        const p = [];
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }
        
        // Shuffle using seed
        let rng = this.seed;
        for (let i = 255; i > 0; i--) {
            // Simple LCG random number generator
            rng = (1103515245 * rng + 12345) & 0x7fffffff;
            const j = rng % (i + 1);
            [p[i], p[j]] = [p[j], p[i]];
        }
        
        // Duplicate for overflow handling
        this.permutation = [...p, ...p];
    }
    
    /**
     * Fade function for smooth interpolation
     */
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    /**
     * Linear interpolation
     */
    lerp(t, a, b) {
        return a + t * (b - a);
    }
    
    /**
     * Gradient function
     */
    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : (h === 12 || h === 14 ? x : 0);
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    
    /**
     * Generate 2D noise value (0.0 to 1.0)
     */
    noise2D(x, y) {
        // Find unit square
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        
        // Relative x, y in square
        x -= Math.floor(x);
        y -= Math.floor(y);
        
        // Fade curves
        const u = this.fade(x);
        const v = this.fade(y);
        
        // Hash coordinates
        const p = this.permutation;
        const aa = p[p[X] + Y];
        const ab = p[p[X] + Y + 1];
        const ba = p[p[X + 1] + Y];
        const bb = p[p[X + 1] + Y + 1];
        
        // Blend results
        const result = this.lerp(v,
            this.lerp(u, this.grad(aa, x, y), this.grad(ba, x - 1, y)),
            this.lerp(u, this.grad(ab, x, y - 1), this.grad(bb, x - 1, y - 1))
        );
        
        // Map from [-1, 1] to [0, 1]
        return (result + 1.0) * 0.5;
    }
    
    /**
     * Generate fractal noise (multiple octaves)
     */
    fractalNoise2D(x, y, octaves = 4, persistence = 0.5) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            total += this.noise2D(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }
        
        return total / maxValue;
    }
    
    /**
     * Generate noise in specific range
     */
    noiseRange(x, y, min, max) {
        const n = this.noise2D(x, y);
        return min + n * (max - min);
    }
    
    /**
     * Set new seed
     */
    setSeed(seed) {
        this.seed = seed;
        this.initPermutation();
    }
}
