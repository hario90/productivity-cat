import { AuthenticationResult, Configuration, LogLevel, PublicClientApplication } from "@azure/msal-browser";
import { loginRequest } from "./config";

let username = ""
const appTenantId = "72f988bf-86f1-41af-91ab-2d7cd011db47";
const authority = `https://login.microsoftonline.com/${appTenantId}`;
const clientId = "9a605161-8a3b-470e-89f6-7e3b622a645d";

const msalConfiguration: Configuration = {
    auth: {
        clientId, // This is the ONLY mandatory field that you need to supply.
        authority, // Defaults to "https://login.microsoftonline.com/common"
        // redirectUri: `https://localhost:${port}/${clientId}`, // You must register this URI on Azure Portal/App Registration. Defaults to window.location.href
        navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO btw tabs.
        storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
}
  
const msalApp = new PublicClientApplication(msalConfiguration);

function login() {
    return msalApp.loginPopup(loginRequest).then(onRedirect);
}


/**
 * A promise handler needs to be registered for handling the
 * response returned from redirect flow. For more information, visit:
 * 
 */
msalApp.handleRedirectPromise()
    .then(onRedirect)
    .catch((error) => {
        console.error("There was an error while redirecting you:", error);
    });

function welcomeUser(name: string, calledFrom: string) {
    console.log("[", calledFrom, "] Welcome, ", name, "!");
}

export function selectAccount() {

    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

    const currentAccounts = msalApp.getAllAccounts();

    if (!currentAccounts || currentAccounts.length < 1) {
        return;
    } else if (currentAccounts.length > 1) {
        // Add your account choosing logic here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        const currentAccount = currentAccounts[0];
        console.log("currentAccount", currentAccount);
        username = currentAccount.username;
        welcomeUser(username, "selectAccount");
        msalApp.setActiveAccount(currentAccount);
    }
}

export const getToken = async (scopes: string[]): Promise<AuthenticationResult> => {
    console.log("Logging in")
    await login();
    console.log("after login");
    let account = msalApp.getActiveAccount();

    if (account) {
        console.log("acquiring token popup")
        // return msalApp.acquireTokenPopup({
        // account,
        // authority,
        // scopes,
        // }).then((resp) => {
        //     console.log("Acquired token success!", resp)
        //     return resp;
        // });
    }
    
    throw new Error ("No account!")
}

function onRedirect(response: any): void {
    console.log("onredirect")

  /**
   * To see the full list of response object properties, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
   */

  if (response !== null) {
      username = response.account.username;
      welcomeUser(username, "onredirect");
  } else {
      selectAccount();
  }
}