#!/bin/sh

echo "Generating env-config.js from runtime environment variables..."

envsubst < /usr/share/nginx/html/env.template.js \
  > /usr/share/nginx/html/env-config.js

echo "Starting NGINX as non-root user"
exec nginx -g "daemon off;"
EOF
cat > env.template.js << 'EOF'
window._env_ = {
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL}",
  VITE_SUPABASE_ANON_KEY: "${VITE_SUPABASE_ANON_KEY}"
  VITE_AZURE_CLIENT_ID: "${VITE_AZURE_CLIENT_ID}"
  VITE_AZURE_TENANT_ID: "${VITE_AZURE_TENANT_ID}"
};
EOF