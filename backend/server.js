import express, { application } from 'express';
import cookieParser from 'cookie-parser';
import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import { nanoid, customAlphabet } from 'nanoid';
const customnano = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'database.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();

import bcrypt from 'bcrypt';

db.data ||= { accounts: [] };

const app = express();
app.use(express.json());
app.use(cookieParser());
//app.use(express.static('../frontend/build'));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization, credentials");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Credentials", "true")
    next();
});

app.post('/api/staff/login', async (request, response) => {
    const credentials = request.body;
    const user = db.data.accounts.find(user => user.username === credentials.username);
    let result = { success: false, token: '' };

    if(user && (await bcrypt.compare(credentials.password, user.password))) {
        const cookieId = nanoid();
        response.cookie('loggedIn', cookieId);
        const userName = user.username;
        
        let accounts = db.data.accounts;
        accounts.map((account) => {
            if(account.username === credentials.username) {
                account.tempId = cookieId;
            }
        });
        
        result.success = true;
    }

    response.json(result);
});

app.get('/api/staff/loggedin', (request, response) => {
    let result = { loggedIn: false };
    const loggedInId = request.cookies.loggedIn;
    const isLoggedIn = db.data.accounts.find(user => user.tempId === loggedInId);

    if(isLoggedIn && loggedInId != null) {
        result.loggedIn = true;
    }

    response.json(result);
});

app.get('/api/allevents', (request, response) => {
    let result = { events: [] }

    result.events = db.data.events;

    response.json(result);
});

app.get('/api/alltickets', (request, response) => {
    let result = { tickets: [] }

    result.tickets = db.data.tickets;

    response.json(result);
});

app.post('/api/findevent', async (request, response) => {
    let result = { event: null }
    const data = request.body;
    result.event = await db.data.events.find(event => event.id === data.id);

    response.json(result);
});

app.post('/api/findticket', async (request, response) => {
    let result = { ticket: null }
    const data = request.body;
    result.ticket = await db.data.tickets.find(ticket => ticket.id === data.id);

    response.json(result);
});

app.post('/api/staff/verify', (request, response) => {
    const newticket = request.body;
    const ticket = db.data.tickets.find(ticket => ticket.ticketnr === newticket.ticketnr);

    let result = { success: "notfound" };
    
    if(ticket) {
        // Make sure the ticket has not already been verified
        if(!ticket.verified) {
            let tickets = db.data.tickets;
            tickets.map((ticket) => {
                if(ticket.ticketnr === newticket.ticketnr) {
                    ticket.verified = true;
                }
            });
            result.success = "success";
        } else {
            result.success = "duplicate";
        }
    }

    response.json(result);
});

app.post('/api/addticket', (request, response) => {
    const data = request.body;
    const obj = db.data.tickets;
    
    const newTicket = {
        "id": obj.length + 1,
        "ticketnr": "F" + customnano(),
        "verified": false,
        "eventId": data.eventId
    }
    
    //Add new ticket to database
    db.data.tickets.push(newTicket);

    let result = { ticket: newTicket, success: true };
    response.json(result);
});

app.listen(3000, () => {
    console.log('Server started');
});