const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config({path:__dirname + '/.env'})

const Schema = mongoose.Schema

const db = mongoose.connection

const routeSchema = new Schema({routePoints: [{name: String, cost: Number, status: Boolean}], packagePoints: [{name: String, quantity: Number, status: Boolean}], startSum: Number, purchasesSum: Number, roadSum: Number, endSum: Number, executorName: String, routeDate: String})
const endedRouteSchema = new Schema({routePoints: Array, packagePoints: Array, startSum: Number, purchasesSum: Number, roadSum: Number, endSum: Number, executorName: String, routeDate: String})
const route = mongoose.model('current_trails', routeSchema)
const endedRoute = mongoose.model('history_trails', endedRouteSchema)

const app = express()

app.use(cors({
    origin: ["*"],
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Origin", "Content-Type", "Authorization"],
}))
app.use(express.json())

const urlencodedParser = bodyParser.urlencoded({
    extended: false
})
 
async function main() {

    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_URI)
        app.listen(8081)
        console.log('Сервер ожидает подключения...')
    } catch(err) {
        return console.log(err)
    }

}

app.post('/api/create', urlencodedParser, async function(req, res) {    

    res.header('Access-Control-Allow-Origin', '*')

    if(!req.body) return res.sendStatus(400)

    const newRoute = new route({routePoints: req.body.routePoints, packagePoints: req.body.packagePoints, startSum: req.body.startSum, purchasesSum: 0, roadSum: 0, endSum: 0, executorName: req.body.executorName, routeDate: req.body.routeDate})

    const _route = await newRoute.save()

    res.status(200).json(_route)

})

app.get('/api/current', async function(req, res){

    res.header('Access-Control-Allow-Origin', '*')

    const currentRoutes = await route.find({})

    if(currentRoutes.length > 0) {

        res.status(200).json(currentRoutes)

    } else {

        res.status(200).json('Здесь пока нет маршрутов')

    }

})

app.get('/api/history', async function(req, res){

    res.header('Access-Control-Allow-Origin', '*')

    const history = await endedRoute.find({})

    if(history.length > 0) {

        res.status(200).json(history)

    } else {
        res.status(200).json('Здесь пока нет маршрутов')
    }

})

app.put('/api/current/:operation', async function(req, res){

    res.header('Access-Control-Allow-Origin', '*')

    if(req.params.operation === 'edit_purchase_points') {

        const newPoint = {
            name: req.body.pointName,
            cost: 0,
            status: false
        }

        if(newPoint) {

            const updatedRoute = await route.findOneAndUpdate({
                executorName: req.body.executorName
            },
            {
                "$push": {
                    "routePoints": newPoint
                }
            })

            const currRoute = await route.find({})

            res.status(200).json(currRoute)

        }

    }

    if(req.params.operation === 'edit_package_points') {

        const newPoint = {
            name: req.body.pointName,
            quantity: req.body.pointQuantity,
            status: false
        }

        if(newPoint) {

            const updatedRoute = await route.findOneAndUpdate({
                executorName: req.body.executorName
            },
            {
                "$push": {
                    "packagePoints": newPoint
                },                
            })

            const currRoute = await route.find({})

            res.status(200).json(currRoute)

        }

    }

    if(req.params.operation === 'edit_road_sum') {

        if(req.body.roadSum !== undefined) {

            const result = await route.findOneAndUpdate(
                {
                    executorName: req.body.executorName
                },
                {
                    roadSum: req.body.roadSum
                }
            )

            const currRoute = await route.find({})

            res.status(200).json(currRoute)

        }
        
    }

    if(req.params.operation === 'edit_start_sum') {

        if(req.body.startSum !== undefined) {

            const result = await route.findOneAndUpdate(
                {
                    executorName: req.body.executorName
                },
                {
                    startSum: req.body.startSum
                }
            )

            const currRoute = await route.find({})

            res.status(200).json(currRoute)

        }

    }

})

app.put('/api/purchase_update', async function(req, res){

    res.header('Access-Control-Allow-Origin', '*')
    if(req.body.pointSum) {

        const result = await route.findOneAndUpdate(
            { 
                executorName: req.body.executorName,
                "routePoints.name": req.body.pointName
            },
            {
                "$set": {
                    "routePoints.$.cost": parseInt(req.body.pointSum)
                }
            }
        )

        const currRoute = await route.find({})

        res.status(200).json(currRoute)

    }

    if(req.body.pointStatus !== undefined) {

        const result = await route.findOneAndUpdate(
            {
                executorName: req.body.executorName,
                "routePoints.name": req.body.pointName
            },
            {
                "$set": {
                    "routePoints.$.status": req.body.pointStatus
                }
            }
        )

        const currRoute = await route.find({})

        res.status(200).json(currRoute)

    }

})

app.put('/api/purchase_remove', async function(req, res){

    res.header('Access-Control-Allow-Origin', '*')

    const result = await route.findOneAndUpdate(
        {
            executorName: req.body.executorName
        },
        {
            "$pull": {
                "routePoints": {
                    "name": req.body.pointName
                }
            }
        }
    )

    const currRoute = await route.find({})

    res.status(200).json(currRoute)

})

app.put('/api/package_remove', async function(req, res){

    res.header('Access-Control-Allow-Origin', '*')
    
    const result = await route.findOneAndUpdate(
        {
            executorName: req.body.executorName
        },
        {
            "$pull": {
                "packagePoints": {
                    "name": req.body.packageName
                }
            }
        }
    )

    const currRoute = await route.find({})

    res.status(200).json(currRoute)

})

app.put('/api/package_update', async function(req, res){

    res.header('Access-Control-Allow-Origin', '*')
    if(req.body.packageStatus !== undefined) {

        const result = await route.findOneAndUpdate(
            {
                executorName: req.body.executorName,
                "packagePoints.name": req.body.packageName
            },
            {
                "$set": {
                    "packagePoints.$.status": req.body.packageStatus
                }
            }
        )

        const currRoute = await route.find({})

        res.status(200).json(currRoute)

    }

})

app.post('/api/save', async function(req, res){

    res.header('Access-Control-Allow-Origin', '*')

    const _route = {
        executorName: req.body.executorName,
        routeDate: req.body.routeDate,
        routePoints: req.body.routePoints,
        packagePoints: req.body.packagePoints,
        startSum: req.body.startSum,
        purchasesSum: req.body.purchasesSum,
        roadSum: req.body.roadSum,
        endSum: req.body.endSum
    }

    const savedRoute = await endedRoute.insertMany(
        _route
    )

    const currHistory = await endedRoute.find({})

    const updatedCurrent = await route.findOneAndDelete({
        executorName: req.body.executorName
    })

    const currRoute = await route.find({})    

    res.status(200).json(currRoute)

})

main()

process.on("SIGINT", async() => {
    
    await mongoose.disconnect()
    console.log('Приложение завершило работу')
    process.exit()

})