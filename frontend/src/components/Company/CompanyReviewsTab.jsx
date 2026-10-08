// frontend/src/components/Company/CompanyReviewsTab.jsx
import React, { useState, useEffect } from 'react';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import companyService from '../../services/companyService';

export const CompanyReviewsTab = ({ company }) => {
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (company?.id) {
      loadReviews();
    }
  }, [company?.id]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await companyService.getCompanyReviews(company.id, 15);
      setReviewsData(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Overall Ratings Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Employee Reviews & Workplace Culture at {company?.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Aggregated ratings on engineering culture, compensation fairness, management, and work-life balance
          </p>
        </div>

        {reviewsData && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-center">
              <span className="text-[11px] font-semibold text-blue-700 block uppercase">Overall</span>
              <p className="text-2xl font-extrabold text-blue-900 mt-1 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                {reviewsData.ratings?.overall || 4.3}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <span className="text-[11px] font-semibold text-gray-500 block uppercase">Culture</span>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {reviewsData.ratings?.culture || 4.5} <span className="text-xs text-gray-400">/ 5</span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <span className="text-[11px] font-semibold text-gray-500 block uppercase">Compensation</span>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {reviewsData.ratings?.compensation || 4.1} <span className="text-xs text-gray-400">/ 5</span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <span className="text-[11px] font-semibold text-gray-500 block uppercase">Management</span>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {reviewsData.ratings?.management || 3.8} <span className="text-xs text-gray-400">/ 5</span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-gray-500 block uppercase">Work-Life Balance</span>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {reviewsData.ratings?.work_life_balance || 3.6} <span className="text-xs text-gray-400">/ 5</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading employee sentiment...</p>
        </div>
      ) : reviewsData ? (
        <div className="space-y-6">
          
          {/* Top Pros & Cons Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Top Pros */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                Frequently Cited Pros
              </h3>
              <div className="space-y-2.5">
                {(reviewsData.top_pros || []).map((pro, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-950 font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      {pro.text}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      +{pro.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Cons */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-red-800 uppercase tracking-wider flex items-center gap-2">
                <ThumbsDown className="w-4 h-4 text-red-600" />
                Common Challenges & Cons
              </h3>
              <div className="space-y-2.5">
                {(reviewsData.top_cons || []).map((con, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between text-xs text-red-950 font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      {con.text}
                    </span>
                    <span className="text-[11px] font-bold text-red-700 bg-white px-2 py-0.5 rounded-md border border-red-200">
                      +{con.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Individual Reviews Feed */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider px-1">
              Recent Employee Reviews ({reviewsData.reviews?.length || 0})
            </h3>

            {reviewsData.reviews?.map((r) => {
              const pros = Array.isArray(r.pros) ? r.pros : [];
              const cons = Array.isArray(r.cons) ? r.cons : [];

              return (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < (r.rating || 4) ? 'fill-amber-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-sm text-gray-900">{r.role}</span>
                      <span className="text-xs text-gray-400">• {r.employment_status || 'Current'} Employee ({r.years_at_company || 2} yrs)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
                    {pros.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Pros:
                        </span>
                        <ul className="list-disc list-inside text-gray-600 pl-1 space-y-0.5">
                          {pros.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {cons.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-red-800 flex items-center gap-1">
                          <ThumbsDown className="w-3 h-3" /> Cons:
                        </span>
                        <ul className="list-disc list-inside text-gray-600 pl-1 space-y-0.5">
                          {cons.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
          <HelpCircle className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-semibold">No reviews found for this company.</p>
        </div>
      )}

    </div>
  );
};

export default CompanyReviewsTab;
