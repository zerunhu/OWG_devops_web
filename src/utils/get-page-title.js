import defaultSettings from '@/settings'

const title = defaultSettings.title || 'OWG DevOps Platform'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
