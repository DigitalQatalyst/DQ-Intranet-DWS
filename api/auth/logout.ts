import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Logout endpoint - clears server-side session if any
 * POST /api/auth/logout
 * 
 * Note: MSAL handles client-side token clearing.
 * This endpoint is for clearing any server-side session data.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Clear any session cookies if using server-side sessions
    // For now, MSAL handles everything client-side, so this is a no-op
    // In the future, you might store session data in a database or cache
    
    res.setHeader(
      "Set-Cookie",
      "session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
    );

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout endpoint error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
