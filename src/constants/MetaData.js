export function getMetaTitle (append) {
  return `${process.env.NEXT_PUBLIC_METADATA_TITLE}${append ? `: ${append}` : ''}`
}
