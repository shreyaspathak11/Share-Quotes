import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Import User model and database connection utility
import User from '@models/user';
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  // Configure authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,        // Google client ID from environment variables
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables
    })
  ],
  
  // Define callback functions for session handling and sign-in flow
  callbacks: {
    // Session callback to add MongoDB user ID to the session object
    async session({ session }) {
      // Retrieve user record based on email from session
      const sessionUser = await User.findOne({ email: session.user.email });
      // Add MongoDB user ID to the session user object for reference in other parts of the app
      session.user.id = sessionUser._id.toString();

      return session;
    },

    // Sign-in callback to handle user creation and session setup
    async signIn({ account, profile, user, credentials }) {
      try {
        // Establish database connection
        await connectToDB();

        // Check if user already exists in MongoDB
        const userExists = await User.findOne({ email: profile.email });

        // If user does not exist, create and save a new user record
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(), // Create username by removing spaces and converting to lowercase
            image: profile.picture,  // Save profile picture URL
          });
        }

        return true;  // Allow sign-in if successful
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false; // Deny sign-in if there's an error
      }
    },
  }
});

// Export handler for GET and POST requests to support NextAuth
export { handler as GET, handler as POST };
