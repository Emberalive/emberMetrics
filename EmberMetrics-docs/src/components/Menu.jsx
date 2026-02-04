export default function Menu (props) {
    return (
            <header className="main-header">
                <div className="header-logo">
                    <img src={props.logoImage} alt="Logo" />
                    <h1 style={{width: '100%'}}>Ember Metrics - Docs</h1>
                </div>
                <div className={'navigation'}>
                    <p className={'navigation-item'} onClick={() => {
                        props.setActiveView('home');
                    }} >Home</p>
                    <p className={'navigation-item'} onClick={() => {
                        props.setActiveView('tester');
                    }}>Tester</p>
                    <p className={'navigation-item'} onClick={() => {
                        props.setActiveView('getting-started');
                    }}>Getting started</p>
                    <p className={'navigation-item'} onClick={() => {
                        props.setActiveView('features');
                    }}>Features</p>
                    <p className={'navigation-item'} onClick={() => {
                        props.setActiveView('features');
                    }}>Road Map</p>
                </div>
            </header>
    )
}