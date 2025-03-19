import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "goldenbutcher-next" });


// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    {
        event: 'clerk/user.created'
    },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            imageUrl: image_url
        }
        await connectDB();
        await User.create(userData);
    }
)

// Inngest Function to update user data in a database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'sync-user-update-from-clerk'
    },
    {
        event: 'clerk/user.updated'
    },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            imageUrl: image_url
        }
        await connectDB();
        await User.findByIdAndUpdate(id, userData, { new: true });
    }
)

// Inngest Function to delete user data from a database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'sync-user-deletion-from-clerk'
    },
    {
        event: 'clerk/user.deleted'
    },

    async ({ event }) => {
        const { id } = event.data;
        await connectDB();
        await User.findByIdAndDelete(id);
    }
)

// Inngest Function to create user order data to a database
export const createUserOrder = inngest.createFunction(
    {
        id: 'create-user-order',
        batchEvents: {
            maxSize: 5,
            timeout: '5s',
        }
    },
    { event: 'order/created' },
    async ({ events }) => {
        await connectDB();
        
        const orders = await Promise.all(events.map(async (event) => {
            try {
                const itemsWithPrices = await Promise.all(
                    event.data.items.map(async (item) => {
                        const product = await Product.findById(item.product);
                        if (!product) {
                            throw new Error(`Product ${item.product} not found`);
                        }
                        return {
                            product: item.product,
                            quantity: item.quantity,
                            price: product.offerPrice || product.price
                        };
                    })
                );

                return new Order({
                    userId: event.data.userId,
                    address: event.data.address,
                    items: itemsWithPrices,
                    amount: event.data.amount,
                    status: 'pending',
                    date: new Date(event.data.date)
                });
            } catch (error) {
                console.error(`Error processing event ${event.id}:`, error);
                return null; // Skip failed orders
            }
        }));

        // Filter out null values from failed order processing
        const validOrders = orders.filter(order => order !== null);
        
        if (validOrders.length > 0) {
            await Order.insertMany(validOrders);
        }
        
        return { 
            success: true, 
            processed: validOrders.length,
            failed: orders.length - validOrders.length
        };
    }
);