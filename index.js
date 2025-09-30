const express = require('express');
const app = express();
const port = 8000;

const {Client, Result} = require('pg');
const con = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Yhvngpluto2$",
  database: "CRUD"
})

con.connect().then(() => console.log("connected"))

app.use(express.json());

let nextId = 1;
isDeleted = false;

app.get('/api/hello', (req, res) => {
  res.status(200).send('Welcome');
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  user.id = nextId++;
  user.isDeleted = isDeleted;
  const insert_query = 'INSERT INTO Users (name, id, age, city, email, isDeleted) VALUES ($1, $2, $3, $4, $5, $6)'
  con.query(insert_query, [user.name, user.id, user.age, user.city, user.email, user.isDeleted], (err, result) => {
    if (err) {
      res.status(500).send({error: "Server not Found"})
    } else {
      console.log(result)
      res.status(201).send({message: "User created", user})
    }
  } )
});

app.get('/api/users', (req, res) => {
  res.send(users.filter((u) => u.isDeleted === false));
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId && u.isDeleted === false);

  if (!user) {
    res.status(400).send({ error: 'User not Found' });
  }

  try {
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId && u.isDeleted === false);
    user.name = req.body.name ? req.body.name : user.name;
    user.age = req.body.age ? req.body.age : user.age;
    user.city = req.body.city ? req.body.city : user.city;
    user.email = req.body.email ? req.body.email : user.email;
    if (!user) {
      return res.status(400).send({ error: 'User not Found' });
    }

    res.status(200).send({ updatedUser: user, message: 'User updated!' });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  try {
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) {
      res.status(400).send({ error: 'User not found' });
    }
    user.isDeleted = true;

    res.status(200).send({ message: 'User has been deleted' });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
