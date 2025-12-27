
import React from 'react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import { BlogPost } from '../types';

interface Props {
  onReadPost: (post: BlogPost) => void;
}

const BlogView: React.FC<Props> = ({ onReadPost }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 pb-24 animate-in fade-in duration-700">
      <section className="bg-white dark:bg-slate-900 py-24 px-4 border-b border-slate-100 dark:border-slate-800 mb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6">Market Insights & <span className="text-indigo-600 dark:text-indigo-400">Tutorials</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Stay updated with the latest trends and improve your earning skills.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post) => (
            <div 
              key={post.id} 
              onClick={() => onReadPost(post)}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-xl dark:hover:border-slate-700 hover:translate-y-[-4px] transition-all group cursor-pointer"
            >
              <div className="h-56 relative overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-900/40">
                    <Tag className="w-3 h-3 mr-1 inline" /> {post.category}
                  </span>
                </div>
              </div>
              <div className="p-10">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-tighter">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                  <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.author}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">{post.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <button className="flex items-center font-black text-sm text-indigo-600 dark:text-indigo-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  Read Article <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-20 text-center">
        <button className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
          Load More Articles
        </button>
      </div>
    </div>
  );
};

export default BlogView;
