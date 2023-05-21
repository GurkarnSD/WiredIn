import functions = require("firebase-functions");
import {createUserMongo} from "../../lib/mongo/user";
import * as admin from "firebase-admin";
import {config} from "dotenv";
config();

/**
 * Create user in MongoDB on user account creation through Firebase Auth.
 */
export const createUser = functions.auth.user().onCreate(async (user) => {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log("Activated createUser function");
  const newUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    providerData: user.providerData,
  };

  // Check if displayName is null
  if (!newUser.displayName) {
    // Reload the user data to fetch updated displayName
    const updatedUser = await admin.auth().getUser(newUser.uid);
    newUser.displayName = updatedUser.displayName;
  }

  await createUserMongo(newUser);

  console.log("New user created:", newUser);
});
