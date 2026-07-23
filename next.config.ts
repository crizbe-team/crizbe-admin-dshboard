import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        qualities: [25, 50, 75, 100],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'crizbe.s3.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'crizbe.s3.eu-north-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'crizbe-media-bucket.s3.amazonaws.com',
            },
        ],
    },
};

export default nextConfig;
