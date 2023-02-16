// Add here the endpoints for services you would like to use.
export const apiConfig = {
    endpoint: "https://dev.azure.com/msaltestingjs/_apis/projects?api-version=4.0",
    scopes: ["https://app.vssps.visualstudio.com/user_impersonation"] // ["499b84ac-1321-427f-aa17-267ca6975798/.default"] // do not change this value
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["openid", "profile", "499b84ac-1321-427f-aa17-267ca6975798/.default"],
};

/**
 * Add here the scopes to request when obtaining an access token for a web API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const tokenRequest = {
    scopes: apiConfig.scopes,
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};
