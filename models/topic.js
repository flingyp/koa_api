const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TopicSchema = new Schema({
    name: {type: String, required: true},  // 话题 名字
    avatar_url: {type: String},  // 话题 图标
    introduction: {type: String, select: true},   // 话题 简介
})

module.exports = mongoose.model('Topic', TopicSchema)