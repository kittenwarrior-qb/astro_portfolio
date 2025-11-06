'use client'

import { useEffect, useState } from 'react'
import { cn } from '~/lib/utils'

interface LeetCodeStats {
  status: string
  message: string
  totalSolved: number
  totalQuestions: number
  easySolved: number
  totalEasy: number
  mediumSolved: number
  totalMedium: number
  hardSolved: number
  totalHard: number
  acceptanceRate: number
  ranking: number
  contributionPoints: number
  reputation: number
  submissionCalendar: Record<string, number>
}

interface Props {
  username: string
}

async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
  const data = await response.json()

  if (!response.ok || data.status !== 'success') {
    throw new Error(`Failed to fetch LeetCode stats for ${username}`)
  }

  return data
}

export default function LeetCodeCard({ username }: Props) {
  const [stats, setStats] = useState<LeetCodeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeetCodeStats(username)
      .then(setStats)
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

  if (error || !stats) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">LeetCode</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Failed to load stats</p>
      </div>
    )
  }

  return (
    <a 
      href={`https://leetcode.com/${username}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 rounded-lg p-4 hover:shadow-md hover:translate-x-2 transition-all duration-300 block relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform -translate-x-full hover:translate-x-0 transition-transform duration-300"></div>
      <h3 className="font-medium text-base text-zinc-700 dark:text-zinc-300 mb-3 relative z-10">LeetCode</h3>

      <div className="flex flex-col items-start gap-2">
        <div className="text-left">
          <div className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">{stats.totalSolved}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Problems Solved</div>
        </div>
        <div className="text-left">
          <div className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">#{stats.ranking.toLocaleString()}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Global Rank</div>
        </div>
      </div>
    </a>
  )
}
