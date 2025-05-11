"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import "easymde/dist/easymde.min.css"

// Import SimpleMDE dynamically to avoid SSR issues
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
})

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
}

export function MarkdownEditor({ value, onChange, height = 400 }: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false)

  // Only render the editor on the client side
  useEffect(() => {
    setMounted(true)
  }, [])

  const options = {
    autofocus: false,
    spellChecker: false,
    placeholder: "Write your event description here...",
    status: ["lines", "words"],
    minHeight: `${height}px`,
  }

  if (!mounted) {
    return (
      <div
        style={{ height: `${height}px` }}
        className="border rounded-md p-4 bg-gray-50 flex items-center justify-center"
      >
        <p className="text-gray-400">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="markdown-editor">
      <SimpleMDE value={value} onChange={onChange} options={options} />
    </div>
  )
}
