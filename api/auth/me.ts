import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_supabase';

/**
 * GET /api/auth/me
 * 
 * Returns user profile, roles, and newJoiner flag.
 * Per Global_Authentication_v1.md spec Section 4.
 * 
 * This endpoint should be called after identity provider login
 * to retrieve the user's IAM context from Supabase.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract and validate MSAL JWT token from Authorization header
    const authHeader = req.headers.authorization;
    let userId: string | undefined;
    let email: string | undefined;
    let tokenClaims: any = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        // Decode JWT token (without verification - for production, verify signature)
        // MSAL tokens are JWTs that can be decoded to extract claims
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          tokenClaims = payload;
          
          // Extract user info from token claims
          email = payload.email || payload.preferred_username || payload.upn;
          userId = payload.sub || payload.oid || payload.localAccountId;
          
          // Validate email domain (internal-only)
          if (email) {
            const allowedDomains = ['@digitalqatalyst.com', '@dq.com', '@dq.lk'];
            const emailLower = email.toLowerCase();
            const isAllowed = allowedDomains.some(domain => emailLower.endsWith(domain));
            if (!isAllowed) {
              return res.status(403).json({ error: 'Access denied - external email domain not allowed' });
            }
          }
        }
      } catch (tokenError) {
        console.error('Error decoding token:', tokenError);
        // Fall through to header-based auth for backward compatibility
      }
    }

    // Fallback: Get user ID from headers (for backward compatibility)
    if (!userId) {
      userId = req.headers['x-user-id'] as string | undefined;
    }
    if (!email) {
      email = req.headers['x-user-email'] as string | undefined;
    }

    if (!userId && !email) {
      return res.status(401).json({ error: 'Unauthorized - valid token or user ID/email required' });
    }

    // Fetch user from Supabase
    let userData;
    if (userId) {
      const { data, error } = await supabaseAdmin
        .from('users_local')
        .select('id, email, dws_role, segment, domain, role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Failed to fetch user data' });
      }
      userData = data;
    } else if (email) {
      const { data, error } = await supabaseAdmin
        .from('users_local')
        .select('id, email, dws_role, segment, domain, role')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Failed to fetch user data' });
      }
      userData = data;
    }

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch responsibility roles
    const { data: responsibilityRolesData } = await supabaseAdmin
      .from('user_responsibility_roles')
      .select('role')
      .eq('user_id', userData.id);

    const roles: string[] = [];
    const roleString = (userData.dws_role as string) || (userData.role as string) || 'viewer';
    roles.push(roleString);

    if (responsibilityRolesData) {
      roles.push(...responsibilityRolesData.map(r => r.role));
    }

    const isNewJoiner = userData.segment === 'new_joiner';

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      name: userData.name || userData.email,
      roles,
      newJoiner: isNewJoiner,
      segment: userData.segment || 'employee',
      domain: userData.domain,
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
