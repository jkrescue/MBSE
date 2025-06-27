import { useState, useEffect } from 'react';

export default function useRole() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('role');
    setRole(stored || 'admin');
  }, []);

  return role;
}
