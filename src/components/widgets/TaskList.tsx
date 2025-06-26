import React from 'react';
import { Card, List, Tag, Typography } from 'antd';

const { Title } = Typography;

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'default';
      case 'in_progress': return 'processing';
      case 'completed': return 'success';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'blue';
      case 'medium': return 'orange';
      case 'high': return 'red';
    }
  };

  return (
    <Card>
      <Title level={4}>任务列表</Title>
      <List
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item>
            <List.Item.Meta
              title={task.title}
              description={
                <>
                  <Tag color={getStatusColor(task.status)}>
                    {task.status === 'in_progress' ? '进行中' : task.status === 'completed' ? '已完成' : '待处理'}
                  </Tag>
                  <Tag color={getPriorityColor(task.priority)}>
                    {task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级'}
                  </Tag>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TaskList; 