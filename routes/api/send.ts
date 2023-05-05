import { HandlerContext } from "$fresh/server.ts";
import { RoomChannel } from "../../communication/channel.ts";
import { ApiSendMessage } from "../../communication/types.ts";

export async function handler(
    req: Request,
    _ctx: HandlerContext,
): Promise<Response> {
    const data = (await req.json()) as ApiSendMessage;
    const channel = new RoomChannel(data.roomId);
    const from = "Faustino Neri";

    if (data.kind === "isTyping") {
        // Send `is typing...` indicator.
        channel.sendIsTyping(from);
        channel.close();
        return new Response("OK");
    }

    const message = data.message,
        now = new Date();

    channel.sendText({
        message: message,
        from,
        createdAt: now.toISOString(),
    });
    channel.close();

    return new Response("OK");
}
