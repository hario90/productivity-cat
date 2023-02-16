
import React, { useEffect } from "react";
// https://fluentsite.z22.web.core.windows.net/quick-start
import { Provider, teamsTheme } from "@fluentui/react-northstar";
import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from "./Tab";
import "./App.css";
import TabConfig from "./TabConfig";
import { useTeams } from "@microsoft/teamsfx-react";
import { getToken, selectAccount } from "../shared/http/msal";
import { AuthenticationResult } from "@azure/msal-browser";


const orgUrl = "https://domoreexp.visualstudio.com";



/** 
 * Helper function to call web API endpoint
 * using the authorization bearer token scheme
*/
function callApiWithToken(endpoint: string, token: string) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append("Authorization", bearer);
  headers.append("Accept", "application/json");

  const options = {
      method: "GET",
      headers: headers
  };

  console.log('Calling web API...');

  fetch(endpoint, options)
      .then(response => response.json())
      .then(response => {
          console.log('Web API responds:');
          console.log(JSON.stringify(response.value[0], null, 4));
      }).catch(error => {
          console.error(error);
      });
}

const connectToADO = (token: string) => {
  // GET https://dev.azure.com/{organization}/{project}/_apis/git/repositories/{repositoryId}/pullrequests?api-version=7.1-preview.1
  //VERB https://{instance}[/{team-project}]/_apis[/{area}]/{resource}?api-version={version}
  // callApiWithToken(`${orgUrl}/_apis/git/repositories/${repositoryId}/pullrequests?api-version=7.1-preview.1`, token)

  callApiWithToken("https://domoreexp.visualstudio.com/Teamspace/_apis/git/repositories?api-version=7.1-preview.1", token);
  // callApiWithToken(`${orgUrl}/_apis/git/repositories?api-version=7.1-preview.1`, token);
}

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const { theme } = useTeams({})[0];

  useEffect(() => {
    getToken(["https://app.vssps.visualstudio.com/user_impersonation"])
    .then((authResult: AuthenticationResult) => {
      connectToADO(authResult.accessToken);
    })
    .catch((e) => {console.log("It failed", e)});
  }, []);

  return (
    <Provider theme={theme || teamsTheme} styles={{ backgroundColor: "#eeeeee" }}>
      <Router>
        <Route exact path="/">
          <Redirect to="/tab" />
        </Route>
        <>
          <Route exact path="/privacy" component={Privacy} />
          <Route exact path="/termsofuse" component={TermsOfUse} />
          <Route exact path="/tab" component={Tab} />
          <Route exact path="/config" component={TabConfig} />
        </>
      </Router>
    </Provider>
  );
}
