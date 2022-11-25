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

    try {

        posgre.getParkingRecords((values) => {

            return res.json(values)
        })
    } catch (error) {
        return error.message
    }

}

const getRecordsWithFilter = (req, res) => {

    try {

        const mobilCb = req.body.mobilCb
        const motorCb = req.body.motorCb
        let loginDate = req.body.loginId
        let logoutDate = req.body.logoutId
        const minCost = parseInt(req.body.minCost)
        const maxCost = parseInt(req.body.maxCost)
        let finalResult = new Array()
        let finalsResult = new Array()

        posgre.getParkingRecords((values) => {

            for (let i = 0; i < values.length; i++) {

                if (minCost <= parseInt(values[i].parking_cost) && maxCost >= parseInt(values[i].parking_cost)) {
                    if (mobilCb == true && values[i].vehicle_type == 'mobil' && !finalResult.includes(values[i].row_id))
                        finalResult.push(values[i])

                    if (motorCb == true && values[i].vehicle_type == 'motor' && !finalResult.includes(values[i].row_id))
                        finalResult.push(values[i])

                    if (mobilCb == false && motorCb == false && !finalResult.includes(values[i].row_id))
                        finalResult.push(values[i])
                }
            }

            for (let i = 0; i < finalResult.length; i++) {
                loginDate = new Date(loginDate)
                logoutDate = new Date(logoutDate)
                console.log(loginDate < finalResult[i].login_time, logoutDate > finalResult[i].logout_time);
                
                // finalResult[i].login_time = new Date(finalResult[i].login_time)
                if (loginDate < finalResult[i].login_time && logoutDate > finalResult[i].logout_time) {
                    finalsResult.push(finalResult[i])
                }
            }
            
            console.log(finalsResult);

            return res.json(finalsResult)
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
app.post('/records', getRecordsWithFilter)
app.get('/all-records', getRecords)



app.listen(3000, () => {
    console.log('listening at port 3000');
})