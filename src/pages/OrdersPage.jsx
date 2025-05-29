// src/pages/OrdersPage.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ekle

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // ekle

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Siparişler alınamadı.');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const role = localStorage.getItem('role');

    // JSX içinde:
    {
        role === 'super_admin' && (
            <button onClick={() => window.location.href = '/create-order'}>
                Yeni Sipariş Ekle
            </button>
        )
    }

    const updateStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders();
        } catch (err) {
            alert('Durum güncellenemedi');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>
            <h2>Sipariş Listesi</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <button onClick={handleLogout}>Çıkış Yap</button>
                {role === 'super_admin' && (
                    <button onClick={() => navigate('/create-order')}>Yeni Sipariş Ekle</button>
                )}
                {role === 'super_admin' && (
                    <button onClick={() => navigate('/branches')}>
                        Şube Yönetimi
                    </button>
                )}
                {role === 'super_admin' && (
                    <button onClick={() => navigate('/users')}>Admin Yönetimi</button>
                )}
                {role === 'super_admin' && (
                    <button onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
                )}

            </div>


            {error && <p style={{ color: 'red' }}>{error}</p>}
            {orders.length === 0 ? (
                <p>Henüz sipariş yok</p>
            ) : (
                <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {orders.map((order) => (
                        <li key={order._id} style={{ border: '1px solid #444', padding: 12, borderRadius: 8 }}>
                            <strong>{order.name}</strong> – {order.quantity} adet – <em>{order.status}</em>
                            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {order.status === 'beklemede' && (
                                    <button onClick={() => updateStatus(order._id, 'hazırlanıyor')}>Kabul Et</button>
                                )}
                                {order.status === 'hazırlanıyor' && (
                                    <button onClick={() => updateStatus(order._id, 'hazır')}>Hazırla</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>

    );

};

export default OrdersPage;
