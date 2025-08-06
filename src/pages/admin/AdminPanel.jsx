// src/pages/admin/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../utils/firebase/config";
import { Wrapper, Title, Table } from "./AdminPanel.styles";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "users"));
    const userList = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    setUsers(userList);
    setLoading(false);
  };

  const updateRole = async (userId, newRole) => {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    await fetchUsers();
  };

  const deleteUser = async (userId) => {
    const confirm = window.confirm(
      "Ви впевнені, що хочете видалити цього користувача?"
    );
    if (!confirm) return;

    await deleteDoc(doc(db, "users", userId));
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Завантаження користувачів...</p>;

  return (
    <Wrapper>
      <Title>Admin Panel</Title>
      <Table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
}
