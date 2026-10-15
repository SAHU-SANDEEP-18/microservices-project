import app, { sandboxProxy } from "./src/app.js";

const server = app.listen(3000, () => {
  console.log("Sandbox router server is running on port 3000");
});

server.on("upgrade", sandboxProxy.upgrade);