/*
    For user
 */

"use strict";

const Post = require('../model/post.js');

module.exports = {

    user: function(req, res) {
        Post.find(function(err, posts) {
            if (err) {
                posts = [];
            }
            res.render('user', {
                posts: posts
            })
        });
    },

    say: function(req, res) {
        var newPost = new Post({
            user: req.user.username,
            content: req.body.content,
        });

        newPost.save(function(err) {
            if (err) {
                req.session.flash = {
                    type: 'danger',
                    intro: 'E_OF_USER   ',
                    message: '如果出现这个，那么我也不知道错误是什么',
                }
                return res.redirect('/user');
            }

            Post.find(function(err, posts) {
                if (err) {
                    posts = [];
                }
                res.render('user', {
                    posts: posts,
                });
            });
        });
    },

    getUser: function(req, res) {
        Post.find({ user: req.params.user }, function(err, posts) {
            if (err) {
                posts = [];
            }
            res.render('user', {
                posts: posts
            })
        });
    },

};
