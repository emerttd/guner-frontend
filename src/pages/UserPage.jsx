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
    role: 'admin',
    branchId: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const currentRole = localStorage.getItem('role');

  useEffect(() => {
    if (currentRole !== 'super_admin') {
      navigate('/orders');
    } else {
      fetchUsers();
      fetchBranches();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form };
      if (form.role !== 'worker') {
        delete payload.branchId;
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/api/users/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/users', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setForm({
        name: '',
        surname: '',
        email: '',
        password: '',
        role: 'admin',
        branchId: branches[0]?._id || ''
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Kullanıcı eklenemedi.');
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: '',
      role: user.role,
      branchId: user.branchId?._id || ''
    });
    setEditingId(user._id);
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

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h2>Kullanıcı Yönetimi (Sadece Super Admin)</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
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
          required={!editingId}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        >
          <option value="admin">admin</option>
          <option value="worker">worker</option>
          <option value="super_admin">super_admin</option>
        </select>

        {form.role === 'worker' && (
          <select
            value={form.branchId}
            onChange={(e) => setForm({ ...form, branchId: e.target.value })}
            required
          >
            {branches.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
        )}

        <button type="submit">{editingId ? 'Kullanıcıyı Güncelle' : 'Kullanıcı Ekle'}</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {users.map((u) => (
          <li key={u._id} style={{ border: '1px solid #ccc', padding: 12, borderRadius: 6 }}>
            <strong>{u.name} {u.surname}</strong> – {u.email} – <code>{u.role}</code>
            {u.branchId && <> – <em>{u.branchId.name}</em></>}
            <button onClick={() => handleEdit(u)} style={{ marginLeft: 12 }}>Düzenle</button>
            <button onClick={() => handleDelete(u._id)} style={{ marginLeft: 12, color: 'red' }}>Sil</button>
          </li>
        ))}
      </ul>

      <br />
      <button onClick={() => navigate('/orders')}>← Sipariş Listesine Dön</button>
    </div>
  );
};

export default UserPage;
