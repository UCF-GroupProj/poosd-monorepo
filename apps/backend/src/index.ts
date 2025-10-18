import "./sentry"; // LOAD FIRST
import Express from "express";
import type { Request, Response } from "express";

const app = Express();

app.get("/", async (req: Request, res: Response)=>{
  res.send("Hello World!");
});

const port = process.env["PORT"] ?? 8080;
app.listen(port, ()=>{
  console.log(`Running on http://localhost:${port}`);
});