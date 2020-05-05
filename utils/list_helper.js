const dummy = blogs => 1;

const totalLikes = blogs => blogs.reduce((total, blog) => blog.likes + total, 0);

const favoriteBlog = blogs => {
	return blogs.length ? blogs.reduce((mostLiked, current) => {
		return mostLiked.likes > current.likes ? mostLiked : current;
	}) : [];
}

const mostBlogs = blogs => {
	if (!blogs.length) {
		return null;
	}
	const bloggers = {};
	const topBlogger = {
		blogs: 0
	}
	blogs.forEach(blog => {
		const { author } = blog;
		bloggers[author] = bloggers[author] ? bloggers[author] + 1 : 1;
		const authorBlogTotal = bloggers[author];
		if (authorBlogTotal > topBlogger.blogs) {
			topBlogger.author = author;
			topBlogger.blogs = authorBlogTotal;
		}
	})
	return topBlogger;
}

const mostLiked = blogs => {
	//takes the blogs and calculates the most liked 
	if (!blogs.length) {
		return null;
	}
	const topBlogger = {
		likes: 0
	}
	blogs.reduce((bloggerLikes, nextBlogger) => {
		const { author, likes } = nextBlogger;
		bloggerLikes[author] = bloggerLikes[author] ? bloggerLikes[author] + likes : likes;
		if (bloggerLikes[author] > topBlogger.likes) {
			topBlogger.author = author;
			topBlogger.likes = bloggerLikes[author];
		}
		return bloggerLikes;
	}, {})
	return topBlogger;
}
	
module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLiked
}
