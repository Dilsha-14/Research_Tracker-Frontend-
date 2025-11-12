import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Form, Spinner, Alert } from "react-bootstrap";
import api from "../services/api";

type Project = {
  id?: number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [form, setForm] = useState<Project>({ title: "", description: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProject = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setForm(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load project.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const save = async () => {
    if (!id) return;
    try {
      await api.put(`/projects/${id}`, form);
      setEditing(false);
      fetchProject();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save project.");
    }
  };

  const remove = async () => {
    if (!id) return;
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete project.");
    }
  };

  if (loading) return <Container className="mt-4"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Project Detail</h2>
        <div>
          <Button variant="secondary" className="me-2" onClick={() => navigate("/projects")}>Back</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </div>

      {!project ? (
        <p>No project found.</p>
      ) : (
        <div>
          {editing ? (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => { setEditing(false); setForm(project); }}>Cancel</Button>
                <Button onClick={save}>Save</Button>
              </div>
            </Form>
          ) : (
            <div>
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <p><strong>Start:</strong> {project.startDate ?? "-"}</p>
              <p><strong>End:</strong> {project.endDate ?? "-"}</p>

              <div className="mt-3">
                <Button className="me-2" onClick={() => setEditing(true)}>Edit</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}