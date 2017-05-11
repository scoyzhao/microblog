/*
	Post model
 */

"use strict";

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: String,
    content: String,
    time: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
