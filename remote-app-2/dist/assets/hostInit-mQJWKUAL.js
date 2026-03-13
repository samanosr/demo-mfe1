import { t as __vitePreload } from "./preload-helper-BAEj96dT.js";
//#region node_modules/__mf__virtual/remoteApp2__H_A_I__hostAutoInit__H_A_I__.js
var remoteEntryPromise = __vitePreload(() => import("../remoteEntry.js"), []);
Promise.resolve(remoteEntryPromise).then((remoteEntry) => {
	return Promise.resolve(remoteEntry.__tla).then(remoteEntry.init).catch(remoteEntry.init);
});
//#endregion
