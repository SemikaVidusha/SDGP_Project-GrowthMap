import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Activity, BarChart3, Briefcase, RefreshCw, TrendingUp, Users } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const MONTH_WINDOW = 24;

const numberFormatter = new Intl.NumberFormat('en-US');

const normalizePoint = (point) => ({
  ...point,
  date: new Date(point.date).toISOString(),
});

const mergeTrendPoint = (existingPoints, incomingPoint) => {
  const normalizedIncoming = normalizePoint(incomingPoint);
  const nextPoints = [...existingPoints];

  const existingIndex = nextPoints.findIndex((point) => (
    point.title === normalizedIncoming.title
      && new Date(point.date).toISOString() === normalizedIncoming.date
  ));

  if (existingIndex >= 0) {
    nextPoints[existingIndex] = {
      ...nextPoints[existingIndex],
      ...normalizedIncoming,
    };
  } else {
    nextPoints.push(normalizedIncoming);
  }

  nextPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
  return nextPoints.slice(-MONTH_WINDOW);
};

const mergeRoleSnapshot = (currentSnapshot, incomingPoint) => {
  const next = [...currentSnapshot];
  const snapshotIndex = next.findIndex((point) => point.title === incomingPoint.title);

  if (snapshotIndex >= 0) {
    next[snapshotIndex] = {
      ...next[snapshotIndex],
      title: incomingPoint.title,
      demand: incomingPoint.demand,
      date: incomingPoint.date,
      monthLabel: incomingPoint.monthLabel,
    };
  } else {
    next.push({
      title: incomingPoint.title,
      demand: incomingPoint.demand,
      date: incomingPoint.date,
      monthLabel: incomingPoint.monthLabel,
    });
  }

  return next.sort((a, b) => b.demand - a.demand);
};

const computeLocalStats = (points, activeRoles, role) => {
  if (!points.length) {
    return {
      role,
      latestDemand: 0,
      previousDemand: 0,
      growthPct: 0,
      averageDemand: 0,
      peakDemand: 0,
      lowDemand: 0,
      monthsTracked: 0,
      activeRoles,
    };
  }

  const latestDemand = points[points.length - 1].demand;
  const previousDemand = points.length > 1 ? points[points.length - 2].demand : latestDemand;
  const growthPct = previousDemand === 0
    ? 0
    : Number((((latestDemand - previousDemand) / previousDemand) * 100).toFixed(2));

  const demandValues = points.map((point) => point.demand);
  const averageDemand = Number((demandValues.reduce((sum, value) => sum + value, 0) / points.length).toFixed(2));

  return {
    role,
    latestDemand,
    previousDemand,
    growthPct,
    averageDemand,
    peakDemand: Math.max(...demandValues),
    lowDemand: Math.min(...demandValues),
    monthsTracked: points.length,
    activeRoles,
  };
};

const formatDemand = (value) => numberFormatter.format(Math.round(value || 0));

const StatCard = ({ icon, label, value, helper }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <p className="text-slate-500 font-medium">{label}</p>
    <div className="flex items-end justify-between gap-2">
      <h4 className="text-3xl font-bold text-slate-900">{value}</h4>
      {helper && (
        <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded-lg text-slate-600 whitespace-nowrap">
          {helper}
        </span>
      )}
    </div>
  </div>
);

const JobTrends = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [trendPoints, setTrendPoints] = useState([]);
  const [latestRoleDemands, setLatestRoleDemands] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [liveConnected] = useState(false);
  const selectedRoleRef = useRef(selectedRole);
  const activeRoleCountRef = useRef(roles.length);

  useEffect(() => {
    selectedRoleRef.current = selectedRole;
  }, [selectedRole]);

  useEffect(() => {
    activeRoleCountRef.current = roles.length;
  }, [roles.length]);

  const fetchRoles = useCallback(async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/job-trends/roles`);
    return Array.isArray(data) ? data : [];
  }, []);

  const fetchTrends = useCallback(async (role) => {
    const { data } = await axios.get(`${API_BASE_URL}/api/job-trends`, {
      params: {
        role,
        months: MONTH_WINDOW,
      },
    });
    return data;
  }, []);

  const fetchStats = useCallback(async (role) => {
    const { data } = await axios.get(`${API_BASE_URL}/api/job-trends/stats`, {
      params: {
        role,
        months: MONTH_WINDOW,
      },
    });
    return data;
  }, []);

  const loadRoleData = useCallback(async (role, showMainLoader = false) => {
    if (!role) {
      return;
    }

    if (showMainLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const [trendsPayload, statsPayload] = await Promise.all([
        fetchTrends(role),
        fetchStats(role),
      ]);

      setTrendPoints((trendsPayload.points || []).map(normalizePoint));
      setLatestRoleDemands(trendsPayload.latestRoleDemands || []);
      setStats(statsPayload);
      setError('');
    } catch (loadError) {
      console.error('Failed to load job trends:', loadError);
      setError('Unable to load live job trends right now. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchStats, fetchTrends]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setLoading(true);
      try {
        const loadedRoles = await fetchRoles();
        if (cancelled) {
          return;
        }

        setRoles(loadedRoles);
        if (!loadedRoles.length) {
          setError('No trend records found. Run backend seed.js first.');
          setLoading(false);
          return;
        }

        setSelectedRole(loadedRoles[0]);
      } catch (bootstrapError) {
        console.error('Failed to bootstrap roles:', bootstrapError);
        if (!cancelled) {
          setError('Unable to load roles for trend analysis.');
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [fetchRoles]);

  useEffect(() => {
    if (!selectedRole) {
      return;
    }
    loadRoleData(selectedRole, true);
  }, [selectedRole, loadRoleData]);

  const activeStats = useMemo(
    () => stats || computeLocalStats(trendPoints, roles.length, selectedRole || 'Role'),
    [stats, trendPoints, roles.length, selectedRole]
  );

  const roleRanking = useMemo(
    () => latestRoleDemands.slice(0, 7),
    [latestRoleDemands]
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Job Market Trends</h1>
            <p className="text-slate-500 text-lg">Monthly demand analytics with live simulation updates.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full font-semibold text-sm ${liveConnected ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              <Activity size={16} />
              {liveConnected ? 'Live Connected' : 'Reconnecting'}
            </div>

            <button
              type="button"
              onClick={() => loadRoleData(selectedRole, false)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
              disabled={refreshing || !selectedRole}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="mb-8 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
          <label htmlFor="roleFilter" className="text-sm font-semibold text-slate-700">Select role</label>
          <select
            id="roleFilter"
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
            className="w-full sm:w-72 border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <span className="text-xs text-slate-500 sm:ml-auto">
            Rolling {MONTH_WINDOW} month window
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<TrendingUp color="#10b981" />}
            label="Latest Demand"
            value={formatDemand(activeStats.latestDemand)}
            helper={activeStats.role}
          />
          <StatCard
            icon={<Users color="#3b82f6" />}
            label="Average Demand"
            value={formatDemand(activeStats.averageDemand)}
            helper={`${activeStats.monthsTracked} months`}
          />
          <StatCard
            icon={<BarChart3 color="#8b5cf6" />}
            label="Monthly Growth"
            value={`${activeStats.growthPct >= 0 ? '+' : ''}${activeStats.growthPct}%`}
            helper={`Prev ${formatDemand(activeStats.previousDemand)}`}
          />
          <StatCard
            icon={<Briefcase color="#f59e0b" />}
            label="Active Roles"
            value={formatDemand(activeStats.activeRoles)}
            helper={`Peak ${formatDemand(activeStats.peakDemand)}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-6 text-slate-800">{selectedRole || 'Role'} Monthly Demand</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendPoints}>
                  <defs>
                    <linearGradient id="selectedRoleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="monthLabel" stroke="#94a3b8" minTickGap={18} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    formatter={(value) => [formatDemand(value), 'Demand']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{ fontSize: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="demand"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#selectedRoleGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border-slate-200">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Latest Demand by Role</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleRanking}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="title" stroke="#94a3b8" interval={0} angle="-15" textAnchor="end" height={70} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    formatter={(value) => [formatDemand(value), 'Demand']}
                    labelFormatter={(label) => `Role: ${label}`}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="demand" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {!loading && !trendPoints.length && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center text-slate-500 font-medium">
            No monthly trend records found for the selected role.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTrends;

