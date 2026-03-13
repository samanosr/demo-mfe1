import { t as __vitePreload } from "./preload-helper-BAEj96dT.js";
import { i as init_remoteApp2__loadShare__react__loadShare__, n as __mf_28, r as __mf_38 } from "./remoteApp2__loadShare__react__loadShare__.mjs-D3aHkpCj.js";
import { t as require_jsx_runtime } from "./jsx-runtime-DL3XSyLE.js";
//#region src/components/UserStats.tsx
await init_remoteApp2__loadShare__react__loadShare__();
var import_jsx_runtime = require_jsx_runtime();
var styles = {
	container: {
		padding: "1.5rem",
		borderRadius: "16px",
		background: "rgba(255, 255, 255, 0.02)",
		border: "1px solid rgba(255, 255, 255, 0.08)",
		backdropFilter: "blur(10px)",
		width: "100%",
		maxWidth: "350px"
	},
	header: {
		display: "flex",
		alignItems: "center",
		gap: "0.5rem",
		marginBottom: "1rem",
		fontSize: "0.85rem",
		fontWeight: 700,
		color: "#fbbf24"
	},
	statGrid: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: "1rem"
	},
	statCard: {
		padding: "1rem",
		borderRadius: "12px",
		background: "rgba(251, 191, 36, 0.05)",
		border: "1px solid rgba(251, 191, 36, 0.1)",
		textAlign: "center"
	},
	label: {
		fontSize: "0.65rem",
		color: "#7777a0",
		textTransform: "uppercase",
		marginBottom: "0.2rem"
	},
	value: {
		fontSize: "1.2rem",
		fontWeight: 800,
		color: "#f0f0f5"
	},
	syncTab: {
		marginTop: "1rem",
		padding: "0.6rem",
		borderRadius: "8px",
		background: "rgba(255, 255, 255, 0.03)",
		fontSize: "0.7rem",
		color: "#8888a8",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "0.5rem"
	}
};
var UserStats = () => {
	const [interactions, setInteractions] = __mf_38(0);
	const [lastSync, setLastSync] = __mf_38("Never");
	__mf_28(() => {
		console.log("%c[Remote:UserStats] 🔌 CONNECTING to SharedStore from remoteApp", "color: #fbbf24; font-weight: bold");
		__vitePreload(() => import("./remoteApp2__loadRemote__remoteApp_mf_1_Store__loadRemote__-CaarciCY.js").then((mod) => {
			return mod.default.subscribe("counter", (val) => {
				if (val && typeof val.value === "number") {
					console.log("%c[Remote:UserStats] 📥 CROSS-REMOTE SYNC: counter updated", "color: #fbbf24");
					setInteractions((prev) => prev + 1);
					setLastSync((/* @__PURE__ */ new Date()).toLocaleTimeString());
				}
			});
		}), []).catch(() => {
			console.warn("[Remote:UserStats] SharedStore from remoteApp not available");
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: styles.container,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: styles.header,
				children: "📊 Multi-App Global Activity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: styles.statGrid,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: styles.statCard,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: styles.label,
						children: "Cross-App Events"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: styles.value,
						children: interactions
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: styles.statCard,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: styles.label,
						children: "Active Remotes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: styles.value,
						children: "2"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: styles.syncTab,
				children: ["🔄 Syncing via SharedStore • Last: ", lastSync]
			})
		]
	});
};
//#endregion
export { UserStats as default };
