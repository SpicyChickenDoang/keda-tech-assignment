const pg = require('pg')
const { config } = require('./db/config')

const pool = new pg.Pool(config);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // process.exit(-1);
});

const conString = "postgres://postgres:1234@localhost/parking";

exports.getParkingRecords = (cb) => {

    const sql = 'SELECT row_id, vehicle_type, login_time, logout_time, parking_cost FROM public.parkingrecord;'
    // const sql = 'SELECT * FROM public.parkingrecord;'

    pool.connect((err, client, done) => {
        console.log('inside pool - GET');
        if (err) return console.log(err.message);
        client.query(sql, async(err, res) => {
            console.log('inside query - GET');
            // done()
            client.end;

            if (err) {
                console.log(err.stack)
            } else {
                return cb(res.rows)
            }
        })
    })

    // pg.connect(conString, function(err, client, done) {
    //     if(err) {
    //       return console.error('error fetching client from pool', err);
    //     }
    //     client.query('SELECT * FROM public.parkingrecord;', function(err, result) {
    //       //call `done()` to release the client back to the pool
    //       done();
      
    //       if(err) {
    //         return console.error('error running query', err);
    //       }
    //       console.log(result.rows);
    //       return cb(result.rows)
    //       //output: 1
    //     });
    //   });

}


exports.insertParkingRecord = (values) => {

    const sqlInsert = 'INSERT INTO public.parkingrecord(vehicle_type, login_time, logout_time, parking_cost) VALUES($1, $2, $3, $4) RETURNING *'

    pool.connect((err, client, done) => {
        console.log('inside pool - INSERT');
        if (err) return console.log(err.message)
        client.query(sqlInsert, values, async(err, res) => {
            console.log('inside query - INSERT');
            done()

            if (err) {
                console.log(err.stack)
            } else {
                return res.rows
            }
        })
    })

}


