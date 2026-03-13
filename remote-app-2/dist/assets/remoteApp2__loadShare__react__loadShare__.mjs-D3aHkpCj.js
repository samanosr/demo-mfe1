import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-BjWfMKpL.js";
//#region node_modules/__mf__virtual/remoteApp2__mf_v__runtimeInit__mf_v__.js
var globalKey, initPromise, initResolve, initReject;
var init_remoteApp2__mf_v__runtimeInit__mf_v__ = __esmMin((() => {
	globalKey = "__mf_init____mf__virtual/remoteApp2__mf_v__runtimeInit__mf_v__.js__";
	if (!globalThis[globalKey]) {
		let initResolve, initReject;
		const initPromise = new Promise((re, rj) => {
			initResolve = re;
			initReject = rj;
		});
		globalThis[globalKey] = {
			initPromise,
			initResolve,
			initReject
		};
		if (typeof window === "undefined") initResolve({
			loadRemote: function() {
				return Promise.resolve(void 0);
			},
			loadShare: function() {
				return Promise.resolve(void 0);
			}
		});
	}
	({initPromise, initResolve, initReject} = globalThis[globalKey]);
}));
//#endregion
//#region node_modules/__mf__virtual/remoteApp2__loadShare__react__loadShare__.mjs
var remoteApp2__loadShare__react__loadShare___exports = /* @__PURE__ */ __exportAll({
	Activity: () => __mf_0,
	Children: () => __mf_1,
	Component: () => __mf_2,
	Fragment: () => __mf_3,
	Profiler: () => __mf_4,
	PureComponent: () => __mf_5,
	StrictMode: () => __mf_6,
	Suspense: () => __mf_7,
	__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE: () => __mf_8,
	__COMPILER_RUNTIME: () => __mf_9,
	__moduleExports: () => __moduleExports,
	cache: () => __mf_10,
	cacheSignal: () => __mf_11,
	cloneElement: () => __mf_12,
	createContext: () => __mf_13,
	createElement: () => __mf_14,
	createRef: () => __mf_15,
	default: () => remoteApp2__loadShare__react__loadShare___default,
	forwardRef: () => __mf_16,
	isValidElement: () => __mf_17,
	lazy: () => __mf_18,
	memo: () => __mf_19,
	startTransition: () => __mf_20,
	unstable_useCacheRefresh: () => __mf_21,
	use: () => __mf_22,
	useActionState: () => __mf_23,
	useCallback: () => __mf_24,
	useContext: () => __mf_25,
	useDebugValue: () => __mf_26,
	useDeferredValue: () => __mf_27,
	useEffect: () => __mf_28,
	useEffectEvent: () => __mf_29,
	useId: () => __mf_30,
	useImperativeHandle: () => __mf_31,
	useInsertionEffect: () => __mf_32,
	useLayoutEffect: () => __mf_33,
	useMemo: () => __mf_34,
	useOptimistic: () => __mf_35,
	useReducer: () => __mf_36,
	useRef: () => __mf_37,
	useState: () => __mf_38,
	useSyncExternalStore: () => __mf_39,
	useTransition: () => __mf_40,
	version: () => __mf_41
});
var exportModule, __moduleExports, remoteApp2__loadShare__react__loadShare___default, __mf_0, __mf_1, __mf_2, __mf_3, __mf_4, __mf_5, __mf_6, __mf_7, __mf_8, __mf_9, __mf_10, __mf_11, __mf_12, __mf_13, __mf_14, __mf_15, __mf_16, __mf_17, __mf_18, __mf_19, __mf_20, __mf_21, __mf_22, __mf_23, __mf_24, __mf_25, __mf_26, __mf_27, __mf_28, __mf_29, __mf_30, __mf_31, __mf_32, __mf_33, __mf_34, __mf_35, __mf_36, __mf_37, __mf_38, __mf_39, __mf_40, __mf_41;
var init_remoteApp2__loadShare__react__loadShare__ = __esmMin((async () => {
	init_remoteApp2__mf_v__runtimeInit__mf_v__();
	exportModule = await initPromise.then((runtime) => runtime.loadShare("react", { customShareInfo: { shareConfig: {
		singleton: true,
		strictVersion: false,
		requiredVersion: "^19.0.0"
	} } })).then((factory) => typeof factory === "function" ? factory() : factory);
	__moduleExports = exportModule;
	remoteApp2__loadShare__react__loadShare___default = exportModule.__esModule ? exportModule.default : exportModule;
	({Activity: __mf_0, Children: __mf_1, Component: __mf_2, Fragment: __mf_3, Profiler: __mf_4, PureComponent: __mf_5, StrictMode: __mf_6, Suspense: __mf_7, __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE: __mf_8, __COMPILER_RUNTIME: __mf_9, cache: __mf_10, cacheSignal: __mf_11, cloneElement: __mf_12, createContext: __mf_13, createElement: __mf_14, createRef: __mf_15, forwardRef: __mf_16, isValidElement: __mf_17, lazy: __mf_18, memo: __mf_19, startTransition: __mf_20, unstable_useCacheRefresh: __mf_21, use: __mf_22, useActionState: __mf_23, useCallback: __mf_24, useContext: __mf_25, useDebugValue: __mf_26, useDeferredValue: __mf_27, useEffect: __mf_28, useEffectEvent: __mf_29, useId: __mf_30, useImperativeHandle: __mf_31, useInsertionEffect: __mf_32, useLayoutEffect: __mf_33, useMemo: __mf_34, useOptimistic: __mf_35, useReducer: __mf_36, useRef: __mf_37, useState: __mf_38, useSyncExternalStore: __mf_39, useTransition: __mf_40, version: __mf_41} = exportModule);
}));
//#endregion
export { remoteApp2__loadShare__react__loadShare___default as a, initResolve as c, init_remoteApp2__loadShare__react__loadShare__ as i, init_remoteApp2__mf_v__runtimeInit__mf_v__ as l, __mf_28 as n, remoteApp2__loadShare__react__loadShare___exports as o, __mf_38 as r, initPromise as s, __mf_24 as t };
