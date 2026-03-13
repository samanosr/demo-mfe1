import { a as __toESM } from "./rolldown-runtime-BjWfMKpL.js";
import { t as __vitePreload } from "./preload-helper-BAEj96dT.js";
import { t as virtual_mf_exposes_remoteApp2__remoteEntry_js_default } from "./virtual_mf-exposes_remoteApp2__remoteEntry_js-CXSmwoGU.js";
import { c as initResolve, l as init_remoteApp2__mf_v__runtimeInit__mf_v__ } from "./remoteApp2__loadShare__react__loadShare__.mjs-D3aHkpCj.js";
var BROWSER_LOG_KEY = "FEDERATION_DEBUG";
var NameTransformSymbol = {
	AT: "@",
	HYPHEN: "-",
	SLASH: "/"
};
var NameTransformMap = {
	[NameTransformSymbol.AT]: "scope_",
	[NameTransformSymbol.HYPHEN]: "_",
	[NameTransformSymbol.SLASH]: "__"
};
NameTransformMap[NameTransformSymbol.AT], NameTransformSymbol.AT, NameTransformMap[NameTransformSymbol.HYPHEN], NameTransformSymbol.HYPHEN, NameTransformMap[NameTransformSymbol.SLASH], NameTransformSymbol.SLASH;
function isBrowserEnv() {
	return typeof window !== "undefined" && typeof window.document !== "undefined";
}
function isReactNativeEnv() {
	return typeof navigator !== "undefined" && navigator?.product === "ReactNative";
}
function isBrowserDebug() {
	try {
		if (isBrowserEnv() && window.localStorage) return Boolean(localStorage.getItem(BROWSER_LOG_KEY));
	} catch (error) {
		return false;
	}
	return false;
}
function isDebugMode() {
	if (typeof process !== "undefined" && {}["FEDERATION_DEBUG"]) return Boolean({}["FEDERATION_DEBUG"]);
	if (typeof FEDERATION_DEBUG !== "undefined" && Boolean(FEDERATION_DEBUG)) return true;
	return isBrowserDebug();
}
var LOG_CATEGORY$1 = "[ Federation Runtime ]";
var composeKeyWithSeparator = function(...args) {
	if (!args.length) return "";
	return args.reduce((sum, cur) => {
		if (!cur) return sum;
		if (!sum) return cur;
		return `${sum}:${cur}`;
	}, "");
};
var getResourceUrl = (module, sourceUrl) => {
	if ("getPublicPath" in module) {
		let publicPath;
		if (!module.getPublicPath.startsWith("function")) publicPath = new Function(module.getPublicPath)();
		else publicPath = new Function("return " + module.getPublicPath)()();
		return `${publicPath}${sourceUrl}`;
	} else if ("publicPath" in module) {
		if (!isBrowserEnv() && !isReactNativeEnv() && "ssrPublicPath" in module) return `${module.ssrPublicPath}${sourceUrl}`;
		return `${module.publicPath}${sourceUrl}`;
	} else {
		console.warn("Cannot get resource URL. If in debug mode, please ignore.", module, sourceUrl);
		return "";
	}
};
var warn$1 = (msg) => {
	console.warn(`${LOG_CATEGORY$1}: ${msg}`);
};
function safeToString(info) {
	try {
		return JSON.stringify(info, null, 2);
	} catch (e) {
		return "";
	}
}
var simpleJoinRemoteEntry = (rPath, rName) => {
	if (!rPath) return rName;
	const transformPath = (str) => {
		if (str === ".") return "";
		if (str.startsWith("./")) return str.replace("./", "");
		if (str.startsWith("/")) {
			const strWithoutSlash = str.slice(1);
			if (strWithoutSlash.endsWith("/")) return strWithoutSlash.slice(0, -1);
			return strWithoutSlash;
		}
		return str;
	};
	const transformedPath = transformPath(rPath);
	if (!transformedPath) return rName;
	if (transformedPath.endsWith("/")) return `${transformedPath}${rName}`;
	return `${transformedPath}/${rName}`;
};
function inferAutoPublicPath(url) {
	return url.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
}
function generateSnapshotFromManifest(manifest, options = {}) {
	const { remotes = {}, overrides = {}, version } = options;
	let remoteSnapshot;
	const getPublicPath = () => {
		if ("publicPath" in manifest.metaData) {
			if (manifest.metaData.publicPath === "auto" && version) return inferAutoPublicPath(version);
			return manifest.metaData.publicPath;
		} else return manifest.metaData.getPublicPath;
	};
	const overridesKeys = Object.keys(overrides);
	let remotesInfo = {};
	if (!Object.keys(remotes).length) remotesInfo = manifest.remotes?.reduce((res, next) => {
		let matchedVersion;
		const name = next.federationContainerName;
		if (overridesKeys.includes(name)) matchedVersion = overrides[name];
		else if ("version" in next) matchedVersion = next.version;
		else matchedVersion = next.entry;
		res[name] = { matchedVersion };
		return res;
	}, {}) || {};
	Object.keys(remotes).forEach((key) => remotesInfo[key] = { matchedVersion: overridesKeys.includes(key) ? overrides[key] : remotes[key] });
	const { remoteEntry: { path: remoteEntryPath, name: remoteEntryName, type: remoteEntryType }, types: remoteTypes = {
		path: "",
		name: "",
		zip: "",
		api: ""
	}, buildInfo: { buildVersion }, globalName, ssrRemoteEntry } = manifest.metaData;
	const { exposes } = manifest;
	let basicRemoteSnapshot = {
		version: version ? version : "",
		buildVersion,
		globalName,
		remoteEntry: simpleJoinRemoteEntry(remoteEntryPath, remoteEntryName),
		remoteEntryType,
		remoteTypes: simpleJoinRemoteEntry(remoteTypes.path, remoteTypes.name),
		remoteTypesZip: remoteTypes.zip || "",
		remoteTypesAPI: remoteTypes.api || "",
		remotesInfo,
		shared: manifest?.shared.map((item) => ({
			assets: item.assets,
			sharedName: item.name,
			version: item.version,
			usedExports: item.referenceExports || []
		})),
		modules: exposes?.map((expose) => ({
			moduleName: expose.name,
			modulePath: expose.path,
			assets: expose.assets
		}))
	};
	if (manifest.metaData?.prefetchInterface) {
		const prefetchInterface = manifest.metaData.prefetchInterface;
		basicRemoteSnapshot = {
			...basicRemoteSnapshot,
			prefetchInterface
		};
	}
	if (manifest.metaData?.prefetchEntry) {
		const { path, name, type } = manifest.metaData.prefetchEntry;
		basicRemoteSnapshot = {
			...basicRemoteSnapshot,
			prefetchEntry: simpleJoinRemoteEntry(path, name),
			prefetchEntryType: type
		};
	}
	if ("publicPath" in manifest.metaData) remoteSnapshot = {
		...basicRemoteSnapshot,
		publicPath: getPublicPath(),
		ssrPublicPath: manifest.metaData.ssrPublicPath
	};
	else remoteSnapshot = {
		...basicRemoteSnapshot,
		getPublicPath: getPublicPath()
	};
	if (ssrRemoteEntry) {
		const fullSSRRemoteEntry = simpleJoinRemoteEntry(ssrRemoteEntry.path, ssrRemoteEntry.name);
		remoteSnapshot.ssrRemoteEntry = fullSSRRemoteEntry;
		remoteSnapshot.ssrRemoteEntryType = ssrRemoteEntry.type || "commonjs-module";
	}
	return remoteSnapshot;
}
function isManifestProvider(moduleInfo) {
	if ("remoteEntry" in moduleInfo && moduleInfo.remoteEntry.includes(".json")) return true;
	else return false;
}
var PREFIX = "[ Module Federation ]";
var DEFAULT_DELEGATE = console;
var LOGGER_STACK_SKIP_TOKENS = [
	"logger.ts",
	"logger.js",
	"captureStackTrace",
	"Logger.emit",
	"Logger.log",
	"Logger.info",
	"Logger.warn",
	"Logger.error",
	"Logger.debug"
];
function captureStackTrace() {
	try {
		const stack = (/* @__PURE__ */ new Error()).stack;
		if (!stack) return;
		const [, ...rawLines] = stack.split("\n");
		const filtered = rawLines.filter((line) => !LOGGER_STACK_SKIP_TOKENS.some((token) => line.includes(token)));
		if (!filtered.length) return;
		return `Stack trace:\n${filtered.slice(0, 5).join("\n")}`;
	} catch {
		return;
	}
}
var Logger = class {
	constructor(prefix, delegate = DEFAULT_DELEGATE) {
		this.prefix = prefix;
		this.delegate = delegate ?? DEFAULT_DELEGATE;
	}
	setPrefix(prefix) {
		this.prefix = prefix;
	}
	setDelegate(delegate) {
		this.delegate = delegate ?? DEFAULT_DELEGATE;
	}
	emit(method, args) {
		const delegate = this.delegate;
		const stackTrace = isDebugMode() ? captureStackTrace() : void 0;
		const enrichedArgs = stackTrace ? [...args, stackTrace] : args;
		const order = (() => {
			switch (method) {
				case "log": return ["log", "info"];
				case "info": return ["info", "log"];
				case "warn": return [
					"warn",
					"info",
					"log"
				];
				case "error": return [
					"error",
					"warn",
					"log"
				];
				default: return ["debug", "log"];
			}
		})();
		for (const candidate of order) {
			const handler = delegate[candidate];
			if (typeof handler === "function") {
				handler.call(delegate, this.prefix, ...enrichedArgs);
				return;
			}
		}
		for (const candidate of order) {
			const handler = DEFAULT_DELEGATE[candidate];
			if (typeof handler === "function") {
				handler.call(DEFAULT_DELEGATE, this.prefix, ...enrichedArgs);
				return;
			}
		}
	}
	log(...args) {
		this.emit("log", args);
	}
	warn(...args) {
		this.emit("warn", args);
	}
	error(...args) {
		this.emit("error", args);
	}
	success(...args) {
		this.emit("info", args);
	}
	info(...args) {
		this.emit("info", args);
	}
	ready(...args) {
		this.emit("info", args);
	}
	debug(...args) {
		if (isDebugMode()) this.emit("debug", args);
	}
};
function createLogger(prefix) {
	return new Logger(prefix);
}
function createInfrastructureLogger(prefix) {
	const infrastructureLogger = new Logger(prefix);
	Object.defineProperty(infrastructureLogger, "__mf_infrastructure_logger__", {
		value: true,
		enumerable: false,
		configurable: false
	});
	return infrastructureLogger;
}
createLogger(PREFIX);
createInfrastructureLogger(PREFIX);
async function safeWrapper(callback, disableWarn) {
	try {
		return await callback();
	} catch (e) {
		!disableWarn && warn$1(e);
		return;
	}
}
function isStaticResourcesEqual(url1, url2) {
	const REG_EXP = /^(https?:)?\/\//i;
	return url1.replace(REG_EXP, "").replace(/\/$/, "") === url2.replace(REG_EXP, "").replace(/\/$/, "");
}
function createScript(info) {
	let script = null;
	let needAttach = true;
	let timeout = 2e4;
	let timeoutId;
	const scripts = document.getElementsByTagName("script");
	for (let i = 0; i < scripts.length; i++) {
		const s = scripts[i];
		const scriptSrc = s.getAttribute("src");
		if (scriptSrc && isStaticResourcesEqual(scriptSrc, info.url)) {
			script = s;
			needAttach = false;
			break;
		}
	}
	if (!script) {
		const attrs = info.attrs;
		script = document.createElement("script");
		script.type = attrs?.["type"] === "module" ? "module" : "text/javascript";
		let createScriptRes = void 0;
		if (info.createScriptHook) {
			createScriptRes = info.createScriptHook(info.url, info.attrs);
			if (createScriptRes instanceof HTMLScriptElement) script = createScriptRes;
			else if (typeof createScriptRes === "object") {
				if ("script" in createScriptRes && createScriptRes.script) script = createScriptRes.script;
				if ("timeout" in createScriptRes && createScriptRes.timeout) timeout = createScriptRes.timeout;
			}
		}
		if (!script.src) script.src = info.url;
		if (attrs && !createScriptRes) Object.keys(attrs).forEach((name) => {
			if (script) {
				if (name === "async" || name === "defer") script[name] = attrs[name];
				else if (!script.getAttribute(name)) script.setAttribute(name, attrs[name]);
			}
		});
	}
	const onScriptComplete = async (prev, event) => {
		clearTimeout(timeoutId);
		const onScriptCompleteCallback = () => {
			if (event?.type === "error") info?.onErrorCallback && info?.onErrorCallback(event);
			else info?.cb && info?.cb();
		};
		if (script) {
			script.onerror = null;
			script.onload = null;
			safeWrapper(() => {
				const { needDeleteScript = true } = info;
				if (needDeleteScript) script?.parentNode && script.parentNode.removeChild(script);
			});
			if (prev && typeof prev === "function") {
				const result = prev(event);
				if (result instanceof Promise) {
					const res = await result;
					onScriptCompleteCallback();
					return res;
				}
				onScriptCompleteCallback();
				return result;
			}
		}
		onScriptCompleteCallback();
	};
	script.onerror = onScriptComplete.bind(null, script.onerror);
	script.onload = onScriptComplete.bind(null, script.onload);
	timeoutId = setTimeout(() => {
		onScriptComplete(null, /* @__PURE__ */ new Error(`Remote script "${info.url}" time-outed.`));
	}, timeout);
	return {
		script,
		needAttach
	};
}
function createLink(info) {
	let link = null;
	let needAttach = true;
	const links = document.getElementsByTagName("link");
	for (let i = 0; i < links.length; i++) {
		const l = links[i];
		const linkHref = l.getAttribute("href");
		const linkRel = l.getAttribute("rel");
		if (linkHref && isStaticResourcesEqual(linkHref, info.url) && linkRel === info.attrs["rel"]) {
			link = l;
			needAttach = false;
			break;
		}
	}
	if (!link) {
		link = document.createElement("link");
		link.setAttribute("href", info.url);
		let createLinkRes = void 0;
		const attrs = info.attrs;
		if (info.createLinkHook) {
			createLinkRes = info.createLinkHook(info.url, attrs);
			if (createLinkRes instanceof HTMLLinkElement) link = createLinkRes;
		}
		if (attrs && !createLinkRes) Object.keys(attrs).forEach((name) => {
			if (link && !link.getAttribute(name)) link.setAttribute(name, attrs[name]);
		});
	}
	const onLinkComplete = (prev, event) => {
		const onLinkCompleteCallback = () => {
			if (event?.type === "error") info?.onErrorCallback && info?.onErrorCallback(event);
			else info?.cb && info?.cb();
		};
		if (link) {
			link.onerror = null;
			link.onload = null;
			safeWrapper(() => {
				const { needDeleteLink = true } = info;
				if (needDeleteLink) link?.parentNode && link.parentNode.removeChild(link);
			});
			if (prev) {
				const res = prev(event);
				onLinkCompleteCallback();
				return res;
			}
		}
		onLinkCompleteCallback();
	};
	link.onerror = onLinkComplete.bind(null, link.onerror);
	link.onload = onLinkComplete.bind(null, link.onload);
	return {
		link,
		needAttach
	};
}
function loadScript(url, info) {
	const { attrs = {}, createScriptHook } = info;
	return new Promise((resolve, reject) => {
		const { script, needAttach } = createScript({
			url,
			cb: resolve,
			onErrorCallback: reject,
			attrs: {
				fetchpriority: "high",
				...attrs
			},
			createScriptHook,
			needDeleteScript: true
		});
		needAttach && document.head.appendChild(script);
	});
}
//#endregion
//#region node_modules/@module-federation/error-codes/dist/index.esm.mjs
var RUNTIME_001 = "RUNTIME-001";
var RUNTIME_002 = "RUNTIME-002";
var RUNTIME_003 = "RUNTIME-003";
var RUNTIME_004 = "RUNTIME-004";
var RUNTIME_005 = "RUNTIME-005";
var RUNTIME_006 = "RUNTIME-006";
var RUNTIME_007 = "RUNTIME-007";
var RUNTIME_008 = "RUNTIME-008";
var RUNTIME_009 = "RUNTIME-009";
var TYPE_001 = "TYPE-001";
var BUILD_001 = "BUILD-001";
var BUILD_002 = "BUILD-002";
var getDocsUrl = (errorCode) => {
	return `View the docs to see how to solve: https://module-federation.io/guide/troubleshooting/${errorCode.split("-")[0].toLowerCase()}#${errorCode.toLowerCase()}`;
};
var getShortErrorMsg = (errorCode, errorDescMap, args, originalErrorMsg) => {
	const msg = [`${[errorDescMap[errorCode]]} #${errorCode}`];
	args && msg.push(`args: ${JSON.stringify(args)}`);
	msg.push(getDocsUrl(errorCode));
	originalErrorMsg && msg.push(`Original Error Message:\n ${originalErrorMsg}`);
	return msg.join("\n");
};
var runtimeDescMap = {
	[RUNTIME_001]: "Failed to get remoteEntry exports.",
	[RUNTIME_002]: "The remote entry interface does not contain \"init\"",
	[RUNTIME_003]: "Failed to get manifest.",
	[RUNTIME_004]: "Failed to locate remote.",
	[RUNTIME_005]: "Invalid loadShareSync function call from bundler runtime",
	[RUNTIME_006]: "Invalid loadShareSync function call from runtime",
	[RUNTIME_007]: "Failed to get remote snapshot.",
	[RUNTIME_008]: "Failed to load script resources.",
	[RUNTIME_009]: "Please call createInstance first."
};
var typeDescMap = { [TYPE_001]: "Failed to generate type declaration. Execute the below cmd to reproduce and fix the error." };
var buildDescMap = {
	[BUILD_001]: "Failed to find expose module.",
	[BUILD_002]: "PublicPath is required in prod mode."
};
({
	...runtimeDescMap,
	...typeDescMap,
	...buildDescMap
});
//#endregion
//#region node_modules/@module-federation/runtime-core/dist/index.esm.js
var LOG_CATEGORY = "[ Federation Runtime ]";
var logger = createLogger(LOG_CATEGORY);
function assert(condition, msg) {
	if (!condition) error(msg);
}
function error(msg) {
	if (msg instanceof Error) {
		if (!msg.message.startsWith(LOG_CATEGORY)) msg.message = `${LOG_CATEGORY}: ${msg.message}`;
		throw msg;
	}
	throw new Error(`${LOG_CATEGORY}: ${msg}`);
}
function warn(msg) {
	if (msg instanceof Error) {
		if (!msg.message.startsWith(LOG_CATEGORY)) msg.message = `${LOG_CATEGORY}: ${msg.message}`;
		logger.warn(msg);
	} else logger.warn(msg);
}
function addUniqueItem(arr, item) {
	if (arr.findIndex((name) => name === item) === -1) arr.push(item);
	return arr;
}
function getFMId(remoteInfo) {
	if ("version" in remoteInfo && remoteInfo.version) return `${remoteInfo.name}:${remoteInfo.version}`;
	else if ("entry" in remoteInfo && remoteInfo.entry) return `${remoteInfo.name}:${remoteInfo.entry}`;
	else return `${remoteInfo.name}`;
}
function isRemoteInfoWithEntry(remote) {
	return typeof remote.entry !== "undefined";
}
function isPureRemoteEntry(remote) {
	return !remote.entry.includes(".json");
}
function isObject(val) {
	return val && typeof val === "object";
}
var objectToString = Object.prototype.toString;
function isPlainObject(val) {
	return objectToString.call(val) === "[object Object]";
}
function arrayOptions(options) {
	return Array.isArray(options) ? options : [options];
}
function getRemoteEntryInfoFromSnapshot(snapshot) {
	const defaultRemoteEntryInfo = {
		url: "",
		type: "global",
		globalName: ""
	};
	if (isBrowserEnv() || isReactNativeEnv() || !("ssrRemoteEntry" in snapshot)) return "remoteEntry" in snapshot ? {
		url: snapshot.remoteEntry,
		type: snapshot.remoteEntryType,
		globalName: snapshot.globalName
	} : defaultRemoteEntryInfo;
	if ("ssrRemoteEntry" in snapshot) return {
		url: snapshot.ssrRemoteEntry || defaultRemoteEntryInfo.url,
		type: snapshot.ssrRemoteEntryType || defaultRemoteEntryInfo.type,
		globalName: snapshot.globalName
	};
	return defaultRemoteEntryInfo;
}
var processModuleAlias = (name, subPath) => {
	let moduleName;
	if (name.endsWith("/")) moduleName = name.slice(0, -1);
	else moduleName = name;
	if (subPath.startsWith(".")) subPath = subPath.slice(1);
	moduleName = moduleName + subPath;
	return moduleName;
};
var CurrentGlobal = typeof globalThis === "object" ? globalThis : window;
var nativeGlobal = (() => {
	try {
		return document.defaultView;
	} catch {
		return CurrentGlobal;
	}
})();
var Global = nativeGlobal;
function definePropertyGlobalVal(target, key, val) {
	Object.defineProperty(target, key, {
		value: val,
		configurable: false,
		writable: true
	});
}
function includeOwnProperty(target, key) {
	return Object.hasOwnProperty.call(target, key);
}
if (!includeOwnProperty(CurrentGlobal, "__GLOBAL_LOADING_REMOTE_ENTRY__")) definePropertyGlobalVal(CurrentGlobal, "__GLOBAL_LOADING_REMOTE_ENTRY__", {});
var globalLoading = CurrentGlobal.__GLOBAL_LOADING_REMOTE_ENTRY__;
function setGlobalDefaultVal(target) {
	if (includeOwnProperty(target, "__VMOK__") && !includeOwnProperty(target, "__FEDERATION__")) definePropertyGlobalVal(target, "__FEDERATION__", target.__VMOK__);
	if (!includeOwnProperty(target, "__FEDERATION__")) {
		definePropertyGlobalVal(target, "__FEDERATION__", {
			__GLOBAL_PLUGIN__: [],
			__INSTANCES__: [],
			moduleInfo: {},
			__SHARE__: {},
			__MANIFEST_LOADING__: {},
			__PRELOADED_MAP__: /* @__PURE__ */ new Map()
		});
		definePropertyGlobalVal(target, "__VMOK__", target.__FEDERATION__);
	}
	target.__FEDERATION__.__GLOBAL_PLUGIN__ ??= [];
	target.__FEDERATION__.__INSTANCES__ ??= [];
	target.__FEDERATION__.moduleInfo ??= {};
	target.__FEDERATION__.__SHARE__ ??= {};
	target.__FEDERATION__.__MANIFEST_LOADING__ ??= {};
	target.__FEDERATION__.__PRELOADED_MAP__ ??= /* @__PURE__ */ new Map();
}
setGlobalDefaultVal(CurrentGlobal);
setGlobalDefaultVal(nativeGlobal);
function setGlobalFederationInstance(FederationInstance) {
	CurrentGlobal.__FEDERATION__.__INSTANCES__.push(FederationInstance);
}
function getGlobalFederationConstructor() {
	return CurrentGlobal.__FEDERATION__.__DEBUG_CONSTRUCTOR__;
}
function setGlobalFederationConstructor(FederationConstructor, isDebug = isDebugMode()) {
	if (isDebug) {
		CurrentGlobal.__FEDERATION__.__DEBUG_CONSTRUCTOR__ = FederationConstructor;
		CurrentGlobal.__FEDERATION__.__DEBUG_CONSTRUCTOR_VERSION__ = "2.0.1";
	}
}
function getInfoWithoutType(target, key) {
	if (typeof key === "string") if (target[key]) return {
		value: target[key],
		key
	};
	else {
		const targetKeys = Object.keys(target);
		for (const targetKey of targetKeys) {
			const [targetTypeOrName, _] = targetKey.split(":");
			const nKey = `${targetTypeOrName}:${key}`;
			const typeWithKeyRes = target[nKey];
			if (typeWithKeyRes) return {
				value: typeWithKeyRes,
				key: nKey
			};
		}
		return {
			value: void 0,
			key
		};
	}
	else throw new Error("key must be string");
}
var getGlobalSnapshot = () => nativeGlobal.__FEDERATION__.moduleInfo;
var getTargetSnapshotInfoByModuleInfo = (moduleInfo, snapshot) => {
	const getModuleInfo = getInfoWithoutType(snapshot, getFMId(moduleInfo)).value;
	if (getModuleInfo && !getModuleInfo.version && "version" in moduleInfo && moduleInfo["version"]) getModuleInfo.version = moduleInfo["version"];
	if (getModuleInfo) return getModuleInfo;
	if ("version" in moduleInfo && moduleInfo["version"]) {
		const { version, ...resModuleInfo } = moduleInfo;
		const moduleKeyWithoutVersion = getFMId(resModuleInfo);
		const getModuleInfoWithoutVersion = getInfoWithoutType(nativeGlobal.__FEDERATION__.moduleInfo, moduleKeyWithoutVersion).value;
		if (getModuleInfoWithoutVersion?.version === version) return getModuleInfoWithoutVersion;
	}
};
var getGlobalSnapshotInfoByModuleInfo = (moduleInfo) => getTargetSnapshotInfoByModuleInfo(moduleInfo, nativeGlobal.__FEDERATION__.moduleInfo);
var setGlobalSnapshotInfoByModuleInfo = (remoteInfo, moduleDetailInfo) => {
	const moduleKey = getFMId(remoteInfo);
	nativeGlobal.__FEDERATION__.moduleInfo[moduleKey] = moduleDetailInfo;
	return nativeGlobal.__FEDERATION__.moduleInfo;
};
var addGlobalSnapshot = (moduleInfos) => {
	nativeGlobal.__FEDERATION__.moduleInfo = {
		...nativeGlobal.__FEDERATION__.moduleInfo,
		...moduleInfos
	};
	return () => {
		const keys = Object.keys(moduleInfos);
		for (const key of keys) delete nativeGlobal.__FEDERATION__.moduleInfo[key];
	};
};
var getRemoteEntryExports = (name, globalName) => {
	const remoteEntryKey = globalName || `__FEDERATION_${name}:custom__`;
	return {
		remoteEntryKey,
		entryExports: CurrentGlobal[remoteEntryKey]
	};
};
var getGlobalHostPlugins = () => nativeGlobal.__FEDERATION__.__GLOBAL_PLUGIN__;
var getPreloaded = (id) => CurrentGlobal.__FEDERATION__.__PRELOADED_MAP__.get(id);
var setPreloaded = (id) => CurrentGlobal.__FEDERATION__.__PRELOADED_MAP__.set(id, true);
var DEFAULT_SCOPE = "default";
var DEFAULT_REMOTE_TYPE = "global";
var buildIdentifier = "[0-9A-Za-z-]+";
var build = `(?:\\+(${buildIdentifier}(?:\\.${buildIdentifier})*))`;
var numericIdentifier = "0|[1-9]\\d*";
var numericIdentifierLoose = "[0-9]+";
var nonNumericIdentifier = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
var preReleaseIdentifierLoose = `(?:${numericIdentifierLoose}|${nonNumericIdentifier})`;
var preReleaseLoose = `(?:-?(${preReleaseIdentifierLoose}(?:\\.${preReleaseIdentifierLoose})*))`;
var preReleaseIdentifier = `(?:${numericIdentifier}|${nonNumericIdentifier})`;
var preRelease = `(?:-(${preReleaseIdentifier}(?:\\.${preReleaseIdentifier})*))`;
var xRangeIdentifier = `${numericIdentifier}|x|X|\\*`;
var xRangePlain = `[v=\\s]*(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:${preRelease})?${build}?)?)?`;
var hyphenRange = `^\\s*(${xRangePlain})\\s+-\\s+(${xRangePlain})\\s*$`;
var loosePlain = `[v=\\s]*${`(${numericIdentifierLoose})\\.(${numericIdentifierLoose})\\.(${numericIdentifierLoose})`}${preReleaseLoose}?${build}?`;
var gtlt = "((?:<|>)?=?)";
var comparatorTrim = `(\\s*)${gtlt}\\s*(${loosePlain}|${xRangePlain})`;
var loneTilde = "(?:~>?)";
var tildeTrim = `(\\s*)${loneTilde}\\s+`;
var loneCaret = "(?:\\^)";
var caretTrim = `(\\s*)${loneCaret}\\s+`;
var star = "(<|>)?=?\\s*\\*";
var caret = `^${loneCaret}${xRangePlain}$`;
var fullPlain = `v?${`(${numericIdentifier})\\.(${numericIdentifier})\\.(${numericIdentifier})`}${preRelease}?${build}?`;
var tilde = `^${loneTilde}${xRangePlain}$`;
var xRange = `^${gtlt}\\s*${xRangePlain}$`;
var comparator = `^${gtlt}\\s*(${fullPlain})$|^$`;
var gte0 = "^\\s*>=\\s*0.0.0\\s*$";
function parseRegex(source) {
	return new RegExp(source);
}
function isXVersion(version) {
	return !version || version.toLowerCase() === "x" || version === "*";
}
function pipe(...fns) {
	return (x) => fns.reduce((v, f) => f(v), x);
}
function extractComparator(comparatorString) {
	return comparatorString.match(parseRegex(comparator));
}
function combineVersion(major, minor, patch, preRelease) {
	const mainVersion = `${major}.${minor}.${patch}`;
	if (preRelease) return `${mainVersion}-${preRelease}`;
	return mainVersion;
}
function parseHyphen(range) {
	return range.replace(parseRegex(hyphenRange), (_range, from, fromMajor, fromMinor, fromPatch, _fromPreRelease, _fromBuild, to, toMajor, toMinor, toPatch, toPreRelease) => {
		if (isXVersion(fromMajor)) from = "";
		else if (isXVersion(fromMinor)) from = `>=${fromMajor}.0.0`;
		else if (isXVersion(fromPatch)) from = `>=${fromMajor}.${fromMinor}.0`;
		else from = `>=${from}`;
		if (isXVersion(toMajor)) to = "";
		else if (isXVersion(toMinor)) to = `<${Number(toMajor) + 1}.0.0-0`;
		else if (isXVersion(toPatch)) to = `<${toMajor}.${Number(toMinor) + 1}.0-0`;
		else if (toPreRelease) to = `<=${toMajor}.${toMinor}.${toPatch}-${toPreRelease}`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	});
}
function parseComparatorTrim(range) {
	return range.replace(parseRegex(comparatorTrim), "$1$2$3");
}
function parseTildeTrim(range) {
	return range.replace(parseRegex(tildeTrim), "$1~");
}
function parseCaretTrim(range) {
	return range.replace(parseRegex(caretTrim), "$1^");
}
function parseCarets(range) {
	return range.trim().split(/\s+/).map((rangeVersion) => rangeVersion.replace(parseRegex(caret), (_, major, minor, patch, preRelease) => {
		if (isXVersion(major)) return "";
		else if (isXVersion(minor)) return `>=${major}.0.0 <${Number(major) + 1}.0.0-0`;
		else if (isXVersion(patch)) if (major === "0") return `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0-0`;
		else return `>=${major}.${minor}.0 <${Number(major) + 1}.0.0-0`;
		else if (preRelease) if (major === "0") if (minor === "0") return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${minor}.${Number(patch) + 1}-0`;
		else return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${Number(minor) + 1}.0-0`;
		else return `>=${major}.${minor}.${patch}-${preRelease} <${Number(major) + 1}.0.0-0`;
		else {
			if (major === "0") if (minor === "0") return `>=${major}.${minor}.${patch} <${major}.${minor}.${Number(patch) + 1}-0`;
			else return `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0`;
			return `>=${major}.${minor}.${patch} <${Number(major) + 1}.0.0-0`;
		}
	})).join(" ");
}
function parseTildes(range) {
	return range.trim().split(/\s+/).map((rangeVersion) => rangeVersion.replace(parseRegex(tilde), (_, major, minor, patch, preRelease) => {
		if (isXVersion(major)) return "";
		else if (isXVersion(minor)) return `>=${major}.0.0 <${Number(major) + 1}.0.0-0`;
		else if (isXVersion(patch)) return `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0-0`;
		else if (preRelease) return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${Number(minor) + 1}.0-0`;
		return `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0`;
	})).join(" ");
}
function parseXRanges(range) {
	return range.split(/\s+/).map((rangeVersion) => rangeVersion.trim().replace(parseRegex(xRange), (ret, gtlt, major, minor, patch, preRelease) => {
		const isXMajor = isXVersion(major);
		const isXMinor = isXMajor || isXVersion(minor);
		const isXPatch = isXMinor || isXVersion(patch);
		if (gtlt === "=" && isXPatch) gtlt = "";
		preRelease = "";
		if (isXMajor) if (gtlt === ">" || gtlt === "<") return "<0.0.0-0";
		else return "*";
		else if (gtlt && isXPatch) {
			if (isXMinor) minor = 0;
			patch = 0;
			if (gtlt === ">") {
				gtlt = ">=";
				if (isXMinor) {
					major = Number(major) + 1;
					minor = 0;
					patch = 0;
				} else {
					minor = Number(minor) + 1;
					patch = 0;
				}
			} else if (gtlt === "<=") {
				gtlt = "<";
				if (isXMinor) major = Number(major) + 1;
				else minor = Number(minor) + 1;
			}
			if (gtlt === "<") preRelease = "-0";
			return `${gtlt + major}.${minor}.${patch}${preRelease}`;
		} else if (isXMinor) return `>=${major}.0.0${preRelease} <${Number(major) + 1}.0.0-0`;
		else if (isXPatch) return `>=${major}.${minor}.0${preRelease} <${major}.${Number(minor) + 1}.0-0`;
		return ret;
	})).join(" ");
}
function parseStar(range) {
	return range.trim().replace(parseRegex(star), "");
}
function parseGTE0(comparatorString) {
	return comparatorString.trim().replace(parseRegex(gte0), "");
}
function compareAtom(rangeAtom, versionAtom) {
	rangeAtom = Number(rangeAtom) || rangeAtom;
	versionAtom = Number(versionAtom) || versionAtom;
	if (rangeAtom > versionAtom) return 1;
	if (rangeAtom === versionAtom) return 0;
	return -1;
}
function comparePreRelease(rangeAtom, versionAtom) {
	const { preRelease: rangePreRelease } = rangeAtom;
	const { preRelease: versionPreRelease } = versionAtom;
	if (rangePreRelease === void 0 && Boolean(versionPreRelease)) return 1;
	if (Boolean(rangePreRelease) && versionPreRelease === void 0) return -1;
	if (rangePreRelease === void 0 && versionPreRelease === void 0) return 0;
	for (let i = 0, n = rangePreRelease.length; i <= n; i++) {
		const rangeElement = rangePreRelease[i];
		const versionElement = versionPreRelease[i];
		if (rangeElement === versionElement) continue;
		if (rangeElement === void 0 && versionElement === void 0) return 0;
		if (!rangeElement) return 1;
		if (!versionElement) return -1;
		return compareAtom(rangeElement, versionElement);
	}
	return 0;
}
function compareVersion(rangeAtom, versionAtom) {
	return compareAtom(rangeAtom.major, versionAtom.major) || compareAtom(rangeAtom.minor, versionAtom.minor) || compareAtom(rangeAtom.patch, versionAtom.patch) || comparePreRelease(rangeAtom, versionAtom);
}
function eq(rangeAtom, versionAtom) {
	return rangeAtom.version === versionAtom.version;
}
function compare(rangeAtom, versionAtom) {
	switch (rangeAtom.operator) {
		case "":
		case "=": return eq(rangeAtom, versionAtom);
		case ">": return compareVersion(rangeAtom, versionAtom) < 0;
		case ">=": return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) < 0;
		case "<": return compareVersion(rangeAtom, versionAtom) > 0;
		case "<=": return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) > 0;
		case void 0: return true;
		default: return false;
	}
}
function parseComparatorString(range) {
	return pipe(parseCarets, parseTildes, parseXRanges, parseStar)(range);
}
function parseRange(range) {
	return pipe(parseHyphen, parseComparatorTrim, parseTildeTrim, parseCaretTrim)(range.trim()).split(/\s+/).join(" ");
}
function satisfy(version, range) {
	if (!version) return false;
	const extractedVersion = extractComparator(version);
	if (!extractedVersion) return false;
	const [, versionOperator, , versionMajor, versionMinor, versionPatch, versionPreRelease] = extractedVersion;
	const versionAtom = {
		operator: versionOperator,
		version: combineVersion(versionMajor, versionMinor, versionPatch, versionPreRelease),
		major: versionMajor,
		minor: versionMinor,
		patch: versionPatch,
		preRelease: versionPreRelease?.split(".")
	};
	const orRanges = range.split("||");
	for (const orRange of orRanges) {
		const trimmedOrRange = orRange.trim();
		if (!trimmedOrRange) return true;
		if (trimmedOrRange === "*" || trimmedOrRange === "x") return true;
		try {
			const parsedSubRange = parseRange(trimmedOrRange);
			if (!parsedSubRange.trim()) return true;
			const parsedComparatorString = parsedSubRange.split(" ").map((rangeVersion) => parseComparatorString(rangeVersion)).join(" ");
			if (!parsedComparatorString.trim()) return true;
			const comparators = parsedComparatorString.split(/\s+/).map((comparator) => parseGTE0(comparator)).filter(Boolean);
			if (comparators.length === 0) continue;
			let subRangeSatisfied = true;
			for (const comparator of comparators) {
				const extractedComparator = extractComparator(comparator);
				if (!extractedComparator) {
					subRangeSatisfied = false;
					break;
				}
				const [, rangeOperator, , rangeMajor, rangeMinor, rangePatch, rangePreRelease] = extractedComparator;
				if (!compare({
					operator: rangeOperator,
					version: combineVersion(rangeMajor, rangeMinor, rangePatch, rangePreRelease),
					major: rangeMajor,
					minor: rangeMinor,
					patch: rangePatch,
					preRelease: rangePreRelease?.split(".")
				}, versionAtom)) {
					subRangeSatisfied = false;
					break;
				}
			}
			if (subRangeSatisfied) return true;
		} catch (e) {
			console.error(`[semver] Error processing range part "${trimmedOrRange}":`, e);
			continue;
		}
	}
	return false;
}
function formatShare(shareArgs, from, name, shareStrategy) {
	let get;
	if ("get" in shareArgs) get = shareArgs.get;
	else if ("lib" in shareArgs) get = () => Promise.resolve(shareArgs.lib);
	else get = () => Promise.resolve(() => {
		throw new Error(`Can not get shared '${name}'!`);
	});
	if (shareArgs.shareConfig?.eager && shareArgs.treeShaking?.mode) throw new Error("Can not set \"eager:true\" and \"treeShaking\" at the same time!");
	return {
		deps: [],
		useIn: [],
		from,
		loading: null,
		...shareArgs,
		shareConfig: {
			requiredVersion: `^${shareArgs.version}`,
			singleton: false,
			eager: false,
			strictVersion: false,
			...shareArgs.shareConfig
		},
		get,
		loaded: shareArgs?.loaded || "lib" in shareArgs ? true : void 0,
		version: shareArgs.version ?? "0",
		scope: Array.isArray(shareArgs.scope) ? shareArgs.scope : [shareArgs.scope ?? "default"],
		strategy: (shareArgs.strategy ?? shareStrategy) || "version-first",
		treeShaking: shareArgs.treeShaking ? {
			...shareArgs.treeShaking,
			mode: shareArgs.treeShaking.mode ?? "server-calc",
			status: shareArgs.treeShaking.status ?? 1,
			useIn: []
		} : void 0
	};
}
function formatShareConfigs(prevOptions, newOptions) {
	const shareArgs = newOptions.shared || {};
	const from = newOptions.name;
	const newShareInfos = Object.keys(shareArgs).reduce((res, pkgName) => {
		const arrayShareArgs = arrayOptions(shareArgs[pkgName]);
		res[pkgName] = res[pkgName] || [];
		arrayShareArgs.forEach((shareConfig) => {
			res[pkgName].push(formatShare(shareConfig, from, pkgName, newOptions.shareStrategy));
		});
		return res;
	}, {});
	const allShareInfos = { ...prevOptions.shared };
	Object.keys(newShareInfos).forEach((shareKey) => {
		if (!allShareInfos[shareKey]) allShareInfos[shareKey] = newShareInfos[shareKey];
		else newShareInfos[shareKey].forEach((newUserSharedOptions) => {
			if (!allShareInfos[shareKey].find((sharedVal) => sharedVal.version === newUserSharedOptions.version)) allShareInfos[shareKey].push(newUserSharedOptions);
		});
	});
	return {
		allShareInfos,
		newShareInfos
	};
}
function shouldUseTreeShaking(treeShaking, usedExports) {
	if (!treeShaking) return false;
	const { status, mode } = treeShaking;
	if (status === 0) return false;
	if (status === 2) return true;
	if (mode === "runtime-infer") {
		if (!usedExports) return true;
		return isMatchUsedExports(treeShaking, usedExports);
	}
	return false;
}
/**
* compare version a and b, return true if a is less than b
*/
function versionLt(a, b) {
	const transformInvalidVersion = (version) => {
		if (!Number.isNaN(Number(version))) {
			const splitArr = version.split(".");
			let validVersion = version;
			for (let i = 0; i < 3 - splitArr.length; i++) validVersion += ".0";
			return validVersion;
		}
		return version;
	};
	if (satisfy(transformInvalidVersion(a), `<=${transformInvalidVersion(b)}`)) return true;
	else return false;
}
var findVersion = (shareVersionMap, cb) => {
	const callback = cb || function(prev, cur) {
		return versionLt(prev, cur);
	};
	return Object.keys(shareVersionMap).reduce((prev, cur) => {
		if (!prev) return cur;
		if (callback(prev, cur)) return cur;
		if (prev === "0") return cur;
		return prev;
	}, 0);
};
var isLoaded = (shared) => {
	return Boolean(shared.loaded) || typeof shared.lib === "function";
};
var isLoading = (shared) => {
	return Boolean(shared.loading);
};
var isMatchUsedExports = (treeShaking, usedExports) => {
	if (!treeShaking || !usedExports) return false;
	const { usedExports: treeShakingUsedExports } = treeShaking;
	if (!treeShakingUsedExports) return false;
	if (usedExports.every((e) => treeShakingUsedExports.includes(e))) return true;
	return false;
};
function findSingletonVersionOrderByVersion(shareScopeMap, scope, pkgName, treeShaking) {
	const versions = shareScopeMap[scope][pkgName];
	let version = "";
	let useTreesShaking = shouldUseTreeShaking(treeShaking);
	const callback = function(prev, cur) {
		if (useTreesShaking) {
			if (!versions[prev].treeShaking) return true;
			if (!versions[cur].treeShaking) return false;
			return !isLoaded(versions[prev].treeShaking) && versionLt(prev, cur);
		}
		return !isLoaded(versions[prev]) && versionLt(prev, cur);
	};
	if (useTreesShaking) {
		version = findVersion(shareScopeMap[scope][pkgName], callback);
		if (version) return {
			version,
			useTreesShaking
		};
		useTreesShaking = false;
	}
	return {
		version: findVersion(shareScopeMap[scope][pkgName], callback),
		useTreesShaking
	};
}
var isLoadingOrLoaded = (shared) => {
	return isLoaded(shared) || isLoading(shared);
};
function findSingletonVersionOrderByLoaded(shareScopeMap, scope, pkgName, treeShaking) {
	const versions = shareScopeMap[scope][pkgName];
	let version = "";
	let useTreesShaking = shouldUseTreeShaking(treeShaking);
	const callback = function(prev, cur) {
		if (useTreesShaking) {
			if (!versions[prev].treeShaking) return true;
			if (!versions[cur].treeShaking) return false;
			if (isLoadingOrLoaded(versions[cur].treeShaking)) if (isLoadingOrLoaded(versions[prev].treeShaking)) return Boolean(versionLt(prev, cur));
			else return true;
			if (isLoadingOrLoaded(versions[prev].treeShaking)) return false;
		}
		if (isLoadingOrLoaded(versions[cur])) if (isLoadingOrLoaded(versions[prev])) return Boolean(versionLt(prev, cur));
		else return true;
		if (isLoadingOrLoaded(versions[prev])) return false;
		return versionLt(prev, cur);
	};
	if (useTreesShaking) {
		version = findVersion(shareScopeMap[scope][pkgName], callback);
		if (version) return {
			version,
			useTreesShaking
		};
		useTreesShaking = false;
	}
	return {
		version: findVersion(shareScopeMap[scope][pkgName], callback),
		useTreesShaking
	};
}
function getFindShareFunction(strategy) {
	if (strategy === "loaded-first") return findSingletonVersionOrderByLoaded;
	return findSingletonVersionOrderByVersion;
}
function getRegisteredShare(localShareScopeMap, pkgName, shareInfo, resolveShare) {
	if (!localShareScopeMap) return;
	const { shareConfig, scope = DEFAULT_SCOPE, strategy, treeShaking } = shareInfo;
	const scopes = Array.isArray(scope) ? scope : [scope];
	for (const sc of scopes) if (shareConfig && localShareScopeMap[sc] && localShareScopeMap[sc][pkgName]) {
		const { requiredVersion } = shareConfig;
		const { version: maxOrSingletonVersion, useTreesShaking } = getFindShareFunction(strategy)(localShareScopeMap, sc, pkgName, treeShaking);
		const defaultResolver = () => {
			const shared = localShareScopeMap[sc][pkgName][maxOrSingletonVersion];
			if (shareConfig.singleton) {
				if (typeof requiredVersion === "string" && !satisfy(maxOrSingletonVersion, requiredVersion)) {
					const msg = `Version ${maxOrSingletonVersion} from ${maxOrSingletonVersion && shared.from} of shared singleton module ${pkgName} does not satisfy the requirement of ${shareInfo.from} which needs ${requiredVersion})`;
					if (shareConfig.strictVersion) error(msg);
					else warn(msg);
				}
				return {
					shared,
					useTreesShaking
				};
			} else {
				if (requiredVersion === false || requiredVersion === "*") return {
					shared,
					useTreesShaking
				};
				if (satisfy(maxOrSingletonVersion, requiredVersion)) return {
					shared,
					useTreesShaking
				};
				const _usedTreeShaking = shouldUseTreeShaking(treeShaking);
				if (_usedTreeShaking) for (const [versionKey, versionValue] of Object.entries(localShareScopeMap[sc][pkgName])) {
					if (!shouldUseTreeShaking(versionValue.treeShaking, treeShaking?.usedExports)) continue;
					if (satisfy(versionKey, requiredVersion)) return {
						shared: versionValue,
						useTreesShaking: _usedTreeShaking
					};
				}
				for (const [versionKey, versionValue] of Object.entries(localShareScopeMap[sc][pkgName])) if (satisfy(versionKey, requiredVersion)) return {
					shared: versionValue,
					useTreesShaking: false
				};
			}
		};
		const params = {
			shareScopeMap: localShareScopeMap,
			scope: sc,
			pkgName,
			version: maxOrSingletonVersion,
			GlobalFederation: Global.__FEDERATION__,
			shareInfo,
			resolver: defaultResolver
		};
		return (resolveShare.emit(params) || params).resolver();
	}
}
function getGlobalShareScope() {
	return Global.__FEDERATION__.__SHARE__;
}
function getTargetSharedOptions(options) {
	const { pkgName, extraOptions, shareInfos } = options;
	const defaultResolver = (sharedOptions) => {
		if (!sharedOptions) return;
		const shareVersionMap = {};
		sharedOptions.forEach((shared) => {
			shareVersionMap[shared.version] = shared;
		});
		const callback = function(prev, cur) {
			return !isLoaded(shareVersionMap[prev]) && versionLt(prev, cur);
		};
		return shareVersionMap[findVersion(shareVersionMap, callback)];
	};
	const resolver = extraOptions?.resolver ?? defaultResolver;
	const isPlainObject = (val) => {
		return val !== null && typeof val === "object" && !Array.isArray(val);
	};
	const merge = (...sources) => {
		const out = {};
		for (const src of sources) {
			if (!src) continue;
			for (const [key, value] of Object.entries(src)) {
				const prev = out[key];
				if (isPlainObject(prev) && isPlainObject(value)) out[key] = merge(prev, value);
				else if (value !== void 0) out[key] = value;
			}
		}
		return out;
	};
	return merge(resolver(shareInfos[pkgName]), extraOptions?.customShareInfo);
}
var addUseIn = (shared, from) => {
	if (!shared.useIn) shared.useIn = [];
	addUniqueItem(shared.useIn, from);
};
function directShare(shared, useTreesShaking) {
	if (useTreesShaking && shared.treeShaking) return shared.treeShaking;
	return shared;
}
function getBuilderId$1() {
	return typeof FEDERATION_BUILD_IDENTIFIER !== "undefined" ? FEDERATION_BUILD_IDENTIFIER : "";
}
function matchRemoteWithNameAndExpose(remotes, id) {
	for (const remote of remotes) {
		const isNameMatched = id.startsWith(remote.name);
		let expose = id.replace(remote.name, "");
		if (isNameMatched) {
			if (expose.startsWith("/")) {
				const pkgNameOrAlias = remote.name;
				expose = `.${expose}`;
				return {
					pkgNameOrAlias,
					expose,
					remote
				};
			} else if (expose === "") return {
				pkgNameOrAlias: remote.name,
				expose: ".",
				remote
			};
		}
		const isAliasMatched = remote.alias && id.startsWith(remote.alias);
		let exposeWithAlias = remote.alias && id.replace(remote.alias, "");
		if (remote.alias && isAliasMatched) {
			if (exposeWithAlias && exposeWithAlias.startsWith("/")) {
				const pkgNameOrAlias = remote.alias;
				exposeWithAlias = `.${exposeWithAlias}`;
				return {
					pkgNameOrAlias,
					expose: exposeWithAlias,
					remote
				};
			} else if (exposeWithAlias === "") return {
				pkgNameOrAlias: remote.alias,
				expose: ".",
				remote
			};
		}
	}
}
function matchRemote(remotes, nameOrAlias) {
	for (const remote of remotes) {
		if (nameOrAlias === remote.name) return remote;
		if (remote.alias && nameOrAlias === remote.alias) return remote;
	}
}
function registerPlugins(plugins, instance) {
	const globalPlugins = getGlobalHostPlugins();
	const hookInstances = [
		instance.hooks,
		instance.remoteHandler.hooks,
		instance.sharedHandler.hooks,
		instance.snapshotHandler.hooks,
		instance.loaderHook,
		instance.bridgeHook
	];
	if (globalPlugins.length > 0) globalPlugins.forEach((plugin) => {
		if (plugins?.find((item) => item.name !== plugin.name)) plugins.push(plugin);
	});
	if (plugins && plugins.length > 0) plugins.forEach((plugin) => {
		hookInstances.forEach((hookInstance) => {
			hookInstance.applyPlugin(plugin, instance);
		});
	});
	return plugins;
}
var importCallback = ".then(callbacks[0]).catch(callbacks[1])";
async function loadEsmEntry({ entry, remoteEntryExports }) {
	return new Promise((resolve, reject) => {
		try {
			if (!remoteEntryExports) if (typeof FEDERATION_ALLOW_NEW_FUNCTION !== "undefined") new Function("callbacks", `import("${entry}")${importCallback}`)([resolve, reject]);
			else __vitePreload(() => import(
				/* webpackIgnore: true */
				/* @vite-ignore */
				entry
).then(resolve), []).catch(reject);
			else resolve(remoteEntryExports);
		} catch (e) {
			reject(e);
		}
	});
}
async function loadSystemJsEntry({ entry, remoteEntryExports }) {
	return new Promise((resolve, reject) => {
		try {
			if (!remoteEntryExports) if (typeof __system_context__ === "undefined") System.import(entry).then(resolve).catch(reject);
			else new Function("callbacks", `System.import("${entry}")${importCallback}`)([resolve, reject]);
			else resolve(remoteEntryExports);
		} catch (e) {
			reject(e);
		}
	});
}
function handleRemoteEntryLoaded(name, globalName, entry) {
	const { remoteEntryKey, entryExports } = getRemoteEntryExports(name, globalName);
	assert(entryExports, getShortErrorMsg(RUNTIME_001, runtimeDescMap, {
		remoteName: name,
		remoteEntryUrl: entry,
		remoteEntryKey
	}));
	return entryExports;
}
async function loadEntryScript({ name, globalName, entry, loaderHook, getEntryUrl }) {
	const { entryExports: remoteEntryExports } = getRemoteEntryExports(name, globalName);
	if (remoteEntryExports) return remoteEntryExports;
	return loadScript(getEntryUrl ? getEntryUrl(entry) : entry, {
		attrs: {},
		createScriptHook: (url, attrs) => {
			const res = loaderHook.lifecycle.createScript.emit({
				url,
				attrs
			});
			if (!res) return;
			if (res instanceof HTMLScriptElement) return res;
			if ("script" in res || "timeout" in res) return res;
		}
	}).then(() => {
		return handleRemoteEntryLoaded(name, globalName, entry);
	}).catch((e) => {
		assert(void 0, getShortErrorMsg(RUNTIME_008, runtimeDescMap, {
			remoteName: name,
			resourceUrl: entry
		}));
		throw e;
	});
}
async function loadEntryDom({ remoteInfo, remoteEntryExports, loaderHook, getEntryUrl }) {
	const { entry, entryGlobalName: globalName, name, type } = remoteInfo;
	switch (type) {
		case "esm":
		case "module": return loadEsmEntry({
			entry,
			remoteEntryExports
		});
		case "system": return loadSystemJsEntry({
			entry,
			remoteEntryExports
		});
		default: return loadEntryScript({
			entry,
			globalName,
			name,
			loaderHook,
			getEntryUrl
		});
	}
}
function getRemoteEntryUniqueKey(remoteInfo) {
	const { entry, name } = remoteInfo;
	return composeKeyWithSeparator(name, entry);
}
async function getRemoteEntry(params) {
	const { origin, remoteEntryExports, remoteInfo, getEntryUrl, _inErrorHandling = false } = params;
	const uniqueKey = getRemoteEntryUniqueKey(remoteInfo);
	if (remoteEntryExports) return remoteEntryExports;
	if (!globalLoading[uniqueKey]) {
		const loadEntryHook = origin.remoteHandler.hooks.lifecycle.loadEntry;
		const loaderHook = origin.loaderHook;
		globalLoading[uniqueKey] = loadEntryHook.emit({
			loaderHook,
			remoteInfo,
			remoteEntryExports
		}).then((res) => {
			if (res) return res;
			return loadEntryDom({
				remoteInfo,
				remoteEntryExports,
				loaderHook,
				getEntryUrl
			});
		}).catch(async (err) => {
			const uniqueKey = getRemoteEntryUniqueKey(remoteInfo);
			if (err instanceof Error && err.message.includes("RUNTIME-008") && !_inErrorHandling) {
				const wrappedGetRemoteEntry = (params) => {
					return getRemoteEntry({
						...params,
						_inErrorHandling: true
					});
				};
				const RemoteEntryExports = await origin.loaderHook.lifecycle.loadEntryError.emit({
					getRemoteEntry: wrappedGetRemoteEntry,
					origin,
					remoteInfo,
					remoteEntryExports,
					globalLoading,
					uniqueKey
				});
				if (RemoteEntryExports) return RemoteEntryExports;
			}
			throw err;
		});
	}
	return globalLoading[uniqueKey];
}
function getRemoteInfo(remote) {
	return {
		...remote,
		entry: "entry" in remote ? remote.entry : "",
		type: remote.type || DEFAULT_REMOTE_TYPE,
		entryGlobalName: remote.entryGlobalName || remote.name,
		shareScope: remote.shareScope || DEFAULT_SCOPE
	};
}
function defaultPreloadArgs(preloadConfig) {
	return {
		resourceCategory: "sync",
		share: true,
		depsRemote: true,
		prefetchInterface: false,
		...preloadConfig
	};
}
function formatPreloadArgs(remotes, preloadArgs) {
	return preloadArgs.map((args) => {
		const remoteInfo = matchRemote(remotes, args.nameOrAlias);
		assert(remoteInfo, `Unable to preload ${args.nameOrAlias} as it is not included in ${!remoteInfo && safeToString({
			remoteInfo,
			remotes
		})}`);
		return {
			remote: remoteInfo,
			preloadConfig: defaultPreloadArgs(args)
		};
	});
}
function normalizePreloadExposes(exposes) {
	if (!exposes) return [];
	return exposes.map((expose) => {
		if (expose === ".") return expose;
		if (expose.startsWith("./")) return expose.replace("./", "");
		return expose;
	});
}
function preloadAssets(remoteInfo, host, assets, useLinkPreload = true) {
	const { cssAssets, jsAssetsWithoutEntry, entryAssets } = assets;
	if (host.options.inBrowser) {
		entryAssets.forEach((asset) => {
			const { moduleInfo } = asset;
			const module = host.moduleCache.get(remoteInfo.name);
			if (module) getRemoteEntry({
				origin: host,
				remoteInfo: moduleInfo,
				remoteEntryExports: module.remoteEntryExports
			});
			else getRemoteEntry({
				origin: host,
				remoteInfo: moduleInfo,
				remoteEntryExports: void 0
			});
		});
		if (useLinkPreload) {
			const defaultAttrs = {
				rel: "preload",
				as: "style"
			};
			cssAssets.forEach((cssUrl) => {
				const { link: cssEl, needAttach } = createLink({
					url: cssUrl,
					cb: () => {},
					attrs: defaultAttrs,
					createLinkHook: (url, attrs) => {
						const res = host.loaderHook.lifecycle.createLink.emit({
							url,
							attrs
						});
						if (res instanceof HTMLLinkElement) return res;
					}
				});
				needAttach && document.head.appendChild(cssEl);
			});
		} else {
			const defaultAttrs = {
				rel: "stylesheet",
				type: "text/css"
			};
			cssAssets.forEach((cssUrl) => {
				const { link: cssEl, needAttach } = createLink({
					url: cssUrl,
					cb: () => {},
					attrs: defaultAttrs,
					createLinkHook: (url, attrs) => {
						const res = host.loaderHook.lifecycle.createLink.emit({
							url,
							attrs
						});
						if (res instanceof HTMLLinkElement) return res;
					},
					needDeleteLink: false
				});
				needAttach && document.head.appendChild(cssEl);
			});
		}
		if (useLinkPreload) {
			const defaultAttrs = {
				rel: "preload",
				as: "script"
			};
			jsAssetsWithoutEntry.forEach((jsUrl) => {
				const { link: linkEl, needAttach } = createLink({
					url: jsUrl,
					cb: () => {},
					attrs: defaultAttrs,
					createLinkHook: (url, attrs) => {
						const res = host.loaderHook.lifecycle.createLink.emit({
							url,
							attrs
						});
						if (res instanceof HTMLLinkElement) return res;
					}
				});
				needAttach && document.head.appendChild(linkEl);
			});
		} else {
			const defaultAttrs = {
				fetchpriority: "high",
				type: remoteInfo?.type === "module" ? "module" : "text/javascript"
			};
			jsAssetsWithoutEntry.forEach((jsUrl) => {
				const { script: scriptEl, needAttach } = createScript({
					url: jsUrl,
					cb: () => {},
					attrs: defaultAttrs,
					createScriptHook: (url, attrs) => {
						const res = host.loaderHook.lifecycle.createScript.emit({
							url,
							attrs
						});
						if (res instanceof HTMLScriptElement) return res;
					},
					needDeleteScript: true
				});
				needAttach && document.head.appendChild(scriptEl);
			});
		}
	}
}
function createRemoteEntryInitOptions(remoteInfo, hostShareScopeMap) {
	const localShareScopeMap = hostShareScopeMap;
	const shareScopeKeys = Array.isArray(remoteInfo.shareScope) ? remoteInfo.shareScope : [remoteInfo.shareScope];
	if (!shareScopeKeys.length) shareScopeKeys.push("default");
	shareScopeKeys.forEach((shareScopeKey) => {
		if (!localShareScopeMap[shareScopeKey]) localShareScopeMap[shareScopeKey] = {};
	});
	const remoteEntryInitOptions = {
		version: remoteInfo.version || "",
		shareScopeKeys: Array.isArray(remoteInfo.shareScope) ? shareScopeKeys : remoteInfo.shareScope || "default"
	};
	Object.defineProperty(remoteEntryInitOptions, "shareScopeMap", {
		value: localShareScopeMap,
		enumerable: false
	});
	return {
		remoteEntryInitOptions,
		shareScope: localShareScopeMap[shareScopeKeys[0]],
		initScope: []
	};
}
var Module = class {
	constructor({ remoteInfo, host }) {
		this.inited = false;
		this.initing = false;
		this.lib = void 0;
		this.remoteInfo = remoteInfo;
		this.host = host;
	}
	async getEntry() {
		if (this.remoteEntryExports) return this.remoteEntryExports;
		const remoteEntryExports = await getRemoteEntry({
			origin: this.host,
			remoteInfo: this.remoteInfo,
			remoteEntryExports: this.remoteEntryExports
		});
		assert(remoteEntryExports, `remoteEntryExports is undefined \n ${safeToString(this.remoteInfo)}`);
		this.remoteEntryExports = remoteEntryExports;
		return this.remoteEntryExports;
	}
	async init(id, remoteSnapshot) {
		const remoteEntryExports = await this.getEntry();
		if (this.inited) return remoteEntryExports;
		if (this.initPromise) {
			await this.initPromise;
			return remoteEntryExports;
		}
		this.initing = true;
		this.initPromise = (async () => {
			const { remoteEntryInitOptions, shareScope, initScope } = createRemoteEntryInitOptions(this.remoteInfo, this.host.shareScopeMap);
			const initContainerOptions = await this.host.hooks.lifecycle.beforeInitContainer.emit({
				shareScope,
				remoteEntryInitOptions,
				initScope,
				remoteInfo: this.remoteInfo,
				origin: this.host
			});
			if (typeof remoteEntryExports?.init === "undefined") error(getShortErrorMsg(RUNTIME_002, runtimeDescMap, {
				hostName: this.host.name,
				remoteName: this.remoteInfo.name,
				remoteEntryUrl: this.remoteInfo.entry,
				remoteEntryKey: this.remoteInfo.entryGlobalName
			}));
			await remoteEntryExports.init(initContainerOptions.shareScope, initContainerOptions.initScope, initContainerOptions.remoteEntryInitOptions);
			await this.host.hooks.lifecycle.initContainer.emit({
				...initContainerOptions,
				id,
				remoteSnapshot,
				remoteEntryExports
			});
			this.inited = true;
		})();
		try {
			await this.initPromise;
		} finally {
			this.initing = false;
			this.initPromise = void 0;
		}
		return remoteEntryExports;
	}
	async get(id, expose, options, remoteSnapshot) {
		const { loadFactory = true } = options || { loadFactory: true };
		const remoteEntryExports = await this.init(id, remoteSnapshot);
		this.lib = remoteEntryExports;
		let moduleFactory;
		moduleFactory = await this.host.loaderHook.lifecycle.getModuleFactory.emit({
			remoteEntryExports,
			expose,
			moduleInfo: this.remoteInfo
		});
		if (!moduleFactory) moduleFactory = await remoteEntryExports.get(expose);
		assert(moduleFactory, `${getFMId(this.remoteInfo)} remote don't export ${expose}.`);
		const symbolName = processModuleAlias(this.remoteInfo.name, expose);
		const wrapModuleFactory = this.wraperFactory(moduleFactory, symbolName);
		if (!loadFactory) return wrapModuleFactory;
		return await wrapModuleFactory();
	}
	wraperFactory(moduleFactory, id) {
		function defineModuleId(res, id) {
			if (res && typeof res === "object" && Object.isExtensible(res) && !Object.getOwnPropertyDescriptor(res, Symbol.for("mf_module_id"))) Object.defineProperty(res, Symbol.for("mf_module_id"), {
				value: id,
				enumerable: false
			});
		}
		if (moduleFactory instanceof Promise) return async () => {
			const res = await moduleFactory();
			defineModuleId(res, id);
			return res;
		};
		else return () => {
			const res = moduleFactory();
			defineModuleId(res, id);
			return res;
		};
	}
};
var SyncHook = class {
	constructor(type) {
		this.type = "";
		this.listeners = /* @__PURE__ */ new Set();
		if (type) this.type = type;
	}
	on(fn) {
		if (typeof fn === "function") this.listeners.add(fn);
	}
	once(fn) {
		const self = this;
		this.on(function wrapper(...args) {
			self.remove(wrapper);
			return fn.apply(null, args);
		});
	}
	emit(...data) {
		let result;
		if (this.listeners.size > 0) this.listeners.forEach((fn) => {
			result = fn(...data);
		});
		return result;
	}
	remove(fn) {
		this.listeners.delete(fn);
	}
	removeAll() {
		this.listeners.clear();
	}
};
var AsyncHook = class extends SyncHook {
	emit(...data) {
		let result;
		const ls = Array.from(this.listeners);
		if (ls.length > 0) {
			let i = 0;
			const call = (prev) => {
				if (prev === false) return false;
				else if (i < ls.length) return Promise.resolve(ls[i++].apply(null, data)).then(call);
				else return prev;
			};
			result = call();
		}
		return Promise.resolve(result);
	}
};
function checkReturnData(originalData, returnedData) {
	if (!isObject(returnedData)) return false;
	if (originalData !== returnedData) {
		for (const key in originalData) if (!(key in returnedData)) return false;
	}
	return true;
}
var SyncWaterfallHook = class extends SyncHook {
	constructor(type) {
		super();
		this.onerror = error;
		this.type = type;
	}
	emit(data) {
		if (!isObject(data)) error(`The data for the "${this.type}" hook should be an object.`);
		for (const fn of this.listeners) try {
			const tempData = fn(data);
			if (checkReturnData(data, tempData)) data = tempData;
			else {
				this.onerror(`A plugin returned an unacceptable value for the "${this.type}" type.`);
				break;
			}
		} catch (e) {
			warn(e);
			this.onerror(e);
		}
		return data;
	}
};
var AsyncWaterfallHook = class extends SyncHook {
	constructor(type) {
		super();
		this.onerror = error;
		this.type = type;
	}
	emit(data) {
		if (!isObject(data)) error(`The response data for the "${this.type}" hook must be an object.`);
		const ls = Array.from(this.listeners);
		if (ls.length > 0) {
			let i = 0;
			const processError = (e) => {
				warn(e);
				this.onerror(e);
				return data;
			};
			const call = (prevData) => {
				if (checkReturnData(data, prevData)) {
					data = prevData;
					if (i < ls.length) try {
						return Promise.resolve(ls[i++](data)).then(call, processError);
					} catch (e) {
						return processError(e);
					}
				} else this.onerror(`A plugin returned an incorrect value for the "${this.type}" type.`);
				return data;
			};
			return Promise.resolve(call(data));
		}
		return Promise.resolve(data);
	}
};
var PluginSystem = class {
	constructor(lifecycle) {
		this.registerPlugins = {};
		this.lifecycle = lifecycle;
		this.lifecycleKeys = Object.keys(lifecycle);
	}
	applyPlugin(plugin, instance) {
		assert(isPlainObject(plugin), "Plugin configuration is invalid.");
		const pluginName = plugin.name;
		assert(pluginName, "A name must be provided by the plugin.");
		if (!this.registerPlugins[pluginName]) {
			this.registerPlugins[pluginName] = plugin;
			plugin.apply?.(instance);
			Object.keys(this.lifecycle).forEach((key) => {
				const pluginLife = plugin[key];
				if (pluginLife) this.lifecycle[key].on(pluginLife);
			});
		}
	}
	removePlugin(pluginName) {
		assert(pluginName, "A name is required.");
		const plugin = this.registerPlugins[pluginName];
		assert(plugin, `The plugin "${pluginName}" is not registered.`);
		Object.keys(plugin).forEach((key) => {
			if (key !== "name") this.lifecycle[key].remove(plugin[key]);
		});
	}
};
function assignRemoteInfo(remoteInfo, remoteSnapshot) {
	const remoteEntryInfo = getRemoteEntryInfoFromSnapshot(remoteSnapshot);
	if (!remoteEntryInfo.url) error(`The attribute remoteEntry of ${remoteInfo.name} must not be undefined.`);
	let entryUrl = getResourceUrl(remoteSnapshot, remoteEntryInfo.url);
	if (!isBrowserEnv() && !entryUrl.startsWith("http")) entryUrl = `https:${entryUrl}`;
	remoteInfo.type = remoteEntryInfo.type;
	remoteInfo.entryGlobalName = remoteEntryInfo.globalName;
	remoteInfo.entry = entryUrl;
	remoteInfo.version = remoteSnapshot.version;
	remoteInfo.buildVersion = remoteSnapshot.buildVersion;
}
function snapshotPlugin() {
	return {
		name: "snapshot-plugin",
		async afterResolve(args) {
			const { remote, pkgNameOrAlias, expose, origin, remoteInfo, id } = args;
			if (!isRemoteInfoWithEntry(remote) || !isPureRemoteEntry(remote)) {
				const { remoteSnapshot, globalSnapshot } = await origin.snapshotHandler.loadRemoteSnapshotInfo({
					moduleInfo: remote,
					id
				});
				assignRemoteInfo(remoteInfo, remoteSnapshot);
				const preloadOptions = {
					remote,
					preloadConfig: {
						nameOrAlias: pkgNameOrAlias,
						exposes: [expose],
						resourceCategory: "sync",
						share: false,
						depsRemote: false
					}
				};
				const assets = await origin.remoteHandler.hooks.lifecycle.generatePreloadAssets.emit({
					origin,
					preloadOptions,
					remoteInfo,
					remote,
					remoteSnapshot,
					globalSnapshot
				});
				if (assets) preloadAssets(remoteInfo, origin, assets, false);
				return {
					...args,
					remoteSnapshot
				};
			}
			return args;
		}
	};
}
function splitId(id) {
	const splitInfo = id.split(":");
	if (splitInfo.length === 1) return {
		name: splitInfo[0],
		version: void 0
	};
	else if (splitInfo.length === 2) return {
		name: splitInfo[0],
		version: splitInfo[1]
	};
	else return {
		name: splitInfo[1],
		version: splitInfo[2]
	};
}
function traverseModuleInfo(globalSnapshot, remoteInfo, traverse, isRoot, memo = {}, remoteSnapshot) {
	const { value: snapshotValue } = getInfoWithoutType(globalSnapshot, getFMId(remoteInfo));
	const effectiveRemoteSnapshot = remoteSnapshot || snapshotValue;
	if (effectiveRemoteSnapshot && !isManifestProvider(effectiveRemoteSnapshot)) {
		traverse(effectiveRemoteSnapshot, remoteInfo, isRoot);
		if (effectiveRemoteSnapshot.remotesInfo) {
			const remoteKeys = Object.keys(effectiveRemoteSnapshot.remotesInfo);
			for (const key of remoteKeys) {
				if (memo[key]) continue;
				memo[key] = true;
				const subRemoteInfo = splitId(key);
				const remoteValue = effectiveRemoteSnapshot.remotesInfo[key];
				traverseModuleInfo(globalSnapshot, {
					name: subRemoteInfo.name,
					version: remoteValue.matchedVersion
				}, traverse, false, memo, void 0);
			}
		}
	}
}
var isExisted = (type, url) => {
	return document.querySelector(`${type}[${type === "link" ? "href" : "src"}="${url}"]`);
};
function generatePreloadAssets(origin, preloadOptions, remote, globalSnapshot, remoteSnapshot) {
	const cssAssets = [];
	const jsAssets = [];
	const entryAssets = [];
	const loadedSharedJsAssets = /* @__PURE__ */ new Set();
	const loadedSharedCssAssets = /* @__PURE__ */ new Set();
	const { options } = origin;
	const { preloadConfig: rootPreloadConfig } = preloadOptions;
	const { depsRemote } = rootPreloadConfig;
	traverseModuleInfo(globalSnapshot, remote, (moduleInfoSnapshot, remoteInfo, isRoot) => {
		let preloadConfig;
		if (isRoot) preloadConfig = rootPreloadConfig;
		else if (Array.isArray(depsRemote)) {
			const findPreloadConfig = depsRemote.find((remoteConfig) => {
				if (remoteConfig.nameOrAlias === remoteInfo.name || remoteConfig.nameOrAlias === remoteInfo.alias) return true;
				return false;
			});
			if (!findPreloadConfig) return;
			preloadConfig = defaultPreloadArgs(findPreloadConfig);
		} else if (depsRemote === true) preloadConfig = rootPreloadConfig;
		else return;
		const remoteEntryUrl = getResourceUrl(moduleInfoSnapshot, getRemoteEntryInfoFromSnapshot(moduleInfoSnapshot).url);
		if (remoteEntryUrl) entryAssets.push({
			name: remoteInfo.name,
			moduleInfo: {
				name: remoteInfo.name,
				entry: remoteEntryUrl,
				type: "remoteEntryType" in moduleInfoSnapshot ? moduleInfoSnapshot.remoteEntryType : "global",
				entryGlobalName: "globalName" in moduleInfoSnapshot ? moduleInfoSnapshot.globalName : remoteInfo.name,
				shareScope: "",
				version: "version" in moduleInfoSnapshot ? moduleInfoSnapshot.version : void 0
			},
			url: remoteEntryUrl
		});
		let moduleAssetsInfo = "modules" in moduleInfoSnapshot ? moduleInfoSnapshot.modules : [];
		const normalizedPreloadExposes = normalizePreloadExposes(preloadConfig.exposes);
		if (normalizedPreloadExposes.length && "modules" in moduleInfoSnapshot) moduleAssetsInfo = moduleInfoSnapshot?.modules?.reduce((assets, moduleAssetInfo) => {
			if (normalizedPreloadExposes?.indexOf(moduleAssetInfo.moduleName) !== -1) assets.push(moduleAssetInfo);
			return assets;
		}, []);
		function handleAssets(assets) {
			const assetsRes = assets.map((asset) => getResourceUrl(moduleInfoSnapshot, asset));
			if (preloadConfig.filter) return assetsRes.filter(preloadConfig.filter);
			return assetsRes;
		}
		if (moduleAssetsInfo) {
			const assetsLength = moduleAssetsInfo.length;
			for (let index = 0; index < assetsLength; index++) {
				const assetsInfo = moduleAssetsInfo[index];
				const exposeFullPath = `${remoteInfo.name}/${assetsInfo.moduleName}`;
				origin.remoteHandler.hooks.lifecycle.handlePreloadModule.emit({
					id: assetsInfo.moduleName === "." ? remoteInfo.name : exposeFullPath,
					name: remoteInfo.name,
					remoteSnapshot: moduleInfoSnapshot,
					preloadConfig,
					remote: remoteInfo,
					origin
				});
				if (getPreloaded(exposeFullPath)) continue;
				if (preloadConfig.resourceCategory === "all") {
					cssAssets.push(...handleAssets(assetsInfo.assets.css.async));
					cssAssets.push(...handleAssets(assetsInfo.assets.css.sync));
					jsAssets.push(...handleAssets(assetsInfo.assets.js.async));
					jsAssets.push(...handleAssets(assetsInfo.assets.js.sync));
				} else if (preloadConfig.resourceCategory = "sync") {
					cssAssets.push(...handleAssets(assetsInfo.assets.css.sync));
					jsAssets.push(...handleAssets(assetsInfo.assets.js.sync));
				}
				setPreloaded(exposeFullPath);
			}
		}
	}, true, {}, remoteSnapshot);
	if (remoteSnapshot.shared && remoteSnapshot.shared.length > 0) {
		const collectSharedAssets = (shareInfo, snapshotShared) => {
			const { shared: registeredShared } = getRegisteredShare(origin.shareScopeMap, snapshotShared.sharedName, shareInfo, origin.sharedHandler.hooks.lifecycle.resolveShare) || {};
			if (registeredShared && typeof registeredShared.lib === "function") {
				snapshotShared.assets.js.sync.forEach((asset) => {
					loadedSharedJsAssets.add(asset);
				});
				snapshotShared.assets.css.sync.forEach((asset) => {
					loadedSharedCssAssets.add(asset);
				});
			}
		};
		remoteSnapshot.shared.forEach((shared) => {
			const shareInfos = options.shared?.[shared.sharedName];
			if (!shareInfos) return;
			const sharedOptions = shared.version ? shareInfos.find((s) => s.version === shared.version) : shareInfos;
			if (!sharedOptions) return;
			arrayOptions(sharedOptions).forEach((s) => {
				collectSharedAssets(s, shared);
			});
		});
	}
	const needPreloadJsAssets = jsAssets.filter((asset) => !loadedSharedJsAssets.has(asset) && !isExisted("script", asset));
	return {
		cssAssets: cssAssets.filter((asset) => !loadedSharedCssAssets.has(asset) && !isExisted("link", asset)),
		jsAssetsWithoutEntry: needPreloadJsAssets,
		entryAssets: entryAssets.filter((entry) => !isExisted("script", entry.url))
	};
}
var generatePreloadAssetsPlugin = function() {
	return {
		name: "generate-preload-assets-plugin",
		async generatePreloadAssets(args) {
			const { origin, preloadOptions, remoteInfo, remote, globalSnapshot, remoteSnapshot } = args;
			if (!isBrowserEnv()) return {
				cssAssets: [],
				jsAssetsWithoutEntry: [],
				entryAssets: []
			};
			if (isRemoteInfoWithEntry(remote) && isPureRemoteEntry(remote)) return {
				cssAssets: [],
				jsAssetsWithoutEntry: [],
				entryAssets: [{
					name: remote.name,
					url: remote.entry,
					moduleInfo: {
						name: remoteInfo.name,
						entry: remote.entry,
						type: remoteInfo.type || "global",
						entryGlobalName: "",
						shareScope: ""
					}
				}]
			};
			assignRemoteInfo(remoteInfo, remoteSnapshot);
			return generatePreloadAssets(origin, preloadOptions, remoteInfo, globalSnapshot, remoteSnapshot);
		}
	};
};
function getGlobalRemoteInfo(moduleInfo, origin) {
	const hostGlobalSnapshot = getGlobalSnapshotInfoByModuleInfo({
		name: origin.name,
		version: origin.options.version
	});
	const globalRemoteInfo = hostGlobalSnapshot && "remotesInfo" in hostGlobalSnapshot && hostGlobalSnapshot.remotesInfo && getInfoWithoutType(hostGlobalSnapshot.remotesInfo, moduleInfo.name).value;
	if (globalRemoteInfo && globalRemoteInfo.matchedVersion) return {
		hostGlobalSnapshot,
		globalSnapshot: getGlobalSnapshot(),
		remoteSnapshot: getGlobalSnapshotInfoByModuleInfo({
			name: moduleInfo.name,
			version: globalRemoteInfo.matchedVersion
		})
	};
	return {
		hostGlobalSnapshot: void 0,
		globalSnapshot: getGlobalSnapshot(),
		remoteSnapshot: getGlobalSnapshotInfoByModuleInfo({
			name: moduleInfo.name,
			version: "version" in moduleInfo ? moduleInfo.version : void 0
		})
	};
}
var SnapshotHandler = class {
	constructor(HostInstance) {
		this.loadingHostSnapshot = null;
		this.manifestCache = /* @__PURE__ */ new Map();
		this.hooks = new PluginSystem({
			beforeLoadRemoteSnapshot: new AsyncHook("beforeLoadRemoteSnapshot"),
			loadSnapshot: new AsyncWaterfallHook("loadGlobalSnapshot"),
			loadRemoteSnapshot: new AsyncWaterfallHook("loadRemoteSnapshot"),
			afterLoadSnapshot: new AsyncWaterfallHook("afterLoadSnapshot")
		});
		this.manifestLoading = Global.__FEDERATION__.__MANIFEST_LOADING__;
		this.HostInstance = HostInstance;
		this.loaderHook = HostInstance.loaderHook;
	}
	async loadRemoteSnapshotInfo({ moduleInfo, id, expose }) {
		const { options } = this.HostInstance;
		await this.hooks.lifecycle.beforeLoadRemoteSnapshot.emit({
			options,
			moduleInfo
		});
		let hostSnapshot = getGlobalSnapshotInfoByModuleInfo({
			name: this.HostInstance.options.name,
			version: this.HostInstance.options.version
		});
		if (!hostSnapshot) {
			hostSnapshot = {
				version: this.HostInstance.options.version || "",
				remoteEntry: "",
				remotesInfo: {}
			};
			addGlobalSnapshot({ [this.HostInstance.options.name]: hostSnapshot });
		}
		if (hostSnapshot && "remotesInfo" in hostSnapshot && !getInfoWithoutType(hostSnapshot.remotesInfo, moduleInfo.name).value) {
			if ("version" in moduleInfo || "entry" in moduleInfo) hostSnapshot.remotesInfo = {
				...hostSnapshot?.remotesInfo,
				[moduleInfo.name]: { matchedVersion: "version" in moduleInfo ? moduleInfo.version : moduleInfo.entry }
			};
		}
		const { hostGlobalSnapshot, remoteSnapshot, globalSnapshot } = this.getGlobalRemoteInfo(moduleInfo);
		const { remoteSnapshot: globalRemoteSnapshot, globalSnapshot: globalSnapshotRes } = await this.hooks.lifecycle.loadSnapshot.emit({
			options,
			moduleInfo,
			hostGlobalSnapshot,
			remoteSnapshot,
			globalSnapshot
		});
		let mSnapshot;
		let gSnapshot;
		if (globalRemoteSnapshot) if (isManifestProvider(globalRemoteSnapshot)) {
			const remoteEntry = isBrowserEnv() ? globalRemoteSnapshot.remoteEntry : globalRemoteSnapshot.ssrRemoteEntry || globalRemoteSnapshot.remoteEntry || "";
			const moduleSnapshot = await this.getManifestJson(remoteEntry, moduleInfo, {});
			const globalSnapshotRes = setGlobalSnapshotInfoByModuleInfo({
				...moduleInfo,
				entry: remoteEntry
			}, moduleSnapshot);
			mSnapshot = moduleSnapshot;
			gSnapshot = globalSnapshotRes;
		} else {
			const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
				options: this.HostInstance.options,
				moduleInfo,
				remoteSnapshot: globalRemoteSnapshot,
				from: "global"
			});
			mSnapshot = remoteSnapshotRes;
			gSnapshot = globalSnapshotRes;
		}
		else if (isRemoteInfoWithEntry(moduleInfo)) {
			const moduleSnapshot = await this.getManifestJson(moduleInfo.entry, moduleInfo, {});
			const globalSnapshotRes = setGlobalSnapshotInfoByModuleInfo(moduleInfo, moduleSnapshot);
			const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
				options: this.HostInstance.options,
				moduleInfo,
				remoteSnapshot: moduleSnapshot,
				from: "global"
			});
			mSnapshot = remoteSnapshotRes;
			gSnapshot = globalSnapshotRes;
		} else error(getShortErrorMsg(RUNTIME_007, runtimeDescMap, {
			hostName: moduleInfo.name,
			hostVersion: moduleInfo.version,
			globalSnapshot: JSON.stringify(globalSnapshotRes)
		}));
		await this.hooks.lifecycle.afterLoadSnapshot.emit({
			id,
			host: this.HostInstance,
			options,
			moduleInfo,
			remoteSnapshot: mSnapshot
		});
		return {
			remoteSnapshot: mSnapshot,
			globalSnapshot: gSnapshot
		};
	}
	getGlobalRemoteInfo(moduleInfo) {
		return getGlobalRemoteInfo(moduleInfo, this.HostInstance);
	}
	async getManifestJson(manifestUrl, moduleInfo, extraOptions) {
		const getManifest = async () => {
			let manifestJson = this.manifestCache.get(manifestUrl);
			if (manifestJson) return manifestJson;
			try {
				let res = await this.loaderHook.lifecycle.fetch.emit(manifestUrl, {});
				if (!res || !(res instanceof Response)) res = await fetch(manifestUrl, {});
				manifestJson = await res.json();
			} catch (err) {
				manifestJson = await this.HostInstance.remoteHandler.hooks.lifecycle.errorLoadRemote.emit({
					id: manifestUrl,
					error: err,
					from: "runtime",
					lifecycle: "afterResolve",
					origin: this.HostInstance
				});
				if (!manifestJson) {
					delete this.manifestLoading[manifestUrl];
					error(getShortErrorMsg(RUNTIME_003, runtimeDescMap, {
						manifestUrl,
						moduleName: moduleInfo.name,
						hostName: this.HostInstance.options.name
					}, `${err}`));
				}
			}
			assert(manifestJson.metaData && manifestJson.exposes && manifestJson.shared, `${manifestUrl} is not a federation manifest`);
			this.manifestCache.set(manifestUrl, manifestJson);
			return manifestJson;
		};
		const asyncLoadProcess = async () => {
			const manifestJson = await getManifest();
			const remoteSnapshot = generateSnapshotFromManifest(manifestJson, { version: manifestUrl });
			const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
				options: this.HostInstance.options,
				moduleInfo,
				manifestJson,
				remoteSnapshot,
				manifestUrl,
				from: "manifest"
			});
			return remoteSnapshotRes;
		};
		if (!this.manifestLoading[manifestUrl]) this.manifestLoading[manifestUrl] = asyncLoadProcess().then((res) => res);
		return this.manifestLoading[manifestUrl];
	}
};
var SharedHandler = class {
	constructor(host) {
		this.hooks = new PluginSystem({
			beforeRegisterShare: new SyncWaterfallHook("beforeRegisterShare"),
			afterResolve: new AsyncWaterfallHook("afterResolve"),
			beforeLoadShare: new AsyncWaterfallHook("beforeLoadShare"),
			loadShare: new AsyncHook(),
			resolveShare: new SyncWaterfallHook("resolveShare"),
			initContainerShareScopeMap: new SyncWaterfallHook("initContainerShareScopeMap")
		});
		this.host = host;
		this.shareScopeMap = {};
		this.initTokens = {};
		this._setGlobalShareScopeMap(host.options);
	}
	registerShared(globalOptions, userOptions) {
		const { newShareInfos, allShareInfos } = formatShareConfigs(globalOptions, userOptions);
		Object.keys(newShareInfos).forEach((sharedKey) => {
			newShareInfos[sharedKey].forEach((sharedVal) => {
				sharedVal.scope.forEach((sc) => {
					this.hooks.lifecycle.beforeRegisterShare.emit({
						origin: this.host,
						pkgName: sharedKey,
						shared: sharedVal
					});
					if (!this.shareScopeMap[sc]?.[sharedKey]) this.setShared({
						pkgName: sharedKey,
						lib: sharedVal.lib,
						get: sharedVal.get,
						loaded: sharedVal.loaded || Boolean(sharedVal.lib),
						shared: sharedVal,
						from: userOptions.name
					});
				});
			});
		});
		return {
			newShareInfos,
			allShareInfos
		};
	}
	async loadShare(pkgName, extraOptions) {
		const { host } = this;
		const shareOptions = getTargetSharedOptions({
			pkgName,
			extraOptions,
			shareInfos: host.options.shared
		});
		if (shareOptions?.scope) await Promise.all(shareOptions.scope.map(async (shareScope) => {
			await Promise.all(this.initializeSharing(shareScope, { strategy: shareOptions.strategy }));
		}));
		const { shareInfo: shareOptionsRes } = await this.hooks.lifecycle.beforeLoadShare.emit({
			pkgName,
			shareInfo: shareOptions,
			shared: host.options.shared,
			origin: host
		});
		assert(shareOptionsRes, `Cannot find ${pkgName} Share in the ${host.options.name}. Please ensure that the ${pkgName} Share parameters have been injected`);
		const { shared: registeredShared, useTreesShaking } = getRegisteredShare(this.shareScopeMap, pkgName, shareOptionsRes, this.hooks.lifecycle.resolveShare) || {};
		if (registeredShared) {
			const targetShared = directShare(registeredShared, useTreesShaking);
			if (targetShared.lib) {
				addUseIn(targetShared, host.options.name);
				return targetShared.lib;
			} else if (targetShared.loading && !targetShared.loaded) {
				const factory = await targetShared.loading;
				targetShared.loaded = true;
				if (!targetShared.lib) targetShared.lib = factory;
				addUseIn(targetShared, host.options.name);
				return factory;
			} else {
				const asyncLoadProcess = async () => {
					const factory = await targetShared.get();
					addUseIn(targetShared, host.options.name);
					targetShared.loaded = true;
					targetShared.lib = factory;
					return factory;
				};
				const loading = asyncLoadProcess();
				this.setShared({
					pkgName,
					loaded: false,
					shared: registeredShared,
					from: host.options.name,
					lib: null,
					loading,
					treeShaking: useTreesShaking ? targetShared : void 0
				});
				return loading;
			}
		} else {
			if (extraOptions?.customShareInfo) return false;
			const _useTreeShaking = shouldUseTreeShaking(shareOptionsRes.treeShaking);
			const targetShared = directShare(shareOptionsRes, _useTreeShaking);
			const asyncLoadProcess = async () => {
				const factory = await targetShared.get();
				targetShared.lib = factory;
				targetShared.loaded = true;
				addUseIn(targetShared, host.options.name);
				const { shared: gShared, useTreesShaking: gUseTreeShaking } = getRegisteredShare(this.shareScopeMap, pkgName, shareOptionsRes, this.hooks.lifecycle.resolveShare) || {};
				if (gShared) {
					const targetGShared = directShare(gShared, gUseTreeShaking);
					targetGShared.lib = factory;
					targetGShared.loaded = true;
					gShared.from = shareOptionsRes.from;
				}
				return factory;
			};
			const loading = asyncLoadProcess();
			this.setShared({
				pkgName,
				loaded: false,
				shared: shareOptionsRes,
				from: host.options.name,
				lib: null,
				loading,
				treeShaking: _useTreeShaking ? targetShared : void 0
			});
			return loading;
		}
	}
	/**
	* This function initializes the sharing sequence (executed only once per share scope).
	* It accepts one argument, the name of the share scope.
	* If the share scope does not exist, it creates one.
	*/
	initializeSharing(shareScopeName = DEFAULT_SCOPE, extraOptions) {
		const { host } = this;
		const from = extraOptions?.from;
		const strategy = extraOptions?.strategy;
		let initScope = extraOptions?.initScope;
		const promises = [];
		if (from !== "build") {
			const { initTokens } = this;
			if (!initScope) initScope = [];
			let initToken = initTokens[shareScopeName];
			if (!initToken) initToken = initTokens[shareScopeName] = { from: this.host.name };
			if (initScope.indexOf(initToken) >= 0) return promises;
			initScope.push(initToken);
		}
		const shareScope = this.shareScopeMap;
		const hostName = host.options.name;
		if (!shareScope[shareScopeName]) shareScope[shareScopeName] = {};
		const scope = shareScope[shareScopeName];
		const register = (name, shared) => {
			const { version, eager } = shared;
			scope[name] = scope[name] || {};
			const versions = scope[name];
			const activeVersion = versions[version] && directShare(versions[version]);
			const activeVersionEager = Boolean(activeVersion && ("eager" in activeVersion && activeVersion.eager || "shareConfig" in activeVersion && activeVersion.shareConfig?.eager));
			if (!activeVersion || activeVersion.strategy !== "loaded-first" && !activeVersion.loaded && (Boolean(!eager) !== !activeVersionEager ? eager : hostName > versions[version].from)) versions[version] = shared;
		};
		const initRemoteModule = async (key) => {
			const { module } = await host.remoteHandler.getRemoteModuleAndOptions({ id: key });
			let remoteEntryExports = void 0;
			try {
				remoteEntryExports = await module.getEntry();
			} catch (error) {
				remoteEntryExports = await host.remoteHandler.hooks.lifecycle.errorLoadRemote.emit({
					id: key,
					error,
					from: "runtime",
					lifecycle: "beforeLoadShare",
					origin: host
				});
			} finally {
				if (remoteEntryExports?.init) {
					module.remoteEntryExports = remoteEntryExports;
					await module.init();
				}
			}
		};
		Object.keys(host.options.shared).forEach((shareName) => {
			host.options.shared[shareName].forEach((shared) => {
				if (shared.scope.includes(shareScopeName)) register(shareName, shared);
			});
		});
		if (host.options.shareStrategy === "version-first" || strategy === "version-first") host.options.remotes.forEach((remote) => {
			if (remote.shareScope === shareScopeName) promises.push(initRemoteModule(remote.name));
		});
		return promises;
	}
	loadShareSync(pkgName, extraOptions) {
		const { host } = this;
		const shareOptions = getTargetSharedOptions({
			pkgName,
			extraOptions,
			shareInfos: host.options.shared
		});
		if (shareOptions?.scope) shareOptions.scope.forEach((shareScope) => {
			this.initializeSharing(shareScope, { strategy: shareOptions.strategy });
		});
		const { shared: registeredShared, useTreesShaking } = getRegisteredShare(this.shareScopeMap, pkgName, shareOptions, this.hooks.lifecycle.resolveShare) || {};
		if (registeredShared) {
			if (typeof registeredShared.lib === "function") {
				addUseIn(registeredShared, host.options.name);
				if (!registeredShared.loaded) {
					registeredShared.loaded = true;
					if (registeredShared.from === host.options.name) shareOptions.loaded = true;
				}
				return registeredShared.lib;
			}
			if (typeof registeredShared.get === "function") {
				const module = registeredShared.get();
				if (!(module instanceof Promise)) {
					addUseIn(registeredShared, host.options.name);
					this.setShared({
						pkgName,
						loaded: true,
						from: host.options.name,
						lib: module,
						shared: registeredShared
					});
					return module;
				}
			}
		}
		if (shareOptions.lib) {
			if (!shareOptions.loaded) shareOptions.loaded = true;
			return shareOptions.lib;
		}
		if (shareOptions.get) {
			const module = shareOptions.get();
			if (module instanceof Promise) {
				const errorCode = extraOptions?.from === "build" ? RUNTIME_005 : RUNTIME_006;
				throw new Error(getShortErrorMsg(errorCode, runtimeDescMap, {
					hostName: host.options.name,
					sharedPkgName: pkgName
				}));
			}
			shareOptions.lib = module;
			this.setShared({
				pkgName,
				loaded: true,
				from: host.options.name,
				lib: shareOptions.lib,
				shared: shareOptions
			});
			return shareOptions.lib;
		}
		throw new Error(getShortErrorMsg(RUNTIME_006, runtimeDescMap, {
			hostName: host.options.name,
			sharedPkgName: pkgName
		}));
	}
	initShareScopeMap(scopeName, shareScope, extraOptions = {}) {
		const { host } = this;
		this.shareScopeMap[scopeName] = shareScope;
		this.hooks.lifecycle.initContainerShareScopeMap.emit({
			shareScope,
			options: host.options,
			origin: host,
			scopeName,
			hostShareScopeMap: extraOptions.hostShareScopeMap
		});
	}
	setShared({ pkgName, shared, from, lib, loading, loaded, get, treeShaking }) {
		const { version, scope = "default", ...shareInfo } = shared;
		const scopes = Array.isArray(scope) ? scope : [scope];
		const mergeAttrs = (shared) => {
			const merge = (s, key, val) => {
				if (val && !s[key]) s[key] = val;
			};
			const targetShared = treeShaking ? shared.treeShaking : shared;
			merge(targetShared, "loaded", loaded);
			merge(targetShared, "loading", loading);
			merge(targetShared, "get", get);
		};
		scopes.forEach((sc) => {
			if (!this.shareScopeMap[sc]) this.shareScopeMap[sc] = {};
			if (!this.shareScopeMap[sc][pkgName]) this.shareScopeMap[sc][pkgName] = {};
			if (!this.shareScopeMap[sc][pkgName][version]) this.shareScopeMap[sc][pkgName][version] = {
				version,
				scope: [sc],
				...shareInfo,
				lib
			};
			const registeredShared = this.shareScopeMap[sc][pkgName][version];
			mergeAttrs(registeredShared);
			if (from && registeredShared.from !== from) registeredShared.from = from;
		});
	}
	_setGlobalShareScopeMap(hostOptions) {
		const globalShareScopeMap = getGlobalShareScope();
		const identifier = hostOptions.id || hostOptions.name;
		if (identifier && !globalShareScopeMap[identifier]) globalShareScopeMap[identifier] = this.shareScopeMap;
	}
};
var RemoteHandler = class {
	constructor(host) {
		this.hooks = new PluginSystem({
			beforeRegisterRemote: new SyncWaterfallHook("beforeRegisterRemote"),
			registerRemote: new SyncWaterfallHook("registerRemote"),
			beforeRequest: new AsyncWaterfallHook("beforeRequest"),
			onLoad: new AsyncHook("onLoad"),
			handlePreloadModule: new SyncHook("handlePreloadModule"),
			errorLoadRemote: new AsyncHook("errorLoadRemote"),
			beforePreloadRemote: new AsyncHook("beforePreloadRemote"),
			generatePreloadAssets: new AsyncHook("generatePreloadAssets"),
			afterPreloadRemote: new AsyncHook(),
			loadEntry: new AsyncHook()
		});
		this.host = host;
		this.idToRemoteMap = {};
	}
	formatAndRegisterRemote(globalOptions, userOptions) {
		return (userOptions.remotes || []).reduce((res, remote) => {
			this.registerRemote(remote, res, { force: false });
			return res;
		}, globalOptions.remotes);
	}
	setIdToRemoteMap(id, remoteMatchInfo) {
		const { remote, expose } = remoteMatchInfo;
		const { name, alias } = remote;
		this.idToRemoteMap[id] = {
			name: remote.name,
			expose
		};
		if (alias && id.startsWith(name)) {
			const idWithAlias = id.replace(name, alias);
			this.idToRemoteMap[idWithAlias] = {
				name: remote.name,
				expose
			};
			return;
		}
		if (alias && id.startsWith(alias)) {
			const idWithName = id.replace(alias, name);
			this.idToRemoteMap[idWithName] = {
				name: remote.name,
				expose
			};
		}
	}
	async loadRemote(id, options) {
		const { host } = this;
		try {
			const { loadFactory = true } = options || { loadFactory: true };
			const { module, moduleOptions, remoteMatchInfo } = await this.getRemoteModuleAndOptions({ id });
			const { pkgNameOrAlias, remote, expose, id: idRes, remoteSnapshot } = remoteMatchInfo;
			const moduleOrFactory = await module.get(idRes, expose, options, remoteSnapshot);
			const moduleWrapper = await this.hooks.lifecycle.onLoad.emit({
				id: idRes,
				pkgNameOrAlias,
				expose,
				exposeModule: loadFactory ? moduleOrFactory : void 0,
				exposeModuleFactory: loadFactory ? void 0 : moduleOrFactory,
				remote,
				options: moduleOptions,
				moduleInstance: module,
				origin: host
			});
			this.setIdToRemoteMap(id, remoteMatchInfo);
			if (typeof moduleWrapper === "function") return moduleWrapper;
			return moduleOrFactory;
		} catch (error) {
			const { from = "runtime" } = options || { from: "runtime" };
			const failOver = await this.hooks.lifecycle.errorLoadRemote.emit({
				id,
				error,
				from,
				lifecycle: "onLoad",
				origin: host
			});
			if (!failOver) throw error;
			return failOver;
		}
	}
	async preloadRemote(preloadOptions) {
		const { host } = this;
		await this.hooks.lifecycle.beforePreloadRemote.emit({
			preloadOps: preloadOptions,
			options: host.options,
			origin: host
		});
		const preloadOps = formatPreloadArgs(host.options.remotes, preloadOptions);
		await Promise.all(preloadOps.map(async (ops) => {
			const { remote } = ops;
			const remoteInfo = getRemoteInfo(remote);
			const { globalSnapshot, remoteSnapshot } = await host.snapshotHandler.loadRemoteSnapshotInfo({ moduleInfo: remote });
			const assets = await this.hooks.lifecycle.generatePreloadAssets.emit({
				origin: host,
				preloadOptions: ops,
				remote,
				remoteInfo,
				globalSnapshot,
				remoteSnapshot
			});
			if (!assets) return;
			preloadAssets(remoteInfo, host, assets);
		}));
	}
	registerRemotes(remotes, options) {
		const { host } = this;
		remotes.forEach((remote) => {
			this.registerRemote(remote, host.options.remotes, { force: options?.force });
		});
	}
	async getRemoteModuleAndOptions(options) {
		const { host } = this;
		const { id } = options;
		let loadRemoteArgs;
		try {
			loadRemoteArgs = await this.hooks.lifecycle.beforeRequest.emit({
				id,
				options: host.options,
				origin: host
			});
		} catch (error) {
			loadRemoteArgs = await this.hooks.lifecycle.errorLoadRemote.emit({
				id,
				options: host.options,
				origin: host,
				from: "runtime",
				error,
				lifecycle: "beforeRequest"
			});
			if (!loadRemoteArgs) throw error;
		}
		const { id: idRes } = loadRemoteArgs;
		const remoteSplitInfo = matchRemoteWithNameAndExpose(host.options.remotes, idRes);
		assert(remoteSplitInfo, getShortErrorMsg(RUNTIME_004, runtimeDescMap, {
			hostName: host.options.name,
			requestId: idRes
		}));
		const { remote: rawRemote } = remoteSplitInfo;
		const remoteInfo = getRemoteInfo(rawRemote);
		const matchInfo = await host.sharedHandler.hooks.lifecycle.afterResolve.emit({
			id: idRes,
			...remoteSplitInfo,
			options: host.options,
			origin: host,
			remoteInfo
		});
		const { remote, expose } = matchInfo;
		assert(remote && expose, `The 'beforeRequest' hook was executed, but it failed to return the correct 'remote' and 'expose' values while loading ${idRes}.`);
		let module = host.moduleCache.get(remote.name);
		const moduleOptions = {
			host,
			remoteInfo
		};
		if (!module) {
			module = new Module(moduleOptions);
			host.moduleCache.set(remote.name, module);
		}
		return {
			module,
			moduleOptions,
			remoteMatchInfo: matchInfo
		};
	}
	registerRemote(remote, targetRemotes, options) {
		const { host } = this;
		const normalizeRemote = () => {
			if (remote.alias) {
				const findEqual = targetRemotes.find((item) => remote.alias && (item.name.startsWith(remote.alias) || item.alias?.startsWith(remote.alias)));
				assert(!findEqual, `The alias ${remote.alias} of remote ${remote.name} is not allowed to be the prefix of ${findEqual && findEqual.name} name or alias`);
			}
			if ("entry" in remote) {
				if (isBrowserEnv() && !remote.entry.startsWith("http")) remote.entry = new URL(remote.entry, window.location.origin).href;
			}
			if (!remote.shareScope) remote.shareScope = DEFAULT_SCOPE;
			if (!remote.type) remote.type = DEFAULT_REMOTE_TYPE;
		};
		this.hooks.lifecycle.beforeRegisterRemote.emit({
			remote,
			origin: host
		});
		const registeredRemote = targetRemotes.find((item) => item.name === remote.name);
		if (!registeredRemote) {
			normalizeRemote();
			targetRemotes.push(remote);
			this.hooks.lifecycle.registerRemote.emit({
				remote,
				origin: host
			});
		} else {
			const messages = [`The remote "${remote.name}" is already registered.`, "Please note that overriding it may cause unexpected errors."];
			if (options?.force) {
				this.removeRemote(registeredRemote);
				normalizeRemote();
				targetRemotes.push(remote);
				this.hooks.lifecycle.registerRemote.emit({
					remote,
					origin: host
				});
				warn$1(messages.join(" "));
			}
		}
	}
	removeRemote(remote) {
		try {
			const { host } = this;
			const { name } = remote;
			const remoteIndex = host.options.remotes.findIndex((item) => item.name === name);
			if (remoteIndex !== -1) host.options.remotes.splice(remoteIndex, 1);
			const loadedModule = host.moduleCache.get(remote.name);
			if (loadedModule) {
				const remoteInfo = loadedModule.remoteInfo;
				const key = remoteInfo.entryGlobalName;
				if (CurrentGlobal[key]) if (Object.getOwnPropertyDescriptor(CurrentGlobal, key)?.configurable) delete CurrentGlobal[key];
				else CurrentGlobal[key] = void 0;
				const remoteEntryUniqueKey = getRemoteEntryUniqueKey(loadedModule.remoteInfo);
				if (globalLoading[remoteEntryUniqueKey]) delete globalLoading[remoteEntryUniqueKey];
				host.snapshotHandler.manifestCache.delete(remoteInfo.entry);
				let remoteInsId = remoteInfo.buildVersion ? composeKeyWithSeparator(remoteInfo.name, remoteInfo.buildVersion) : remoteInfo.name;
				const remoteInsIndex = CurrentGlobal.__FEDERATION__.__INSTANCES__.findIndex((ins) => {
					if (remoteInfo.buildVersion) return ins.options.id === remoteInsId;
					else return ins.name === remoteInsId;
				});
				if (remoteInsIndex !== -1) {
					const remoteIns = CurrentGlobal.__FEDERATION__.__INSTANCES__[remoteInsIndex];
					remoteInsId = remoteIns.options.id || remoteInsId;
					const globalShareScopeMap = getGlobalShareScope();
					let isAllSharedNotUsed = true;
					const needDeleteKeys = [];
					Object.keys(globalShareScopeMap).forEach((instId) => {
						const shareScopeMap = globalShareScopeMap[instId];
						shareScopeMap && Object.keys(shareScopeMap).forEach((shareScope) => {
							const shareScopeVal = shareScopeMap[shareScope];
							shareScopeVal && Object.keys(shareScopeVal).forEach((shareName) => {
								const sharedPkgs = shareScopeVal[shareName];
								sharedPkgs && Object.keys(sharedPkgs).forEach((shareVersion) => {
									const shared = sharedPkgs[shareVersion];
									if (shared && typeof shared === "object" && shared.from === remoteInfo.name) if (shared.loaded || shared.loading) {
										shared.useIn = shared.useIn.filter((usedHostName) => usedHostName !== remoteInfo.name);
										if (shared.useIn.length) isAllSharedNotUsed = false;
										else needDeleteKeys.push([
											instId,
											shareScope,
											shareName,
											shareVersion
										]);
									} else needDeleteKeys.push([
										instId,
										shareScope,
										shareName,
										shareVersion
									]);
								});
							});
						});
					});
					if (isAllSharedNotUsed) {
						remoteIns.shareScopeMap = {};
						delete globalShareScopeMap[remoteInsId];
					}
					needDeleteKeys.forEach(([insId, shareScope, shareName, shareVersion]) => {
						delete globalShareScopeMap[insId]?.[shareScope]?.[shareName]?.[shareVersion];
					});
					CurrentGlobal.__FEDERATION__.__INSTANCES__.splice(remoteInsIndex, 1);
				}
				const { hostGlobalSnapshot } = getGlobalRemoteInfo(remote, host);
				if (hostGlobalSnapshot) {
					const remoteKey = hostGlobalSnapshot && "remotesInfo" in hostGlobalSnapshot && hostGlobalSnapshot.remotesInfo && getInfoWithoutType(hostGlobalSnapshot.remotesInfo, remote.name).key;
					if (remoteKey) {
						delete hostGlobalSnapshot.remotesInfo[remoteKey];
						if (Boolean(Global.__FEDERATION__.__MANIFEST_LOADING__[remoteKey])) delete Global.__FEDERATION__.__MANIFEST_LOADING__[remoteKey];
					}
				}
				host.moduleCache.delete(remote.name);
			}
		} catch (err) {
			logger.log("removeRemote fail: ", err);
		}
	}
};
var USE_SNAPSHOT = typeof FEDERATION_OPTIMIZE_NO_SNAPSHOT_PLUGIN === "boolean" ? !FEDERATION_OPTIMIZE_NO_SNAPSHOT_PLUGIN : true;
var ModuleFederation = class {
	constructor(userOptions) {
		this.hooks = new PluginSystem({
			beforeInit: new SyncWaterfallHook("beforeInit"),
			init: new SyncHook(),
			beforeInitContainer: new AsyncWaterfallHook("beforeInitContainer"),
			initContainer: new AsyncWaterfallHook("initContainer")
		});
		this.version = "2.0.1";
		this.moduleCache = /* @__PURE__ */ new Map();
		this.loaderHook = new PluginSystem({
			getModuleInfo: new SyncHook(),
			createScript: new SyncHook(),
			createLink: new SyncHook(),
			fetch: new AsyncHook(),
			loadEntryError: new AsyncHook(),
			getModuleFactory: new AsyncHook()
		});
		this.bridgeHook = new PluginSystem({
			beforeBridgeRender: new SyncHook(),
			afterBridgeRender: new SyncHook(),
			beforeBridgeDestroy: new SyncHook(),
			afterBridgeDestroy: new SyncHook()
		});
		const plugins = USE_SNAPSHOT ? [snapshotPlugin(), generatePreloadAssetsPlugin()] : [];
		const defaultOptions = {
			id: getBuilderId$1(),
			name: userOptions.name,
			plugins,
			remotes: [],
			shared: {},
			inBrowser: isBrowserEnv()
		};
		this.name = userOptions.name;
		this.options = defaultOptions;
		this.snapshotHandler = new SnapshotHandler(this);
		this.sharedHandler = new SharedHandler(this);
		this.remoteHandler = new RemoteHandler(this);
		this.shareScopeMap = this.sharedHandler.shareScopeMap;
		this.registerPlugins([...defaultOptions.plugins, ...userOptions.plugins || []]);
		this.options = this.formatOptions(defaultOptions, userOptions);
	}
	initOptions(userOptions) {
		this.registerPlugins(userOptions.plugins);
		const options = this.formatOptions(this.options, userOptions);
		this.options = options;
		return options;
	}
	async loadShare(pkgName, extraOptions) {
		return this.sharedHandler.loadShare(pkgName, extraOptions);
	}
	loadShareSync(pkgName, extraOptions) {
		return this.sharedHandler.loadShareSync(pkgName, extraOptions);
	}
	initializeSharing(shareScopeName = DEFAULT_SCOPE, extraOptions) {
		return this.sharedHandler.initializeSharing(shareScopeName, extraOptions);
	}
	initRawContainer(name, url, container) {
		const remoteInfo = getRemoteInfo({
			name,
			entry: url
		});
		const module = new Module({
			host: this,
			remoteInfo
		});
		module.remoteEntryExports = container;
		this.moduleCache.set(name, module);
		return module;
	}
	async loadRemote(id, options) {
		return this.remoteHandler.loadRemote(id, options);
	}
	async preloadRemote(preloadOptions) {
		return this.remoteHandler.preloadRemote(preloadOptions);
	}
	initShareScopeMap(scopeName, shareScope, extraOptions = {}) {
		this.sharedHandler.initShareScopeMap(scopeName, shareScope, extraOptions);
	}
	formatOptions(globalOptions, userOptions) {
		const { allShareInfos: shared } = formatShareConfigs(globalOptions, userOptions);
		const { userOptions: userOptionsRes, options: globalOptionsRes } = this.hooks.lifecycle.beforeInit.emit({
			origin: this,
			userOptions,
			options: globalOptions,
			shareInfo: shared
		});
		const remotes = this.remoteHandler.formatAndRegisterRemote(globalOptionsRes, userOptionsRes);
		const { allShareInfos } = this.sharedHandler.registerShared(globalOptionsRes, userOptionsRes);
		const plugins = [...globalOptionsRes.plugins];
		if (userOptionsRes.plugins) userOptionsRes.plugins.forEach((plugin) => {
			if (!plugins.includes(plugin)) plugins.push(plugin);
		});
		const optionsRes = {
			...globalOptions,
			...userOptions,
			plugins,
			remotes,
			shared: allShareInfos
		};
		this.hooks.lifecycle.init.emit({
			origin: this,
			options: optionsRes
		});
		return optionsRes;
	}
	registerPlugins(plugins) {
		const pluginRes = registerPlugins(plugins, this);
		this.options.plugins = this.options.plugins.reduce((res, plugin) => {
			if (!plugin) return res;
			if (res && !res.find((item) => item.name === plugin.name)) res.push(plugin);
			return res;
		}, pluginRes || []);
	}
	registerRemotes(remotes, options) {
		return this.remoteHandler.registerRemotes(remotes, options);
	}
	registerShared(shared) {
		this.sharedHandler.registerShared(this.options, {
			...this.options,
			shared
		});
	}
};
//#endregion
//#region node_modules/@module-federation/runtime/dist/utils.esm.js
function getBuilderId() {
	return typeof FEDERATION_BUILD_IDENTIFIER !== "undefined" ? FEDERATION_BUILD_IDENTIFIER : "";
}
function getGlobalFederationInstance(name, version) {
	const buildId = getBuilderId();
	return CurrentGlobal.__FEDERATION__.__INSTANCES__.find((GMInstance) => {
		if (buildId && GMInstance.options.id === buildId) return true;
		if (GMInstance.options.name === name && !GMInstance.options.version && !version) return true;
		if (GMInstance.options.name === name && version && GMInstance.options.version === version) return true;
		return false;
	});
}
//#endregion
//#region node_modules/@module-federation/runtime/dist/index.esm.js
function createInstance(options) {
	const instance = new ((getGlobalFederationConstructor()) || ModuleFederation)(options);
	setGlobalFederationInstance(instance);
	return instance;
}
var FederationInstance = null;
/**
* @deprecated Use createInstance or getInstance instead
*/
function init$1(options) {
	const instance = getGlobalFederationInstance(options.name, options.version);
	if (!instance) {
		FederationInstance = createInstance(options);
		return FederationInstance;
	} else {
		instance.initOptions(options);
		if (!FederationInstance) FederationInstance = instance;
		return instance;
	}
}
setGlobalFederationConstructor(ModuleFederation);
//#endregion
//#region .__mf__temp/remoteApp2/localSharedImportMap.js
var importMap = {
	"react": async () => {
		return await __vitePreload(() => import("./react-D9SRsaqy.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1)), []);
	},
	"react-dom": async () => {
		return await __vitePreload(() => import("./react-dom-Blynr932.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1)), []);
	}
};
var usedShared = {
	"react": {
		name: "react",
		version: "19.2.4",
		scope: ["default"],
		loaded: false,
		from: "remoteApp2",
		async get() {
			usedShared["react"].loaded = true;
			const { "react": pkgDynamicImport } = importMap;
			const exportModule = { ...await pkgDynamicImport() };
			Object.defineProperty(exportModule, "__esModule", {
				value: true,
				enumerable: false
			});
			return function() {
				return exportModule;
			};
		},
		shareConfig: {
			singleton: true,
			requiredVersion: "^19.0.0"
		}
	},
	"react-dom": {
		name: "react-dom",
		version: "19.2.4",
		scope: ["default"],
		loaded: false,
		from: "remoteApp2",
		async get() {
			usedShared["react-dom"].loaded = true;
			const { "react-dom": pkgDynamicImport } = importMap;
			const exportModule = { ...await pkgDynamicImport() };
			Object.defineProperty(exportModule, "__esModule", {
				value: true,
				enumerable: false
			});
			return function() {
				return exportModule;
			};
		},
		shareConfig: {
			singleton: true,
			requiredVersion: "^19.0.0"
		}
	}
};
var usedRemotes = [{
	entryGlobalName: "http://localhost:5001/mf-manifest.json",
	name: "remoteApp",
	type: "var",
	entry: "http://localhost:5001/mf-manifest.json",
	shareScope: "default"
}];
//#endregion
//#region virtual:mf-REMOTE_ENTRY_ID:remoteApp2__remoteEntry_js
init_remoteApp2__mf_v__runtimeInit__mf_v__();
var initTokens = {};
var shareScopeName = "default";
var mfName = "remoteApp2";
async function init(shared = {}, initScope = []) {
	const initRes = init$1({
		name: mfName,
		remotes: usedRemotes,
		shared: usedShared,
		plugins: [],
		shareStrategy: "version-first"
	});
	var initToken = initTokens[shareScopeName];
	if (!initToken) initToken = initTokens[shareScopeName] = { from: mfName };
	if (initScope.indexOf(initToken) >= 0) return;
	initScope.push(initToken);
	initRes.initShareScopeMap("default", shared);
	try {
		await Promise.all(await initRes.initializeSharing("default", {
			strategy: "version-first",
			from: "build",
			initScope
		}));
	} catch (e) {
		console.error(e);
	}
	initResolve(initRes);
	return initRes;
}
function getExposes(moduleName) {
	if (!(moduleName in virtual_mf_exposes_remoteApp2__remoteEntry_js_default)) throw new Error(`Module ${moduleName} does not exist in container.`);
	return virtual_mf_exposes_remoteApp2__remoteEntry_js_default[moduleName]().then((res) => () => res);
}
//#endregion
export { init as n, getExposes as t };
