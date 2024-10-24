/** @type {import('next').NextConfig} */
const svg = require('@neodx/svg/webpack');

module.exports = {
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: '/misc/:path*',
					destination: 'http://localhost:4321/misc/:path*'
				},
			],
		}
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8000',
				pathname: '/get-skin/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8000',
				pathname: '/get-head/**',
			},
			{
				protocol: "http",
				hostname: "127.0.0.1",
				port: "54341",
				pathname: '/storage/**'
			}
		],
	},
	reactStrictMode: false,
	transpilePackages: [
		'@repo/ui'
	],
	webpack: (config, {isServer}) => {
		if (!isServer) {
			config.plugins.push(
				svg({
					root: '../../packages/assets/svgs',
					output: 'public/sprites',
					group: true,
					fileName: '{name}.{hash:8}.svg',
					metadata: {
						path: '../../packages/shared/ui/sprite.gen.ts',
						runtime: {
							size: true,
							viewBox: true
						}
					}
				})
			);
		}
		return config;
	},
	experimental: {
		optimizePackageImports: [
			"@repo/ui",
			"@repo/category-threads",
			"@repo/lib"
		],
		instrumentationHook: true,
		serverComponentsExternalPackages: [
			"@node-rs/bcrypt",
			"@node-rs/argon2"
		],
		serverActions: {
			bodySizeLimit: '15mb',
		},
	}
};