import {useEffect, useState} from "react";

export default function Login () {
    const [isRegister, setIsRegister] = useState(false);

    useEffect(() => {
        console.info('Register', isRegister);
    }, [isRegister]);

    return (
        <div className="login-wrapper">
            <section style={{width:'75%'}}>
                <header className="section-header">
                    <h1 style={{width: '100%',textAlign: 'center' }}>{isRegister ? 'Register' : 'Login'}</h1>
                </header>
                <form style={{display: 'flex',flexDirection: 'column', width:'100%', gap: '20px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        <label style={{width: '80%'}} >User Name:</label>
                        <input style={{width: '80%', outline: 'none',border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '5px', fontSize: '20px', backgroundColor: 'var(--neutral)' }} type={'text'} placeholder={'user123'}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        <lable style={{width: '80%'}} >Password:</lable>
                        <input style={{width: '80%', outline: 'none',border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '5px', fontSize: '20px', backgroundColor: 'var(--neutral)' }} type={'text'} placeholder={'password123'}/>
                    </div>
                    {isRegister && <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <lable style={{width: '80%'}}>Confirm Password:</lable>
                        <input style={{
                            width: '80%',
                            outline: 'none',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius)',
                            padding: '5px',
                            fontSize: '20px',
                            backgroundColor: 'var(--neutral)'
                        }} type={'text'} placeholder={'password123'}/>
                    </div>}
                </form>
                <div className="form-links">
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '8px', width: '100%', alignItems: 'center'}}>
                        <p>{isRegister ? 'Have an account?' : 'Don\'t have an account?' }</p>
                        <p style={{fontWeight: '700', color: 'var(--secondary)', borderBottom: 'solid 2px var(--secondary)', cursor: 'pointer'}}  onClick={() => {
                            console.info('clicked');
                            setIsRegister(prevState => !prevState);
                        }}>{isRegister ? 'Login' : 'Register'}</p>
                    </div>
                </div>
            </section>
        </div>
    )
}