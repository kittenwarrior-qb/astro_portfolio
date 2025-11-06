'use client'

import { useEffect, useState } from 'react'
import { cn } from '~/lib/utils'

interface GitHubProfile {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  user_view_type: string
  site_admin: boolean
  name: string
  company: string | null
  blog: string
  location: string | null
  email: string | null
  hireable: boolean | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

interface Props {
  username: string
}

async function fetchGitHubProfile(username: string): Promise<GitHubProfile> {
  const response = await fetch(`https://api.github.com/users/${username}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub profile for ${username}`)
  }

  return data
}

export default function GitHubCard({ username }: Props) {
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGitHubProfile(username)
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [username])

  if (loading) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded mb-3"></div>
        <div className="flex flex-col gap-3">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">GitHub</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Failed to load profile</p>
      </div>
    )
  }

  return (
    <a 
      href={`https://github.com/${username}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 rounded-lg p-4 hover:shadow-md hover:translate-x-2 transition-all duration-300 block relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform -translate-x-full hover:translate-x-0 transition-transform duration-300"></div>
      <h3 className="font-medium text-base text-zinc-700 dark:text-zinc-300 mb-3 relative z-10">GitHub</h3>

      <div className="flex flex-col items-start gap-2">
        <div className="text-left">
          <div className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">{profile.public_repos}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Repositories</div>
        </div>
        <div className="text-left">
          <div className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">{profile.followers}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Followers</div>
        </div>
      </div>
    </a>
  )
}
