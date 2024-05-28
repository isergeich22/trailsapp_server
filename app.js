const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const https = require('https')
const privkey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCfHozjNTGUsDQO
7+MvESyePTpTXPA5jwglmNjA25TaddUip9jH049x8032AFIt8AQC3pvNO5tYn/J3
kvaw2wOfcDswTtO84PbLGAP2G6gxqhaUfd3rwd0ZnmMqbsUezM10gaVyFUqEmrQw
FN7vpDwirasoxqI4RBaSVsX72pWTO1BnZjYqjTrIQLNYnLvcMxVcxy/1mz3B7R4T
RW08kjg0zEIVOpbmGcRJigkOy0yU9nTm4/DofeM1WwGyUu9qbdvC+a15M8JAmuTW
oJGAnp4uMIf3jkE2GeyJOZmHEpfRgEN/9Sk05bin0JbCpzg0fWecQxa5V+PF6veH
AWKN7h6vAgMBAAECggEAMAfSQlFPvpCzniCmRJJcFAXqYbiHoPA+Zs7s+sYteAYi
iHv+8U64mY52ZX/yToCJTW5xvDE2crmRQKvhgEAUJ2AC1dGtk3GavXJp27O8gQVV
HIyj3OLfgTiwuWHHacUrbXQnAzlPDZj/NBZQtyitqFAg/sV6uR5Aa/r6d0wjY1YF
090aRKjihRmxUzfgTV0NWVXVud7CMcMLGRijEihJwW+Til4MHlfp7C3nlQ157fHm
zm3GbdbH+Y/UeaCKQWAsuwv+HnPwjWcchKFzrOqYCELeeq3kP6ny2d8KbiQnM09H
fEK5M/e02Kr5FLTJmDGxKZ4JY8YpscQKY/iQMXUrCQKBgQDHdPkOsd7KWvcsNAV2
S+aAoctbIN6CrW/i3TPSoyIivFv6fJqa/jwwYtbYmQUp+xhUCt+l1lca/3ZQNICx
5+4rrfRGPyNVJkFE3JqzotJhIZMqNu5K3KfKSRj1wAntrnJJNEuGP9p/e4gmnCZA
EeKWIQNH/FewYbU71xZB457jOQKBgQDMOjCq4ZINJVPZXpayEzdHHQUzHVDFm2f6
W1+0nOa7abvO/UOMbeEba/jpGvzNsqu4kNl3vab7WQyiaN0RFC+5xZgwEvnWi8lS
564IsgkFkVlcDNP41vs2+jdzSuy4nJMlnuAUJA1eD+mp1n4yMan/5v2+u6kmG9RQ
NTIWAiCJJwKBgBuKOi1eP+3e24wd7rcjycLvFB4UDsUqX22Kr3IhFkCHk4ells9Z
1UO1Egc8MatXQUexbKoAS2yt4081wKNP6+HaFgVxCFbkflScxTuSesvwj9pfVU2+
4+gZabnc90H7OUqETv1NacT6cJUsMFfeYFPsYQCahh0TkKufijI01KZ5AoGAXtEp
ZTzDDT1mV4Y12slXIboUfu2+YXBMbwzbO0SZTyvA2VH2eY1ONOgFMVypQGsSlOcT
QCeaDhoC5qhe8p33pn1ZsgAtZHGT79zGjRzzWVVpMnZ2N5LAIX88HVgM3Y08N/wy
NseiOSiUKJkAEBfEwJ2i81m3J41GHlMERPmJ14MCgYA/1P7UB28cNABRHQrzKox4
ZFFtmrcPPHQpAmLIzCK+807CxxK6gvUEzn/TljYdfkmybOPWS1bi100CH6TjqNeV
i2604Vnv5LiuKX8di5PqrSbNjL1LpFutJHqxJUYMNTP5THPF2EEeZhHhxctUqXDh
W9DKgCV69KK9WkoCae2xcw==
-----END PRIVATE KEY-----`

const certificate = `-----BEGIN CERTIFICATE-----
MIIFAjCCA+qgAwIBAgISBIiH8KkAJfUQQHroGHnpIBcVMA0GCSqGSIb3DQEBCwUA
MDIxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQswCQYDVQQD
EwJSMzAeFw0yNDA1MjgxNTQ5NDJaFw0yNDA4MjYxNTQ5NDFaMBsxGTAXBgNVBAMT
EHRyYWlsc2FwcC5vbmxpbmUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
AQCfHozjNTGUsDQO7+MvESyePTpTXPA5jwglmNjA25TaddUip9jH049x8032AFIt
8AQC3pvNO5tYn/J3kvaw2wOfcDswTtO84PbLGAP2G6gxqhaUfd3rwd0ZnmMqbsUe
zM10gaVyFUqEmrQwFN7vpDwirasoxqI4RBaSVsX72pWTO1BnZjYqjTrIQLNYnLvc
MxVcxy/1mz3B7R4TRW08kjg0zEIVOpbmGcRJigkOy0yU9nTm4/DofeM1WwGyUu9q
bdvC+a15M8JAmuTWoJGAnp4uMIf3jkE2GeyJOZmHEpfRgEN/9Sk05bin0JbCpzg0
fWecQxa5V+PF6veHAWKN7h6vAgMBAAGjggInMIICIzAOBgNVHQ8BAf8EBAMCBaAw
HQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMAwGA1UdEwEB/wQCMAAwHQYD
VR0OBBYEFPPzLit6VAQnxLjip1OY/ZKg/WweMB8GA1UdIwQYMBaAFBQusxe3WFbL
rlAJQOYfr52LFMLGMFUGCCsGAQUFBwEBBEkwRzAhBggrBgEFBQcwAYYVaHR0cDov
L3IzLm8ubGVuY3Iub3JnMCIGCCsGAQUFBzAChhZodHRwOi8vcjMuaS5sZW5jci5v
cmcvMDEGA1UdEQQqMCiCEHRyYWlsc2FwcC5vbmxpbmWCFHd3dy50cmFpbHNhcHAu
b25saW5lMBMGA1UdIAQMMAowCAYGZ4EMAQIBMIIBAwYKKwYBBAHWeQIEAgSB9ASB
8QDvAHYAPxdLT9ciR1iUHWUchL4NEu2QN38fhWrrwb8ohez4ZG4AAAGPwBuOrQAA
BAMARzBFAiBWkSUmG6HOjC7q7wfv1NckSoDv0rs7LJoMzg7/skjUigIhAPcGszL6
+qN+CJZufUQwjnVQpl4zkGUJMZSHp/KxbGmzAHUASLDja9qmRzQP5WoC+p0w6xxS
ActW3SyB2bu/qznYhHMAAAGPwBuOrAAABAMARjBEAiBoHZzTkdqzIHQhyGBeFc9v
/VdrVrrVTxcoXzlnFltRPwIgB9sEEJ72FtHOecX8hkCjoNfmvaPkl7Aj3Z7gk8YW
ysUwDQYJKoZIhvcNAQELBQADggEBACCFYeXhcHgL4l2gYSvkHvrXdCc6mAQxmKou
ylrVjIDmUMCwMWQ3CMpLRD95rCda4YT6e0Yj66TWsZZbg79HsI72IpmrDSOXJcIz
Yqyx7Iri7VVvPlOO094eH6ieBiqtzcDRpyiI1Guxs+8oYJamiTVnaHK1IQT2QRLZ
SKCJ+YJqTdONyKVvoXW7eIDaRtjPOuDCcpSYhCdvtg9lbjDgyR3bNvduH4HMRNFy
0Er6B4CRPBIXAnZIhouBz+/mmA3ex7hamx1wPGp5AdCWezRWICDw9l0uJ9IsAtKL
IzGjFecsqPUpXotrl3JyjPaV/1KjRtWDCBjq8C7XpufQbj1WEkk=
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIFFjCCAv6gAwIBAgIRAJErCErPDBinU/bWLiWnX1owDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMjAwOTA0MDAwMDAw
WhcNMjUwOTE1MTYwMDAwWjAyMQswCQYDVQQGEwJVUzEWMBQGA1UEChMNTGV0J3Mg
RW5jcnlwdDELMAkGA1UEAxMCUjMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
AoIBAQC7AhUozPaglNMPEuyNVZLD+ILxmaZ6QoinXSaqtSu5xUyxr45r+XXIo9cP
R5QUVTVXjJ6oojkZ9YI8QqlObvU7wy7bjcCwXPNZOOftz2nwWgsbvsCUJCWH+jdx
sxPnHKzhm+/b5DtFUkWWqcFTzjTIUu61ru2P3mBw4qVUq7ZtDpelQDRrK9O8Zutm
NHz6a4uPVymZ+DAXXbpyb/uBxa3Shlg9F8fnCbvxK/eG3MHacV3URuPMrSXBiLxg
Z3Vms/EY96Jc5lP/Ooi2R6X/ExjqmAl3P51T+c8B5fWmcBcUr2Ok/5mzk53cU6cG
/kiFHaFpriV1uxPMUgP17VGhi9sVAgMBAAGjggEIMIIBBDAOBgNVHQ8BAf8EBAMC
AYYwHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMBMBIGA1UdEwEB/wQIMAYB
Af8CAQAwHQYDVR0OBBYEFBQusxe3WFbLrlAJQOYfr52LFMLGMB8GA1UdIwQYMBaA
FHm0WeZ7tuXkAXOACIjIGlj26ZtuMDIGCCsGAQUFBwEBBCYwJDAiBggrBgEFBQcw
AoYWaHR0cDovL3gxLmkubGVuY3Iub3JnLzAnBgNVHR8EIDAeMBygGqAYhhZodHRw
Oi8veDEuYy5sZW5jci5vcmcvMCIGA1UdIAQbMBkwCAYGZ4EMAQIBMA0GCysGAQQB
gt8TAQEBMA0GCSqGSIb3DQEBCwUAA4ICAQCFyk5HPqP3hUSFvNVneLKYY611TR6W
PTNlclQtgaDqw+34IL9fzLdwALduO/ZelN7kIJ+m74uyA+eitRY8kc607TkC53wl
ikfmZW4/RvTZ8M6UK+5UzhK8jCdLuMGYL6KvzXGRSgi3yLgjewQtCPkIVz6D2QQz
CkcheAmCJ8MqyJu5zlzyZMjAvnnAT45tRAxekrsu94sQ4egdRCnbWSDtY7kh+BIm
lJNXoB1lBMEKIq4QDUOXoRgffuDghje1WrG9ML+Hbisq/yFOGwXD9RiX8F6sw6W4
avAuvDszue5L3sz85K+EC4Y/wFVDNvZo4TYXao6Z0f+lQKc0t8DQYzk1OXVu8rp2
yJMC6alLbBfODALZvYH7n7do1AZls4I9d1P4jnkDrQoxB3UqQ9hVl3LEKQ73xF1O
yK5GhDDX8oVfGKF5u+decIsH4YaTw7mP3GFxJSqv3+0lUFJoi5Lc5da149p90Ids
hCExroL1+7mryIkXPeFM5TgO9r0rvZaBFOvV2z0gp35Z0+L4WPlbuEjN/lxPFin+
HlUjr8gRsI3qfJOQFy/9rKIJR0Y/8Omwt/8oTWgy1mdeHmmjk7j1nYsvC9JSQ6Zv
MldlTTKB3zhThV1+XWYp6rjd5JW1zbVWEkLNxE7GJThEUG3szgBVGP7pSWTUTsqX
nLRbwHOoq7hHwg==
-----END CERTIFICATE-----`

dotenv.config({path:__dirname + '/.env'})

const Schema = mongoose.Schema

const db = mongoose.connection

const routeSchema = new Schema({routePoints: [{name: String, cost: Number, status: Boolean}], packagePoints: [{name: String, quantity: Number, status: Boolean}], startSum: Number, purchasesSum: Number, roadSum: Number, endSum: Number, executorName: String, routeDate: String})
const endedRouteSchema = new Schema({routePoints: Array, packagePoints: Array, startSum: Number, purchasesSum: Number, roadSum: Number, endSum: Number, executorName: String, routeDate: String})
const route = mongoose.model('current_trails', routeSchema)
const endedRoute = mongoose.model('history_trails', endedRouteSchema)

const app = express()
const port = 8081

app.use(cors())
app.use(express.json())

const urlencodedParser = bodyParser.urlencoded({
    extended: false
})

const credentials = { key: privkey, cert: certificate }

const httpsServer = https.createServer(credentials, app)
 
async function main() {

    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_URI)
        httpsServer.listen(port, () => {
            console.log('Сервер ожидает подключения...')
        })        
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