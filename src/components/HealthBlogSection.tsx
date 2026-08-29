import React from 'react';
import { BookOpen, ArrowRight, Sparkles, Clock, UserCheck } from 'lucide-react';
import { HEALTH_BLOG_POSTS } from '../data/mockData';

export const HealthBlogSection: React.FC = () => {
  return (
    <section className="py-12 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy bg-brand-100/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" /> North India Health Guide
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Medical Insights &amp; Preventive Guidance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Articles written by senior pathologists and clinicians on North Indian lifestyle and environmental challenges.
            </p>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HEALTH_BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-600 transition leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-1">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4 pt-4 text-xs">
                <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[180px]">
                  By {post.author}
                </span>
                <span className="text-brand-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
