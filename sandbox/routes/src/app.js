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
    const sandboxId = req.headers.host.split(".")[0];
    return `http://sandbox-service-${sandboxId}.default.svc.cluster.local:80`;
  },
});

app.use(sandboxProxy);

export default app;
