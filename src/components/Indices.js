import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Indices.css"; // custom css

export default function Indices({ backendURL }) {
    const [indices, setIndices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${backendURL}/api/indices/`)
            .then(res => setIndices(res.data))
            .catch(() => setIndices([]));
    }, [backendURL]);

    if (!indices.length) return <div className="loader-container">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading Indices...</p>
    </div>;

    return (
        <div className="container mt-5 indices-page">
            <h2 className="mb-4 text-center fw-bold text-primary">📊 All Nifty Indices</h2>
            <div className="table-responsive shadow-lg rounded">
                <table className="table table-hover table-striped align-middle">
                    <thead className="table-dark text-center">
                        <tr>
                            {Object.keys(indices[0]).map((key, i) => (
                                <th key={i} className="text-nowrap">{key}</th>
                            ))}
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {indices.map((row, i) => (
                            <tr key={i}>
                                {Object.values(row).map((val, j) => (
                                    <td key={j} className={val && val.toString().includes("-") && j > 1 ? "text-danger fw-bold" : "text-success fw-bold"}>
                                        {val || "-"}
                                    </td>
                                ))}
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => {
                                            const idxName = row.INDEX || row.Index || row["INDEX "] || Object.values(row)[0];
                                            navigate(`/indices/${idxName.replace(/\s+/g, "-")}`);
                                        }}
                                    >
                                        View Constituents
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
