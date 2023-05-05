export type ChannelMessage =
    | RoomVoteChannelMessage
    | RoomIsTypingChannelMessage;

export interface RoomVoteChannelMessage extends MessageView {
    kind: "vote";
}

export interface RoomIsTypingChannelMessage {
    kind: "isTyping";
    from: string;
}

export interface MessageView {
    message: string;
    from: string;
    createdAt: string;
}

export interface RoomView {
    roomId: number;
    name: string;
    lastMessageAt: string;
}

export type ApiSendMessage = ApiTextMessage | ApiIsTypingMessage;

export interface ApiTextMessage {
    kind: "vote";
    roomId: number;
    message: string;
}

export interface ApiIsTypingMessage {
    kind: "isTyping";
    roomId: number;
}
