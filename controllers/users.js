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

    async userupdate(ctx) {
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
}

module.exports = new users()