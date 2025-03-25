import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";
import Order from "@/models/Order";
import Product from "@/models/Product";

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
        // Force fresh model

        const orders = events.map((event) => ({
            userId: event.data.userId,
            items: event.data.items.map(item => ({
                product: item.product,
                productSnapshot: item.productSnapshot,
                quantity: item.quantity
            })),
            amount: event.data.amount,
            address: event.data.address,
            status: 'Order Placed',
            date: event.data.date
        }));
        await Order.insertMany(orders);

        return { success: true, processed: orders.length };
    }
);