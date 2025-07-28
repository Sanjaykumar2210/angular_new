export const environment = {
  production: false,
  auth0: {
    domain: 'dev-20e46pusyzcwhm2l.us.auth0.com', // Replace with your Auth0 domain
    clientId: 'JlaAQ5lcZFuQLdPXh9LWya3bC0GRwiuI', // Replace with your Auth0 client ID
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'YOUR_API_IDENTIFIER', // Optional: Replace if you have an API
    }
  }
}; 