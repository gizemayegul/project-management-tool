import dotenv from "dotenv";
import path from "path";

// Determine which .env file to load based on the environment
let envFile = "";

if (process.env.NODE_ENV === "development") {
  console.log(process.env.NODE_ENV, "NODE_ENV");
  envFile = path.resolve(
    __dirname,
    `./.env.${process.env.NODE_ENV || "development"}`
  );
} else {
  envFile = path.resolve(`./.env.${process.env.NODE_ENV || "production"}`);
}

console.log(__dirname, "dirname");
console.log(envFile, "envFile");
console.log(process.env.NODE_ENV, "NODE_ENV");

// Load environment variables
dotenv.config({ path: envFile });

// Access the environment variables after loading them
const port = process.env.PORT || 5004;
const host = process.env.HOST || "0.0.0.0";

console.log(`Loaded environment variables from ${envFile}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(`HOST: ${process.env.HOST}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI}`);

import "./src/db";
import app from "./app";

app.listen(Number(port), host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
