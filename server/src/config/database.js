import { PrismaPg     } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["error", "warn", "query"]
      : ["error"],
});

const connectToDatabase = async () => {
    try {
        await prisma.$connect();
        console.log("Successfully connected to the database.");
    } catch (error) {        
        console.log(`Error while connecting to the database: ${error.message}`);
        process.exit(1);
    }
}

const disconnectFromDatabase = async () => {
    await prisma.$disconnect();
    console.log("Successfully disconnected from the database.");
};

export { prisma, connectToDatabase, disconnectFromDatabase };