import { NextRequest } from "next/server";
import { fetchAction } from "convex/nextjs";

export async function POST(request: NextRequest) {
  const { action, args } = await request.json();

  if (action !== "auth:signIn" && action !== "auth:signOut") {
    return new Response("Invalid action", { status: 400 });
  }

  try {
    const result = await fetchAction(action, args);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
