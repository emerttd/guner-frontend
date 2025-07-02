"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"

const StatCard = ({ title, value, icon }) => (
  <motion.div
    className="card"
    whileHover={{ scale: 1.05 }}
    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textAlign: "center" }}
  >
    <div style={{ fontSize: "2.5rem" }}>{icon}</div>
    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</div>
    <div style={{ color: "#888" }}>{title}</div>
  </motion.div>
)

const DashboardPage = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem("token")

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard/summary", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setData(res.data)
    } catch (err) {
      setError("Dashboard verileri alınamadı.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const handleCleanup = async (type) => {
    const typeText = type === "completed" ? "hazır" : "iptal edilmiş"
    const confirmed = window.confirm(
      `Bu işlem, durumu "${typeText}" olan tüm siparişleri kalıcı olarak silecek. Emin misiniz?`,
    )
    if (!confirmed) return

    try {
      const res = await axios.delete(`http://localhost:5000/api/orders/cleanup/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert(`✅ ${res.data.deletedCount} adet ${typeText} sipariş silindi.`)
      fetchDashboard()
    } catch {
      alert("❌ Silme işlemi başarısız oldu.")
    }
  }

  if (isLoading) return <div className="loading-message">Dashboard Yükleniyor...</div>
  if (error) return <p className="error-message">{error}</p>
  if (!data) return <div className="empty-message">Görüntülenecek veri yok.</div>

  return (
    <>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <motion.div
        className="item-list"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        <StatCard title="Toplam Sipariş" value={data.orders.total} icon="📦" />
        <StatCard title="Bekleyen Sipariş" value={data.orders.pending} icon="⏳" />
        <StatCard title="Hazırlanan Sipariş" value={data.orders.inProgress} icon="🍳" />
        <StatCard title="Hazır Sipariş" value={data.orders.ready} icon="✅" />
        <StatCard title="Toplam Kullanıcı" value={data.users.total} icon="👥" />
        <StatCard title="Toplam Şube" value={data.branches.total} icon="🏢" />
      </motion.div>

      <div className="card">
        <h3>Yönetim Araçları</h3>
        <div className="action-group">
          <button onClick={() => handleCleanup("completed")} className="btn btn-warning">
            🧹 Hazır Siparişleri Temizle
          </button>
          <button onClick={() => handleCleanup("cancelled")} className="btn btn-danger">
            🧹 İptal Edilenleri Temizle
          </button>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
