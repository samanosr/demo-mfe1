import { t as __vitePreload } from "./preload-helper-BAEj96dT.js";
//#region virtual:mf-exposes:remoteApp2__remoteEntry_js
var virtual_mf_exposes_remoteApp2__remoteEntry_js_default = {
	"./UserStats": async () => {
		const importModule = await __vitePreload(() => import("./UserStats-BYaZt5II.js"), []);
		const exportModule = {};
		Object.assign(exportModule, importModule);
		Object.defineProperty(exportModule, "__esModule", {
			value: true,
			enumerable: false
		});
		return exportModule;
	},
	"./AnalyticsDashboard": async () => {
		const importModule = await __vitePreload(() => import("./AnalyticsDashboard-Dy5ix5M3.js"), []);
		const exportModule = {};
		Object.assign(exportModule, importModule);
		Object.defineProperty(exportModule, "__esModule", {
			value: true,
			enumerable: false
		});
		return exportModule;
	}
};
//#endregion
export { virtual_mf_exposes_remoteApp2__remoteEntry_js_default as t };
