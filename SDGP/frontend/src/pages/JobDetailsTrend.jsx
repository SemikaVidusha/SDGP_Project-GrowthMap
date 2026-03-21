import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';

const JobDetailsTrend = () => {
  const { jobId } = useParams();
  
  // Note: These are mock data points. 
  // In a real application, you would fetch these from your Express backend using useEffect.
  
  const growthData = [
    { year: '2021', growth: 20 },
    { year: '2022', growth: 45 },
    { year: '2023', growth: 30 },
    { year: '2024', growth: 70 },
    { year: '2025', growth: 85 },
  ];

  const skillData = [
    { name: 'React', value: 400 },
    { name: 'Node.js', value: 300 },
    { name: 'Python', value: 300 },
    { name: 'Cloud', value: 200 },
  ];

  const salaryData = [
    { level: 'Entry', salary: 50000 },
    { level: 'Mid', salary: 85000 },
    { level: 'Senior', salary: 140000 },
    { level: 'Lead', salary: 190000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
      {/* Header Section */}
      <header style={{ borderBottom: '2px solid #333', marginBottom: '20px', paddingBottom: '10px' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Job Market Trends Analysis</h1>
      </header>

      {/* 1. Job Growth - Line Chart */}
      <section style={sectionStyle}>
        <h3 style={chartTitleStyle}>Annual Job Growth Rate (%)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="growth" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* 2 & 3. Industry Demand & Top Skills Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        
        {/* Industry Demand - Bar Chart */}
        <div style={sectionStyle}>
          <h3 style={chartTitleStyle}>Demand by Experience Level</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="salary" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Skills - Pie Chart */}
        <div style={sectionStyle}>
          <h3 style={chartTitleStyle}>Required Top Skills</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie 
                data={skillData} 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                fill="#8884d8" 
                dataKey="value" 
                label
              >
                {skillData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Salary Trend - Area Chart */}
      <section style={sectionStyle}>
        <h3 style={chartTitleStyle}>Salary Projection Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="growth" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      {/* 5. AI Summary Cards */}
      <section style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
        <div style={cardStyle}>
          <h4>Market Insight</h4>
          <p>This field is expected to grow by 15% in the next 2 years based on current market data.</p>
        </div>
        <div style={cardStyle}>
          <h4>Top Recommendation</h4>
          <p>Upskilling in React and Node.js increases hiring chances by 40% in today's tech landscape.</p>
        </div>
        <div style={cardStyle}>
          <h4>Salary Outlook</h4>
          <p>Competitive salaries are trending upward for senior roles with niche specialization.</p>
        </div>
      </section>
    </div>
  );
};

// Styling Objects
const sectionStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  marginBottom: '20px'
};

const chartTitleStyle = {
  marginBottom: '15px',
  color: '#444',
  fontSize: '18px'
};

const cardStyle = {
  flex: 1,
  padding: '15px',
  backgroundColor: '#e3f2fd',
  borderRadius: '8px',
  borderLeft: '5px solid #2196f3',
  fontSize: '14px',
  color: '#0d47a1'
};

export default JobDetailsTrend;