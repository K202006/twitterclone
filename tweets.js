const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');

// Middleware to check if logged in
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash('error', 'You must be logged in to do that.');
    res.redirect('/login');
};

router.get('/tweets', async (req, res) => {
    try {
        const tweets = await Tweet.find().sort({ createdAt: -1 });
        res.render('index', { tweets });
    } catch (err) {
        req.flash('error', 'Could not fetch tweets.');
        res.redirect('/');
    }
});

router.post('/tweets', isLoggedIn, async (req, res) => {
    try {
        const { tweetContent } = req.body;
        const newTweet = new Tweet({
            tweetContent,
            username: req.user.username
        });
        await newTweet.save();
        req.flash('success', 'Tweet added successfully!');
        res.redirect('/tweets');
    } catch (err) {
        req.flash('error', 'Error creating tweet.');
        res.redirect('/tweets');
    }
});

router.get('/tweets/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if(tweet.username !== req.user.username) {
            req.flash('error', 'You can only edit your own tweets.');
            return res.redirect('/tweets');
        }
        res.render('edit', { tweet });
    } catch (err) {
        req.flash('error', 'Error finding tweet.');
        res.redirect('/tweets');
    }
});

router.put('/tweets/:id', isLoggedIn, async (req, res) => {
    try {
        const { tweetContent } = req.body;
        const tweet = await Tweet.findById(req.params.id);
        if(tweet.username !== req.user.username) {
            req.flash('error', 'You can only edit your own tweets.');
            return res.redirect('/tweets');
        }
        tweet.tweetContent = tweetContent;
        await tweet.save();
        req.flash('success', 'Tweet updated!');
        res.redirect('/tweets');
    } catch (err) {
        req.flash('error', 'Error updating tweet.');
        res.redirect('/tweets');
    }
});

router.delete('/tweets/:id/delete', isLoggedIn, async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if(tweet.username !== req.user.username) {
            req.flash('error', 'You can only delete your own tweets.');
            return res.redirect('/tweets');
        }
        await Tweet.findByIdAndDelete(req.params.id);
        req.flash('success', 'Tweet deleted!');
        res.redirect('/tweets');
    } catch (err) {
        req.flash('error', 'Error deleting tweet.');
        res.redirect('/tweets');
    }
});

module.exports = router;
