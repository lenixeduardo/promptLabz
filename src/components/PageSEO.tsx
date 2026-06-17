import { Helmet } from "react-helmet-async"

interface PageSEOProps {
  title: string
  description: string
  canonicalPath?: string
  ogImage?: string
  ogType?: "website" | "article"
  noIndex?: boolean
}

const BASE_URL = "https://promptlabz.vercel.app"
const DEFAULT_IMAGE = `${BASE_URL}/assets/mascot-login-new.png`
const SITE_NAME = "PromptLabz"

export function PageSEO({
  title,
  description,
  canonicalPath = "/",
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  noIndex = false,
}: PageSEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const canonical = `${BASE_URL}${canonicalPath}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@promptlabz" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
