const express = require('express')
const uuid = require('uuid')
const cors = require('cors')

const port = 3001
const server = express()
server.use(express.json())
server.use(cors())

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ mensage: "user not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

server.get('/users', (request, response) => {
    return response.json(users)
})

server.post('/users', (request, response) => {
try {
    const { name, age } = request.body

    // if(age < 18) throw new Error("Only allowed users over 18 years old")

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user);
} catch(err){
    return response.status(400).json({error:err.message});
}
}) 

server.put('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex
    const id = request.userId
    const { name, age } = request.body

    const userUpdate = { id , name, age }

    users[index] = userUpdate

    return response.json(userUpdate)
})

server.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})



server.listen(port, () => {
    console.log(`🚀 server on the port ${port}`)
})