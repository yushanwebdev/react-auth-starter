import jwt from "jsonwebtoken";
import { ObjectID } from "mongodb";
import { getDBConnection } from "../db";

export const updateUserInfoRoute = {
  path: "/api/users/:userId",
  method: "put",
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;

    const updates = ({ favouriteFood, hairColor, bio }) =>
      ({
        favouriteFood,
        hairColor,
        bio,
      }(req.body)); // We add this to make sure that users don't include extraneous data in the updates that they're trying to make to the database.

    if (!authorization) {
      return res.status(401).json({ message: "No authorization received" });
    }

    // Bearer fgkfjkdjk.djjdss.djdjdjkdsjdkj
    const token = authorization.split(" ")[1];
  },
};
