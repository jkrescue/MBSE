import React from 'react';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatusCardProps {
  title: string;
  value: number;
  precision?: number;
  prefix?: React.ReactNode;
  suffix?: string;
  trend?: 'up' | 'down';
  trendValue?: number;
  loading?: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  precision = 0,
  prefix,
  suffix,
  trend,
  trendValue,
  loading = false,
}) => {
  return (
    <Card loading={loading} bordered={false} style={{ height: '100%' }}>
      <Statistic
        title={title}
        value={value}
        precision={precision}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{
          color: trend === 'up' ? '#3f8600' : trend === 'down' ? '#cf1322' : undefined,
        }}
      />
      {trend && trendValue && (
        <div style={{ marginTop: 8 }}>
          <span
            style={{
              color: trend === 'up' ? '#3f8600' : '#cf1322',
              marginRight: 4,
            }}
          >
            {trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {trendValue}%
          </span>
          较上周期
        </div>
      )}
    </Card>
  );
}; 