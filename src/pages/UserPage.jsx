"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

const UserPage = () => {
  const [users, setUsers] = useState([])
  const [branches, setBranches] = useState([])
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "admin",
    branchId: "",
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [usersRes, branchesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/branches", { headers: { Authorization: `Bearer ${token}` } }),
        ])
        setUsers(usersRes.data)
        setBranches(branchesRes.data)
        if (branchesRes.data.length > 0) {
          setForm((prev) => ({ ...prev, branchId: branchesRes.data[0]._id }))
        }
      } catch {
        setError("Veriler yüklenirken bir hata oluştu.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [token])

  const resetForm = () => {
    setForm({
      name: "",
      surname: "",
      email: "",
      password: "",
      role: "admin",
      branchId: branches[0]?._id || "",
    })
    setEditingId(null)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const payload = { ...form }
      if (form.role !== "worker") {
        delete payload.branchId
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/api/users/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await axios.post("http://localhost:5000/api/users", payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      resetForm()
      const res = await axios.get("http://localhost:5000/api/users", { headers: { Authorization: `Bearer ${token}` } })
      setUsers(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "İşlem gerçekleştirilemedi.")
    }
  }

  const handleEdit = (user) => {
    setEditingId(user._id)
    setForm({
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: "",
      role: user.role,
      branchId: user.branchId?._id || branches[0]?._id || "",
    })
    window.scrollTo(0, 0)
  }

  const handleDelete = async (userId) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(users.filter((u) => u._id !== userId))
    } catch {
      alert("Kullanıcı silinemedi.")
    }
  }

  if (isLoading) return <div className="loading-message">Kullanıcılar Yükleniyor...</div>

  return (
    <>
      <div className="page-header">
        <h2>Kullanıcı Yönetimi</h2>
      </div>

      <motion.div layout className="card">
        <h3>{editingId ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}</h3>
        <form onSubmit={handleSubmit} className="form-wrapper">
          <div className="form-row">
            <input
              className="form-input"
              type="text"
              placeholder="Ad"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="form-input"
              type="text"
              placeholder="Soyad"
              value={form.surname}
              onChange={(e) => setForm({ ...form, surname: e.target.value })}
              required
            />
          </div>
          <input
            className="form-input"
            type="email"
            placeholder="E-posta"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="form-input"
            type="password"
            placeholder={editingId ? "Yeni Şifre (isteğe bağlı)" : "Şifre"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editingId}
          />
          <select
            className="form-select"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="worker">Worker</option>
            <option value="super_admin">Super Admin</option>
          </select>

          {form.role === "worker" && (
            <select
              className="form-select"
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: e.target.value })}
              required
            >
              <option value="">Şube Seçin</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
          {error && <p className="error-message">{error}</p>}
          <div className="action-group">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Güncelle" : "Ekle"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                İptal
              </button>
            )}
          </div>
        </form>
      </motion.div>

      <motion.ul layout className="item-list">
        <AnimatePresence>
          {users.map((u) => (
            <motion.li
              layout
              key={u._id}
              className="card list-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="list-item-header">
                {u.name} {u.surname}
              </div>
              <div>{u.email}</div>
              <div>
                Rol: <code>{u.role}</code>
              </div>
              {u.branchId && <div>Şube: {u.branchId.name}</div>}
              <div className="list-item-actions">
                <button onClick={() => handleEdit(u)} className="btn btn-secondary">
                  Düzenle
                </button>
                <button onClick={() => handleDelete(u._id)} className="btn btn-danger">
                  Sil
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  )
}

export default UserPage
