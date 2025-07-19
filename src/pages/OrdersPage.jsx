"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")
  const categories = ["yaş pasta", "tatlı", "kuru pasta"]
  const [categoryFilter, setCategoryFilter] = useState("")

  const statusOrder = {
    beklemede: 1,
    hazırlanıyor: 2,
    hazır: 3,
    "iptal edildi": 4,
  }

  const sortOrders = (orderArray) => {
    return [...orderArray].sort((a, b) => {
      const orderA = statusOrder[a.status] || 99
      const orderB = statusOrder[b.status] || 99
      return orderA - orderB
    })
  }

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get("orders", {
        headers: { Authorization: `Bearer ${token}` },
        params: categoryFilter ? { category: categoryFilter } : {},
      })
      setOrders(sortOrders(res.data))
    } catch (err) {
      setError(err.response?.data?.message || "Siparişler alınamadı.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [categoryFilter])

  const updateStatus = async (orderId, newStatus) => {
    try {
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        )
        return sortOrders(updatedOrders)
      })

      await axios.put(
        `orders/status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      )
    } catch (err) {
      alert("Durum güncellenemedi")
      fetchOrders()
    }
  }

  const getStatusClass = (status) => {
    const statusMap = {
      beklemede: "status-beklemede",
      hazırlanıyor: "status-hazırlanıyor",
      hazır: "status-hazır",
      "iptal edildi": "status-iptal-edildi",
    }
    return statusMap[status] || ""
  }

  return (
    <>
      <div className="page-header">
        <h2>Sipariş Listesi</h2>
        <button onClick={() => navigate("/create-order")} className="btn-add-order" aria-label="Yeni sipariş oluştur">
          +
        </button>
      </div>

      {/* Kategori filtre butonları */}
      <div className="category-filters">
        <button onClick={() => setCategoryFilter("")} className={`filter-btn ${categoryFilter === "" ? "active" : ""}`}>
          Tümü
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`filter-btn ${categoryFilter === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="loading-message">Siparişler Yükleniyor...</div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : orders.length === 0 ? (
        <div className="empty-message card">Bu kategoride görüntülenecek sipariş yok.</div>
      ) : (
        <motion.ul layout className="item-list">
          <AnimatePresence>
            {orders.map((order) => (
              <motion.li
                layout
                key={order._id}
                className="card list-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                <div className="list-item-header">
                  <span>{order.name}</span>
                  <span style={{ fontWeight: 400, marginLeft: "8px" }}>({order.quantity} adet)</span>
                </div>
                <div>
                  Durum: <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                </div>
                <div>Kategori: {order.category}</div>
                {order.branchId?.name && <div>Şube: {order.branchId.name}</div>}

                {role !== "worker" && (
                  <div className="list-item-actions">
                    {order.status === "beklemede" && (
                      <button onClick={() => updateStatus(order._id, "hazırlanıyor")} className="btn btn-info">
                        Kabul Et
                      </button>
                    )}
                    {order.status === "hazırlanıyor" && (
                      <button onClick={() => updateStatus(order._id, "hazır")} className="btn btn-success">
                        Hazırla
                      </button>
                    )}
                    {["beklemede", "hazırlanıyor"].includes(order.status) && (
                      <button
                        onClick={() => {
                          const confirmed = window.confirm(
                            `${order.quantity} adet ${order.name} siparişini iptal etmek istediğinize emin misiniz?`,
                          )
                          if (confirmed) {
                            updateStatus(order._id, "iptal edildi")
                          }
                        }}
                        className="btn btn-danger"
                      >
                        İptal Et
                      </button>
                    )}
                  </div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </>
  )
}

export default OrdersPage
