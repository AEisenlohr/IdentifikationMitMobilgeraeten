const express = require('express');
const app = express();
const bcrypt = require('bcrypt')

app.use(express.json())

const users = []

app.get('/users', (req, res) => {
    res.json(users)
})

/*
 * Implements the registration of users
 */
app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hashedPassword}
        users.push(user)
        res.status(201).send("User created")
    } catch {
        res.status(500).send("Error while creating User")
    }
})

/*
 * Implements the user login
 */
app.post('/users/login', async (req,res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if (await bcrypt.compareSync(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.send('Access denied')
        }
    } catch {
        res.status(500).send('Error')
    }
})

app.listen(3000)