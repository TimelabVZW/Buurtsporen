import { useState } from "react";
import { Tiptap } from "../components";
import UserMenu from "../components/WYSIWYG/UserMenu";


const Test = () => {
    const [content, setContent] = useState('');
    return (
        <>
            <Tiptap MenuBar={<UserMenu/>} setInput={(e) => setContent(e)}/>
            <div dangerouslySetInnerHTML={{__html: content}}/>
        </>
    )
};

export default Test;