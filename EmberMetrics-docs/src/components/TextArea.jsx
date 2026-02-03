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
                {txt.title && <h2 className={'app-home__sub-header'}>{txt.title}</h2>}
                {txt.text && <p>{txt.text}</p>}
                {(codeList[i] && codeList[i].code) && (
                    <CodeInsert
                        code={codeList[i].code}
                        language={codeList[i].language}
                        isDarkMode={isDarkMode}
                    />
                )}
                {txt.img  &&
                    <div className={'text-area__image-container'}>
                        <img src={txt.img} alt={txt.text} />
                    </div>
                }
            </Fragment>
        ));

        return (
            <div className={'text-area__container white-space-pre'}>
                {textDisplay}
            </div>
        )
    }
}