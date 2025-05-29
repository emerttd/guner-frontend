// src/pages/BranchPage.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BranchPage = () => {
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchBranches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/branches', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranches(res.data);
    } catch (err) {
      setError('Şubeler alınamadı.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(
        'http://localhost:5000/api/branches',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName('');
      fetchBranches();
    } catch (err) {
      setError('Şube oluşturulamadı.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu şubeyi silmek istediğine emin misin?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/branches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBranches();
    } catch (err) {
      alert('Şube silinemedi.');
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/branches/${id}`,
        { name: editedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchBranches();
    } catch (err) {
      alert('Şube güncellenemedi.');
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2>Şubeler</h2>

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Yeni şube adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Ekle</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {branches.map((branch) => (
          <li key={branch._id} style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
            {editingId === branch._id ? (
              <>
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  style={{ marginRight: 8, padding: 6 }}
                />
                <button onClick={() => handleUpdate(branch._id)}>Kaydet</button>
                <button onClick={() => setEditingId(null)} style={{ marginLeft: 8 }}>
                  İptal
                </button>
              </>
            ) : (
              <>
                <strong>{branch.name}</strong>
                <button
                  onClick={() => {
                    setEditingId(branch._id);
                    setEditedName(branch.name);
                  }}
                  style={{ marginLeft: 8 }}
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(branch._id)}
                  style={{ marginLeft: 8, color: 'red' }}
                >
                  Sil
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <br />
      <button onClick={() => navigate('/orders')}>← Sipariş Listesine Dön</button>
    </div>
  );
};

export default BranchPage;
