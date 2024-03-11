import {AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool} from 'amazon-cognito-identity-js';
import {getSecret} from './secrets.js'

// Retrieve parameters asynchronously
async function getUserPool() {
    try {
        const userPoolId = await getSecret('REACT_APP_USER_POOL_ID');
        const clientId = await getSecret('REACT_APP_CLIENT_ID');

        // Create CognitoUserPool instance with retrieved values
        return new CognitoUserPool({
            UserPoolId: userPoolId,
            ClientId: clientId
        });

    } catch (err) {
        console.error(`Error retrieving parameters: ${err}`);
        throw err;
    }
}

export async function getCurrentUserAttr() {
    return new Promise(async (resolve, reject) => { // Marking the inner function as async
        const cognitoUser = await getCurrentUser(); // Await for getCurrentUser()

        if (!cognitoUser) {
            resolve(null); // No need for Promise.resolve()
            return;
        }

        try {
            await new Promise((resolve, reject) => {
                cognitoUser.getSession((err, session) => {
                    if (err) reject(err);
                    else resolve(session);
                });
            });
            const attributes = await new Promise((resolve, reject) => { // Await for getUserAttributes()
                cognitoUser.getUserAttributes((err, attributes) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(attributes);
                });
            });

            const userData = attributes.reduce((acc, attribute) => {
                acc[attribute.Name] = attribute.Value;
                return acc;
            }, {});

            resolve({...userData, username: cognitoUser.username});
        } catch (error) {
            reject(error);
        }
    });
}


export const createUser = async (email, password, firstname, lastname, dateOfBirth, phoneNumber, locale, callback) => {
    try {
        const userPool = await getUserPool();

        const attributeList = [
            new CognitoUserAttribute({Name: 'given_name', Value: firstname}),
            new CognitoUserAttribute({Name: 'family_name', Value: lastname}),
            new CognitoUserAttribute({Name: 'birthdate', Value: dateOfBirth}),
            new CognitoUserAttribute({Name: 'phone_number', Value: phoneNumber}),
            new CognitoUserAttribute({Name: 'locale', Value: locale}),
        ];

        userPool.signUp(email, password, attributeList, null, callback);
    } catch (err) {
        console.error('Failed to create CognitoUserPool instance:', err);
        // Handle error gracefully
    }
};
export const authenticateUser = async (email, password, callback) => {
    try {
        const userPool = await getUserPool();

        const authData = {Username: email, Password: password};
        const authDetails = new AuthenticationDetails(authData);
        const userData = {Username: email, Pool: userPool};
        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authDetails, {
            onSuccess: result => {
                callback(null, result);
            },
            onFailure: err => {
                callback(err);
            }
        });
    } catch (err) {
        console.error('Failed to authenticate user:', err);
        callback(err);
    }
};

export const logout = async () => {
    const userPool = await getUserPool();
    userPool.getCurrentUser().signOut();
    window.location.href = '/';
};

export const getCurrentUser = async () => {
    const userPool = await getUserPool();
    return userPool.getCurrentUser();
};
