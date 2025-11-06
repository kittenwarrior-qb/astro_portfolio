'use client'

import LeetCodeCard from './LeetCodeCard.tsx'
import GitHubCard from './GitHubCard.tsx'

interface Props {
  username: string
}

export default function ProfileCards({ username }: Props) {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeetCodeCard username={username} />
        <GitHubCard username={username} />
      </div>
    </section>
  )
}
