import {HandlerContext} from "$fresh/server.ts";
import {RoomChannel} from "../../communication/channel.ts";
import {ApiSendMessage} from "../../communication/types.ts";


export async function handler(
    req: Request,
    _ctx: HandlerContext,
): Promise<Response> {
    const data = (await req.json()) as ApiSendMessage;
    const channel = new RoomChannel(data.roomId);
    const from = data.user;

    if (data.kind === "isTyping") {
        // Send `is typing...` indicator.
        channel.sendIsTyping(from);
        channel.close();
        return new Response("OK");
    }

    const message = data.message,
        now = new Date();

    const vote = {
        user: from,
        vote: message,
        timestamp: Math.floor(now.getTime() / 1000)
    };

    channel.sendVote(vote);
    channel.close();

    await fetch(`${Deno.env.get("KAFKA_REST_URL")}/topics/votes/records`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Deno.env.get("KAFKA_REST_TOKEN")}`
        },
        body: JSON.stringify({value: {type: "JSON", data: vote}})
    });

    // console.log(vote);
    // console.log(result);

    return new Response("OK");
}
