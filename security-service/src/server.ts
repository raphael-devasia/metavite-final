import { dbConfig } from "./config/db.config"
import { seedRoles } from "./seedRoles"
import "./services/grpc-server"

export const startServer = async (): Promise<void> => {
    const PORT = process.env.PORT || 3005

    try {
        await dbConfig()
        await seedRoles()
        console.log(`Auth Service running on port ${PORT}`)
    } catch (error) {
        console.error("Server startup failed:", error)
        process.exit(1)
    }
}
