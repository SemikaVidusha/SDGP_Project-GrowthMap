import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/jobs');
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs", error);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Available Jobs</h1>
            <div style={{ display: 'grid', gap: '20px' }}>
                {jobs.map((job) => (
                    <div key={job._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        <h3>{job.title}</h3>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <button style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                            Apply Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Jobs;