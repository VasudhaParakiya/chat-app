import { Auth0Provider } from "@auth0/auth0-react";
import {
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_CLIENT_ID,
} from "../../../config";

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = REACT_APP_AUTH0_DOMAIN;
  const clientId = REACT_APP_AUTH0_CLIENT_ID;

  //   const navigate = useNavigate();
  return (
    <Auth0Provider domain={domain} clientId={clientId}>
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
