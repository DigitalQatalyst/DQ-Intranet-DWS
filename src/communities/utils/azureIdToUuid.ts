/**
 * Convert an Azure AD account identifier into a stable UUID string.
 *
 * On most Entra ID tenants, localAccountId / homeAccountId are already GUIDs,
 * so for now we simply return the input as-is. This helper exists to provide
 * a single mapping point if we need to normalize or hash IDs later.
 */
export function azureIdToUuid(azureId: string): string {
  return azureId;
}


