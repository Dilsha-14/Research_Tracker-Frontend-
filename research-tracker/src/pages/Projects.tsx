import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Project = {
  id?: number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newProject, setNewProject] = useState<Project>({ title: "", description: "" });
  const navigate = useNavigate();

  const fetch = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    try {
      await api.post("/projects", newProject);
      setShowNew(false);
      setNewProject({ title: "", description: "" });
      fetch();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      fetch();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h2>Projects</h2>
      <Button onClick={() => setShowNew(true)} className="mb-3">New Project</Button>
      {loading ? <div>Loading...</div> : (
        <Table striped bordered hover>
          <thead><tr><th>ID</th><th>Title</th><th>Actions</th></tr></thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td onClick={() => navigate(`/projects/${p.id}`)} style={{cursor:"pointer"}}>{p.title}</td>
                <td>
                  <Button size="sm" onClick={() => navigate(`/projects/${p.id}`)}>View</Button>{" "}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showNew} onHide={() => setShowNew(false)}>
        <Modal.Header closeButton><Modal.Title>New Project</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2"><Form.Label>Title</Form.Label>
              <Form.Control value={newProject.title} onChange={(e)=>setNewProject({...newProject, title:e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2"><Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={newProject.description} onChange={(e)=>setNewProject({...newProject, description:e.target.value})}/>
            </Form.Group>
            <Button onClick={handleCreate}>Create</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}