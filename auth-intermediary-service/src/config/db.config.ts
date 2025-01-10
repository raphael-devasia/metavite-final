import mongoose from "mongoose"

class DatabaseConnection {
    private static instance: DatabaseConnection
    private isConnected = false

    private constructor() {}

    public static getInstance(): DatabaseConnection {
        if (!this.instance) {
            this.instance = new DatabaseConnection()
        }
        return this.instance
    }

    public async connect(): Promise<mongoose.Connection> {
        if (this.isConnected) {
            return mongoose.connection
        }

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined")
        }

        try {
            await mongoose.connect(process.env.MONGO_URI)
            this.isConnected = true
            console.log("MongoDB connected successfully")
            return mongoose.connection
        } catch (error) {
            console.error("MongoDB connection error:", error)
            throw error
        }
    }
}

export const dbConfig = async (): Promise<mongoose.Connection> => {
    return DatabaseConnection.getInstance().connect()
}
