// const express = require('express');
// const {
//     createPost,
//     getPosts,
//     getPostsByTags,
//     getPostById,
//     updatePost,
//     deletePost,
//     likePost,
//     commentOnPost,
// } = require('../controllers/postController');
// const { protect } = require('../middlewares/authMiddleware');
// const router = express.Router();

// router.route('/')
//     .get(getPosts)          // Fetch all posts with optional tag filtering
//     .post(protect, createPost); // Create a new post (protected)

// router.route('/tags')
//     .get(getPostsByTags); // Fetch posts categorized by tags

// router.route('/:id')
//     .get(getPostById)       // Fetch a specific post
//     .put(protect, updatePost)  // Update a post (protected)
//     .delete(protect, deletePost); // Delete a post (protected)

// router.route('/:id/like')
//     .post(protect, likePost);  // Like a post (protected)

// router.route('/:id/comment')
//     .post(protect, commentOnPost); // Comment on a post (protected)

// module.exports = router;


const express = require('express');
const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protect, createPost);         // Create a post
router.get('/', getAllPosts);                 // Get all posts
router.get('/:id', getPostById);              // Get post by ID
router.put('/:id', protect, updatePost);      // Update a post
router.delete('/:id', protect, deletePost);   // Delete a post

module.exports = router;
