import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { setupVite } from "./server/_core/vite";

async function test() {
  const app = express();
  const server = createServer(app);
  try {
    console.log("Setting up Vite...");
    await setupVite(app, server);
    console.log("Vite setup complete");
  } catch (e) {
    console.error("Vite setup failed:", e);
  }
  server.listen(3002, "127.0.0.1", () => {
  console.log("Test server on 3002");
  console.log("Server address:", server.address());
});
server.on('error', (err) => console.error('Server error:', err));
  setTimeout(() => process.exit(0), 10000);
}
test();