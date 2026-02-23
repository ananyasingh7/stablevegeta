export async function getRepos(username) {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!res.ok) {
      throw new Error('Failed to fetch repos')
    }

    const repos = await res.json()

    // Filter out forks and sort by stars
    return repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return []
  }
}
