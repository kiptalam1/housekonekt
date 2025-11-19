// tailwind.config.ts
import type { Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";

const config: Config = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [scrollbar({ nocompatible: true })],
};

export default config;
