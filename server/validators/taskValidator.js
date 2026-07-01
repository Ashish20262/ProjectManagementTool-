import mongoose from 'mongoose';

const statusOptions = ['Todo', 'In Progress', 'Done'];
const priorityOptions = ['Low', 'Medium', 'High'];

export const validateTaskInput = ({ title, project, status, priority, assignedTo, dueDate }) => {
  const errors = [];

  if (!title || !title.trim()) {
    errors.push('Title is required');
  }

  if (!project) {
    errors.push('Project is required');
  } else if (!mongoose.Types.ObjectId.isValid(project)) {
    errors.push('Project ID must be valid');
  }

  if (status && !statusOptions.includes(status)) {
    errors.push('Invalid status value');
  }

  if (priority && !priorityOptions.includes(priority)) {
    errors.push('Invalid priority value');
  }

  if (assignedTo !== undefined && assignedTo !== '') {
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      errors.push('Assigned user ID must be valid');
    }
  }

  if (dueDate !== undefined && dueDate !== '') {
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) {
      errors.push('Due date must be a valid date');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
