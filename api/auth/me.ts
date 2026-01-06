import type { VercelRequest, VercelResponse } from "@vercel/node";

interface TokenClaims {
  sub?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  roles?: string | string[];
  new_joiner?: boolean;
  aud?: string;
  exp?: number;
  iat?: number;
}

/**
 * Validates Azure Entra ID token and returns user profile with roles
 * GET /api/auth/me
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);

    // Validate token with Microsoft
    const tenantId = process.env.VITE_AZURE_TENANT_ID || process.env.AZURE_AD_TENANT_ID;
    if (!tenantId) {
      console.error("Azure Tenant ID not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // For client-side tokens, we validate via Microsoft's userinfo endpoint
    // In production, you should validate the JWT signature properly
    const userInfoResponse = await fetch(
      "https://graph.microsoft.com/oidc/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userInfo = await userInfoResponse.json();

    // Decode token claims (in production, use a proper JWT library)
    // For now, we'll extract from userInfo and make a secondary call if needed
    let claims: TokenClaims = {
      email: userInfo.email || userInfo.preferred_username,
      name: userInfo.name,
      given_name: userInfo.given_name,
      family_name: userInfo.family_name,
      sub: userInfo.sub || userInfo.oid,
    };

    // Try to get roles from token via Graph API or decode JWT
    // For now, we'll fetch user profile from Graph API
    const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (graphResponse.ok) {
      const graphUser = await graphResponse.json();
      // Map additional info from Graph API
      claims.email = graphUser.mail || graphUser.userPrincipalName || claims.email;
    }

    // Validate email domain (internal DQ employees only)
    const email = (claims.email || "").toLowerCase();
    const isInternalEmail =
      email.endsWith("@dq.com") || email.endsWith("@dq.lk");

    if (!isInternalEmail) {
      return res.status(403).json({
        error: "External email domain not allowed",
      });
    }

    // Extract roles from token claims
    // In Azure Entra ID, roles come from app roles or group claims
    // For now, we'll set defaults based on user properties
    // TODO: Configure app roles in Azure Entra ID and extract from token
    const roles: string[] = [];
    
    // Check for roles claim (could be string or array)
    if (claims.roles) {
      if (Array.isArray(claims.roles)) {
        roles.push(...claims.roles);
      } else {
        roles.push(claims.roles);
      }
    }

    // Default role if none assigned
    if (roles.length === 0) {
      roles.push("employee");
    }

    // Determine segment based on roles and claims
    let segment: "employee" | "new_joiner" | "lead" | "hr" | "tech_support" | "platform_admin" = "employee";
    
    if (claims.new_joiner || roles.includes("new_joiner")) {
      segment = "new_joiner";
    } else if (roles.includes("system_admin") || roles.includes("admin")) {
      segment = "platform_admin";
    } else if (roles.includes("lead")) {
      segment = "lead";
    } else if (roles.includes("hr")) {
      segment = "hr";
    } else if (roles.includes("tech_support")) {
      segment = "tech_support";
    }

    // Determine if user is a new joiner
    const newJoiner = segment === "new_joiner" || claims.new_joiner === true;

    // Return user profile
    const userProfile = {
      id: claims.sub || userInfo.sub || userInfo.oid || "",
      email: claims.email || "",
      name: claims.name || userInfo.name || "",
      givenName: claims.given_name,
      familyName: claims.family_name,
      picture: undefined, // Graph API profile picture if needed
      roles,
      segment,
      newJoiner,
      employeeId: claims.sub || userInfo.sub || userInfo.oid,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Auth me endpoint error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
