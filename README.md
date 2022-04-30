## JWT Access, Refresh Tokens

### API Endpoints

``
/posts  : Displays details of logged user  
/login  : Log in with user details. Returns an access token and refresh token  
/token  : Regenerate a new access token with the refresh token  
/logout : Delete existing refresh token (invalidation of an JWT token)
``