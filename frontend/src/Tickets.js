import './Tickets.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackBtn from './components/BackBtn.js';

function Tickets() {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    useEffect( () => {
        getTickets();
    }, []);

    async function getTickets() {
        const response = await fetch('http://localhost:3000/api/alltickets',
        {
            method: 'GET',
            credentials: "include"
        });
        const data = await response.json();
        setTickets(data.tickets);
    }

    function selectTicket(ticketId, eventId) {
        navigate('/tickets/'+ticketId, {state:{id:ticketId, eventId:eventId}});
    }

    function goBack() {
        navigate('/events');
    }

    return (
        <div className="Tickets">
            <div onClick={() => goBack()}>
                <BackBtn />
            </div>
            <p className="ticketsHeader">Tickets</p>
            <ul className="ticketsContainer">
                {tickets.map(ticket => (
                    <li onClick={() => selectTicket(ticket.id, ticket.eventId)} id={ticket.id} key={ticket.id} className="ticketsItem">
                        <div className="ticketsDetails">
                            <p>Ticket number:</p>
                            <p>{ticket.ticketnr}</p>
                            <p>Verified: {ticket.verified ? "Yes" : "No"}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tickets;