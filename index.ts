import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import { connectToDatabase } from './config/db'
import router from './routes/auth.route'

configDotenv()


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors()) 

app.use('/auth', router)

app.get("/", (req, res) => res.send("Hello World!"))
const PORT = process.env.PORT || 3000

connectToDatabase(process.env.MONGO_URI as string).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}).catch((error) => {
    console.error('MongoDB connection error:', error)
    process.exit(1)
})
