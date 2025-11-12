import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
import api from "../services/api";

/**
 * Minimal admin panel. Expand with user management, role assignment, etc.
 * Assumes backend exposes /admin/users or similar. Adjust endpoints as needed.
 */

type UserSummary = {
  id?: number;
  username?: string;
  email?: string;
  roles?: string[];
  enabled?: boolean;
};

export default function AdminPanel() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/users"); // change if your backend uses different path
      setUsers(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container className="mt-4">
      <h2>Admin Panel</h2>
      <p>Administrative actions (user list).</p>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <Spinner animation="border" /> : (
        <Table striped bordered responsive>
          <thead>
            <tr><th>ID</th><th>Username</th><th>Email</th><th>Roles</th><th>Enabled</th></tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} className="text-center">No users found or you lack permissions.</td></tr>
            ) : users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username ?? "-"}</td>
                <td>{u.email ?? "-"}</td>
                <td>{(u.roles || []).join(", ")}</td>
                <td>{u.enabled ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}