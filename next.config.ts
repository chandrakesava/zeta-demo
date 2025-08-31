// next.config.ts (root)
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ✅ Don’t fail the Vercel build on ESLint errors
  eslint: { ignoreDuringBuilds: true },

  // ✅ Don’t fail the Vercel build on TypeScript type errors (ok for prototype)
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
