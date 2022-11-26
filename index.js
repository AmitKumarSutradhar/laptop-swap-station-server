const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = 'mongodb+srv://laptop-swap-station:e4o2vdngLISw6zBS@cluster0.qctdu57.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const productsCollection = client.db('laptop-swap-station').collection('products');
        const categoriesCollection = client.db('laptop-swap-station').collection('categories');
        // const appointmentOptionCollection = client.db('doctorsPortal').collection('appointmentOptions');
        // const bookingsCollection = client.db('doctorsPortal').collection('bookings');
        const usersCollection = client.db('laptop-swap-station').collection('users');
        // const doctorsCollection = client.db('doctorsPortal').collection('doctors');
        // const paymentsCollection = client.db('doctorsPortal').collection('payments');


        // const verifyAdmin = async (req, res, next) => {
        //     const decodedEmail = req.decoded.email;
        //     const query = { email: decodedEmail };
        //     const user = await usersCollection.findOne(query);

        //     if (user?.role !== 'admin') {
        //         return res.status(403).send({ message: 'forbidden access' })
        //     }
        //     next();
        // }


        // app.get('/categories', async (req, res) => {
        //     const query = {};
        //     const categories = await categoriesCollection.find(query).toArray();
        //     res.send(categories);
        // });


        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });


        app.get('/categories', async (req, res) => {
            let query = {};
            const cursor = categoriesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/category', async (req, res) => {
            let query = {};
            if (req.query.category_id) {
                query = {
                    category_id: req.query.category_id
                }
            }
            console.log(query);
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });


        // app.get('/appointmentOptions', async (req, res) => {
        //     const date = req.query.date;
        //     const query = {};
        //     const options = await appointmentOptionCollection.find(query).toArray();

        //     // get the bookings of the provided date
        //     const bookingQuery = { appointmentDate: date }
        //     const alreadyBooked = await bookingsCollection.find(bookingQuery).toArray();

        //     // code carefully :D
        //     options.forEach(option => {
        //         const optionBooked = alreadyBooked.filter(book => book.treatment === option.name);
        //         const bookedSlots = optionBooked.map(book => book.slot);
        //         const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot))
        //         option.slots = remainingSlots;
        //     })
        //     res.send(options);
        // });

        // app.get('/v2/appointmentOptions', async (req, res) => {
        //     const date = req.query.date;
        //     const options = await appointmentOptionCollection.aggregate([
        //         {
        //             $lookup: {
        //                 from: 'bookings',
        //                 localField: 'name',
        //                 foreignField: 'treatment',
        //                 pipeline: [
        //                     {
        //                         $match: {
        //                             $expr: {
        //                                 $eq: ['$appointmentDate', date]
        //                             }
        //                         }
        //                     }
        //                 ],
        //                 as: 'booked'
        //             }
        //         },
        //         {
        //             $project: {
        //                 name: 1,
        //                 price: 1,
        //                 slots: 1,
        //                 booked: {
        //                     $map: {
        //                         input: '$booked',
        //                         as: 'book',
        //                         in: '$$book.slot'
        //                     }
        //                 }
        //             }
        //         },
        //         {
        //             $project: {
        //                 name: 1,
        //                 price: 1,
        //                 slots: {
        //                     $setDifference: ['$slots', '$booked']
        //                 }
        //             }
        //         }
        //     ]).toArray();
        //     res.send(options);
        // })

        // app.get('/appointmentSpecialty', async (req, res) => {
        //     const query = {}
        //     const result = await appointmentOptionCollection.find(query).project({ name: 1 }).toArray();
        //     res.send(result);
        // })

        // // app.get('/bookings', verifyJWT, async (req, res) => {
        // app.get('/bookings', async (req, res) => {
        //     const email = req.query.email;
        //     const decodedEmail = req.decoded.email;

        //     if (email !== decodedEmail) {
        //         return res.status(403).send({ message: 'forbidden access' });
        //     }

        //     const query = { email: email };
        //     const bookings = await bookingsCollection.find(query).toArray();
        //     res.send(bookings);
        // });

        // app.get('/bookings/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const booking = await bookingsCollection.findOne(query);
        //     res.send(booking);
        // })

        // app.post('/bookings', async (req, res) => {
        //     const booking = req.body;
        //     console.log(booking);
        //     const query = {
        //         appointmentDate: booking.appointmentDate,
        //         email: booking.email,
        //         treatment: booking.treatment
        //     }

        //     const alreadyBooked = await bookingsCollection.find(query).toArray();

        //     if (alreadyBooked.length) {
        //         const message = `You already have a booking on ${booking.appointmentDate}`
        //         return res.send({ acknowledged: false, message })
        //     }

        //     const result = await bookingsCollection.insertOne(booking);
        //     res.send(result);
        // });

        // app.post('/create-payment-intent', async (req, res) => {
        //     const booking = req.body;
        //     const price = booking.price;
        //     const amount = price * 100;

        //     const paymentIntent = await stripe.paymentIntents.create({
        //         currency: 'usd',
        //         amount: amount,
        //         "payment_method_types": [
        //             "card"
        //         ]
        //     });
        //     res.send({
        //         clientSecret: paymentIntent.client_secret,
        //     });
        // });

        // app.post('/payments', async (req, res) => {
        //     const payment = req.body;
        //     const result = await paymentsCollection.insertOne(payment);
        //     const id = payment.bookingId
        //     const filter = { _id: ObjectId(id) }
        //     const updatedDoc = {
        //         $set: {
        //             paid: true,
        //             transactionId: payment.transactionId
        //         }
        //     }
        //     const updatedResult = await bookingsCollection.updateOne(filter, updatedDoc)
        //     res.send(result);
        // })

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
        });

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
