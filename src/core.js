const _ = require('lodash');

console.log('Application running');

const array = new Int32Array();

const returnMax = (num) => {
    const byteSize = str => new Blob([str]).size;
    const binaryString = (num).toString(2);
    const length = byteSize(binaryString);
    let adding = 0;
    for (let i = 0; i <= length - 1; i++) {
        adding += Math.pow(2, i);
    }
    return adding;
}

const returnMin = (num) => {
    const byteSize = str => new Blob([str]).size;
    const binaryString = (num).toString(2);
    const length = byteSize(binaryString);
    let adding = 0;
    for (let i = 0; i <= length - 2; i++) {
        adding = adding + Math.pow(2, i);
    }
    return adding;
}

const betNumber = (num) => {
    let min = returnMin(num);
    let max = returnMax(num);
    let change = 0;

    const isGreater = (num, initial) => {
        if (num < initial) {
            return true
        } else {
            return false
        }
    }

    const isSmaller = (num, initial) => {
        if (num > initial) {
            return true;
        } else {
            return false;
        }
    }

    const mean = (min + max) / 2;
    let initial = mean;
    let percentage = 1 / 4;
    let counter = 0;

    let processes = 0;
    let procsUp = 0;
    let procsDown = 0;

    while (true) {

        processes ++

        console.log(Math.round(initial));

        if (Math.round(initial) == num) {
            break;
        }

        let condG = isGreater(num, initial);

        let previousObj = {
            initial: initial,
            cond: condG,
        }
        let delta = percentage / Math.pow(2, counter + 1);
        process.stdout.write(`Percentage: ${percentage * 100}%, Delta: ${delta * 100}%\n`);

        if (min < previousObj.initial < initial && isSmaller(num, initial)) {
            min = initial;
            console.log('new min',  min)
        } 

        else if ((initial < previousObj < max) && isGreater(num, initial)){
            max = initial;
            console.log('new max', max)
        }


        if (condG) {
            
            procsDown ++

            if (processes === 0){ 
                max = previousObj.initial;
            }

            console.log(max, min)
            initial -= initial * percentage;
            percentage += delta;


            if (Math.round(initial) < min) {
                console.log("Epa!");
                initial = previousObj.initial;

                percentage /= 2;

                initial -= initial*percentage;  
                
                continue

            }

            if (initial < max && isGreater(num, initial)) {
                max = initial;
                console.log("new max", max)
            }

            console.log(min, max)

        } else {

            procsUp ++

            if (processes === 0){
                min = previousObj.initial;
            
            }

            initial += initial * percentage;
            percentage += delta;

            if (initial > max) {

                initial = previousObj.initial;
                percentage /= 2;
                initial += initial * percentage;

                continue


            }            
        }

        
        console.log(min, max);

        condG = isGreater(num, initial);
        let obj = {
            initial: initial,
            cond: condG,
        }

        if (obj.cond != previousObj.cond) {
            process.stdout.write(`Obj: ${obj.cond}, Previous: ${previousObj.cond}\n`);
            process.stdout.write(`Current ${obj.initial}, Previous ${previousObj.initial}\n`);
            process.stdout.write('Change!\n');
            counter++;
            process.stdout.write(`${counter} switches...\n`);
            process.stdout.cursorTo(0, -5);
            process.stdout.clearScreenDown((error) => {
                if (error) {
                    console.log(error);
                }
            });
            percentage = 1 - percentage;
            continue;
        }
    }

    return {
        commence: Math.round(initial),
        isgreater: isGreater(num, initial),
        up: procsUp,
        down : procsDown,
    }
}

const init = (num) => {
    return betNumber(num)
}

module.exports = init
