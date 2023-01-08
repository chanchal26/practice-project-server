const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// user: dbuser2
// pass: Q0fANEmMPDmPErCr

const uri = `mongodb+srv://dbuser2:Q0fANEmMPDmPErCr@cluster0.v73oziy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function dbConnect() {
    try {
        const Products = client.db('Practice-Project').collection('Products');
        const Users = client.db('Practice-Project').collection('users');

        app.get('/products', async (req, res) => {
            const result = await Products.find({}).toArray();
            res.send(result);
        });

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await Products.insertOne(product);
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