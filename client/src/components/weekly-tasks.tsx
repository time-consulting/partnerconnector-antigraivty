import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  TargetIcon, 
  PlusIcon, 
  BellIcon,
  CalendarIcon,
  TrendingUpIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WeeklyTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  category: 'leads' | 'deals' | 'training' | 'follow-up' | 'custom';
  reminderSet: boolean;
}

interface WeeklyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: string;
}

export default function WeeklyTasks() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'leads' as const,
    dueDate: ''
  });

  // Initialize with default weekly tasks and goals
  useEffect(() => {
    const defaultTasks: WeeklyTask[] = [
      {
        id: '1',
        title: 'Upload 10 new leads',
        description: 'Add fresh prospects to your CRM pipeline',
        priority: 'high',
        completed: false,
        dueDate: getWeekEndDate(),
        category: 'leads',
        reminderSet: false
      },
      {
        id: '2',
        title: 'Complete Dojo training module',
        description: 'Master payment processing sales techniques',
        priority: 'medium',
        completed: false,
        dueDate: getWeekEndDate(),
        category: 'training',
        reminderSet: false
      },
      {
        id: '3',
        title: 'Submit 2 deals applications',
        description: 'Convert qualified leads into active deals',
        priority: 'high',
        completed: false,
        dueDate: getWeekEndDate(),
        category: 'deals',
        reminderSet: false
      },
      {
        id: '4',
        title: 'Follow up with 5 prospects',
        description: 'Reconnect with potential clients who showed interest',
        priority: 'medium',
        completed: false,
        dueDate: getWeekEndDate(),
        category: 'follow-up',
        reminderSet: false
      }
    ];

    const defaultGoals: WeeklyGoal[] = [
      {
        id: '1',
        title: 'New Leads Added',
        target: 15,
        current: 3,
        unit: 'leads',
        category: 'prospecting'
      },
      {
        id: '2',
        title: 'Referrals Submitted',
        target: 3,
        current: 1,
        unit: 'deals',
        category: 'conversion'
      },
      {
        id: '3',
        title: 'Training Modules',
        target: 2,
        current: 0,
        unit: 'modules',
        category: 'education'
      }
    ];

    setTasks(defaultTasks);
    setGoals(defaultGoals);
  }, []);

  function getWeekEndDate(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilSunday = 7 - dayOfWeek;
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + daysUntilSunday);
    return sunday.toISOString().split('T')[0];
  }

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast({
        title: "Task Completed! 🎉",
        description: `Great job completing "${task.title}"`,
      });
    }
  };

  const toggleReminder = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, reminderSet: !task.reminderSet }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    toast({
      title: task?.reminderSet ? "Reminder Removed" : "Reminder Set",
      description: task?.reminderSet 
        ? "You'll no longer receive reminders for this task"
        : "We'll remind you about this task via email",
    });
  };

  const addCustomTask = () => {
    if (!newTask.title.trim()) return;

    const customTask: WeeklyTask = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      completed: false,
      dueDate: newTask.dueDate || getWeekEndDate(),
      category: newTask.category,
      reminderSet: false
    };

    setTasks([...tasks, customTask]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'leads',
      dueDate: ''
    });
    setShowAddTask(false);

    toast({
      title: "Task Added",
      description: "Your custom task has been added to this week's goals",
    });
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'leads': return <TargetIcon className="w-4 h-4" />;
      case 'deals': return <TrendingUpIcon className="w-4 h-4" />;
      case 'training': return <ClockIcon className="w-4 h-4" />;
      case 'follow-up': return <CalendarIcon className="w-4 h-4" />;
      default: return <CheckCircleIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Weekly Progress Overview */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TargetIcon className="w-6 h-6 text-blue-600" />
              Weekly Goals & Tasks
            </CardTitle>
            <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2" data-testid="button-add-task">
                  <PlusIcon className="w-4 h-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Add Custom Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Task Title</label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="e.g., Call 5 warm prospects"
                      data-testid="input-task-title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Additional details about this task..."
                      data-testid="input-task-description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                        className="w-full p-2 border rounded-md"
                        data-testid="select-task-priority"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <select
                        value={newTask.category}
                        onChange={(e) => setNewTask({...newTask, category: e.target.value as any})}
                        className="w-full p-2 border rounded-md"
                        data-testid="select-task-category"
                      >
                        <option value="leads">Leads</option>
                        <option value="deals">Referrals</option>
                        <option value="training">Training</option>
                        <option value="follow-up">Follow-up</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={addCustomTask} className="flex-1" data-testid="button-save-task">
                      Add Task
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddTask(false)} data-testid="button-cancel-task">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Weekly Progress</h3>
                <span className="text-sm text-gray-600">{completedTasks} of {totalTasks} completed</span>
              </div>
              <Progress value={progressPercentage} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">
                {progressPercentage === 100 
                  ? "🎉 All tasks completed! Great week!" 
                  : `Keep going! ${totalTasks - completedTasks} tasks remaining`
                }
              </p>
            </div>

            {/* Goals Section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Weekly Targets</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-900">{goal.title}</h5>
                      <Badge variant="outline" className="text-xs">
                        {goal.current}/{goal.target}
                      </Badge>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-1.5" />
                    <p className="text-xs text-gray-500 mt-1">{goal.unit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks List */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">This Week's Tasks</h4>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg transition-all ${
                      task.completed 
                        ? 'bg-green-50 border-green-200 opacity-75' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          task.completed
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        data-testid={`button-toggle-task-${task.id}`}
                      >
                        {task.completed && <CheckCircleIcon className="w-3 h-3" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getCategoryIcon(task.category)}
                          <h5 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </h5>
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          <button
                            onClick={() => toggleReminder(task.id)}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                              task.reminderSet
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                            data-testid={`button-reminder-${task.id}`}
                          >
                            <BellIcon className="w-3 h-3" />
                            {task.reminderSet ? 'Reminder Set' : 'Set Reminder'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}