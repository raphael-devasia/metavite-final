import dotenv from "dotenv"
import { startServer } from "./server"
import "./services/grpc-server"

dotenv.config()
startServer()
// 