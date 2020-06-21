const Router = require('koa-router')
// 接口函数
const {topictest, find, findById, create, update}  = require('../controllers/topic')
const koaJwt = require('koa-jwt')
const {secret} = require('../config/secret')
const topic = require('../models/topic')
const user = require('../models/user')

const router = new Router({prefix: '/topic'})

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
router.get('/test', topictest)

/**
 * 获取话题接口
 */
router.get('/', find)

/**
 * 查询特定的话题接口
 */
router.get('/:id', findById)

/**
 * 创建话题接口
 */
router.post('/', auth, create)

/**
 * 更新话题接口
 */
router.patch('/:id', auth, update)

module.exports = router