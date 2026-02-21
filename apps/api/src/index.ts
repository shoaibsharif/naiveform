import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { Hono } from "hono";
import { getClient } from "./clients";
import { handle } from "hono/vercel";

const app = new Hono();

app.get("/", (c) => c.json({ ok: true, message: "Naiveform API" }));
app.get("/health", (c) => c.json({ status: "ok" }));

app.post("/f/:formId", async (c) => {
  try {
    const formId = c.req.param("formId");
    const client = getClient();
    const form = await client.query(api.forms.get, {
      formId: formId as Id<"forms">,
    });
    const body = await c.req.json();
    return c.json({
      form,
      body,
      formId,
      comvexUrl: process.env.CONVEX_URL,
    });
  } catch {
    return c.json({ error: "Failed to save response" }, 500);
  }
});

export default handle(app);
