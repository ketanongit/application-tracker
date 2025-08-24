import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        // Automatically detect GitHub Codespaces
        ...(process.env.GITHUB_CODESPACES === 'true' && process.env.CODESPACE_NAME
          ? [`${process.env.CODESPACE_NAME}-3000.app.github.dev`]
          : []
        ),
        // Fallback for any GitHub Codespace domain
        "*.app.github.dev"
      ]
    }
  }
};

export default nextConfig;
