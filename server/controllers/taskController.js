import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { validateTaskInput } from '../validators/taskValidator.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, status, priority, dueDate } = req.body;
    const { valid, errors } = validateTaskInput({ title, project, status, priority, assignedTo, dueDate });

    if (!valid) {
      return res.status(400).json({ success: false, errors });
    }

    const projectRecord = await Project.findById(project).populate('owner members');
    if (!projectRecord) {
      return res.status(400).json({ success: false, message: 'Project must be valid' });
    }

    const isProjectMember = projectRecord.owner._id.toString() === req.user.id ||
      projectRecord.members.some((member) => member._id.toString() === req.user.id);

    if (!isProjectMember) {
      return res.status(403).json({ success: false, message: 'Unauthorized to create tasks for this project' });
    }

    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(400).json({ success: false, message: 'Assigned user must be valid' });
      }
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user.id,
      status: status || 'Todo',
      priority: priority || 'Low',
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    const populatedTask = await task
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    })
      .sort({ createdAt: -1 })
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title owner members')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const isCreator = task.createdBy._id.equals(req.user.id);
    const isAssigned = task.assignedTo && task.assignedTo._id.equals(req.user.id);
    const isProjectOwner = task.project && task.project.owner.equals(req.user.id);
    const isProjectMember = task.project && task.project.members.some((member) => member._id.equals(req.user.id));

    if (!isCreator && !isAssigned && !isProjectOwner && !isProjectMember) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project', 'owner members');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, project, assignedTo, status, priority, dueDate } = req.body;
    const { valid, errors } = validateTaskInput({ title, project, status, priority, assignedTo, dueDate });

    if (!valid) {
      return res.status(400).json({ success: false, errors });
    }

    const projectRecord = await Project.findById(project).populate('owner members');
    if (!projectRecord) {
      return res.status(400).json({ success: false, message: 'Project must be valid' });
    }

    const isCreator = task.createdBy.equals(req.user.id);
    const isAssigned = task.assignedTo ? task.assignedTo.equals(req.user.id) : false;
    const isProjectOwner = task.project && task.project.owner.equals(req.user.id);
    const isProjectMember = task.project && task.project.members.some((member) => member._id.equals(req.user.id));

    if (!isCreator && !isAssigned && !isProjectOwner && !isProjectMember) {
      return res.status(403).json({ success: false, message: 'Only task owner, assignee, or project member can update this task' });
    }

    const isAuthorizedForTargetProject =
      projectRecord.owner._id.equals(req.user.id) ||
      projectRecord.members.some((member) => member._id.equals(req.user.id)) ||
      isCreator;

    if (!isAuthorizedForTargetProject) {
      return res.status(403).json({ success: false, message: 'Unauthorized to move task to this project' });
    }

    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(400).json({ success: false, message: 'Assigned user must be valid' });
      }
    }

    task.title = title;
    task.description = description || '';
    task.project = project;
    task.assignedTo = assignedTo;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;

    await task.save();
    const populatedTask = await task
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({ success: true, data: populatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project', 'owner');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (!task.project.owner.equals(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Only project owner can delete tasks' });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};
