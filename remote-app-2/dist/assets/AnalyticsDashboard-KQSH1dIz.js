import { t as __vitePreload } from "./preload-helper-BAEj96dT.js";
import { i as init_remoteApp2__loadShare__react__loadShare__, n as __mf_28, r as __mf_38, t as __mf_24 } from "./remoteApp2__loadShare__react__loadShare__.mjs-D3aHkpCj.js";
import { t as require_jsx_runtime } from "./jsx-runtime-DL3XSyLE.js";
//#region src/components/AnalyticsDashboard.tsx
await init_remoteApp2__loadShare__react__loadShare__();
var import_jsx_runtime = require_jsx_runtime();
var styles = {
	container: {
		padding: "2rem",
		borderRadius: "24px",
		background: "rgba(255, 255, 255, 0.02)",
		border: "1px solid rgba(255, 255, 255, 0.08)",
		backdropFilter: "blur(16px)",
		width: "100%",
		color: "#f0f0f5",
		boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
	},
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: "2rem"
	},
	title: {
		fontSize: "1.25rem",
		fontWeight: 800,
		background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		display: "flex",
		alignItems: "center",
		gap: "0.75rem"
	},
	grid: {
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
		gap: "1.5rem",
		marginBottom: "2rem"
	},
	card: {
		padding: "1.5rem",
		borderRadius: "16px",
		background: "rgba(251, 191, 36, 0.05)",
		border: "1px solid rgba(251, 191, 36, 0.1)",
		transition: "transform 0.2s ease"
	},
	label: {
		fontSize: "0.7rem",
		color: "#7777a0",
		textTransform: "uppercase",
		fontWeight: 600,
		letterSpacing: "0.05em",
		marginBottom: "0.5rem"
	},
	value: {
		fontSize: "1.5rem",
		fontWeight: 800,
		color: "#ffffff"
	},
	inputArea: {
		padding: "1.5rem",
		borderRadius: "16px",
		background: "rgba(255, 255, 255, 0.03)",
		border: "1px solid rgba(255, 255, 255, 0.05)"
	},
	inputLabel: {
		display: "block",
		fontSize: "0.8rem",
		fontWeight: 600,
		color: "#a5b4fc",
		marginBottom: "1rem"
	},
	flex: {
		display: "flex",
		gap: "0.75rem"
	},
	input: {
		flex: 1,
		padding: "0.75rem 1rem",
		borderRadius: "10px",
		background: "rgba(0, 0, 0, 0.2)",
		border: "1px solid rgba(255, 255, 255, 0.1)",
		color: "#ffffff",
		fontSize: "0.9rem",
		outline: "none"
	},
	button: {
		padding: "0.75rem 1.5rem",
		borderRadius: "10px",
		background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
		color: "#06060f",
		border: "none",
		fontWeight: 700,
		fontSize: "0.85rem",
		cursor: "pointer",
		transition: "all 0.2s ease"
	},
	status: {
		marginTop: "1.5rem",
		fontSize: "0.7rem",
		color: "#555570",
		display: "flex",
		alignItems: "center",
		gap: "0.5rem"
	}
};
var AnalyticsDashboard = ({ onSendMessage }) => {
	const [interactions, setInteractions] = __mf_38(0);
	const [lastSync, setLastSync] = __mf_38("Never");
	const [message, setMessage] = __mf_38("");
	__mf_28(() => {
		console.log("%c[Remote 2] 📊 INITIALIZING AnalyticsDashboard", "color: #fbbf24; font-weight: bold");
		let unsubscribe;
		__vitePreload(() => import("./remoteApp2__loadRemote__remoteApp_mf_1_Store__loadRemote__-CaarciCY.js").then((mod) => {
			unsubscribe = mod.default.subscribe("counter", (val) => {
				if (val && typeof val.value === "number") {
					console.log("%c[Remote 2] 📥 SYNC: counter incremented in Remote 1", "color: #fbbf24");
					setInteractions((prev) => prev + 1);
					setLastSync((/* @__PURE__ */ new Date()).toLocaleTimeString());
				}
			});
		}), []).catch((err) => console.error("[Remote 2] Store load failed", err));
		return () => unsubscribe?.();
	}, []);
	const handleSend = __mf_24(() => {
		if (!message.trim()) return;
		console.log("%c[Remote 2] 📤 SENDING MESSAGE to Host", "color: #fbbf24");
		const payload = {
			text: message,
			sender: "Analytics App",
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		onSendMessage?.(payload);
		setMessage("");
	}, [message, onSendMessage]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: styles.container,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: styles.header,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: styles.title,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📊" }), " Analytics Dashboard"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: styles.grid,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: styles.card,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: styles.label,
						children: "Cross-App Events"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: styles.value,
						children: interactions
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: styles.card,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: styles.label,
						children: "Last Remote Sync"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							...styles.value,
							fontSize: "1rem"
						},
						children: lastSync
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: styles.inputArea,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					style: styles.inputLabel,
					children: "💬 Send Command / Message to Host"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: styles.flex,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						style: styles.input,
						placeholder: "Type a message...",
						value: message,
						onChange: (e) => setMessage(e.target.value),
						onKeyDown: (e) => e.key === "Enter" && handleSend()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						style: styles.button,
						onClick: handleSend,
						onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-2px)",
						onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)",
						children: "Send"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: styles.status,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
					width: 6,
					height: 6,
					borderRadius: "50%",
					background: "#fbbf24"
				} }), "Synchronized with SharedStore via Module Federation"]
			})
		]
	});
};
//#endregion
export { AnalyticsDashboard as t };
