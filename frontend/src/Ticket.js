import './Ticket.css'
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import BackBtn from './components/BackBtn.js';

function Ticket() {
    const location = useLocation();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [relatedEvent, setRelatedEvent] = useState(null);

    useEffect( () => {
        fetchTicket();
    }, []);

    async function fetchTicket() {
        let id = 1;
        if(location.state) {
            id = location.state.id;
        } else {
            id = parseInt(location.pathname.substring(9), 10);
        }
        const obj = {
            id: id
        };
        
        const response = await fetch('http://localhost:3000/api/findticket', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(data.ticket) {
            setTicket(data.ticket);
            fetchEvent(data.ticket.eventId);
        }
    }

    async function fetchEvent(eventId) {
        const obj = {
            id: eventId
        };
        
        const response = await fetch('http://localhost:3000/api/findevent', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(data.event) {
            setRelatedEvent(data.event);
        }
    }

    function goBack() {
        navigate('/tickets');
    }

    function toVerification() {
        navigate('/staff/login');
    }

    return (
        <div className="Ticket">
            <div onClick={() => goBack()}>
                <BackBtn />
            </div>
            { ticket !== (undefined || null) ? (<div>
                <div className="ticketContainer">
                    <div className="ticketColumn">
                        <p className="smallHeader">WHAT</p>
                        <p className="ticketWhat">{relatedEvent && 
                            relatedEvent.what}</p>
                    </div>
                    <div className="ticketColumn ticketGrey1">
                        <p className="smallHeader">WHERE</p>
                        <p className="ticketWhere">{relatedEvent && 
                            relatedEvent.where}</p>
                    </div>
                    <div className="ticketRow ticketGrey2">
                        <div className="ticketColumn">
                            <p className="smallHeader">WHEN</p>
                            <p className="ticketDetail">{relatedEvent && 
                                relatedEvent.day + ' ' +
                                relatedEvent.month.substring(0, 3)}</p>
                        </div>
                        <div className="ticketColumn borderSides">
                            <p className="smallHeader">FROM</p>
                            <p className="ticketDetail">{relatedEvent && 
                                relatedEvent.from}</p>
                        </div>
                        <div className="ticketColumn">
                            <p className="smallHeader">TO</p>
                            <p className="ticketDetail">{relatedEvent && 
                                relatedEvent.to}</p>
                        </div>
                    </div>
                    <div onClick={() => toVerification()} className="ticketColumn ticketGrey3">
                        <img 
                            className="ticketBarcode"
                            src="/barcode.png"
                            width="164"
                            height="60"
                            alt="Ticket Barcode"
                        >
                        </img>
                        <p className="ticketNumber">{ticket !== (undefined || null) && 'Ticket number: ' + ticket.ticketnr}</p>
                    </div>
                </div>
            </div>)
            :
            <p className="ticketInvalidUrl">Oops! There doesn't seem to be anything here...</p>}
        </div>
    );
}

export default Ticket;