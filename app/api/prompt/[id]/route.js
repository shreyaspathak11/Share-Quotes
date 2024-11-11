import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

/* fetch a single prompt by ID
    @param {string} id - the ID of the prompt to fetch
    @returns {Response} - prompt object
*/
export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const quote = await Prompt.findById(params.id).populate("creator")
        if (!quote) return new Response("Prompt Not Found", { status: 404 });

        return new Response(JSON.stringify(quote), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

/* update a prompt by ID
    @param {string} id - the ID of the quote to update
    @returns {Response} - a response object
*/
export const PATCH = async (request, { params }) => {
    const { prompt, tag } = await request.json();

    try {
        await connectToDB();

        // Find the existing quote by ID
        const existingQuote = await Prompt.findById(params.id);

        if (!existingQuote) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Update the quote with new data
        existingQuote.prompt = prompt;
        existingQuote.tag = tag;

        await existingQuote.save();

        return new Response("Successfully updated the Prompts", { status: 200 });
    } catch (error) {
        return new Response("Error Updating Prompt", { status: 500 });
    }
};

/* delete a prompt by ID
    @param {string} id - the ID of the prompt to delete
    @returns {Response} - a response object
*/
export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        // Find the prompt by ID and remove it
        await Prompt.findByIdAndRemove(params.id);

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting prompt", { status: 500 });
    }
};
