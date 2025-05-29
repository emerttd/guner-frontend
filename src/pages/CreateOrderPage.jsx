// src/pages/CreateOrderPage.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Şube listesi çek
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/branches', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBranches(res.data);
        if (res.data.length > 0) setBranchId(res.data[0]._id);
      } catch (err) {
        setError('Şubeler alınamadı');
      }
    };

    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/orders',
        { name, quantity, branchId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Sipariş oluşturuldu');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Sipariş oluşturulamadı');
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: 'auto' }}>
      <h2>Yeni Sipariş Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ürün adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="number"
          min={1}
          placeholder="Miktar"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <select
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        >
          {branches.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        <button type="submit" style={{ width: '100%' }}>Oluştur</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateOrderPage;
