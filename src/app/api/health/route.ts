import { NextResponse } from "next/server";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      controller.signal.addEventListener("abort", () => reject(new Error("timeout")), {
        once: true,
      });
    }),
  ]).finally(() => clearTimeout(timeout));
}

async function checkBackend(baseUrl: string | undefined) {
  if (!baseUrl) {
    return { ok: false, reason: "NEXT_PUBLIC_API_BASE_URL not set" as const };
  }

  const url = baseUrl.replace(/\/+$/, "");
  try {
    // We don't assume a specific backend health path exists; a simple GET to base URL
    // is enough to prove the backend is reachable for demo purposes.
    const res = await withTimeout(fetch(url, { method: "GET", cache: "no-store" }), 5000);
    return {
      ok: res.ok,
      status: res.status,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown_error" };
  }
}

export async function GET() {
  const backend = await checkBackend(process.env.NEXT_PUBLIC_API_BASE_URL);

  const allOk = backend.ok !== false;
  const status = allOk ? 200 : 503;

  return NextResponse.json(
    {
      ok: allOk,
      timestamp: new Date().toISOString(),
      env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ? "set" : "missing",
        NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? "set" : "missing",
        RESEND_API_KEY: process.env.RESEND_API_KEY ? "set" : "missing",
      },
      checks: {
        backend,
      },
    },
    { status }
  );
}

