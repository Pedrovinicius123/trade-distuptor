const fs = require('fs')


const info = JSON.stringify({
    win: 0,
    loss:0,
    times:50,
})

fs.writeFile('data/test.txt', info, {encoding:'utf-8'}, (err) =>{
    if (err){
        console.log(err);
    }
})
