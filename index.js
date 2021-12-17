const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bnebi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//middleware
app.use(cors());
app.use(express.json());

async function run(){
    try{
        await client.connect();
        
        const db = client.db("task");
        const list_collection = db.collection("list");

        /**
         * add list
         */
        app.post('/list', async(req, res) => {
			const data = req.body;
			const result = await list_collection.insertOne(data);
			res.json(result);
        });

        /**
		 * Get list
		 */
        app.get('/list', async(req, res) => {
			const query = {}
            const result = await list_collection.find(query).toArray();
            res.json(result);
        });

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Tasks List Running!');
})

app.listen(port, () => {
  console.log(`listening port: ${port}`);
})