import { _ as __vitePreload } from './preload-helper-B52LGRp6.js';

const exposesMap = {
    
        "./Counter": async () => {
          const importModule = await __vitePreload(() => import('./Counter-BymSRF1I.js'),true              ?[]:void 0);
          const exportModule = {};
          Object.assign(exportModule, importModule);
          Object.defineProperty(exportModule, "__esModule", {
            value: true,
            enumerable: false
          });
          return exportModule
        }
      ,
        "./Card": async () => {
          const importModule = await __vitePreload(() => import('./Card-DaGlqyut.js'),true              ?[]:void 0);
          const exportModule = {};
          Object.assign(exportModule, importModule);
          Object.defineProperty(exportModule, "__esModule", {
            value: true,
            enumerable: false
          });
          return exportModule
        }
      ,
        "./Store": async () => {
          const importModule = await __vitePreload(() => import('./store-DJtbu1A2.js'),true              ?[]:void 0);
          const exportModule = {};
          Object.assign(exportModule, importModule);
          Object.defineProperty(exportModule, "__esModule", {
            value: true,
            enumerable: false
          });
          return exportModule
        }
      
  };

export { exposesMap as default };
