// 数据库 user 模板
const user = require('../models/user')
// 密码加密
const bcrypt = require('bcryptjs')
// jwt
const jwt = require('jsonwebtoken')

const {secret, tokenExpiresTime} = require('../config/secret')
const { use } = require('../routers/Users')

class users {
    async userstest (ctx){
        ctx.body = 'This is test API'
    }

    async allusers(ctx) {
        ctx.body = await user.find()
    }
    
    async userregister (ctx){
        ctx.verifyParams({
            username: { type: 'string', required: true },
            password: {type: 'string', required: true }
        })
        const findResult = await user.findOne({username: ctx.request.body.username})
        if(findResult) {
            ctx.throw(409, 'The user already exists')
        }
        let newUser = {
            username: ctx.request.body.username,
            password: ctx.request.body.password,
            mobile: ctx.request.body.mobile
        }
        // 加密后的密码
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(`${newUser.password}`, salt);
        newUser.password = hash
        // 把用户 添加到数据库中
        const admin = await new user(newUser).save()
        ctx.status = 201
        ctx.body = {
            username: admin.username,
            mobile: admin.mobile
        }
    }

    async userlogin (ctx) {
        ctx.verifyParams({
            username: { type: 'string', required: true },
            password: {type: 'string', required: true }
        })
        // 获取 用户登陆时输入的用户名 和 密码
        let {username, password} = ctx.request.body
        let findResult = await user.findOne({username}).select('+password')
        // 判断 用户名 时
        if(!findResult) {
            ctx.status = 401
            ctx.body = {
                status: 401,
                error: '用户名或密码输入错误'
            }
            return 
        }
        // 获取 数据库 该用户加密后的密码
        // 输入的密码 和 数据库的密码 进行对比 true 为 用户输入密码正确 false 为 用户输入密码不正确
        let passwordJudge = bcrypt.compareSync(`${password}`, findResult.password)
        // 判断 密码错误时
        if(!passwordJudge) {
            ctx.status = 401
            ctx.body = {
                status: 401,
                error: '用户名或密码错误'
            }
            return
        }
        // 用户名存在 和 密码 正确的情况下 派发 token
        const token = jwt.sign(
            {username: findResult.username,id: findResult._id},
            secret,
            {expiresIn: tokenExpiresTime}
        )
        ctx.status = 200
        ctx.body = {
            token,
            status: 200
        }
    }

    async getuser(ctx) {
        const { fields } = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const getUser = await user.findById(ctx.params.id).select(selectFields);
        if(!getUser) {ctx.throw(404, '用户不存在')}
        ctx.body = getUser
    }

    async userupdate(ctx) {
        ctx.verifyParams({
            username: { type: 'string', required: false },
            password: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            gender: { type: 'string', required: false },
            headline: { type: 'string', required: false },
            locations: { type: 'array', itemType: 'string', required: false },
            business: { type: 'string', required: false },
            employments: { type: 'array', itemType: 'object' ,required: false },
            educations: { type: 'array', itemType: 'object' ,required: false },
        })
        let hash = null
        let updateUser = null
        if(ctx.request.body.password) {
            // 加密后的密码
            const salt = bcrypt.genSaltSync(10);
            hash = bcrypt.hashSync(`${ctx.request.body.password}`, salt);
            ctx.request.body.password = hash  
        } 
        updateUser = await user.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if(!updateUser) {
            ctx.throw('用户不存在，更新失败')
        }
        const res = ctx.request.body.username ? { _id: updateUser._id, username: ctx.request.body.username } : updateUser
        ctx.body = {
            res,
            message: '更新成功',
            status: 200,
        }
    }

    async userdelete(ctx) {
        let deleteUser = await user.deleteOne({_id: ctx.params.id})
        if(deleteUser.deletedCount>0) {
            console.log('1')
            ctx.status = 204
            ctx.body = {
                message: '删除成功',
                status: 204
            }
        }
    }

    async listFollowing(ctx) {
        const followUser = await user.findById(ctx.params.id).select("+following").populate("following")
        if(!user) {ctx.throw(404)}
        ctx.body = followUser.following
    }

    async follow(ctx) {
        const me = await user.findById(ctx.state.user.id).select("+following")
        if(!me.following.map(id => id.toString()).includes(ctx.params.id)) {
            me.following.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }

    async listFollowers(ctx) {
        // 查询数据库中following 包含 这个用户tx.params.id 的数据
        const users = await user.find({following: ctx.params.id})
        ctx.body = users
    }

    async unfollow(ctx) {
        // 首页要知道是谁在请求这个接口 通过 ctx.state.user._id 获取 请求这个接口用户的 id
        const me = await user.findById(ctx.state.user.id).select('+following')
        // 获取 index 
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
        if(index>-1) {
            me.following.splice(index, 1)
            me.save()
        }
        ctx.status = 204
    }
}

module.exports = new users()