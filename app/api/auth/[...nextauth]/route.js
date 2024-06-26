import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDb } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  async session(session) {
    const sessionUser = await User.findOne({ email: session.user.email });

    session.user.id = sessionUser._id.toString();

    return session;
  },
  async signIn( { profile } ) {
    try {
      await connectToDb();

      // Check if user exists in the database
      const userExists = await User.findOne({ email: profile.email });
      
      if (!userExists) {
        // Create a new user
        const newUser = new User({
          email: profile.email,
          username: profile.name.replace(" ", "").toLowerCase(),
          image: profile.picture,
        });

        await newUser.save();
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
});

export { handler as GET, handler as POST };