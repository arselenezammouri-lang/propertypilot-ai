/**
 * Bundle Analyzer Helper
 * 
 * To analyze bundle size:
 * 1. Install: npm install --save-dev @next/bundle-analyzer
 * 2. Update next.config.mjs (see instructions below)
 * 3. Run: ANALYZE=true npm run build
 */

/*
// Add to next.config.mjs:
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // ... your config
};

export default withBundleAnalyzer(nextConfig);
*/

/**
 * Get bundle size recommendations
 */
export function getBundleSizeRecommendations() {
  return {
    critical: [
      'Use dynamic imports for heavy components',
      'Remove unused dependencies',
      'Optimize images with next/image',
      'Enable tree shaking',
    ],
    optimization: [
      'Code split by route',
      'Lazy load third-party libraries',
      'Use webpack bundle analyzer',
      'Monitor bundle size in CI/CD',
    ],
  };
}
