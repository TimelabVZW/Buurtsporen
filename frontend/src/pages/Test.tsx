import React, { useState } from "react";
import { Tiptap } from "../components";
import ImportMenu from "../components/WYSIWYG/ImportMenu";

const Test = () => {
    const [test, setTest] = useState('');
    return (
        <>
            <Tiptap MenuBar={<ImportMenu/>} setInput={(e:string) => setTest(e)}/>
            <div className="specialtest" dangerouslySetInnerHTML={{ __html: test }} />
        </>
    )
}

export default Test;