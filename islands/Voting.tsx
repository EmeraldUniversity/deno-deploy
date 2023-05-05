import {Button} from "../components/Button.tsx";
import type {MessageView} from "../communication/types.ts";
import {server} from "../communication/server.ts";
import {useState, useReducer, useEffect} from "preact/hooks";
import getBrowserFingerprint from "https://cdn.jsdelivr.net/npm/get-browser-fingerprint@3.0.0/src/index.min.js";

const roomId = 0;


export default function Voting() {
    const [typing, setTyping] = useState<
        { user: string; interval: number } | null
    >(null);
    const [messages, addMessage] = useReducer<MessageView[], MessageView>(
        (msgs, msg) => [msg, ...msgs],
        [],
    );
    const [user , setUser] = useState('')

    useEffect(() => {
        const subscription = server.subscribeMessages(roomId, (msg) => {
            switch (msg.kind) {
                case "isTyping": {
                    if (typing) {
                        clearInterval(typing.interval);
                    }
                    const interval = setTimeout(() => {
                        setTyping(null);
                    }, 1500);
                    setTyping({
                        user: msg.user,
                        interval,
                    });
                    break;
                }
                case "vote":
                    addMessage(msg);
                    break;
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    useEffect(() => {
        setUser(getBrowserFingerprint().toString())
    }, [])

    const vote = (option: string) => {
        server.sendMessage(roomId, user, option);
    };

    const sendTyping = () => {
        server.sendIsTyping(roomId, user);
    }

    return (
        <div>
            <div class="flex gap-2 w-full">
                <p class="flex-grow-1 font-bold text-xl">Java: {messages.filter(m => m.vote === "java").length}</p>
                <p class="flex-grow-1 font-bold text-xl">.NET: {messages.filter(m => m.vote === ".net").length}</p>
                <Button onMouseDown={sendTyping} onClick={() => vote("java")}>Java</Button>
                <Button onMouseDown={sendTyping} onClick={() => vote(".net")}>.NET</Button>
            </div>
            {
                typing && (
                    <div class="w-full text-xl text-gray-400">
                        <span class="text-gray-800">{typing.user}</span> is voting...
                    </div>
                )
            }
        </div>
    );
}
