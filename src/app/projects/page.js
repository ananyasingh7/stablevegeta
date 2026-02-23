import { getRepos } from '../../lib/github'
import ProjectCard from '../../components/ProjectCard'

export const metadata = {
  title: 'Projects - stablevegeta',
  description: 'My open-source projects and contributions',
}

export default async function ProjectsPage() {
  const repos = await getRepos('ananyasingh')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Projects</h1>
        <p className="text-xl text-zinc-400">
          Open-source projects and experiments I've built
        </p>
      </div>

      {repos.length === 0 ? (
        <p className="text-zinc-500">No public repositories found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {repos.map((repo) => (
            <ProjectCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  )
}
