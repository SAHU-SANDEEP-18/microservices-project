import { k8sCoreV1Api } from "./config.js";

export async function createPod(sandboxId) {
  const resources = {
    limits: { cpu: "500m", memory: "1Gi" },
    requests: { cpu: "250m", memory: "500Mi" },
  };

  const podManifest = {
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: { app: "sandbox-instance", sandboxId },
    },
    spec: {
      volumes: [{ name: "workspace-volume", emptyDir: {} }],

      initContainers: [
        {
          name: "init-workspace",
          image: "sandbox-template:v3",
          imagePullPolicy: "IfNotPresent",
          command: ["sh", "-c", "cp -a /workspace/. /mnt/workspace/"],
          volumeMounts: [{ name: "workspace-volume", mountPath: "/mnt/workspace" }],
        },
      ],

      containers: [
        {
          name: "sandbox-container",
          image: "sandbox-template:v3",
          imagePullPolicy: "IfNotPresent",
          ports: [{ containerPort: 5173, name: "preview" }],
          resources,
          volumeMounts: [{ name: "workspace-volume", mountPath: "/workspace" }],
        },
        {
          name: "agent-container",
          image: "agent:v4",
          imagePullPolicy: "IfNotPresent",
          ports: [{ containerPort: 3000, name: "agent" }],
          resources,
          volumeMounts: [{ name: "workspace-volume", mountPath: "/workspace" }],
        },
      ],
    },
  };

  return await k8sCoreV1Api.createNamespacedPod({
    namespace: "default",
    body: podManifest,
  });
}