const path = require('path')
class Home {
    async userstest(ctx) {
        ctx.body = 'this is test api'
    }

    async upload(ctx) {
        const file = ctx.request.files.file
        // 获取 上传后的图片每次 + 扩展名
        const basename = path.basename(file.path) 
        // // ctx.origin 就是 http:localhost:3000
        ctx.body = {
            url: `${ctx.origin}/uploads/${basename}`
        }
    }
}


module.exports = new Home()