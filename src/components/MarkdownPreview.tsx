import { marked } from "marked"

interface MarkdownPreviewProps {
  value: string
}

export const MarkdownPreview = (props: MarkdownPreviewProps) => {
  return <div innerHTML={marked(props.value)}/>
}
