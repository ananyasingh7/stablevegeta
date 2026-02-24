import { getRepos } from '../../lib/github'
import { FaStar, FaCodeBranch } from 'react-icons/fa'

const CARD_ACCENT_COLORS = [
  'border-b-blue-600',
  'border-b-amber-500',
  'border-b-indigo-500',
]

export const metadata = {
  title: 'Portfolio - stablevegeta',
  description: 'My open-source projects and contributions',
}

export default async function ProjectsPage() {
  const repos = await getRepos('ananyasingh7')

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <h1 className="text-4xl font-bold mb-12">Portfolio</h1>

        {repos.length === 0 ? (
          <p className="text-zinc-500 text-lg">No public repositories found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {repos.map((repo, i) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-zinc-950 rounded-lg p-5 border border-zinc-800 border-b-4 ${CARD_ACCENT_COLORS[i % CARD_ACCENT_COLORS.length]} flex flex-col justify-between hover:bg-zinc-900 transition-colors`}
              >
                <div>
                  <p className="font-bold text-white text-lg mb-2">{repo.name}</p>
                  <p className="text-zinc-500 text-base leading-relaxed line-clamp-3">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-5 text-zinc-500 text-base">
                  <span className="flex items-center gap-1.5"><FaStar size={13} />{repo.stargazers_count.toLocaleString()}</span>
                  <span className="flex items-center gap-1.5"><FaCodeBranch size={13} />{repo.forks_count.toLocaleString()}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
