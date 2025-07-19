"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

const BranchPage = () => {
  const [branches, setBranches] = useState([])
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editedName, setEditedName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const token = localStorage.getItem("token")

  const fetchBranches = async () => {
    try {
      const res = await axios.get("branches", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBranches(res.data)
    } catch (err) {
      setError("Şubeler alınamadı.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBranches()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setError("")
    try {
      const res = await axios.post(
        "branches",
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setBranches([...branches, res.data])
      setName("")
    } catch (err) {
      setError("Şube oluşturulamadı.")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bu şubeyi silmek istediğinize emin misiniz?")) return
    try {
      await axios.delete(`branches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBranches(branches.filter((b) => b._id !== id))
    } catch (err) {
      alert("Şube silinemedi. Muhtemelen şubeye bağlı siparişler veya kullanıcılar var.")
    }
  }

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `branches/${id}`,
        { name: editedName },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setEditingId(null)
      fetchBranches()
    } catch (err) {
      alert("Şube güncellenemedi.")
    }
  }

  if (isLoading) return <div className="loading-message">Şubeler Yükleniyor...</div>

  return (
    <>
      <div className="page-header">
        <h2>Şube Yönetimi</h2>
      </div>

      <motion.div layout className="card">
        <form onSubmit={handleCreate} className="action-group">
          <input
            type="text"
            className="form-input"
            placeholder="Yeni şube adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
          />
          <button type="submit" className="btn btn-primary">
            Ekle
          </button>
        </form>
        {error && (
          <p className="error-message" style={{ marginTop: "1rem" }}>
            {error}
          </p>
        )}
      </motion.div>

      <motion.ul layout className="item-list">
        <AnimatePresence>
          {branches.map((branch) => (
            <motion.li
              layout
              key={branch._id}
              className="card list-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {editingId === branch._id ? (
                <div className="form-wrapper">
                  <input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="form-input" />
                  <div className="action-group">
                    <button onClick={() => handleUpdate(branch._id)} className="btn btn-success">
                      Kaydet
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn btn-secondary">
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <strong className="list-item-header">{branch.name}</strong>
                  <div className="list-item-actions">
                    <button
                      onClick={() => {
                        setEditingId(branch._id)
                        setEditedName(branch.name)
                      }}
                      className="btn btn-secondary"
                    >
                      Düzenle
                    </button>
                    <button onClick={() => handleDelete(branch._id)} className="btn btn-danger">
                      Sil
                    </button>
                  </div>
                </>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  )
}

export default BranchPage
