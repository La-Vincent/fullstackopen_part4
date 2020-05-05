const listHelpers = require('../utils/list_helper');


describe('Testing list listHelpers', () => {
	test('dummy method always returns 1', () => {
		const blogs = [];
		const result = listHelpers.dummy(blogs)
		expect(result).toBe(1);
	})

})

describe('Total Likes', () => {
	const singleBlog = { title: "hello bob", author: "marty mc fly", url: "jim jaming" };
	test('should return 0 is there are no blogs', () => {
		const blogs = [];
		const total = listHelpers.totalLikes(blogs);
		expect(total).toBe(0);
	});
	test('should return the sum of one blog', () => {
		const blogs = Array.of({...singleBlog, likes: 2});
		const total = listHelpers.totalLikes(blogs);
		expect(total).toBe(2);
	})
	test('should return the sum of blog likes', () => {
		const blogs = Array.of({ ...singleBlog, likes: 2 }, { ...singleBlog, likes: 4 }, { ...singleBlog, likes: 6 });
		const total = listHelpers.totalLikes(blogs);
		expect(total).toBe(12);
	});
});

describe('Favorite Blog', () => {
	const blog = { title: 'lets get it', author: 'Not you', url: 'maybe here', likes: 5 };
	test('should return a blog if there is only one blog', () => {
		const favorite = listHelpers.favoriteBlog([blog])
		expect(favorite).toEqual(blog);
	});
	test('should return the blog with the most likes', () => {
		const newFavoriteBlog = { ...blog, likes: 20 };
		const favorite = listHelpers.favoriteBlog([blog, newFavoriteBlog]);
		expect(favorite).toEqual(newFavoriteBlog);
	});
	test('should return an empty array if there are no blogs', () => {
		const blogs = [];
		const favorite = listHelpers.favoriteBlog(blogs);
		expect(favorite.length).toBe(0);
	});
})

describe('Most Blogs', () => {
	const blog = { title: 'this is a gneeric name', url: 'hi i generic', likes: 1 };
	const blogs = [
		{ ...blog, author: 'James TW' },
		{ ...blog, author: 'Margret Grounder' },
		{ ...blog, author: 'Steven Nightly' },
		{ ...blog, author: 'James TW' },
		{ ...blog, author: 'James TW' },
	];
	const topBlogger = {
		author: "James TW",
		blogs: 3
	};
	test('should return null if there are no blogs', () => {
		const blogs = [];
		const mostBlogs = listHelpers.mostBlogs(blogs);
		expect(mostBlogs).toBe(null);
	});
	test('should return the author with the most blogs', () => {
		const blogger = listHelpers.mostBlogs(blogs);
		expect(blogger).toEqual(topBlogger);
	});
	test('should return the first author if there is a tie between authors', () => {
		const updatedBlogs = [...blogs, { ...blog, author: 'Steven Nightly' }, { ...blog, author: 'Steven Nightly' }]
		const blogger = listHelpers.mostBlogs(updatedBlogs);
		expect(blogger).toEqual(topBlogger)
	});
});

describe('Most Likes', () => {
	const blog = { title: 'this is a gneeric name', url: 'hi i generic' };
	const blogs = [
		{ ...blog, author: 'James TW', likes: 2 },
		{ ...blog, author: 'Margret Grounder', likes: 15 },
		{ ...blog, author: 'Steven Nightly', likes: 7 },
		{ ...blog, author: 'James TW', likes: 1 },
		{ ...blog, author: 'James TW', likes: 1 },
	];
	const mostLikedBlogger = {
		author: "Margret Grounder",
		likes: 15
	};
	test('should reutnr null if there are no blogs', () => {
		const blogs = [];
		const blogger = listHelpers.mostLiked(blogs);
		expect(blogger).toBe(null);
	});
	test('should return blogger if there is only one blogger', () => {
		const single = { author: 'hello world', likes: 2 };
		const blogger = listHelpers.mostLiked([single]);
		expect(blogger).toEqual(single);
	})
	test('should return the most liked blogger with author name and total likes', () => {
		const blogger = listHelpers.mostLiked(blogs);
		expect(blogger).toEqual(mostLikedBlogger);
	})
	test('should return the first most liked blogger, if there are multiple bloggers with the same amount of likes', () => {
		const firstMostLikedBlogger = { author: 'Ashley Winters', likes: 15 };
		const updatedBlogs = [firstMostLikedBlogger, ...blogs];
		const blogger = listHelpers.mostLiked(updatedBlogs);
		expect(blogger).toEqual(firstMostLikedBlogger);
	});
})