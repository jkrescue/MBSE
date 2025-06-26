import React from 'react';
import { Card, Progress, Typography } from 'antd';

const { Text } = Typography;

interface ProgressCardProps {
  title: string;
  percent: number;
  status?: 'success' | 'exception' | 'normal' | 'active';
  subTitle?: string;
  loading?: boolean;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  percent,
  status = 'normal',
  subTitle,
  loading = false,
}) => {
  return (
    <Card loading={loading} bordered={false} style={{ height: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <Progress
          type="dashboard"
          percent={percent}
          status={status}
          size={120}
          strokeWidth={8}
        />
        <div style={{ marginTop: 16 }}>
          <Text strong style={{ fontSize: 16 }}>{title}</Text>
          {subTitle && (
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">{subTitle}</Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}; 