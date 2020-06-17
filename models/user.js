const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true,
        select: false
    },
    mobile: {
        type: Number
    },
    avatar_url: { type: String }, // 头像
    gender: {type: String, enum: ['male', 'female'], default: 'male', required: true}, // 性别
    headline: {type: String},  // 一句话介绍
    locations: {    // 居住地
        type: [{
            type: String
        }],
        select: false
    },
    business: {type: String, select: false}, // 所在行业
    employments: { 
        type: [{         // 职业经历  （公司 和 职位）
            company: {type: String}, // 公司
            job: {type: String}  // 职位
        }],
        select: false
      },
      educations: {   // 教育简历 
          type: [{
              scholls: {type: String},  // 学校
              major: {type: String},    // 专业
              diploma: {type: Number, enum: [1,2,3,4,5]},  // 学历
              entrance_year: {type: Number},   // 入学年份
              graduation_year: {type: Number}  // 毕业年份
          }],
          select: false
      }
})

module.exports = mongoose.model('user', userSchema)