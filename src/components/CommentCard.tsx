// src/components/CommentCard.tsx
type Comment = {
    id: number
    body: string
    created_at: string
  }
  
  export function CommentCard({ comment }: { comment: Comment }) {
    return (
      <div className="bg-card border border-white/10 rounded-lg p-3 space-y-1">
        <p className="text-base text-text whitespace-pre-wrap">{comment.body}</p>
        <p className="text-xs text-subtext">
          {new Date(comment.created_at).toLocaleString('ja-JP')}
        </p>
      </div>
    )
  }
  