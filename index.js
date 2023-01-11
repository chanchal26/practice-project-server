const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://dbuser2:Q0fANEmMPDmPErCr@cluster0.v73oziy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function dbConnect() {
    try {
        const Products = client.db('Practice-Project').collection('Products');
        const Users = client.db('Practice-Project').collection('users');
        const CartItem = client.db('Practice-Project').collection('cartItem');
        const SignInUsers = client.db('Practice-Project').collection('signInUsers');

        app.get('/products', async (req, res) => {
            const result = await Products.find({}).toArray();
            res.send(result);
        });

        app.get("/cartItem", async (req, res) => {
            const result = await CartItem.find({}).toArray();
            res.send(result);
        });

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await Products.insertOne(product);
            res.send(result)
        });

        app.delete('/deleteCart/:name', async (req, res) => {
            const name = req.params.name;
            const query = { name: name };
            const result = await CartItem.deleteOne(query);
            res.send(result);
        })

        app.post('/cartItem', async (req, res) => {
            const product = req.body;
            const result = await CartItem.insertOne(product);
            res.send(result)
        });

        app.get('/users', async (req, res) => {
            const result = await Users.find({}).toArray();
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await Users.insertOne(user);
            res.send(result)
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await Users.findOne(query);
            res.send(result);
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const options = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    plan: user.plan,
                    status: user.status,
                    image: user.image
                }
            }
            const result = await Users.updateOne(filter, updatedUser, options);
            res.send(result);
        });

        app.post('/signInUsers', async (req, res) => {
            const user = req.body;
            const result = await SignInUsers.insertOne(user);
            res.send(result)
        });


        app.get('/signInUsers/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await SignInUsers.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });

        app.delete('/deleteUsers/:id', async (req, res) => {
            const id = req.params.id;
            const ObjectID = require('mongodb').ObjectId;
            const query = { _id: ObjectId(id) };
            const result = await Users.deleteOne(query);
            res.send(result);
        });
    }
    finally {

    }
}

dbConnect().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from Practice server');
});

app.listen(port, () => {
    console.log(`listening to port ${port}`);
});