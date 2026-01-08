import { MapPin, ExternalLink, Eye, DollarSign, User } from "lucide-react";
import { Job } from "../types/job";

interface JobCardProps {
  job: Job;
  formatDate: (dateString: string | null | undefined) => string;
  onViewDetails: (job: Job) => void;
}

export default function JobCard({ job, formatDate, onViewDetails }: JobCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col h-full group">
      <div className="p-6 flex flex-col h-full">
        {/* Top: Meta & Type */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              {job.job_type}
            </span>
            {job.salary && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                <DollarSign className="w-3 h-3" />
                {job.salary}
              </span>
            )}
          </div>
          {job.posted_date && (
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">
              {job.posted_date}
            </span>
          )}
        </div>

        {/* Header: Title & Poster */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
            {job.title}
          </h3>
          {job.poster_name && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.poster_name}</span>
            </div>
          )}
          {job.company_name && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.company_name}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {job.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-medium">
                +{job.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Description Snippet */}
        <div className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3 flex-1">
          {job.description}
        </div>

        {/* Footer: Scrape Info & Buttons */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="text-[10px] text-slate-400 mb-3">
            Scraped: {formatDate(job.scraped_at)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(job)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
