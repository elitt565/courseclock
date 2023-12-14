import axios from "axios";
import { createRefresh } from 'react-auth-kit';
/**
 * Logs in the user with the provided values.
 * @param values - The login values.
 * @param isInstructor - Indicates whether the user is an instructor.
 * @returns The response data from the login request.
 */
export async function login(values: any, isInstructor: boolean) {
    const response = await axios.post('http://localhost:8080/auth/login', {
        ...values,
        isInstructor,
    });
    return response.data;
}

/**
 * Registers a new user with the provided information.
 * @param info - The user information for registration.
 * @returns The response from the registration request.
 */
export async function register(info: any) {
    const response = await axios.post('http://localhost:8080/auth/register', info);
    return response;
}

/**
 * Refreshes the authentication tokens.
 * @param authToken - The current authentication token.
 * @param authTokenExpireAt - The expiration time of the current authentication token.
 * @param refreshToken - The current refresh token.
 * @param refreshTokenExpiresAt - The expiration time of the current refresh token.
 * @param authUserState - The current user state.
 * @returns An object indicating the success of the refresh operation and the new tokens.
 */
export const refreshApi = createRefresh({
    interval: 25,
    refreshApiCallback: ({
      authToken,
      authTokenExpireAt,
      refreshToken,
      refreshTokenExpiresAt,
      authUserState,
    }): any => {
      return axios
        .post(`http://localhost:8080/auth/token`)
        .then(({ data }) => {
          return {
            isSuccess: true,
            newAuthToken: data.accessToken,
            newAuthTokenExpireIn: 30,
            newRefreshTokenExpiresIn: 1440
          };
        })
        .catch((e) => {
          console.log(e);
          return {
            isSuccess: false,
          };
        });
    },
  });