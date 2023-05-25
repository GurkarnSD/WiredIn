import functions = require("firebase-functions");
import {createUserMongo, deleteUserMongo} from "../../lib/mongo/user";
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
    following: [],
    followers: [],
    title: "",
    bio: "",
  };

  if (!newUser.displayName) {
    const updatedUser = await admin.auth().getUser(newUser.uid);
    newUser.displayName = updatedUser.displayName;
  }

  await createUserMongo(newUser);
});

export const deleteUser = functions.auth.user().onDelete(async (user) => {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log("Activated deleteUser function");
  await deleteUserMongo(user.uid);
});
