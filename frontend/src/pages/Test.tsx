import React, { useState } from "react";
import { Tiptap } from "../components";

const Test = () => {
    const [content, setContent] = useState('');

    return (
        <>
            <Tiptap setInput={(e: string) => setContent(e)}/>
            <p>{content}</p>
        </>
    )
}

export default Test;