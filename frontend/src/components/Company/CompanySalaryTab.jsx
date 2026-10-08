// frontend/src/components/Company/CompanySalaryTab.jsx
import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  MapPin,
  Briefcase,
  ShieldCheck,
  Award,
  HelpCircle,
  Clock,
  Building2,
  PieChart
} from 'lucide-react';
import companyService from '../../services/companyService';

export const CompanySalaryTab = ({ company }) => {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Senior Software Engineer');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  useEffect(() => {
    if (company?.id) {
      loadSalary();
    }
  }, [company?.id, selectedRole, selectedLocation]);

  const loadSalary = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedRole) params.role = selectedRole;
      if (selectedLocation !== 'All') params.location = selectedLocation;

      const data = await companyService.getCompanySalary(company.id, params);
      setSalaryData(data);
      if (data.all_roles) setAvailableRoles(data.all_roles);
      if (data.all_locations) setAvailableLocations(['All', ...data.all_locations]);
    } catch (err) {
      console.error('Failed to load salary data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val) return '$0';
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Salary & Compensation at {company?.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Benchmarks by role, level, location, base, annual bonus, and equity RSUs
          </p>
        </div>

        {/* Role & Location Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs sm:text-sm font-semibold rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {(availableRoles.length > 0 ? availableRoles : ['Senior Software Engineer', 'SDE', 'Frontend Engineer', 'Product Manager', 'Data Scientist']).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500">Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs sm:text-sm font-semibold rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {(availableLocations.length > 0 ? availableLocations : ['All', 'Mountain View, CA / Bay Area', 'Seattle, WA', 'New York, NY', 'Bengaluru, India', 'Remote (US)']).map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Calculating verified compensation figures...</p>
        </div>
      ) : salaryData ? (
        <div className="space-y-6">
          
          {/* Total Comp Highlight Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Average Total Compensation (TC)
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {formatCurrency(salaryData.total_comp?.average)}
                </span>
                <span className="text-sm text-blue-200">
                  Range: {formatCurrency(salaryData.total_comp?.low)} - {formatCurrency(salaryData.total_comp?.high)}
                </span>
              </div>
              <p className="text-xs text-blue-300 flex items-center gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5" />
                {salaryData.location} • Based on {salaryData.data_points} reported data points
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
                <span className="text-[10px] text-blue-200 font-semibold uppercase block">Market Tier</span>
                <span className="text-sm font-bold text-emerald-400">{salaryData.market_comparison}</span>
              </div>
              <div className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
                <span className="text-[10px] text-blue-200 font-semibold uppercase block">Cost of Living</span>
                <span className="text-sm font-bold text-white">{salaryData.location_cost_of_living}x Index</span>
              </div>
            </div>
          </div>

          {/* Detailed Component Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Base Salary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-500">Base Salary</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">
                  {formatCurrency(salaryData.salary?.average)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Range: {formatCurrency(salaryData.salary?.low)} - {formatCurrency(salaryData.salary?.high)}
                </p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '70%' }} />
              </div>
              <p className="text-[11px] text-gray-400">Guaranteed bi-weekly base pay</p>
            </div>

            {/* Annual Bonus */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-500">Annual Bonus</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">
                  {formatCurrency(salaryData.bonus?.average)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Range: {formatCurrency(salaryData.bonus?.low)} - {formatCurrency(salaryData.bonus?.high)}
                </p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
              </div>
              <p className="text-[11px] text-gray-400">Target performance & company multiplier</p>
            </div>

            {/* Stock / Equity RSUs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-500">Annual Stock (RSUs)</span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">
                  {formatCurrency(Math.round(((salaryData.equity?.low || 30000) + (salaryData.equity?.high || 70000)) / 2))}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Range: {formatCurrency(salaryData.equity?.low)} - {formatCurrency(salaryData.equity?.high)} / yr
                </p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }} />
              </div>
              <p className="text-[11px] text-gray-400">Typical 4-year schedule with quarterly vesting</p>
            </div>

          </div>

          {/* Negotiation Intelligence Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Negotiation Leverage Insights for {company?.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed">
              <div className="p-3.5 bg-gray-50 rounded-xl space-y-1">
                <span className="font-semibold text-gray-900 block">Sign-on Bonuses & Competing Offers:</span>
                <p>{company?.name} recruiters frequently match or exceed top competing offers (FAANG / Tier-1). First year sign-on bonuses typically range between $20k-$50k when leveraging counter-offers.</p>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl space-y-1">
                <span className="font-semibold text-gray-900 block">Equity Refreshers & Upside:</span>
                <p>Annual refresher grants are distributed based on mid-year performance reviews, increasing total compensation substantially by year 2 and year 3.</p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
          <HelpCircle className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-gray-700">No salary benchmarks available for this selection</p>
        </div>
      )}

    </div>
  );
};

export default CompanySalaryTab;
