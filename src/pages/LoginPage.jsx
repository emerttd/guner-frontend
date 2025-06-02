// src/pages/LoginPage.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      alert(`Hoş geldin ${res.data.user.name}`);
      navigate('/orders'); // ✅ Giriş sonrası yönlendirme
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş hatası');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 400,
      margin: '0 auto',
      padding: 24,
      gap: 12
    }}>
      <h2 style={{ textAlign: 'center' }}>Giriş Yap</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 8, fontSize: 16 }}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 8, fontSize: 16 }}
          required
        />
        <button type="submit" style={{ padding: 10, fontSize: 16 }}>Giriş Yap</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
