import mongoose from 'mongoose';

const statusOptions = ['Active', 'Completed', 'Archived'];
const priorityOptions = ['Low', 'Medium', 'High'];

export const validateProjectInput = ({ title, status, priority, members }) => {
  const errors = [];

  if (!title || !title.trim()) {
    errors.push('Title is required');
  }

  if (status && !statusOptions.includes(status)) {
    errors.push('Invalid status value');
  }

  if (priority && !priorityOptions.includes(priority)) {
    errors.push('Invalid priority value');
  }

  if (members !== undefined) {
    if (!Array.isArray(members)) {
      errors.push('Members must be an array');
    } else if (members.some((member) => !mongoose.Types.ObjectId.isValid(member))) {
      errors.push('All member IDs must be valid');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
