const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')
const Users = require('./routers/Users')


const app = new Koa()
const port = 3000
const db = mongoose.connection

// 连接数据库
mongoose.connect('mongodb://localhost/demo01', { 
    useUnifiedTopology: true,
    useNewUrlParser: true
})


db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', () => {
    console.log('数据库连接成功!')
})

app.use(bodyParser())
app.use(Users.routes())
app.use(Users.allowedMethods())

app.listen(port, async () => {
    console.log(`Project running in ${port} port`)
})
