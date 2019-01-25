const express = require('express');
const PostRouter = express.Router();
const axios = require('axios');
const cachios = require('cachios');

const postUrl = 'https://hatchways.io/api/assessment/blog/posts?tag=';

PostRouter.get('/ping', (req, res) => {
	res.status(200).json({success: true});
});

PostRouter.get('/posts', async (req, res) => {
	// Get query parameters
	var tags = req.query.tags;
	let sortBy = req.query.sortBy;
	let direction = req.query.direction || 'asc';

	// Send error messages when query parameters are invalid
	if (tags === undefined){
		res.send({error: 'Tags parameter is required'});
	}
	if (sortBy !== undefined && !(['id','likes','popularity','reads'].includes(sortBy))) {
		res.send({error: 'sortBy parameter is invalid'});
	}
	if (!(['asc','desc'].includes(direction))) {
		res.send({error: 'direction parameter is invalid'});
	}

	// Save tags in a list, to iterate through them later
	let tagList = [];
	if (tags.indexOf(',') === -1) {
		tagList.push(tags);
	} else {
		tagList = tags.split(',');
	}

	// Fetch data for all posts corresponding to tags
	let promises = tagList.map(async tag => {
		var tempURL = postUrl + tag;
		var tempResults = await cachios.get(tempURL);
		return tempResults.data.posts;
	});
	let results = await Promise.all([...promises]);
	results = [].concat(...results);

	// results should be unique for all if multiple tags are specified
	if (tagList.length > 1) {
		results = unique(results, "id");
	}

	// Sort list if order has been specified	
	if (sortBy !== undefined) {
		results.sort(compareValues(sortBy, direction));	
	}
	
	// Send processed results
	res.send({"posts":results});
});

// 
function unique(array, propertyName) {
	return array.filter((e, i) =>
		array.findIndex(a => a[propertyName] === e[propertyName]) === i);
}

// function for dynamic sorting
function compareValues(key, direction='asc') {
	return function(a, b) {
		if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
		// property doesn't exist on either object
		return 0;
    }

    const varA = a[key];
    const varB = b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (direction == 'desc') ? (comparison * -1) : comparison
    );
  };
}

module.exports = PostRouter;