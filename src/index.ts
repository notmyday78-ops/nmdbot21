```ts
console.log("NMDBot starting...");

const token = process.env.BOT_TOKEN;

if (!token) {
    console.error("BOT_TOKEN is missing!");
    process.exit(1);
}

console.log("BOT_TOKEN detected!");
console.log("Starting Discord bot...");
```
