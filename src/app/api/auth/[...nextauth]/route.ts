import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler functions for GET and POST requests
export { handler as GET, handler as POST }; 