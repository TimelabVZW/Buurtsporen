import { useState } from "react";
import { Tiptap } from "../components";
import UserMenu from "../components/WYSIWYG/UserMenu";
import { Helmet } from "react-helmet";


const Test = () => {
    const [content, setContent] = useState('');
    return (
        <>
            <Helmet>
                <title>Buurtsporen - Login</title>
                <meta name='description' content='Test page to test components during development.'/>
                <meta name='robots' content='noindex'/>
                <link rel="canonical" href="/test" />
            </Helmet>
            <Tiptap MenuBar={<UserMenu/>} setInput={(e) => setContent(e)}/>
            <div dangerouslySetInnerHTML={{__html: content}}/>
        </>
    )
};

export default Test;