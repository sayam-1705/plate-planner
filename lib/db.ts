import mongoose from "mongoose";

/**
 * MongoDB connection configuration
 */
const DB_NAME = "plane-planner";
let MONGODB_URI = process.env.MONGODB_URI as string;

// Basic validation
if (!MONGODB_URI) {
  throw new Error("MongoDB URI is not defined in environment variables");
}

// Simple URI formatting to ensure correct database
if (!MONGODB_URI.includes(`/${DB_NAME}`)) {
  MONGODB_URI = MONGODB_URI.replace(/\/?$/, `/${DB_NAME}`);
}

// Connection state
let isConnected = false;

/**
 * Connects to MongoDB database with connection caching
 */
async function connectDB() {
  // Return if already connected
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);

    isConnected = true;
    console.log(`Connected to ${DB_NAME} database`);

    // Simple event handler for disconnection
    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.log("Database connection lost");
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

/**
 * Disconnects from MongoDB database
 * @returns {Promise<boolean>} True if disconnection was successful, false otherwise
 */
async function disconnectDB(): Promise<boolean> {
  // If not connected, no need to disconnect
  if (!isConnected) return true;

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("Successfully disconnected from database");
    return true;
  } catch (error: unknown) {
    // Proper error handling with type checking
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during database disconnection";

    console.error(`Database disconnection failed: ${errorMessage}`);

    // Rethrow in development environment for debugging
    if (process.env.NODE_ENV === "development") {
      throw error;
    }

    return false;
  }
}

/**
 * Checks if the database connection is active
 * @returns {boolean} True if connected, false otherwise
 */
function isConnectedToDB(): boolean {
  // MongoDB connection states: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return mongoose.connection.readyState === 1;
}

export { connectDB as default, disconnectDB, isConnectedToDB };
