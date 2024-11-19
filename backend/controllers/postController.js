const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
exports.createPost = async (req, res) => {
    const { title, content, tags } = req.body;

    try {
        const post = new Post({
            user: req.user.id, // Assuming `req.user` contains the authenticated user
            title,
            content,
            tags,
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
};

// Get all posts (with optional tag filtering)
exports.getPosts = async (req, res) => {
    const { tag } = req.query; // Retrieve the tag from query parameters

    try {
        const filter = tag ? { tags: tag } : {}; // If a tag is provided, filter by it
        const posts = await Post.find(filter)
            .populate('user', 'name') // Populating user info
            .sort({ createdAt: -1 }); // Reverse chronological order

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
    }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'name');
        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch post', error: error.message });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    const { title, content, tags } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check if the user is the owner of the post
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this post' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.tags = tags || post.tags;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post', error: error.message });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check if the user is the owner of the post
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        await post.remove();
        res.json({ message: 'Post removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete post', error: error.message });
    }
};

// Like a post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(req.user.id)) {
            return res.status(400).json({ message: 'You already liked this post' });
        }

        post.likes.push(req.user.id);
        await post.save();

        res.json({ message: 'Post liked successfully', likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: 'Failed to like post', error: error.message });
    }
};

// Comment on a post
exports.commentOnPost = async (req, res) => {
    const { content } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = {
            user: req.user.id,
            content,
        };

        post.comments.push(comment);
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', comments: post.comments });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add comment', error: error.message });
    }
};
