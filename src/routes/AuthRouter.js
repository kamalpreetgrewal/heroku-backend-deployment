const express = require('express');
const AuthRouter = express.Router();
const axios = require('axios');
const cachios = require('cachios');

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

    let combinedRes = [];

    let postAuths = postsRes.map((post) => {
    	return (post.author);
    });

    for (author of authRes) {
    	if (postAuths.includes(author.firstName + " " + author.lastName)) {
    		let _posts = postsRes.filter((post) => {
				return post.authorId === author.id;
			});
			let _tags = _posts.reduce((temp, post) => {
    				temp.push(post.tags);
    				return temp;
    			}, []);
			_tags = Array.from(new Set([].concat(..._tags)));
    		let authorObj = {
    			bio: author.bio,
    			firstName: author.firstName,
    			id: author.id,
    			lastName: author.lastName,
    			posts: _posts,
    			tags: _tags,
    			totalLikeCount: _posts.reduce((total, post) => post.likes + total, 0),
    			totalReadCount: _posts.reduce((total, post) => post.reads + total, 0)
    		};
    		combinedRes.push(authorObj);
    	}
    }
    res.send({"authors": combinedRes});
  }));

	
	
	
	// if (postsInfo.data.posts.author === (authInfo.data.authors.firstName +
	// 										authInfo.data.authors.lastName)) {
	// 	combinedResults['bio'] = authInfo.data.authors.bio;
	// console.log(combinedResults);
	// }
});

module.exports = AuthRouter;
