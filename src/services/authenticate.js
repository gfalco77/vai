import { AuthenticationDetails, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const userPool = new CognitoUserPool({
    UserPoolId: process.env.REACT_APP_USER_POOL_ID,
    ClientId: process.env.REACT_APP_CLIENT_ID
});
export const createUser = (email, password, firstname, lastname, dateOfBirth, phoneNumber, locale, callback) => {
    const attributeList = [
        new CognitoUserAttribute({
            Name: 'given_name',
            Value: firstname,
        }),
        new CognitoUserAttribute({
            Name: 'family_name',
            Value: lastname,
        }),
        new CognitoUserAttribute({
            Name: 'birthdate',
            Value: dateOfBirth,
        }),
        new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phoneNumber,
        }),
        new CognitoUserAttribute({
            Name: 'locale',
            Value: locale,
        }),
    ]
    userPool.signUp(email, password, attributeList, null, callback)
}

export const authenticateUser = (email, password, callback) => {
    const authData = {
        Username: email,
        Password: password,
    }
    const authDetails = new AuthenticationDetails(authData)
    const userData = {
        Username: email,
        Pool: userPool,
    }
    const cognitoUser = new CognitoUser(userData)
    cognitoUser.authenticateUser(authDetails, {
        onSuccess: result => {
            callback(null, result)
        },
        onFailure: err => {
            callback(err)
        }
    })
}

export const logout = () => {
    userPool.getCurrentUser().signOut();
    window.location.href = '/';
};

export const getCurrentUser = () => {
    return(userPool.getCurrentUser());
};

export async function getCurrentUserAttr() {
    return new Promise((resolve, reject) => {
        const cognitoUser = userPool.getCurrentUser();

        if (!cognitoUser) {
            reject(new Error("No user found"));
            return
        }

        cognitoUser.getSession((err, session) => {
            if (err) {
                reject(err);
                return;
            }
            cognitoUser.getUserAttributes((err, attributes) => {
                if (err) {
                    reject(err);
                    return;
                }
                const userData = attributes.reduce((acc, attribute) => {
                    acc[attribute.Name] = attribute.Value;
                    return acc;
                }, {})

                resolve({ ...userData, username: cognitoUser.username });
            })
        })
    })
}