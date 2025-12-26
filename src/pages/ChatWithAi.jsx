import React from 'react'
import { Client } from "@gradio/client";

const client = await Client.connect("MariusSitoye/abalma");
const result = await client.predict("/chat_mvp", {
	conversation: "Hello!!",

});

console.log(result.data);

const ChatWithAi = () => {

    return (

        <>

        </>
    )
}

export default ChatWithAi;