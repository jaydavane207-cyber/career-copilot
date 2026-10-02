// frontend/src/components/SkillGap/ResourceModal.jsx
import React from 'react';
import { Modal } from '../Common/Modal';
import { ExternalLink, BookOpen, Video, Code } from 'lucide-react';

export const ResourceModal = ({ isOpen, onClose, skillName, resources }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Learning Resources for ${skillName}`}>
      <p className="text-xs text-slate-500 mb-4">
        Curated materials and roadmaps to bridge your skill gap in {skillName}.
      </p>

      <div className="space-y-3">
        {resources && resources.length > 0 ? (
          resources.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="font-semibold">{item.type}</span>
                    <span>•</span>
                    <span className={item.free ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>
                      {item.free ? 'Free' : 'Paid'}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0"
              >
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-6">
            No specific resources found. Search online documentation for tutorials.
          </p>
        )}
      </div>

      <div className="mt-5 text-right">
        <button onClick={onClose} className="btn-secondary text-xs">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ResourceModal;
