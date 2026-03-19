import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobBoard = ({ userId }) => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const getMatchedJobs = async () => {
            const res = await axios.get(`http://localhost:5000/api/jobs/match/${userId}`);
            setJobs(res.data);
        };
        getMatchedJobs();
    }, [userId]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Recommended Jobs for You</h2>
            {jobs.length > 0 ? jobs.map(job => (
                <div key={job._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <h3>{job.title}</h3>
                    <p>Company: {job.company}</p>
                    <p>Requirements: {job.requiredSkills.join(", ")}</p>
                </div>
            )) : <p>No matching jobs found.</p>}
        </div>
    );
};

export default JobBoard;