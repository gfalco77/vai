import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'eu-west-2_isJX9AzfJ',
  ClientId: '7ecrgo1ccmqstgtvsemembh7gu',
};
// UserPoolId: process.env.REACT_APP_USER_POOL_ID,
// ClientId: process.env.REACT_APP_CLIENT_ID,
export default new CognitoUserPool(poolData);