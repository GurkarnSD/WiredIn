import clientPromise from ".";

let client: any;
let db: any;
let users: any;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    console.log("Connected to MongoDB")
    db = client.db('UserDatabase');
    console.log("Connected to DB")
    users = db.collection("users");
    console.log("Connected to users collection")
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    throw new Error("Could not initialize MongoDB connection");
  }
}

(async () => {
  await init();
})();

async function createUserMongo(user: any): Promise<boolean> {
  try {
    if (!users) await init();
    console.log("Creating user:", user);
    const result = await users.insertOne(user);
    console.log("User created:", result);
    return true;
  } catch (error) {
    throw new Error("Unable To Create User");
  }
}

async function deleteUserMongo(uid: string): Promise<any> {
  try {
    if (!users) await init();
    const result = await users.deleteOne({ uid });
    return result;
  } catch (error) {
    throw new Error("Unable To Delete User");
  }
}

async function getUserMongo(uid: string, name: string): Promise<any> {
  console.log("Finding user:", uid)
  const regexPattern = new RegExp(`^${name}$`, 'i');
  
  var result = {};
  try {
    if (!users) await init();
    if (uid !== '') result = await users.findOne({ uid });
    else if (name !== '') result = await users.findOne({ displayName: { $regex: regexPattern } });
    return result;
  } catch (error) {
    throw new Error("Unable To Find User");
  }
}

export {
  createUserMongo,
  deleteUserMongo,
  getUserMongo,
};
