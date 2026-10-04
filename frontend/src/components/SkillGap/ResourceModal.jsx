// frontend/src/components/SkillGap/ResourceModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { ExternalLink, BookOpen, Video, Code, Newspaper } from 'lucide-react';
import { skillService } from '../../services/skillService';

export const ResourceModal = ({ isOpen, onClose, skillName, resources: initialResources }) => {
  const [resources, setResources] = useState(initialResources || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && skillName) {
      if (initialResources && initialResources.length > 0) {
        setResources(initialResources);
      } else {
        const fetchRes = async () => {
          try {
            setLoading(true);
            const res = await skillService.getResources(skillName);
            if (res.success && res.resources) {
              setResources(res.resources);
            }
          } catch (e) {
            console.error('Failed to load resources:', e);
          } finally {
            setLoading(false);
          }
        };
        fetchRes();
      }
    }
  }, [isOpen, skillName, initialResources]);

  if (!isOpen) return null;

  const getIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('video') || t.includes('youtube')) return <Video className="w-4 h-4 text-[#EF4444]" />;
    if (t.includes('repo') || t.includes('code') || t.includes('github')) return <Code className="w-4 h-4 text-[#374151]" />;
    if (t.includes('article') || t.includes('blog')) return <Newspaper className="w-4 h-4 text-[#F59E0B]" />;
    return <BookOpen className="w-4 h-4 text-[#3B82F6]" />;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Learning Resources: ${skillName}`}>
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Curated materials and roadmaps to bridge your skill gap in <strong>{skillName}</strong>.
        </p>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading learning resources...</div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {resources && resources.length > 0 ? (
              resources.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="font-semibold text-blue-600">{item.type}</span>
                        {item.free !== undefined && (
                          <>
                            <span>•</span>
                            <span className={item.free ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>
                              {item.free ? 'Free' : 'Paid'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-xs font-semibold text-slate-600 flex items-center gap-1 flex-shrink-0 transition-colors"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">
                No specific resources found. Search online documentation for tutorials.
              </p>
            )}
          </div>
        )}

        <div className="pt-2 text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ResourceModal;
