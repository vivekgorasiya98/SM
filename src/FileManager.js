// FileManager.js
import React, { useState } from 'react';

export default function FileManager({ user, backendURL, files, setFiles, setMessage }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${backendURL}/upload/`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.status === 'success') {
        setMessage('✅ ' + data.message);
        setFile(null);

        const updated = await fetch(`${backendURL}/files/`).then(res => res.json());
        if (updated.status === 'success') setFiles(updated.files);
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed.');
    }
  };

  const getFileType = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['txt', 'log', 'csv'].includes(ext)) return 'text';
    return 'other';
  };

  return (
    <>
      <h3>Upload a File</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: 10 }}>Upload</button>

      <h3>Uploaded Files</h3>
      <ul>
        {files.map((url, index) => {
          const type = getFileType(url);
          return (
            <li key={index} style={{ marginBottom: 20 }}>
              <p><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>
              {type === 'image' && <img src={url} alt="preview" style={{ maxWidth: '300px' }} />}
              {type === 'pdf' && <iframe src={url} style={{ width: '100%', height: 400 }} title="PDF Preview" />}
              {type === 'text' && <iframe src={url} style={{ width: '100%', height: 200 }} title="Text Preview" />}
              {type === 'other' && <p>Preview not supported for this file type.</p>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
