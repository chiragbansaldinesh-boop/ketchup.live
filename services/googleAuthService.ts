import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/config/firebase';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export const googleAuthService = {
  async signInWithGoogle() {
    try {
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

      if (!webClientId) {
        throw new Error('Google Web Client ID not configured. Please add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to your .env file');
      }

      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'com.ketchup.live',
        path: 'auth',
      });

      const request = new AuthSession.AuthRequest({
        clientId: webClientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Token,
        usePKCE: false,
      });

      await request.makeAuthUrlAsync(discovery);

      const result = await request.promptAsync(discovery, {
        useProxy: true,
      });

      if (result.type === 'success') {
        const { id_token } = result.params;

        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);

        return {
          success: true,
          user: userCredential.user,
        };
      } else if (result.type === 'cancel') {
        return {
          success: false,
          error: 'Sign-in cancelled',
        };
      } else {
        return {
          success: false,
          error: 'Sign-in failed',
        };
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during Google Sign-In',
      };
    }
  },
};
