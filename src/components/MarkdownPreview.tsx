import { marked } from "marked"

interface MarkdownPreviewProps {
  value: string
}

const renderer = {
  link: function (href: string, title: string, text: string) {
    return '<a target="_blank" href="'+ href +'" title="' + title + '">' + (text ?? href) + '</a>';
  }
} as any

marked.use({ renderer })

export const MarkdownPreview = (props: MarkdownPreviewProps) => {
  return <div innerHTML={marked(props.value)}/>
}
