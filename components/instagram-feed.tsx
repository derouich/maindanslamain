"use client"

interface InstagramFeedProps {
  username: string
  className?: string
}

export default function InstagramFeed({ username, className = "" }: InstagramFeedProps) {
  return (
    <div className={`instagram-feed ${className}`}>
      <iframe
        title={`Instagram feed de ${username}`}
        src={`https://www.instagram.com/${username}/embed`}
        width="100%"
        height="600"
        frameBorder="0"
        scrolling="no"
        allowTransparency={true}
        className="rounded-lg shadow-md"
      ></iframe>
    </div>
  )
}

