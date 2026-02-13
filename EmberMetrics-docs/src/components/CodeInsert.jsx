import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeInsert({code, language, isDarkMode}) {
    return (
        <div className="code-insert__container">
            <SyntaxHighlighter language={language} style = {isDarkMode ? oneDark : undefined} showLineNumbers={true}>
                {code}
            </SyntaxHighlighter>
        </div>
    )
}