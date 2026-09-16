
export const multipleChoices = 300;
export const success = 200;
export const errorCase = 'Error';
// The REST backend returns a standard 401 Unauthorized on an expired/invalid
// access token (previously the old GraphQL backend used a custom 498).
export const tokenExpireCase = 401;