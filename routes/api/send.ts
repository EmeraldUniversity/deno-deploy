import {HandlerContext} from "$fresh/server.ts";
import {RoomChannel} from "../../communication/channel.ts";
import {ApiSendMessage} from "../../communication/types.ts";


export async function handler(
    req: Request,
    _ctx: HandlerContext,
): Promise<Response> {
    const data = (await req.json()) as ApiSendMessage;
    console.log(data);

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
        timestamp: now.toISOString()
    };

    channel.sendVote(vote);
    channel.close();

    fetch(`${Deno.env.get("UPSTASH_KAFKA_REST_URL")}/produce/voting/${JSON.stringify(vote)}`, {
        headers: {
            Authorization: `Basic ${Deno.env.get("UPSTASH_KAFKA_REST_TOKEN")}`
        }
    }).then(response => response.json())
        .then(data => {
            console.log(data)
        });

    return new Response("OK");
}
