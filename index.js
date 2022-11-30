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



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qctdu57.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const productsCollection = client.db('laptop-swap-station').collection('products');
        const categoriesCollection = client.db('laptop-swap-station').collection('categories');
        const usersCollection = client.db('laptop-swap-station').collection('users');
        const bookingCollection = client.db('laptop-swap-station').collection('booking');


        const verifyAdmin = async (req, res, next) => {
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await usersCollection.findOne(query);

            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        }


        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });

        app.post('/products', async (req, res) => {
            const postProduct = req.body;
            const result = await productsCollection.insertOne(postProduct);
            res.send(result);
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
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });


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

        // For User Log In & Register Data Set on db 
        app.put('/users', async (req, res) => {
            const query = req.body;
            const update = { $set: query };
            const options = { upsert: true };
            const result = await usersCollection.updateOne(query, update, options);

            res.send(result);
        });


        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        })

        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'buyer' });
        })

        app.get('/users/role', async (req, res) => {
            let query = {};
            if (req.query.role) {
                query = {
                    role: req.query.role
                }
            }
            const cursor = usersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.log);






app.get('/', async (req, res) => {
    res.send('SWAP Station server is running');
})

app.listen(port, () => console.log(`SWAP Station running on ${port}`))
