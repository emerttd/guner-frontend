// src/pages/DashboardPage.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      setError('Dashboard verileri alınamadı.');
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error) {
    return <p style={{ color: 'red', padding: 24 }}>{error}</p>;
  }

  if (!data) {
    return <p style={{ padding: 24 }}>Yükleniyor...</p>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h2>📊 Dashboard</h2>

      <h3>📦 Siparişler</h3>
      <ul>
        <li>Toplam: {data.orders.total}</li>
        <li>Hazır: {data.orders.ready}</li>
        <li>Hazırlanıyor: {data.orders.inProgress}</li>
        <li>Beklemede: {data.orders.pending}</li>
      </ul>

      <h3>👥 Tüm Kullanıcılar: {data.users.total}</h3>
      <ul>
        <li>Admin: {data.users.admins}</li>
        <li>Worker: {data.users.workers}</li>
        <li>Super Admin: {data.users.superAdmins}</li>
      </ul>

      <h3>🏢 Şubeler</h3>
      <ul>
        <li>Toplam Şube Sayısı: {data.branches.total}</li>
      </ul>

      <hr />

      <h3>🔗 Hızlı Erişim</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={() => navigate('/orders')}>📦 Sipariş Listesi</button>
        <button onClick={() => navigate('/create-order')}>➕ Sipariş Oluştur</button>
        <button onClick={() => navigate('/branches')}>🏢 Şube Yönetimi</button>
        <button onClick={() => navigate('/users')}>👥 Kullanıcı Yönetimi</button>
        <button
          style={{ color: 'red' }}
          onClick={() => {
            const confirmed = window.confirm(
              'Bu işlem, tüm DURUMU "hazır" olan siparişleri kalıcı olarak silecek.\nDevam etmek istediğine emin misin?'
            );
            if (!confirmed) return;

            axios
              .delete('http://localhost:5000/api/orders/cleanup/completed', {
                headers: { Authorization: `Bearer ${token}` }
              })
              .then((res) => {
                alert(`✅ ${res.data.deletedCount} hazır sipariş silindi.`);
                fetchDashboard(); // Sayıları güncelle
              })
              .catch(() => {
                alert('❌ Silme işlemi başarısız oldu.');
              });
          }}
        >
          🧹 Hazır Siparişleri Temizle
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
