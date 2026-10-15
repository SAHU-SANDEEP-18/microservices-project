import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(morgan("dev"));

app.get("/api/status/healthz", (req, res) => {
    res.status(200).json({
        status: "ok"
    })
})

app.get("/api/status/readyz", (req, res) => {
    res.status(200).json({
        status: "ready"
    })
})

export const sandboxProxy = createProxyMiddleware({
  changeOrigin: true,
  ws: true,
  router: (req) => {
    const parts = (req.headers.host || "").split(".");
    const sandboxId = parts[0];
    const kind = parts[1]; // "preview" ya "agent"

    // <id>.agent.localhost -> agent (port 3000)
    if (kind === "agent") {
      return `http://sandbox-service-${sandboxId}.default.svc.cluster.local:3000`;
    }

    // <id>.preview.localhost -> Vite (port 80 -> 5173)
    return `http://sandbox-service-${sandboxId}.default.svc.cluster.local:80`;
  },
});

app.use(sandboxProxy);

export default app;
