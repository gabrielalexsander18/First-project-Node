const express = require('express')
const uuid = require('uuid')

const port = 3000
const server = express()
server.use(express.json())

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
    const { name, age, sex } = request.body

    const user = { id: uuid.v4(), name, age, sex }

    users.push(user)

    return response.status(201).json(user)
})

server.put('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex
    const id = request.userId
    const { name, age, sex } = request.body

    const userUpdate = { id , name, age, sex }

    users[index] = userUpdate

    return response.json(userUpdate)
})

server.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})



server.listen(port, () => {
    console.log(`🟢  server on the port ${port}`)
})