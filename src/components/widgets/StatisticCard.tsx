import React from 'react';
import { Card, Statistic } from 'antd';
import { StatisticProps } from 'antd/es/statistic/Statistic';

interface StatisticCardProps extends Omit<StatisticProps, 'title'> {
  title: string;
  loading?: boolean;
  color?: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  loading = false,
  color,
  ...statisticProps
}) => {
  return (
    <Card loading={loading} bodyStyle={{ padding: '20px' }}>
      <Statistic
        title={title}
        valueStyle={{ color }}
        {...statisticProps}
      />
    </Card>
  );
}; 