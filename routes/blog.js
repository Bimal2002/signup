const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // For development, you might need to disable SSL validation
  }
});

// Create a new blog
router.post('/', async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    
    // Insert new blog into the database
    const queryText = 'INSERT INTO blogs (title, content, author_id) VALUES ($1, $2, $3) RETURNING *';
    const values = [title, content, authorId];
    const result = await pool.query(queryText, values);
    
    const newBlog = result.rows[0];
    
    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing blog
router.put('/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, content } = req.body;

    // Update blog in the database
    const queryText = 'UPDATE blogs SET title = $1, content = $2 WHERE id = $3 RETURNING *';
    const values = [title, content, blogId];
    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const updatedBlog = result.rows[0];

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    // Retrieve all blogs from the database
    const queryText = 'SELECT * FROM blogs';
    const result = await pool.query(queryText);

    const blogs = result.rows;

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blogId = req.params.id;

    // Retrieve blog from the database
    const queryText = 'SELECT * FROM blogs WHERE id = $1';
    const values = [blogId];
    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const blog = result.rows[0];

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
