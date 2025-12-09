import "./index.css";
import "./styles/theme.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AppRouter } from "./AppRouter";
import { createRoot } from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance, defaultLoginRequest } from "./services/auth/msal";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://9609a7336af8.ngrok-free.app/services-api",
  }),
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  
  // Show blank screen while initializing - no content until authenticated
  root.render(<div style={{ display: 'none' }} />);
  
  // Guard to prevent infinite redirect loops
  const REDIRECT_GUARD_KEY = 'msal_redirect_guard';
  const MAX_REDIRECT_ATTEMPTS = 2;
  
  // Check if we're in a redirect loop
  const redirectAttempts = parseInt(sessionStorage.getItem(REDIRECT_GUARD_KEY) || '0', 10);
  const isRedirectLoop = redirectAttempts >= MAX_REDIRECT_ATTEMPTS;
  
  // Check if we just came back from a redirect (URL contains code or error)
  const urlParams = new URLSearchParams(window.location.search);
  const hasRedirectParams = urlParams.has('code') || urlParams.has('error') || urlParams.has('state');
  
  // If we're in a redirect loop, show error instead of redirecting again
  if (isRedirectLoop) {
    sessionStorage.removeItem(REDIRECT_GUARD_KEY);
    root.render(
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-4">Too many redirect attempts. Please clear your browser cache and try again.</p>
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = window.location.origin;
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear and Retry
          </button>
        </div>
      </div>
    );
  } else {
    // Initialize MSAL and handle redirect promise
    const initializeAndHandleAuth = async () => {
      try {
        // Check if MSAL is already initialized to avoid re-initialization errors
        let initPromise: Promise<void>;
        try {
          // Try to initialize MSAL - it will throw if already initialized
          initPromise = msalInstance.initialize();
        } catch (initError: any) {
          // If initialization fails because it's already initialized, that's okay
          if (initError?.message?.includes("already been initialized") || 
              initError?.message?.includes("already initialized") ||
              initError?.code === "already_initialized") {
            console.log("MSAL already initialized, continuing...");
            initPromise = Promise.resolve();
          } else {
            // For other errors, check if we can still proceed
            try {
              // Try to get accounts to see if MSAL is functional
              const testAccounts = msalInstance.getAllAccounts();
              console.log("MSAL appears functional despite init error, continuing...");
              initPromise = Promise.resolve();
            } catch {
              // If we can't even get accounts, this is a real error
              throw initError;
            }
          }
        }

        // Wait for initialization, then handle redirect promise
        await initPromise;
        const result = await msalInstance.handleRedirectPromise();
        
        // Clear redirect guard on successful authentication
        if (result?.account) {
          sessionStorage.removeItem(REDIRECT_GUARD_KEY);
        }
        
        let authenticatedAccount = null;
        
        // Check for authenticated account
        if (result?.account) {
          authenticatedAccount = result.account;
          msalInstance.setActiveAccount(result.account);
        } else {
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            authenticatedAccount = accounts[0];
            msalInstance.setActiveAccount(accounts[0]);
          }
        }
        
        // If we just came back from a redirect but have no account, there might be an error
        if (hasRedirectParams && !authenticatedAccount) {
          const error = urlParams.get('error');
          const errorDescription = urlParams.get('error_description');
          
          if (error) {
            console.error("Authentication error from redirect:", error, errorDescription);
            root.render(
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
                  <p className="text-gray-600 mb-4">
                    {errorDescription || error || "An error occurred during authentication."}
                  </p>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem(REDIRECT_GUARD_KEY);
                      window.location.href = window.location.origin;
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            );
            return;
          }
        }
        
        // If no authenticated account, check if we should redirect
        if (!authenticatedAccount) {
          // Only redirect if we're not already in a redirect flow
          // Add a small delay to allow MSAL to fully process any pending redirects
          setTimeout(() => {
            // Double-check accounts after delay
            const delayedAccounts = msalInstance.getAllAccounts();
            if (delayedAccounts.length > 0) {
              const account = delayedAccounts[0];
              msalInstance.setActiveAccount(account);
              // Render app with authenticated account
              root.render(
                <ApolloProvider client={client}>
                  <MsalProvider instance={msalInstance}>
                    <AppRouter />
                  </MsalProvider>
                </ApolloProvider>
              );
              return;
            }
            
            // Increment redirect attempt counter
            sessionStorage.setItem(REDIRECT_GUARD_KEY, String(redirectAttempts + 1));
            
            // Trigger login redirect - no app content rendered
            msalInstance.loginRedirect({
              ...defaultLoginRequest
            }).catch((error) => {
              console.error("Login redirect failed:", error);
              sessionStorage.removeItem(REDIRECT_GUARD_KEY);
              // Show minimal error message if redirect fails
              root.render(
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
                    <p className="text-gray-600 mb-4">Please sign in to access this application.</p>
                    <button
                      onClick={() => {
                        sessionStorage.removeItem(REDIRECT_GUARD_KEY);
                        window.location.reload();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Retry Login
                    </button>
                  </div>
                </div>
              );
            });
          }, hasRedirectParams ? 500 : 100); // Longer delay if we just came back from redirect
          return; // Do not render app - user is not authenticated
        }
        
        // User is authenticated - handle special routing cases
        try {
          const isSignupState =
            typeof result?.state === "string" &&
            result.state.includes("ej-signup");
          const claims = (result as any)?.idTokenClaims || {};
          const isNewUser =
            claims?.newUser === true || claims?.newUser === "true";
          if (isSignupState || isNewUser) {
            // Navigate to onboarding without adding history entry
            window.location.replace("/dashboard/onboarding");
            return;
          }
        } catch (error) {
          console.warn("Error processing authentication state:", error);
        }
        
        // User is authenticated - render the app
        root.render(
          <ApolloProvider client={client}>
            <MsalProvider instance={msalInstance}>
              <AppRouter />
            </MsalProvider>
          </ApolloProvider>
        );
      } catch (e: any) {
        console.error("MSAL initialization failed:", e);
        sessionStorage.removeItem(REDIRECT_GUARD_KEY);
        
        // Check if we have accounts despite initialization failure
        try {
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            console.log("Found accounts despite initialization error, proceeding with app render");
            msalInstance.setActiveAccount(accounts[0]);
            // Render app if we have accounts
            root.render(
              <ApolloProvider client={client}>
                <MsalProvider instance={msalInstance}>
                  <AppRouter />
                </MsalProvider>
              </ApolloProvider>
            );
            return;
          }
        } catch (accountError) {
          console.warn("Error checking accounts:", accountError);
        }
        
        // On initialization failure, show error with more details
        const errorMessage = e?.message || "Unknown error";
        root.render(
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
              <p className="text-gray-600 mb-4">
                Unable to initialize authentication. Please refresh the page.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-sm text-gray-500 mb-4 mt-2">
                  Error: {errorMessage}
                </p>
              )}
              <div className="space-x-4">
                <button
                  onClick={() => {
                    sessionStorage.removeItem(REDIRECT_GUARD_KEY);
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem(REDIRECT_GUARD_KEY);
                    msalInstance.loginRedirect({
                      ...defaultLoginRequest
                    }).catch((error) => {
                      console.error("Login redirect failed:", error);
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Try Login Again
                </button>
              </div>
            </div>
          </div>
        );
      }
    };

    initializeAndHandleAuth();
  }
}
