// 数据库 user 模板
const Topic = require('../models/topic')



class Topics {
    async topictest (ctx){
        ctx.body = 'This is test API'
    }

    async find(ctx) {
        const {per_page = 10} = ctx.query
        const page = Math.max(ctx.query.page*1, 1) - 1
        const perPage = Math.max(per_page*1, 1)
        ctx.body = await Topic.find().limit(perPage).skip(page * perPage)
    }

    async findById(ctx) {
        const {fields=''} = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const topic = await Topic.findById(ctx.params.id).select(selectFields)
        ctx.body = topic;
    }

    async create(ctx) {
        // 校验参数
        ctx.verifyParams({
            name: {type: 'string', required: true},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        })
        const topic = await new Topic(ctx.request.body).save()
        ctx.body = topic
    }
    
    async update(ctx) {
        // 校验参数
        ctx.verifyParams({
            name: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        })
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        ctx.body = topic
    }
}

module.exports = new Topics()