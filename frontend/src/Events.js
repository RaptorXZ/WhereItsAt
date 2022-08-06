import './Events.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackBtn from './components/BackBtn.js';

function Events() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect( () => {
        getEvents();
    }, []);

    async function getEvents() {
        const response = await fetch('http://localhost:3000/api/allevents',
        {
            method: 'GET',
            credentials: "include"
        });
        const data = await response.json();

        setEvents(data.events);
    }

    function selectEvent(eventId) {
        navigate('/buy', {state:{id:eventId}});
    }

    function goBack() {
        navigate('/');
    }

    return (
        <div className="Events">
            <div onClick={() => goBack()}>
                <BackBtn />
            </div>
            <p className="eventsHeader">Events</p>
            <ul className="eventsContainer">
                {events.map(event => (
                    <li onClick={() => selectEvent(event.id)} id={event.id} key={event.id} className="eventItem">
                        <div className="dateContainer">
                            <p>{event.day}</p>
                            <p>{event.month.toUpperCase().substring(0, 3)}</p>
                        </div>
                        <div className="detailsContainer">
                            <p>{event.what}</p>
                            <p className="where">{event.where}</p>
                            <div className="bottomRow">
                                <p className="time">{event.from} - {event.to}</p>
                                <p className="price">{event.price} sek</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Events;