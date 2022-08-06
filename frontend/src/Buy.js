import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import BackBtn from './components/BackBtn.js';
import './Buy.css';

function Buy() {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect( () => {
        fetchEvent();
    }, []);

    async function fetchEvent() {
        let id = 1;
        if(location.state) {
            id = location.state.id;
        }
        const obj = {
            id: id
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
        setSelectedEvent(data);
    }

    async function buyTicket() {
        let eventId = 1;
        if(location.state) {
            eventId = location.state.id;
        }

        const obj = {
            eventId: eventId
        };

        const response = await fetch('http://localhost:3000/api/addticket', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const ticketId = data.ticket.id;

        navigate('/tickets');
    }

    function goBack() {
        navigate('/events');
    }

    return(
        <div className="Buy">
            <div onClick={() => goBack()}>
                <BackBtn />
            </div>
            <div>
                <p className="buyHeader">You are about to score some tickets to</p>
                <div className="flexStart">
                    <p className="buyWhat">{selectedEvent ? selectedEvent.event.what : 'Loading...'}</p>
                    <p className="buyWhen">{selectedEvent && 
                        selectedEvent.event.day + ' ' +
                        selectedEvent.event.month + ' at ' +
                        selectedEvent.event.from + ' - ' +
                        selectedEvent.event.to}
                    </p>
                    <p className="buyWhere">{selectedEvent &&
                        '@ ' + selectedEvent.event.where}
                    </p>
                </div>
            </div>
            <div className="flexEnd">
                <p className="buyPrice">{selectedEvent &&
                    selectedEvent.event.price + ' sek'}</p>
                <button onClick={() => buyTicket()} className="buyButton">Order</button>
            </div>
        </div>
    );
}

export default Buy;