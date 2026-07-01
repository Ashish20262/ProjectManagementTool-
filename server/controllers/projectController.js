import Project from '../models/Project.js';
import { validateProjectInput } from '../validators/projectValidator.js';

export const createProject = async (req, res, next) => {
  try {
    const { title, description, members, status, priority } = req.body;
    const { valid, errors } = validateProjectInput({ title, status, priority, members });

    if (!valid) {
      return res.status(400).json({ success: false, errors });
    }

    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
      members: Array.isArray(members) ? members : [],
      status: status || 'Active',
      priority: priority || 'Low',
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    })
      .sort({ createdAt: -1 })
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!project.owner.equals(req.user.id) && !project.members.some((member) => member._id.equals(req.user.id))) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!project.owner.equals(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Only the owner can update this project' });
    }

    const { title, description, members, status, priority } = req.body;
    const { valid, errors } = validateProjectInput({ title, status, priority, members });

    if (!valid) {
      return res.status(400).json({ success: false, errors });
    }

    project.title = title;
    project.description = description || '';
    project.members = Array.isArray(members) ? members : project.members;
    project.status = status || project.status;
    project.priority = priority || project.priority;

    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!project.owner.equals(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Only the owner can delete this project' });
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};
