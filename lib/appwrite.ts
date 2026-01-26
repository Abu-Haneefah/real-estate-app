import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

export const config = {
  platform: "com.jsm.restate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);

export async function login() {
  try {
    // 1. Create the Redirect URL
    // Use Linking.createURL("/") to ensure it points to your app's root
    const redirectUri = Linking.createURL("/");
    console.log("DEBUG: Generated Redirect URI:", redirectUri);

    // 2. Create OAuth2 Token
    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri,
    );

    if (!response) {
      console.error("DEBUG: No response from createOAuth2Token");
      throw new Error("Failed to Login");
    }

    console.log("DEBUG: OAuth Token URL:", response.toString());

    // 3. Open Browser for Authentication
    const browserResult = await WebBrowser.openAuthSessionAsync(
      response.toString(),
      redirectUri,
    );

    console.log("DEBUG: Browser Result Type:", browserResult.type);

    if (browserResult.type !== "success") {
      console.warn("DEBUG: Browser login was cancelled or failed");
      throw new Error("Failed to login");
    }

    // 4. Parse the URL returned by the browser
    const url = new URL(browserResult.url);
    console.log("DEBUG: Full Callback URL:", browserResult.url);

    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) {
      console.error("DEBUG: Missing secret or userId in URL params");
      throw new Error("No User Found");
    }

    // 5. Create the Session
    console.log("DEBUG: Attempting to create session for userId:", userId);
    const session = await account.createSession(userId, secret);

    if (!session) {
      throw new Error("Failed to create user session");
    }

    console.log("DEBUG: Session created successfully!");
    return true;
  } catch (error) {
    console.error("DEBUG: Login Error Details:", error);
    return false;
  }
}

export async function getUser() {
  try {
    const response = await account.get();
    console.log("DEBUG: Fetched User:", response.name);

    if (response.$id) {
      const userAvatar = avatar.getInitials(response.name);
      return {
        ...response,
        avatar: userAvatar.toString(),
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
    console.log("DEBUG: Session deleted");
    return true;
  } catch (error) {
    console.error("DEBUG: Logout error", error);
    return false;
  }
}
