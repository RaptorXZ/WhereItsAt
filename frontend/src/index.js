import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Login from './Login';
import Verify from './Verify';
import Events from './Events';
import Buy from './Buy';
import Ticket from './Ticket';
import Tickets from './Tickets';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/staff/login" element={<Login />} />
      <Route path="/staff/verify" element={<Verify />} />
      <Route path="/events" element={<Events />} />
      <Route path="/buy" element={<Buy />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/tickets/:id" element={<Ticket />} />
    </Routes>
  </BrowserRouter>
);
