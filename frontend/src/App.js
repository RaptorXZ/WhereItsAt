import Logo from './components/Logo.js';
import './App.css';
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();

    function goTo(path) {
        navigate(path);
    }

    return(
        <div className="App">
            <Logo />
            <div className="appLinkContainer">
                <p onClick={() => goTo('/events')} className="appLink">To Events</p>
                <p onClick={() => goTo('/staff/login')} className="appLink">To Staff</p>
            </div>
        </div>
    );
}

export default App;