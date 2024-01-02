const init = require('./src/core');
const fs = require('fs');
const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const { spawn } = require('child_process')

arr = new Array();

dotenv.config({
    debug:true,
})


const request = require('request');


const intervals = async (intervals) => {
    let up = []
    let lower = []
    console.log('Intervals: ',intervals)

    let counterUp = 0;
    let counterDown = 0;

    let resultLog = []
    let closeLog = []

    for (let i of intervals){

        i = i.map((num) => Math.round(num), 0)

        

        for (let idx = i.sort()[0]; idx <= i.sort()[1]; idx += 1){
            
            let sortedArr = i.sort()
            closeLog.push(sortedArr[1])

            let result = init(idx)
            resultLog.push(result)
        
            if (result.up > result.down) {
                counterUp ++

        
            } else {
                counterDown ++

            }

            up.push(result.up);
            lower.push(result.down)
        }   
    }

    
    
    console.log('Up: ', up);
    console.log('Down: ', lower);

    sleep(300);


    let i = 0
    let index = closeLog.map((n) => {
        i++
        return i-1
    })

    let indexStr = closeLog.map((n) => 'a')

    indexStr = indexStr.join('')

    console.log(index);
    const sumUp =  up.reduce((accumulator, current) => accumulator + current, 0);
    const sumDown = lower.reduce((accumulator, current) => accumulator + current, 0);
    
    console.log(sumDown);
    console.log(sumUp);
    
    if (sumUp > sumDown) {
        return {code: true, closeLog: closeLog[index.slice(-1)]}
    }
    
    else if (sumUp === sumDown) {
        return NaN
    }
    
    else {
        return {code: false, closeLog: closeLog[index.slice(-1)]}
    }
}

const symbol = "EURUSDT";
const interval = "1m";



app = express();

app.get(`/:symbol/:interval`, async (req, res) => {

    try {

        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/BTCUSDT/1m')

        const {symbol, interval} = req.params
        const resp = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`)
        const data = await resp.json()

        const klinedata = data.map((d) => ({
            time: d[0]/1000,
            open: d[1]*1,
            high : d[2]*1,
            low: d[3]*1,
            close: d[4]*1 
        }))

        res.status(200).send(klinedata);
    }

    catch (err) {
        res.status(500).send(err)
    }
})

app.post(`/:symbol/:interval`, async (req, res) => {
    try {
        location.reload()
    }

    catch (err) {
        console.log(err);
    }

})

const port = 5000
app.listen(port, 'localhost', (err) => {

    if (err) {
        console.log(`An error ocurred ${err}`)
    } else {
        console.log('listening at port 5000')
    }
    
    
});

async function getData(n, symbol, interval, port, delta) {

    try {

        list = []

        const resp = await fetch(`http://localhost:${port}/BTCUSDT/1m`)

        const kline = await resp.json()

        for (let i = delta; i < n+delta; i++) {
            list.push(kline[i])
        }

        console.log(list)

        return list
    

    }

    catch (error) {
        console.log(error)
    }

    
}

async function getResult(vari, range, original) {
    const port = 3000;
    const symbol = "BTCUSDT";
    const interval = "1m";
  
    const resp = await fetch(`http://localhost:5000/BTCUSDT/1m`);
    const kline = await resp.json();
  
    vari += range;
  
    console.log('kline vari: ', kline[vari]);
  
    return {final: kline[vari].close, original: original}; // Return the fetched data
  }

const range = 3;

let wincounter = 0;
let losscounter = 0;

async function main(variation){
        
        
    let win = false;
    
    getData(range, 'BTCUSDT', '1m', 5000, variation)
        .then((data) => {
            const mapped = data.map((n) => [n.low, n.high]);
            const result = intervals(mapped);
    
            console.log('Mapped: ', mapped);
            console.log(result);
    
            return getResult(variation + range, 14, original = result); // Await the getResult function
        })
    
        
        .then(async (data) => {

            original = await data.original

            console.log('Final: ', data.final);
            console.log('INItial: ', original.closeLog)

            await sleep(3);

            if(data.final > original.closeLog){
                if (original.code){
                    console.log('Lose1... ;-;');
                    
                }
                else{
                    console.log('Win1!!! :D');
                    win = true
                }
            }
    
            if (data.final < original.closeLog){
                if (!original.code){
                    console.log('Lose2... ;-;');
                }
                else{
                    console.log('WIN2!!! :DDD');
                    win = true
                }
            }

            return win
            
        })
        .catch((error) => {
            console.log(error);
        }); 
}

function restartApplication() {
    const node = process.argv[0];
    const app = process.argv[1];
  
    const args = process.argv.slice(2);
  
    // Spawn a new process with the same command and arguments
    const child = spawn(node, [app, ...args], {
      detached: true,
      stdio: 'inherit',
    });
  
    // Exit the current process
    process.exit();
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay*1000))

async function run (){

    
    let obj = {}

    fs.readFile(path.join('data', 'test.txt'), async (err, data) => {
        if(err){
            console.log(err);
        }
        let obj = JSON.parse(data);

        console.log('Final')

        console.log("Data: ", obj.win, obj.loss, obj.times)

        await sleep(6)

        let win = main(obj.times);

        if (win) {
            console.log('WIN!!!! :DDDD')
            obj.win ++
        }

        else{
            console.log('loss... ;-;')
            obj.loss ++
        }    

        obj.times ++
        

        console.log('Wins: ', obj.win);
        console.log('Loses: ', obj.loss)

        final = JSON.stringify({
            times : obj.times,
            win: obj.win,
            loss : obj.loss
        })

        fs.writeFile(path.join('data', 'test.txt'), final, (err) => {
            if(err){
                console.log(err);
            }
        })

        await sleep(60);

        restartApplication();
    })
}


run();
