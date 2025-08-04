import dotenv from 'dotenv';
dotenv.config();
import readline from 'readline';
import express from "express";
import chalk from 'chalk';
const app = express();
import { Server as server } from 'http'
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { join, dirname } from "path";
import axios from 'axios';

const _server = new server(app);
const io = new Server(_server);
const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
const _views = join(_dirname, '/');

app.use(express.static(_views));
app.set('view engine', 'html');
app.set('/', _views);
const headers = {'Content-Type': 'application/json'};

const port = process.argv[2] || process.env.PORT;

if (port < 49152 || port >  65536) {
    console.error("Please enter dynamic or private ports");
    process.exit(1);
}

app.get('/', (req, res) => res.render('index'));
_server.listen(port, () => {});

// socket store
let socketArray = [];

const  generateUniqueAuctionID = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let ans = '';
    for (let i = 0; i < 10; i++) {
        ans += characters[(Math.floor(Math.random() * characters.length))];
    }
    return ans;
}

const specifiedDateFuc = (dateTimeString) => {
    const parts = dateTimeString.split(' ');
    const isoString = parts.join('T');
    return new Date(isoString);
}

// call API every minute for Auctions
const auto_start_end_Auctions = async () => {
    const response = await axios.get(process.env.url + "?endpoint=getAuction", { headers: headers });

    const arr = response.data;
    for (let index = 0; index < arr.length; index++) {
      
        const currentDate = new Date();
        let specifiedDate = specifiedDateFuc(arr[index].start_date);
        if (currentDate > specifiedDate && arr[index].state === 'Waiting') {
            const data = {'auctionid': arr[index].auctionid, 'state' : 'Ongoing', 'endpoint' : 'updateAuction'};
            await axios.post(process.env.url, data, { headers: headers });
        }


        specifiedDate = specifiedDateFuc(arr[index].end_date);
        if (currentDate > specifiedDate && arr[index].state !== 'Done)') {
            const res = await axios.get(process.env.url + "?endpoint=getAllBidder", { headers: headers });
            const allBidderArr = res.data;
            const data = {'auctionid': arr[index].auctionid, 'state' : 'Done', 'endpoint' : 'updateAuction'};

            const auctionidBidder = allBidderArr.filter((_bidder) => _bidder.Auctionid !== arr[index].auctionid);
            
            if (auctionidBidder.length > 0) {
                const high = auctionidBidder.reduce((maxItem, currentItem) => {
                    return currentItem.Price > maxItem.Price ? currentItem : maxItem;
                }, auctionidBidder[0]);
                data = {...data, 'buyer': high.userid};

                const resAll = await axios.get(process.env.url + "?endpoint=getAllUsers", { headers: headers });
                let username = '';
                for (let k = 0; k < resAll.data.length; k++) {
                    if (resAll.data[k].id ===  high.userid) {
                        username = resAll.data[k].Name;
                    }
                }

                for (let k = 0; k < socketArray.length; k++) {
                    if (socketArray[k].auctionid === data.auctionid) {
                        socketArray[k].socket.emit('highestBidder',{username});
                    }
                }
            }
            await axios.post(process.env.url, data, { headers: headers });
            
        }
    }
}

setInterval(auto_start_end_Auctions,60000);

const auctionCommand = async() => {
    const auction = await axios.get(process.env.url + "?endpoint=getAuction", { headers: headers });
    const buyer = await axios.get(process.env.url + "?endpoint=getAllUsers", { headers: headers });
    const _bidder = await axios.get(process.env.url + "?endpoint=getAllBidder", { headers: headers });
    const arrA = auction.data;
    const arrBuyer = buyer.data;
    const _bidderArr = _bidder.data;
    for (let index = 0; index < arrA.length; index++) {
        console.log(chalk.green('AuctionID:') + arrA[index].auctionid + ' ' + chalk.green('AuctionName:') + arrA[index].name);
        let buyerAll = '';
        for (let i = 0; i < _bidderArr.length; i++) {
            if (_bidderArr[i].Auctionid === arrA[index].auctionid) {
                for (let k = 0; k < arrBuyer.length; k++) {
                    if (arrBuyer[k].id === _bidderArr[i].userid) {
                        if (buyerAll === '') {
                            buyerAll = arrBuyer[k].Name
                        } else buyerAll += "," +  arrBuyer[k].Name;
                    }
                }
            }
        }
        console.log(chalk.green('Bidder:') + buyerAll);
    }
    Command();
}

// socket connection
io.on('connection', socket => {
    socketArray = [...socketArray, { socket }];
    // socket disconnect
    socket.on('disconnect', () => socketArray = socketArray.filter( _socket => _socket.socket.id !== socket.id));
    // login
    socket.on('login', async (data) => {
        data = {...data, endpoint: 'login'};
        try {
            const response = await axios.post(process.env.url, data, { headers: headers });
            const output = response.data.data;

            if (typeof output !== 'undefined') {
                socketArray = socketArray.map((_socket) => {
                    if (_socket.socket == socket) {
                        return { ..._socket , username : output.username}
                    } else {
                        return _socket;
                    }
                });
            }
            socket.emit('login', output);
            // 
        } catch (error) {}
    });
    // create auction
    socket.on('create', async (data) => {
        const auctionid = generateUniqueAuctionID();
        data = {...data, endpoint: 'createAuction', auctionid};
        try {
            const response = await axios.post(process.env.url, data, { headers: headers });
            const output = response.data.data;
            if (typeof output !== 'undefined'){
                socketArray = socketArray.map((_socket) => {
                    if (_socket.socket == socket) {
                        return { ..._socket , 'username' : output.username, 'auctionid' : auctionid};
                    } else {
                        return _socket;
                    }
                });
            }
            const usernameID = {'username': data.username, 'id' : data.id};
            socket.emit('create',usernameID);
        } catch (error) {}
    });
    // join auction
    socket.on('join', async (data) => {
        data = {...data, endpoint: 'joinAuction'};
        try {
            const response = await axios.post(process.env.url, data, { headers: headers });
            const output = response.data.data;
            if (typeof output !== 'undefined') {
                socketArray = socketArray.map((_socket) => {
                    if (_socket.socket == socket) {
                        return { ..._socket , 'auctionid' : data.Auctionid};
                    } else {
                        return _socket;
                    }
                });
                socket.emit('movebid', {userid:data.userid, Auctionid: data.Auctionid});
            }
            // 
        } catch (error) {}
    });
    // update auction
    socket.on('update', async (data) => {
        data = {...data, endpoint: 'updateAuction'};
        try {
            const response = await axios.post(process.env.url, data, { headers: headers });
            const output = response.data.data;
            if (typeof output !== 'undefined') {
                let username = '';
                const res = await axios.get(process.env.url + "?endpoint=getAllUsers", { headers: headers });
                for (let index = 0; index < res.data.length; index++) {
                    if (res.data[index].id === data.userid) {
                        username = res.data[index].Name;
                        break;
                    }
                }

                for (let index = 0; index < socketArray.length; index++) {
                    if (socketArray[index].socket === socket && socketArray[index].auctionid === data.Auctionid) {
                        socketArray[index].socket.emit('bid',{Price: data.Price, username});
                    }
                }
            }
            // 
        } catch (error) {}
    });
    // get auction
    socket.on('get', async (data) => {
        try {
            const response = await axios.get(process.env.url + "?endpoint=getAuction", { headers: headers });
            let arrayAuction = [];
            const arr = response.data;
            for (let index = 0; index < arr.length; index++) {
                const dateTimeString = arr[index].start_date;
                const parts = dateTimeString.split(' ');
                const isoString = parts.join('T');
                const currentDate = new Date();
                const specifiedDate = new Date(isoString);
                if (currentDate > specifiedDate) {
                    arrayAuction = [...arrayAuction, arr[index]];
                }
            }
            io.emit("get", {'arrayAuction': arrayAuction, 'userData': data});
        } catch (error) {}
    });

    socket.on('bid', async data => {
        data = {...data, endpoint: 'joinAuctionUpdate'};
        try {
            const response = await axios.post(process.env.url, data, { headers: headers });
            const output = response.data.data;
            
            if (typeof output !== 'undefined'){
                let username = '';
                const res = await axios.get(process.env.url + "?endpoint=getAllUsers", { headers: headers });
                
                for (let index = 0; index < res.data.length; index++) {
                    if (res.data[index].id === data.userid) {
                        username = res.data[index].Name;
                        break;
                    }
                }
                
                for (let index = 0; index < socketArray.length; index++) {
                    if (socketArray[index].auctionid === data.Auctionid) {
                        socketArray[index].socket.emit('biddings',{Price: data.Price, username});
                    }
                }
            }

        } catch (error) {}
    });
});

const remove = () => {
    const userInput = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    userInput.question('Enter username: ', (input) => {
        userInput.close();
        input = input.trim();
        const socket = socketArray.find(_socket => _socket.hasOwnProperty('username') && _socket.username === input);
        if (socket) {
            socket.socket.disconnect(true);
        }
        Command();
    });
    
}

const Command = () => {
    console.log("Command:");
    console.log(chalk.blue("A")+": LIST");
    console.log(chalk.red("B")+": KILL")
    console.log(chalk.green("C")+": QUIT");
    console.log(chalk.yellow("D")+": AUCTIONS");

    const userInput = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    userInput.question('Select Command (A-D): ', (input) => {
        userInput.close();
        switch(input.trim()) {
            case 'A':
                console.log(chalk.blue("You Selected LIST:"));
                for (let index = 0; index < socketArray.length; index++) {
                    if (socketArray[index].hasOwnProperty('username')) {
                        console.log(chalk.green("Socket ID")+ ": " + socketArray[index].socket.id + " " + chalk.green("Username") + ": " + socketArray[index].username);
                    } else console.log(chalk.green("Socket ID")+ ": " + socketArray[index].socket.id + " " + chalk.green("guest user"));
                }
                Command();
                break;
            case 'B':
                console.log(chalk.red("You Selected KILL"));
                remove()
                break;
            case 'C':
                console.log(chalk.green("You Selected QUIT"));
                // Broadcast to all connections notifying that the server will now go off-line
                io.emit('broadcast', 'Server will now go off-line');

                while (socketArray.length > 0) {
                    socketArray[0].socket.disconnect(true);
                }
                _server.close();
                process.exit(1);
                break;
            case 'D':
                console.log(chalk.yellow("You Selected AUCTIONS"));
                auctionCommand();
                break;
            default:
                Command();
                break;
        }
    });
}
Command();