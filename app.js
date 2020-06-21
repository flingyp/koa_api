const Koa = require('koa')
const koaBody = require('koa-body')
const mongoose = require('mongoose')
const Users = require('./routers/Users')
const Home = require('./routers/Home')
const Topic = require('./routers/Topic')
const path = require('path')
const koaStatic = require('koa-static')
const parameter = require('koa-parameter');


const app = new Koa()
const port = 3000
const db = mongoose.connection

// 参数校验 koa-parameter
parameter(app);

// 连接数据库
mongoose.connect('mongodb://localhost/demo01', { 
    useUnifiedTopology: true,
    useNewUrlParser: true
})


db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', () => {
    console.log('数据库连接成功!')
})


app.use(koaStatic(path.join(__dirname, 'public')))
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true
    }
}))
app.use(Users.routes())
app.use(Users.allowedMethods())
app.use(Home.routes())
app.use(Home.allowedMethods())
app.use(Topic.routes())

app.listen(port, async () => {
    console.log(`Project running in ${port} port`)
})
