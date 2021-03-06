const Router = require('koa-router')
// 接口函数
const {allusers,userstest, userregister, userlogin, userupdate, userdelete, getuser, listFollowing, follow, listFollowers, unfollow}  = require('../controllers/users')
const koaJwt = require('koa-jwt')
const {secret} = require('../config/secret')
const user = require('../models/user')

const router = new Router({prefix: '/user'})

// token 验证
const auth = koaJwt({ secret })
// 用户验证  当 token验证后 检测调用敏感接口 （例如 更新用户信息 删除用户） 是不是自己。 防止他人携带token后修改信息
const checkOwner = async (ctx, next) => {
    if (ctx.params.id !== ctx.state.user.id) {
      ctx.throw(403, '该用户没有此权限')
    }
    await next()
}
// 检查用户是否存在
const checkUserExist = async (ctx, next) => {
  const isUser = await user.findById(ctx.params.id)
  if(!isUser) {ctx.throw(404, '用户不存在')}
  await next()
}

/** 
 * 测试接口
 */
router.get('/test', userstest)

/**
 * 显示用户列表接口
 * 参数： per_page 一页多少条数据  page 获取第几页的数据
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
 * 查询特定用户接口
 * 查询地址： http://localhost:3000/user/getuser/特定用户id?fields=xxx;xxx(想要查询的字段)
 */
router.get('/getuser/:id', getuser)

/**
 * 更新用户接口
 */
router.put('/update/:id', auth,checkOwner, userupdate)

/**
 * 删除用户接口
 */
router.delete('/delete/:id', auth, checkOwner,userdelete)

/**
 * 获取用户关注 接口
 */
router.get('/:id/following', listFollowing)

/**
 * 实现用户关注 接口
 */
router.put('/following/:id', auth, checkUserExist, follow)

/**
 * 获取粉丝列表 
 */
router.get('/:id/listFollowers', listFollowers)

/**
 * 取消关注接口
 */
router.delete('/following/:id', auth, checkUserExist, unfollow) 

module.exports = router