import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Button, Form } from "react-bootstrap";

export default function Documents() {
  const [file, setFile] = useState<File | null>(null);
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(()=>{ fetchDocs(); }, []);
  const fetchDocs = async () => { const res = await api.get("/documents"); setDocs(res.data); };

  const handleUpload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    // optionally attach projectId: form.append("projectId", "1")
    try {
      await api.post("/documents", form, { headers: { "Content-Type": "multipart/form-data" }});
      setFile(null);
      fetchDocs();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h3>Documents</h3>
      <Form.Group>
        <Form.Control type="file" onChange={(e) => {
          const input = e.target as HTMLInputElement;
          setFile(input.files?.[0] || null);
        }} />
      </Form.Group>
      <Button onClick={handleUpload}>Upload</Button>

      <ul>
        {docs.map(d => <li key={d.id}><a href={d.url} target="_blank" rel="noreferrer">{d.name}</a></li>)}
      </ul>
    </div>
  );
}