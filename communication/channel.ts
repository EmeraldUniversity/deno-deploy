import type {
    ChannelMessage,
    RoomIsTypingChannelMessage,
    RoomVoteChannelMessage
} from "./types.ts";

export class RoomChannel {
    #channel: BroadcastChannel;

    constructor(roomId: number) {
        this.#channel = new BroadcastChannel(roomId.toString());
    }

    onMessage(handler: (message: ChannelMessage) => void) {
        const listener = (e: MessageEvent) => {
            handler(e.data);
        };
        this.#channel.addEventListener("message", listener);
        return {
            unsubscribe: () => {
                this.#channel.removeEventListener("message", listener);
            },
        };
    }

    close() {
        this.#channel.close();
    }

    sendText(message: Omit<RoomVoteChannelMessage, "kind">) {
        this.#channel.postMessage({
            kind: "vote",
            ...message,
        });
    }

    sendIsTyping(user: string) {
        const message: RoomIsTypingChannelMessage = {
            kind: "isTyping",
            from: user,
        };
        this.#channel.postMessage(message);
    }
}
