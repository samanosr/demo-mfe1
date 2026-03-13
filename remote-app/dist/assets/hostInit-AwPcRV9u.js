import { _ as __vitePreload } from './preload-helper-B52LGRp6.js';

const remoteEntryPromise = __vitePreload(() => import('../remoteEntry.js'),true              ?[]:void 0);
    // __tla only serves as a hack for vite-plugin-top-level-await.
    Promise.resolve(remoteEntryPromise)
      .then(remoteEntry => {
        return Promise.resolve(remoteEntry.__tla)
          .then(remoteEntry.init).catch(remoteEntry.init)
      });
