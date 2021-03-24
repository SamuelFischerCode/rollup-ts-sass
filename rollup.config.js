import scss from "rollup-plugin-scss";
import typescript from "@rollup/plugin-typescript";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require("child_process").spawn(
				"npm",
				["run", "start", "--", "--dev"],
				{
					stdio: ["ignore", "inherit", "inherit"],
					shell: true,
				}
			);

			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		},
	};
}

export default {
	input: "src/main.ts",
	output: {
		file: "public/build/bundle.min.js",
		format: "iife",
		name: "version",
		sourcemap: true,
	},
	plugins: [
		typescript(),
		scss({
			output: "public/build/bundle.css",
		}),
		!production && serve(),
		!production && livereload("public"),
		production && terser(),
	],
};
