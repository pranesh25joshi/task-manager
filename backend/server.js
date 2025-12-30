import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from './database/db.js';
import User from './models/User.js';
import Task from './models/Task.js';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json());

connectDB();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};


app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashedPassword,
      name
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    await User.findByIdAndDelete(userId);
    await Task.deleteMany({ $or: [{ assignedTo: userId }, { createdBy: userId }] });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    
    let filter = { assignedTo: req.user.id };
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }

    const skip = (page - 1) * limit;
    
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name username')
      .populate('createdBy', 'name username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Task.countDocuments(filter);
    
    res.json({
      tasks,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name username')
      .populate('createdBy', 'name username');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const isAssigned = task.assignedTo.some(user => user._id.toString() === req.user.id);
    if (!isAssigned && task.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    
    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Title and due date are required' });
    }
    
    let assignedUsers = [];
    if (assignedTo && Array.isArray(assignedTo) && assignedTo.length > 0) {
      assignedUsers = assignedTo;
    } else {
      assignedUsers = [req.user.id];
    }
    
    const newTask = await Task.create({
      title,
      description: description || '',
      dueDate,
      status: 'pending',
      priority: priority || 'medium',
      assignedTo: assignedUsers,
      createdBy: req.user.id
    });
    
    const populatedTask = await Task.findById(newTask._id)
      .populate('assignedTo', 'name username')
      .populate('createdBy', 'name username');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const isAssigned = task.assignedTo.some(userId => userId.toString() === req.user.id);
    if (!isAssigned && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { title, description, dueDate, status, priority, assignedTo } = req.body;
    
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignedTo && Array.isArray(assignedTo)) task.assignedTo = assignedTo;
    
    await task.save();
    
    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name username')
      .populate('createdBy', 'name username');
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const isAssigned = task.assignedTo.some(userId => userId.toString() === req.user.id);
    if (!isAssigned && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
