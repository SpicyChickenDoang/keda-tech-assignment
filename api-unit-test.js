const axios = require('axios')

// API Unit Testing without framework

async function insertRecord() {

    let vehicleType = "pesawat"
    let inTime = new Date('2022-11-25T17:11')
    let outTime = new Date('2022-11-25T21:26')

    if (outTime > inTime) {
        let totalTime = ((outTime - inTime) / 360000).toFixed(2)
        totalTime = parseFloat(totalTime)
    } else {
        console.error('bad timing');
        return 0
    }

    axios.post('http://localhost:3000/new', {
        type: vehicleType,
        clockIn: inTime,
        clockOut: outTime,
    }).then((res) => {
        console.log(res.data);
    })
        .catch((err) => {
            console.log(err.message);
        });

    return 0
};

insertRecord()

async function loadRecords() {

    axios.get('http://localhost:3000/all-records').then((res) => {
        console.table(res.data);
        return

    })
        .catch((err) => {
            return console.log(err.message);
        });

        return 0

}

loadRecords()


async function loadFilteredRecords() {

    let mobilCb = true
    let motorCb = false

    const minimumDate = new Date(Date.now() - 12096e5)
    let loginId = minimumDate.toISOString()
    let logoutId = new Date().toISOString()

    let minCost = 5000
    let maxCost = 1000000

    await axios.post('http://localhost:3000/records', {
        mobilCb: mobilCb,
        motorCb: motorCb,
        loginId: loginId,
        logoutId: logoutId,
        minCost: minCost,
        maxCost: maxCost
    }).then((res) => {
        console.log(res.data);
    })
        .catch((err) => {
            console.log(err.message);
        });

    return
}

loadFilteredRecords()


