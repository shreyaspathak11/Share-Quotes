import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

/* create a new quote
    @param {string} userId - the ID of the user creating the quote
    @param {string} prompt - the quote text
    @param {string} tag - the tag for the quote
    @returns {Response} - the created quote object
*/
export const POST = async (request) => {
    const { userId, prompt, tag } = await request.json();

    try {
        await connectToDB();
        const newPrompt = new Prompt({ creator: userId, prompt, tag });

        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new quote", { status: 500 });
    }
}
