/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "ely.by",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "mc-heads.net",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "http",
				hostname: "127.0.0.1",
				port: "54322",
				pathname: "/storage/**"
			},
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "media.discordapp.net",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "docs.google.com",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "mc.yandex.ru",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "storage.easyx.ru",
				port: "",
				pathname: "/**"
			}
		]
	},
};