import app from "./src/app";

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const port = process.env.PORT || 5004;
console.log("backend port:" + port);
const host = process.env.HOST || "0.0.0.0";

app.listen(Number(port), host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
