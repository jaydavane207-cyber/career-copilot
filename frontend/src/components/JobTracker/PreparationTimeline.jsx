// frontend/src/components/JobTracker/PreparationTimeline.jsx
import React from 'react';
import { Calendar, Clock, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

/**
 * PreparationTimeline Component
 * Visual weekly timeline showing recommended order of learning,
 * weekly hours distribution, and milestones towards being ready.
 */
export const PreparationTimeline = ({ preparation }) => {
  if (!preparation) return null;

  const critical = preparation.criticalSkills || [];
  const important = preparation.importantSkills || [];
  const allSkills = [...critical, ...important];

  // Distribute skills across weeks
  const weeksData = [];
  if (allSkills.length === 0) {
    weeksData.push({
      week: 1,
      title: 'Technical & System Architecture Review',
      skills: ['System Design Core Patterns', 'Data Structures & Algorithms'],
      hours: 15,
      focus: 'High-frequency interview questions and scenario trade-offs'
    });
    weeksData.push({
      week: 2,
      title: 'Mock Interview Simulations & Application Polish',
      skills: ['Live Coding Simulation', 'Behavioral STAR Preparation'],
      hours: 10,
      focus: 'Simulated rounds and company-tailored resume submission'
    });
  } else {
    // Generate weekly blocks dynamically based on skills
    let currentWeek = 1;
    for (let i = 0; i < allSkills.length; i += 2) {
      const chunk = allSkills.slice(i, i + 2);
      const totalHoursChunk = chunk.reduce((sum, s) => sum + (s.estimatedHours || 20), 0);
      weeksData.push({
        week: currentWeek,
        title: currentWeek === 1
          ? 'Foundations & High-Priority Gap Training'
          : currentWeek === 2
            ? 'Architecture, Implementation & Project Milestones'
            : currentWeek === 3
              ? 'Secondary Tools & Ecosystem Integration'
              : 'Final Mock Rounds & Application Submission',
        skills: chunk.map(s => s.skill || s.name),
        hours: totalHoursChunk,
        focus: chunk[0]?.priority === 'HIGH' ? 'Critical interview topics' : 'Preferred stack mastery'
      });
      currentWeek++;
      if (currentWeek > 4) break;
    }
  }

  const totalHours = weeksData.reduce((acc, w) => acc + w.hours, 0);
  const totalWeeks = preparation.estimatedPrepTime || `${weeksData.length} weeks`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Recommended Preparation Timeline
        </h4>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Total: ~{totalHours} hours ({totalWeeks})
          </span>
        </div>
      </div>

      <div className="relative border-l-2 border-blue-200 ml-4 space-y-6 py-1">
        {weeksData.map((item, idx) => (
          <div key={idx} className="relative pl-6 group">
            {/* Timeline node */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs group-hover:scale-110 transition-transform"></div>

            <div className="bg-white border border-gray-200/90 rounded-xl p-3.5 shadow-2xs hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between flex-wrap gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">
                    Week {item.week}
                  </span>
                  <h5 className="text-xs font-bold text-gray-900">{item.title}</h5>
                </div>
                <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  ~{item.hours} hrs/week
                </span>
              </div>

              <p className="text-[11px] text-gray-600 mb-2.5">
                {item.focus}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap">
                {item.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-800 border border-gray-200"
                  >
                    <Zap className="w-3 h-3 text-amber-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreparationTimeline;
