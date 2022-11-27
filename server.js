const express = require('express')
const app = express()
const cors = require('cors')
const posgre = require('./postgre-functions')

app.use(
    cors({
        origin: '*'
    })

)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const newRecords = (req, res) => {
    let clockIn = new Date(req.body.clockIn)
    let clockOut = new Date(req.body.clockOut)
    let vehicleType = req.body.type
    let totalCost = 0

    let totalTime = ((clockOut - clockIn) / 3600000).toFixed(3)
    totalTime = parseFloat(totalTime)
    // console.log(totalTime)
    totalCost = parkingCost(totalTime, vehicleType)
    console.log('Biaya Parkir: ', totalCost)

    //start of inserting data to database
    let value = [vehicleType, clockIn, clockOut, totalCost]

    posgre.insertParkingRecord(value)

    //end of inserting data to database

    return res.json({
        total_Time: totalTime,
        total_Cost: totalCost,
        message: 'Success'
    })
}

const getRecords = (req, res) => {
    // console.log('inside log records');
    try {
        posgre.getParkingRecords((values) => {
            // console.log(values);
            return res.json(values)
        })
    } catch (error) {
        return error.message
    }
}

const parkingCost = (totalTime, vehicleType) => {
    let total = 0
    let totalTimeDays = Math.floor(totalTime / 24)
    let totalTimeHours = 0
    let totalTimeMinute = totalTime % 1
    let cost = 0

    if (vehicleType == "mobil") {
        cost = 5000
        if (totalTimeDays >= 1) {
            totalTimeHours = Math.floor(totalTime % 24)
            total += (totalTimeHours * cost) + (80000 * totalTimeDays)
        } else {
            totalTime = Math.floor(totalTime)
            total += (totalTime * cost)
        }

    } else {
        cost = 2000
        if (totalTimeDays >= 1) {
            totalTimeHours = Math.floor(totalTime % 24)
            total += (totalTimeHours * cost) + (40000 * totalTimeDays)
        } else {
            totalTime = Math.floor(totalTime)
            total += (totalTime * cost)
        }
    }

    if (totalTimeMinute > 0.01) total += cost

    return total;
}

app.post('/new', newRecords)
app.get('/all-records', getRecords)



app.listen(3099, () => {
    console.log('listening at port 3099');
})