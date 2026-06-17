import { Helmet } from "react-helmet-async"

interface PageSEOProps {
  title: string
  description: string
  canonicalPath?: string
  ogImage?: string
  noIndex?: boolean
}

const BASE_URL = "https://promptlabz.vercel.app"
const DEFAULT_IMAGE = `${BASE_URL}/assets/mascot-login-new.png`

export function PageSEO({
  title,
  description,
  canonicalPath = "/",
  ogImage = DEFAULT_IMAGE,
  noIndex = false,
}: PageSEOProps) {
  const fullTitle = `${title} | PromptLabz`
  const canonical = `${BASE_URL}${canonicalPath}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
