import { updateUser } from "../repositories/user.repository"

const amqp = require("amqplib")


// Consume notification queue and send emails
const consumeNotificationQueue = async () => {
    
    const rabbitmqHost = process.env.RABBITMQ_HOST || "rabbitmq"
    const rabbitmqPort = process.env.RABBITMQ_PORT || "5672"

    const connection = await amqp.connect(
        `amqp://${rabbitmqHost}:${rabbitmqPort}`
    )
   

    const channel = await connection.createChannel()
    const queue = "userUpdateQueue"

    // Assert the queue exists and is durable
    await channel.assertQueue(queue, { durable: true })
    console.log("Waiting for messages in queue:", queue)

    // Handle incoming messages
    channel.consume(queue, async (msg: any) => {
        if (msg !== null) {
            try {
                const message = JSON.parse(msg.content.toString())
                const { userId, isActive } = message

                console.log("Message received:", message)

                // Call the updateUser function to update the user's status
                const updateResult = await updateUser(userId, isActive)

                if (updateResult.success) {
                    console.log(
                        "User status updated successfully:",
                        updateResult.message
                    )

                    // Acknowledge the message if the update was successful
                    channel.ack(msg)
                } else {
                    console.error(
                        "Failed to update user:",
                        updateResult.message
                    )

                    // Negative acknowledge the message to be requeued
                    channel.nack(msg, false, true)
                }
            } catch (error) {
                console.error("Error processing message:", error)

                // Negative acknowledge the message to be requeued in case of error
                channel.nack(msg, false, true)
            }
        }
    })

    // Graceful shutdown handler
    const gracefulShutdown = () => {
        console.log("Closing RabbitMQ connection gracefully...")
        channel.close()
        connection.close()
        process.exit(0)
    }

    // Listen for termination signals to shut down gracefully
    process.on("SIGINT", gracefulShutdown)
    process.on("SIGTERM", gracefulShutdown)
}

// Start consuming the queue
consumeNotificationQueue().catch((error) => {
    console.error("Error in consuming notifications:", error)
    process.exit(1)
})
