const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = 'mongodb+srv://laptop-swap-station:e4o2vdngLISw6zBS@cluster0.qctdu57.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// console.log(DB_USER);
async function run() {
    try {
        // const appointmentOptionCollection = client.db('doctorsPortal').collection('appointmentOptions');
        // const bookingsCollection = client.db('doctorsPortal').collection('bookings');
        const usersCollection = client.db('laptop-swap-station').collection('users');

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        // app.get('/users/admin/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email }
        //     const user = await usersCollection.findOne(query);
        //     res.send({ isAdmin: user?.role === 'admin' });
        // })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // app.put('/users/admin/:id', verifyJWT, verifyAdmin, async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) }
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             role: 'admin'
        //         }
        //     }
        //     const result = await usersCollection.updateOne(filter, updatedDoc, options);
        //     res.send(result);
        // });

        // // temporary to update price field on appointment options
        // // app.get('/addPrice', async (req, res) => {
        // //     const filter = {}
        // //     const options = { upsert: true }
        // //     const updatedDoc = {
        // //         $set: {
        // //             price: 99
        // //         }
        // //     }
        // //     const result = await appointmentOptionCollection.updateMany(filter, updatedDoc, options);
        // //     res.send(result);
        // // })

        // app.get('/doctors', verifyJWT, verifyAdmin, async (req, res) => {
        //     const query = {};
        //     const doctors = await doctorsCollection.find(query).toArray();
        //     res.send(doctors);
        // })

        // app.post('/doctors', verifyJWT, verifyAdmin, async (req, res) => {
        //     const doctor = req.body;
        //     const result = await doctorsCollection.insertOne(doctor);
        //     res.send(result);
        // });

        // app.delete('/doctors/:id', verifyJWT, verifyAdmin, async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };
        //     const result = await doctorsCollection.deleteOne(filter);
        //     res.send(result);
        // })

    }
    finally {

    }
}
run().catch(console.log);






app.get('/', async (req, res) => {
    res.send('SWAP Station server is running');
})

app.listen(port, () => console.log(`SWAP Station running on ${port}`))
