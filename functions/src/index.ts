import functions = require("firebase-functions");
import {createUserPrisma, deleteUserPrisma} from "../../lib/prisma/user";
import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const createUser = functions.auth.user().onCreate(async (user) => {
  console.log("Activated createUser function");
  const newUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    title: "",
    bio: "",
  };

  if (!newUser.displayName) {
    const updatedUser = await admin.auth().getUser(newUser.uid);
    newUser.displayName = updatedUser.displayName;
  }

  await createUserPrisma(newUser);
});

export const deleteUser = functions.auth.user().onDelete(async (user) => {
  console.log("Activated deleteUser function");
  await deleteUserPrisma(user.uid);
});
