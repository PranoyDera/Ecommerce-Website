import "dotenv/config";   // 👈 loads .env BEFORE anything else

await import("./server.js"); // 👈 now load your real server