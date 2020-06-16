const Router = require('koa-router')
// 接口函数
const {allusers,userstest, userregister, userlogin, userupdate, userdelete}  = require('../controllers/users')
const koaJwt = require('koa-jwt')
const {secret} = require('../config/secret')

const router = new Router({prefix: '/user'})

// token 验证
const auth = koaJwt({ secret })
// 用户验证  当 token验证后 检测调用敏感接口 （例如 更新用户信息 删除用户） 是不是自己。 防止他人携带token后修改信息
const checkOwner = async (ctx, next) => {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '该用户没有此权限')
    }
    await next()
}

/** 
 * 测试接口
 */
router.get('/test', userstest)

/**
 * 显示用户列表接口
 */
router.get('/allusers', allusers)

/** 
 * 用户注册接口
 */
router.post('/register', userregister)

/**
 * 用户登录接口
 */
router.post('/login', userlogin)

/**
 * 更新用户接口
 */
router.put('/update/:id', auth,checkOwner, userupdate)

/**
 * 删除用户接口
 */
router.delete('/delete/:id', auth, checkOwner,userdelete)


module.exports = router