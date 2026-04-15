import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App';

const domain = process.env.REACT_APP_AUTH0_DOMAIN || 'dev-13py8orx1jq30sww.us.auth0.com';
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || 'NGk6DzO5wtPoasTe4FK9PWmf52T6cACJ';
const audience = process.env.REACT_APP_AUTH0_AUDIENCE || 'https://smi-api';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        ...(audience && { audience }),
        // Ask Auth0 for email (shows on user object; API token still needs Action for email claim)
        scope: 'openid profile email',
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
