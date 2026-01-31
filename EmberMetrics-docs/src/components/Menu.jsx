import Logo from '../assets/logo.svg';
export default function Menu (props) {
    return (
            <header className="header">
                <div className="header-logo">
                    <img src={Logo} alt="Logo" />
                    <h1>Ember Metrics - Docs</h1>
                </div>
                <div className={'navigation'}>
                    <p className={'navigation-item'} onClick={() => {
                        props.setActiveView('home');
                    }} >Home</p>
                    <p className={'navigation-item'} onClick={() => {
                        props.setActiveView('tester');
                    }}>Tester</p>
                    <p className={'navigation-item'}>Getting started</p>
                </div>
            </header>

    )
}