// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Auth0Provider } from "@auth0/auth0-react";

// import App from "./App.jsx";
// import client from "./client.jsx";
// import "./index.css";
// import { ApolloProvider } from "@apollo/client";
// import Auth0ProviderWithHistory from "./ui/component/Auth0Provider/Auth0ProviderWithHistory.jsx";
// import ApolloWrapper from "./client.jsx";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   // <Auth0Provider
//   //   domain="dev-la3ds5f55hutyak4.us.auth0.com"
//   //   clientId="380O7RoueTGHl1qUhIdengR0lJ5YFZCa"
//   //   authorizationParams={{
//   //     redirect_uri: window.location.origin,
//   //   }}
//   // >
//   //   {/* <Auth0ProviderWithHistory> */}
//   //   {/* <ApolloProvider client={client}> */}
//   //   <ApolloWrapper>
//   //     <App />
//   //   </ApolloWrapper>
//   // </Auth0Provider>
//   //   {/* </ApolloProvider> */}

//   //   {/* </Auth0ProviderWithHistory> */}
//   <Auth0Provider
//     domain="dev-la3ds5f55hutyak4.us.auth0.com"
//     clientId="380O7RoueTGHl1qUhIdengR0lJ5YFZCa"
//     authorizationParams={{
//       redirect_uri: window.location.origin,
//     }}
//   >
//     {/* <Auth0ProviderWithHistory> */}
//     {/* <ApolloProvider client={client}> */}
//     <ApolloWrapper>
//       <App />
//     </ApolloWrapper>
//     {/* </ApolloProvider> */}
//     {/* </Auth0ProviderWithHistory> */}
//   </Auth0Provider>
// );

import React from "react";
import ReactDOM from "react-dom/client";
// import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.jsx";

import "./index.css";
import { ApolloProvider } from "@apollo/client";
import client from "./client.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   // <Auth0Provider
//   //   domain="dev-la3ds5f55hutyak4.us.auth0.com"
//   //   clientId="380O7RoueTGHl1qUhIdengR0lJ5YFZCa"
//   //   authorizationParams={{
//   //     redirect_uri: window.location.origin,
//   //   }}
//   //   audience="https://dev-la3ds5f55hutyak4.us.auth0.com/api/v2/"
//   // >
//   // <ApolloWrapper>
//   // </ApolloWrapper></Auth0Provider>
//   <ApolloProvider client={client}>
//     <App />
//   </ApolloProvider>
// );
