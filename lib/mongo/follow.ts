import clientPromise from ".";
import { getUserMongo, updateUserMongo } from "./user";

let client: any;
let db: any;
let users: any;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    console.log("Connected to MongoDB");
    db = client.db("UserDatabase");
    users = db.collection("users");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    throw new Error("Could not initialize MongoDB connection");
  }
}

(async () => {
  await init();
})();

async function followUserMongo(user: string, otherUser: string) {
  try {
    if (!users) await init();
    console.log("Getting user:", user);
    console.log("Getting other user:", otherUser);
    const userData = await getUserMongo(user, "");
    const otherUserData = await getUserMongo(otherUser, "");

    if (
      !otherUserData.followers.includes(user) ||
      !userData.following.includes(otherUser)
    ) {
      otherUserData.followers.push(user);
      userData.following.push(otherUser);
    }

    await updateUserMongo(otherUserData);

    await updateUserMongo(userData);

    return true;
  } catch (error) {
    throw new Error("Unable To Follow User");
  }
}

async function unfollowUserMongo(user: string, otherUser: string) {
  try {
    if (!users) await init();
    console.log("Getting user:", user);
    console.log("Getting other user:", otherUser);
    const userData = await getUserMongo(user, "");
    const otherUserData = await getUserMongo(otherUser, "");

    otherUserData.followers = otherUserData.followers.filter(
      (followerId: string) => followerId !== user
    );

    userData.following = userData.following.filter(
      (followingId: string) => followingId !== otherUser
    );

    await updateUserMongo(otherUserData);

    await updateUserMongo(userData);

    return true;
  } catch (error) {
    throw new Error("Unable To Unfollow User");
  }
}

export { followUserMongo, unfollowUserMongo };
