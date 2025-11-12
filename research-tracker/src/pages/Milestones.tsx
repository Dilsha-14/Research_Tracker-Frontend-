import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import api from "../services/api";

type Milestone = {
  id?: number;
  projectId?: number;
  title: string;
  dueDate?: string;
  status?: "PENDING" | "DONE" | "IN_PROGRESS" | string;
};

export default function Milestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [newMilestone, setNewMilestone] = useState<Milestone>({ title: "", status: "PENDING" });
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/milestones");
      setMilestones(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load milestones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const create = async () => {
    if (!newMilestone.title.trim()) return setError("Title required.");
    try {
      await api.post("/milestones", newMilestone);
      setShowNew(false);
      setNewMilestone({ title: "", status: "PENDING" });
      fetch();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create milestone.");
    }
  };

  const updateStatus = async (m: Milestone, status: string) => {
    if (!m.id) return;
    try {
      await api.put(`/milestones/${m.id}`, { ...m, status });
      fetch();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update status.");
    }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Delete this milestone?")) return;
    try {
      await api.delete(`/milestones/${id}`);
      fetch();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete milestone.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Milestones</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="mb-3"><Button onClick={() => setShowNew(true)}>New Milestone</Button></div>

      {loading ? <Spinner animation="border" /> : (
        <Table striped bordered hover responsive>
          <thead><tr><th>ID</th><th>Project ID</th><th>Title</th><th>Due</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {milestones.length === 0 ? (
              <tr><td colSpan={6} className="text-center">No milestones.</td></tr>
            ) : milestones.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.projectId ?? "-"}</td>
                <td>{m.title}</td>
                <td>{m.dueDate ?? "-"}</td>
                <td>{m.status}</td>
                <td>
                  <Button size="sm" onClick={() => updateStatus(m, "IN_PROGRESS")}>In progress</Button>{" "}
                  <Button size="sm" variant="success" onClick={() => updateStatus(m, "DONE")}>Mark Done</Button>{" "}
                  <Button size="sm" variant="danger" onClick={() => remove(m.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showNew} onHide={() => setShowNew(false)}>
        <Modal.Header closeButton><Modal.Title>New Milestone</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Project ID (optional)</Form.Label>
              <Form.Control type="number" value={newMilestone.projectId ?? ""} onChange={(e) => setNewMilestone({ ...newMilestone, projectId: e.target.value ? Number(e.target.value) : undefined })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control value={newMilestone.title} onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Due Date</Form.Label>
              <Form.Control type="date" value={newMilestone.dueDate ?? ""} onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })} />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button onClick={create}>Create</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}