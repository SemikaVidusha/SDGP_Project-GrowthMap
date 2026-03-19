import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [userData, setUserData] = useState({
        name: "User Name",
        email: "user@example.com",
        skills: ["JavaScript", "React", "Node.js"]
    });

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>User Profile</h1>
            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <h3>Skills</h3>
                <ul>
                    {userData.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Profile;