import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const projectQuery = { $or: [{ owner: userId }, { members: userId }] };
    const taskQuery = { $or: [{ createdBy: userId }, { assignedTo: userId }] };

    const [
      totalProjects,
      activeProjects,
      completedProjects,
      archivedProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      overdueTasks,
    ] = await Promise.all([
      Project.countDocuments(projectQuery),
      Project.countDocuments({ ...projectQuery, status: 'Active' }),
      Project.countDocuments({ ...projectQuery, status: 'Completed' }),
      Project.countDocuments({ ...projectQuery, status: 'Archived' }),
      Task.countDocuments(taskQuery),
      Task.countDocuments({ ...taskQuery, status: 'Todo' }),
      Task.countDocuments({ ...taskQuery, status: 'In Progress' }),
      Task.countDocuments({ ...taskQuery, status: 'Done' }),
      Task.countDocuments({ ...taskQuery, priority: 'High' }),
      Task.countDocuments({ ...taskQuery, priority: 'Medium' }),
      Task.countDocuments({ ...taskQuery, priority: 'Low' }),
      Task.countDocuments({
        ...taskQuery,
        dueDate: { $lt: now },
        status: { $ne: 'Done' },
      }),
    ]);

    const recentProjects = await Project.find(projectQuery)
      .select('title status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTasks = await Task.find(taskQuery)
      .select('title status priority dueDate createdAt project')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        completedProjects,
        archivedProjects,
        totalTasks,
        todoTasks,
        inProgressTasks,
        completedTasks,
        highPriorityTasks,
        mediumPriorityTasks,
        lowPriorityTasks,
        overdueTasks,
        recentProjects: recentProjects.map((project) => ({
          id: project.id,
          title: project.title,
          status: project.status,
          createdAt: project.createdAt,
        })),
        recentTasks: recentTasks.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          project: task.project ? { id: task.project.id, title: task.project.title } : null,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardCharts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectQuery = { $or: [{ owner: userId }, { members: userId }] };
    const taskQuery = { $or: [{ createdBy: userId }, { assignedTo: userId }] };

    const [activeCount, completedCount, archivedCount, todoCount, inProgressCount, doneCount, highPriorityCount, mediumPriorityCount, lowPriorityCount] =
      await Promise.all([
        Project.countDocuments({ ...projectQuery, status: 'Active' }),
        Project.countDocuments({ ...projectQuery, status: 'Completed' }),
        Project.countDocuments({ ...projectQuery, status: 'Archived' }),
        Task.countDocuments({ ...taskQuery, status: 'Todo' }),
        Task.countDocuments({ ...taskQuery, status: 'In Progress' }),
        Task.countDocuments({ ...taskQuery, status: 'Done' }),
        Task.countDocuments({ ...taskQuery, priority: 'High' }),
        Task.countDocuments({ ...taskQuery, priority: 'Medium' }),
        Task.countDocuments({ ...taskQuery, priority: 'Low' }),
      ]);

    const projectStatusChart = [
      { status: 'Active', count: activeCount },
      { status: 'Completed', count: completedCount },
      { status: 'Archived', count: archivedCount },
    ];

    const taskStatusChart = [
      { status: 'Todo', count: todoCount },
      { status: 'In Progress', count: inProgressCount },
      { status: 'Done', count: doneCount },
    ];

    const priorityChart = [
      { priority: 'High', count: highPriorityCount },
      { priority: 'Medium', count: mediumPriorityCount },
      { priority: 'Low', count: lowPriorityCount },
    ];

    res.status(200).json({
      success: true,
      data: {
        projectStatusChart,
        taskStatusChart,
        priorityChart,
      },
    });
  } catch (error) {
    next(error);
  }
};
