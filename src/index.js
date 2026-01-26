import express from 'express'
import cors from 'cors'
// Routes
import roleRouter from './modules/role/role.route.js'
import userRouter from './modules/user/user.route.js'

const app = express()
const port = 8000

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/users', userRouter)
app.use('/api/roles', roleRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
