import {useEffect, useState} from "react";

export default function Login (props) {
    async function submit (e) {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword ? e.target.confirmPassword.value : null;
        console.info(username, password, confirmPassword);
        try {
            if (confirmPassword) {
                if (username && password) {
                    const response = await fetch(`http://${props.deviceType === 'remote-device' ? props.hostIp : 'localhost'}:3000/users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({user: {
                                username: username,
                                password: password,
                                confirmPassword: confirmPassword,
                                role: 'user'
                            }})
                    })
                    if (response.ok) {
                        props.setIsLoggedIn(prevState => !prevState)
                        props.handleNotification('notice', 'Successfully logged in as' + username)
                    } else {
                        if (response.status === 400) {
                            props.handleNotification('error', 'Please send all fields required')
                        } else {
                            console.error('server response was 500')
                            props.handleNotification('error', 'There was an issue with the server, sorry')
                        }
                    }
                } else {
                    props.handleNotification('error', 'Please send all fields required')
                }
            } else {
                if (username && password) {
                    const response = await fetch(`http://${props.deviceType === 'remote-device' ? props.hostIp : 'localhost'}:3000/users/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({user: {
                                username: username,
                                password: password,

                            }})
                    })
                    if (response.ok) {
                        const resData = await response.json()
                        if (resData) {
                            props.setIsLoggedIn(prevState => !prevState)
                            props.handleNotification('notice', 'Successfully logged in as: ' + username)
                        }

                    } else if (response.status === 400) {
                        props.handleNotification('error', 'please send all fields required')
                    } else {
                        console.error('server response was 500')
                        props.handleNotification('error', 'There was an issue with the server, sorry')
                    }
                } else {
                    props.handleNotification('error', 'Please send all fields required')
                }
            }
        } catch (e) {
            props.handleNotification('error', 'There was an issue with the server, sorry')
            console.error(e.message)
        }
    }

    const [isRegister, setIsRegister] = useState(false);

    useEffect(() => {
        console.info('Register', isRegister);
    }, [isRegister]);

    return (
        <div className="login-wrapper">
            <section className={'login'}>
                <header className="section-header">
                    <h1 style={{width: '100%',textAlign: 'center' }}>{isRegister ? 'Register' : 'Login'}</h1>
                </header>
                <form className="login-form" onSubmit={submit}>
                    <div className="input-container">
                        <label>User Name:</label>
                        <input type={'text'} name={'username'} placeholder={'user123'}/>
                    </div>
                    <div className="input-container">
                        <label>Password:</label>
                        <input type={'password'} name={'password'} placeholder={'password123'}/>
                    </div>
                    {isRegister && <div className="input-container">
                        <label>Confirm Password:</label>
                        <input type={'password'} name={'confirmPassword'} placeholder={'password123'}/>
                    </div>}
                    <button className={'general-button'} type={'submit'} >{isRegister ? 'Register' : 'Login'}</button>
                </form>
                <div className="form-links">
                    <div className={'link-container'}>
                        <p>{isRegister ? 'Have an account?' : 'Don\'t have an account?' }</p>
                        <p className={'link-container__link'}onClick={() => {
                            console.info('clicked');
                            setIsRegister(prevState => !prevState);
                        }}>{isRegister ? 'Login' : 'Register'}</p>
                    </div>
                </div>
            </section>
        </div>
    )
}