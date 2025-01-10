"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = require("../repositories/user.repository");
const amqp = require("amqplib");
// Consume notification queue and send emails
const consumeNotificationQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield amqp.connect("amqp://localhost");
    const channel = yield connection.createChannel();
    const queue = "userUpdateQueue";
    // Assert the queue exists and is durable
    yield channel.assertQueue(queue, { durable: true });
    console.log("Waiting for messages in queue:", queue);
    // Handle incoming messages
    channel.consume(queue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        if (msg !== null) {
            try {
                const message = JSON.parse(msg.content.toString());
                const { userId, isActive } = message;
                console.log("Message received:", message);
                // Call the updateUser function to update the user's status
                const updateResult = yield (0, user_repository_1.updateUser)(userId, isActive);
                if (updateResult.success) {
                    console.log("User status updated successfully:", updateResult.message);
                    // Acknowledge the message if the update was successful
                    channel.ack(msg);
                }
                else {
                    console.error("Failed to update user:", updateResult.message);
                    // Negative acknowledge the message to be requeued
                    channel.nack(msg, false, true);
                }
            }
            catch (error) {
                console.error("Error processing message:", error);
                // Negative acknowledge the message to be requeued in case of error
                channel.nack(msg, false, true);
            }
        }
    }));
    // Graceful shutdown handler
    const gracefulShutdown = () => {
        console.log("Closing RabbitMQ connection gracefully...");
        channel.close();
        connection.close();
        process.exit(0);
    };
    // Listen for termination signals to shut down gracefully
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
});
// Start consuming the queue
consumeNotificationQueue().catch((error) => {
    console.error("Error in consuming notifications:", error);
    process.exit(1);
});
