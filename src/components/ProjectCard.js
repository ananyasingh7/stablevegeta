import { FaStar, FaCodeBranch } from 'react-icons/fa'

export default function ProjectCard({ repo }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-semibold text-white hover:text-zinc-300 transition-colors"
          >
            {repo.name}
          </a>
          <p className="mt-2 text-zinc-400 text-sm line-clamp-2">
            {repo.description || 'No description available'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-4 text-sm text-zinc-500">
        {repo.language && (
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></span>
            {repo.language}
          </span>
        )}
        <span className="flex items-center">
          <FaStar className="mr-1" />
          {repo.stargazers_count}
        </span>
        <span className="flex items-center">
          <FaCodeBranch className="mr-1" />
          {repo.forks_count}
        </span>
      </div>
    </div>
  )
}
