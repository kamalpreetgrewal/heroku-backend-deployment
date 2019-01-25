const express = require('express');
const AuthRouter = express.Router();
const axios = require('axios');
const cachios = require('cachios');

// Request URLs
const postUrl = 'https://hatchways.io/api/assessment/blog/posts?tag=';
const authUrl = 'https://hatchways.io/api/assessment/blog/authors';

AuthRouter.get('/authors', async (req, res) => {
	// get data from both apis
	axios.all([
		cachios.get(authUrl),
		cachios.get(postUrl)
		])
	.then(axios.spread((authInfo, postsInfo) => {
    
    // do something with both responses'
    let authRes = (authInfo.data.authors);
    let postsRes = (postsInfo.data.posts);

    // combined response storage
    let combinedRes = [];

    // iterate through posts to keep track of post authors
    let postAuths = postsRes.map((post) => {
    	return (post.author);
    });

    // iterate through author response from api and find corresponding posts
    for (author of authRes) {
    	if (postAuths.includes(author.firstName + " " + author.lastName)) {
    		// Filter posts to find match with their authors
    		let tempPosts = postsRes.filter((post) => {
				return post.authorId === author.id;
			});
			// Find tags associated to posts of each author
			let tempTags = tempPosts.reduce((temp, post) => {
    				temp.push(post.tags);
    				return temp;
    			}, []);
			// unique tags
			tempTags = Array.from(new Set([].concat(...tempTags)));

			// set up response object for each author
    		let authorObj = {
    			bio: author.bio,
    			firstName: author.firstName,
    			id: author.id,
    			lastName: author.lastName,
    			posts: tempPosts,
    			tags: tempTags,
    			totalLikeCount: tempPosts.reduce((total, post) => post.likes + total, 0),
    			totalReadCount: tempTags.reduce((total, post) => post.reads + total, 0)
    		};
    		combinedRes.push(authorObj);
    	}
    }
    // send response to server
    res.send({"authors": combinedRes});
  }));
});

module.exports = AuthRouter;