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

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err)
        return res.status(401).json({ message: "Unable to verify token" });

      const { id } = decoded;

      if (id !== userId)
        return res
          .status(403)
          .json({ message: "Not allowed to update that user's data" });

      const db = getDBConnection("react-auth-db");
      const result = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: ObjectID(id) },
          { $set: { info: updates } },
          { returnOriginal: false }
        );

      const { email, isVerified, info } = result.value;

      jwt.sign(
        { id, email, isVerified, info },
        process.env.JWT_SECRET,
        { expiresIn: "2d" },
        () => {
          if (err) res.status(200).json(err);

          res.status(200).json({ token });
        }
      );
    });
  },
};
