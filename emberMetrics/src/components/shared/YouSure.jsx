export default function YouSure({confirmFunction, cancelFunction, message, messageHighlight}) {
    return (
        <div style={{
            height: '100%',
            width: '100%',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            backdropFilter: 'blur(2px)',
            top: 0
        }}>
            <section style={{width: '600px'}}>
                <div style={{display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
                    <p style={{fontSize: 'var(--font-size)'}}>{message}</p>
                    <p style={{fontWeight: 700, color: 'var(--secondary)', fontSize: 'var(--font-size)'}}>{messageHighlight}</p>
                </div>
                <div style={{width: '100%', gap: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <button className={'general-button  danger-button'} onClick={(e) => {
                        e.preventDefault()
                        confirmFunction()
                        cancelFunction()
                    }}>Yes</button>
                    <button className={'general-button success-button'} onClick={() => {
                        cancelFunction()
                    }}>No</button>
                </div>
            </section>
        </div>
    )
}