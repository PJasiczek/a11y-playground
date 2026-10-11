import { createFileRoute } from "@tanstack/react-router";
import { isSignedByNotion, verificationToken } from "~/lib/notion-webhook";

/**
 * Notion calls this when content changes; it starts a Vercel deploy, whose build imports the
 * content from Notion again. Needs NOTION_WEBHOOK_SECRET (the subscription's verification token)
 * and VERCEL_DEPLOY_HOOK_URL. Until the secret is set, the handshake's token is written to the
 * function log, to be pasted into Notion and into NOTION_WEBHOOK_SECRET.
 */
export const Route = createFileRoute("/api/notion-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const secret = process.env.NOTION_WEBHOOK_SECRET;
        const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL;

        if (!secret) {
          const token = verificationToken(body);
          if (token) console.log(`Notion webhook verification token: ${token}`);
          return new Response(null, { status: token ? 200 : 503 });
        }
        if (!isSignedByNotion(body, request.headers.get("x-notion-signature"), secret)) return new Response(null, { status: 401 });
        if (!deployHook) return new Response(null, { status: 503 });

        const deploy = await fetch(deployHook, { method: "POST" });
        return new Response(null, { status: deploy.ok ? 202 : 502 });
      },
    },
  },
});
