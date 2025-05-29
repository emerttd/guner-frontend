// src/pages/UserPage.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    role: 'admin', // ✅ varsayılan olarak admin
    branchId: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError('Kullanıcılar alınamadı.');
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/branches', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBranches(res.data);
      if (res.data.length > 0 && !form.branchId) {
        setForm((prev) => ({ ...prev, branchId: res.data[0]._id }));
      }
    } catch {
      console.log('Şubeler alınamadı.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/users', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({
        name: '',
        surname: '',
        email: '',
        password: '',
        role: 'admin', // ✅ tekrar admin'e dön
        branchId: branches[0]?._id || ''
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Kullanıcı eklenemedi.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Kullanıcıyı silmek istiyor musun?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch {
      alert('Silinemedi.');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h2>Admin / Super Admin Yönetimi</h2>

      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Ad"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Soyad"
          value={form.surname}
          onChange={(e) => setForm({ ...form, surname: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="E-posta"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          value={form.branchId}
          onChange={(e) => setForm({ ...form, branchId: e.target.value })}
          required
        >
          {branches.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        >
          <option value="admin">admin</option>
          <option value="super_admin">super_admin</option>
        </select>

        <button type="submit">Kullanıcı Ekle</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {users.map((u) => (
          <li key={u._id} style={{ border: '1px solid #ccc', padding: 12, borderRadius: 6 }}>
            <strong>{u.name} {u.surname}</strong> – {u.email} – <code>{u.role}</code>
            {u.branchId && (
              <> – <em>{u.branchId.name}</em></>
            )}
            <button
              onClick={() => handleDelete(u._id)}
              style={{ marginLeft: 12, color: 'red' }}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>

      <br />
      <button onClick={() => navigate('/orders')}>← Sipariş Listesine Dön</button>
    </div>
  );
};

export default UserPage;
