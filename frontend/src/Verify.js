import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackBtn from './components/BackBtn.js';
import Logo from './components/Logo.js';

function Verify() {
    const navigate = useNavigate();
    const [ticketnr, setTicketnr] = useState(0);
    const [access, setAccess] = useState(false);
    const [verifyStatus, setVerifyStatus] = useState("");

    useEffect( () => {
        isLoggedIn();
    }, []);

    async function isLoggedIn() {
        const response = await fetch('http://localhost:3000/api/staff/loggedin',
        {
            method: 'GET',
            credentials: "include"
        });
        const data = await response.json();

        if(data.loggedIn) {
            setAccess(true);
        }
    }

    const VerifyTicket = async (e) => {
        e.preventDefault();
        const obj = {
            ticketnr: ticketnr,
            verified: true
        }
        
        const response = await fetch('http://localhost:3000/api/staff/verify', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const verified = await response.json();
        
        if(verified.success === 'success') {
            setVerifyStatus("Verification successful!");
        }
        if(verified.success === 'notfound') {
            setVerifyStatus("Verification failed, not a valid ticket number");
        }
        if(verified.success === 'duplicate') {
            setVerifyStatus("Verification failed, ticket has already been verified");
        }
    }

    function goBack() {
        if(access) {
            navigate('/tickets');
        } else {
            navigate('/staff/login');
        }
    }

    function logOut() {
        document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        navigate('/staff/login');
    }

    return (
        <div className="Login">
            <div onClick={() => goBack()}>
                <BackBtn />
            </div>
            {access &&
            <div onClick={() => logOut()}>
                <p className="logoutBtn">Log out</p>
            </div>}
            <Logo />
            {access ?
            <form className="loginForm">
                <input 
                type="text"
                placeholder="Ticket number"
                onChange={(e) => setTicketnr(e.target.value)}
                id="ticketnr"
                />
                <p className="errorMsg">{ verifyStatus }</p>
                <button className="marginBottom" id="verify" onClick={(e) => VerifyTicket(e)}>Verify ticket</button>
            </form>
            : 
            <div className="loginForm">
                <p>You need to be logged in to access this page.</p>
                <p 
                    onClick={() => window.location.href = '/' }>
                    Click here to go back.
                </p>
            </div>}
        </div>
    );
}

export default Verify;