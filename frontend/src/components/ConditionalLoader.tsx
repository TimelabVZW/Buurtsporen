import { ConditionalLoaderProps } from '../interfaces';

const ConditionalLoader = (props: ConditionalLoaderProps) => {
    if (props.condition) {
        return (
            <div className={props.className}>
                {props.children}
            </div>
        )
    } 
    return (
        <></>
    )
}

export default ConditionalLoader;