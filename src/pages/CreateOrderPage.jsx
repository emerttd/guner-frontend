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
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role !== 'admin' && role !== 'worker' && role !== 'super_admin') {
      navigate('/orders');
    }
  }, [navigate, role]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/branches', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBranches(res.data);

        if (role === 'worker') {
          const userBranchId = localStorage.getItem('branchId');
          setBranchId(userBranchId || res.data[0]?._id || '');
        } else {
          setBranchId(res.data[0]?._id || '');
        }
      } catch (err) {
        setError('Şubeler alınamadı');
      }
    };

    fetchBranches();
  }, [role]);

  if (role === 'worker') {
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const finalBranchId = role === 'worker' ? localStorage.getItem('branchId') : branchId;

      console.log('Gönderilecek branchId:', finalBranchId);

      const payload = {
        name,
        quantity,
        branchId: finalBranchId,
      };

      console.log('Gönderilen veri:', payload);

      await axios.post(
        'http://localhost:5000/api/orders',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Sipariş oluşturuldu');
      navigate('/orders');
    } catch (err) {
      console.error('🚨 Sipariş oluşturulamadı:', err.response?.data);
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

        {role !== 'worker' && (
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          >
            {branches.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
        )}

        <button type="submit" style={{ width: '100%' }}>Oluştur</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateOrderPage;
