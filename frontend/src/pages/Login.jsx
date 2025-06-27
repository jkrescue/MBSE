import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const roles = [
  { label: '平台管理员', value: 'admin' },
  { label: '项目经理', value: 'pm' },
  { label: '系统架构师', value: 'arch' },
  { label: '仿真工程师', value: 'sim' },
  { label: '建模工程师', value: 'model' },
];

export default function Login() {
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('role', role);
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>选择角色登录</h2>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        {roles.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <button onClick={handleLogin} style={{ marginLeft: '1rem' }}>
        登录
      </button>
    </div>
  );
}
