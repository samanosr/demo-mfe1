import { i as initPromise } from './runtimeInit-BGxDdJgg.js';

function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== 'string' && !Array.isArray(e)) { for (const k in e) {
      if (k !== 'default' && !(k in n)) {
        const d = Object.getOwnPropertyDescriptor(e, k);
        if (d) {
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    } }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }));
}

const res = initPromise.then(runtime => runtime.loadRemote("remoteApp/Store"));
    const exportModule = await initPromise.then(_ => res);
    const __moduleExports = exportModule;
const host__loadRemote__remoteApp_mf_1_Store__loadRemote__ = exportModule.__esModule ? exportModule.default : exportModule;

const host__loadRemote__remoteApp_mf_1_Store__loadRemote__$1 = /*#__PURE__*/_mergeNamespaces({
  __proto__: null,
  default: host__loadRemote__remoteApp_mf_1_Store__loadRemote__
}, [__moduleExports]);

export { host__loadRemote__remoteApp_mf_1_Store__loadRemote__$1 as h };
