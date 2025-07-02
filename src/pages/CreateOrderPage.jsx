"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const CreateOrderPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [branches, setBranches] = useState([])
  const [branchId, setBranchId] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const role = localStorage.getItem("role")
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (role !== "admin" && role !== "worker" && role !== "super_admin") {
      navigate("/orders")
    }
  }, [navigate, role])

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/branches", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setBranches(res.data)
        if (res.data.length > 0) {
          const userBranchId = localStorage.getItem("branchId")
          setBranchId(role === "worker" ? userBranchId : res.data[0]._id)
        }
      } catch (err) {
        setError("Şubeler alınamadı")
      }
    }
    fetchBranches()
  }, [role, token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const finalBranchId = role === "worker" ? localStorage.getItem("branchId") : branchId
      const payload = { name, quantity, branchId: finalBranchId }
      await axios.post("http://localhost:5000/api/orders", payload, { headers: { Authorization: `Bearer ${token}` } })
      alert("Sipariş başarıyla oluşturuldu")
      navigate("/orders")
    } catch (err) {
      setError(err.response?.data?.message || "Sipariş oluşturulamadı")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card">
        <h2 style={{ textAlign: "center", marginTop: 0, width: "100%" }}>Yeni Sipariş Oluştur</h2>
        <form onSubmit={handleSubmit} className="form-wrapper">
          <div className="form-group">
            <label htmlFor="name">Ürün Adı</label>
            <input
              id="name"
              className="form-input"
              type="text"
              placeholder="Örn: Latte"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Miktar</label>
            <input
              id="quantity"
              className="form-input"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          {role !== "worker" && (
            <div className="form-group">
              <label htmlFor="branch">Şube</label>
              <select
                id="branch"
                className="form-select"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
              >
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Oluşturuluyor..." : "Siparişi Oluştur"}
          </button>
        </form>
      </div>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ alignSelf: "center" }}>
        ← Geri Dön
      </button>
    </motion.div>
  )
}

export default CreateOrderPage
