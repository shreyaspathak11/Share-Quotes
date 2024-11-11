import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

/* fetch all quotes created by a user
    @param {string} id - the ID of the user to fetch quotes for
    @returns {Response} - an array of prompt objects
*/
export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const quotes = await Prompt.find({ creator: params.id }).populate("creator")

        return new Response(JSON.stringify(quotes), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch quotes created by user", { status: 500 })
    }
} 