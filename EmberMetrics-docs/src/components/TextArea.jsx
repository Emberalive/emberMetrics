import CodeInsert from "./CodeInsert.jsx";
import { Fragment } from 'react';


export default function TextArea(props) {
    const text = props.text
    const data = props.data
    const isDarkMode = props.isDarkMode
    if (!data) {
        return (
            <div className={'text-area__container white-space-pre'}>
                <p>{text}</p>
                <CodeInsert code={props.code} isDarkMode={isDarkMode} language={props.language}/>
            </div>
        )
    } else {
        const codeList = data.code
        const textList = data.text

        const textDisplay = textList.map((txt, i) => (
            <Fragment key={i}>
                <p>{txt}</p>
                {codeList[i] && (
                    <CodeInsert
                        code={codeList[i].code}
                        language={codeList[i].language}
                        isDarkMode={isDarkMode}
                    />
                )}
            </Fragment>
        ));

        return (
            <div className={'text-area__container white-space-pre'}>
                {textDisplay}
            </div>
        )
    }
}