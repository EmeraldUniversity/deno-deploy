import {Button} from "../components/Button.tsx";
import type {MessageView} from "../communication/types.ts";
import {server} from "../communication/server.ts";
import {useState, useReducer, useEffect} from "preact/hooks";

const roomId = 0;


export default function Voting({user}: { user: string }) {
    const [typing, setTyping] = useState<
        { user: string; interval: number } | null
    >(null);
    const [messages, addMessage] = useReducer<MessageView[], MessageView>(
        (msgs, msg) => [msg, ...msgs],
        [],
    );

    useEffect(() => {
        Notification.requestPermission();

        const subscription = server.subscribeMessages(roomId, (msg) => {
            switch (msg.kind) {
                case "isTyping": {
                    if (typing) {
                        clearInterval(typing.interval);
                    }
                    const interval = setTimeout(() => {
                        setTyping(null);
                    }, 5000);
                    setTyping({
                        user: msg.from,
                        interval,
                    });
                    break;
                }
                case "vote":
                    addMessage(msg);
                    new Notification(`New message from ${msg.from}`, {
                        body: msg.message,
                    });
                    break;
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    const vote = (option: string) => {
        server.sendMessage(roomId, option);
    };

    const sendTyping = () => {
        server.sendIsTyping(roomId);
    }

    return (
        <div>
            <div class="flex gap-2 w-full">
                <p class="flex-grow-1 font-bold text-xl">Java: {messages.filter(m => m.message === "java").length}</p>
                <p class="flex-grow-1 font-bold text-xl">C# {messages.filter(m => m.message === "c#").length}</p>
                <Button onMouseDown={sendTyping} onClick={() => vote("java")}>Java</Button>
                <Button onMouseDown={sendTyping} onClick={() => vote("c#")}>C#</Button>
            </div>
            {
                typing && (
                    <div class="w-full text-xl text-gray-400">
                        <span class="text-gray-800">{typing.user}</span> is typing...
                    </div>
                )
            }
        </div>
    );
}
