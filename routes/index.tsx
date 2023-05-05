import {Head} from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";
import Voting from "../islands/Voting.tsx";

export default function Home() {
    return (
        <>
            <Head>
                <title>Fresh App</title>
            </Head>
            <div class="p-4 mx-auto max-w-screen-sm">
                <img
                    src="/emerald.png"
                    class="w-32 h-32"
                    alt="the fresh logo: a sliced lemon dripping with juice"
                />

                <p class="my-6">
                    Welcome to Emerald University. Vote for your favorite programming language (you can vote many times).
                </p>
                <Voting/>
            </div>
        </>
    );
}
