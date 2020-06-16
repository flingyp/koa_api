const Router = require('koa-router')
// 接口函数
const {userstest, upload} = require('../controllers/home')


const router = new Router({prefix: '/home'})



/** 
 * 测试接口
 */
router.get('/test', userstest)

/**
 * 图片上传接口
 */
router.post('/upload', upload)


module.exports = router