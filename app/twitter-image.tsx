// Twitter card image — same composition as OG image (1200x630 accepted by Twitter)
// Duplicate the convention exports so Next.js static analysis works correctly.
export { default, alt, size, contentType } from './opengraph-image'

export const runtime = 'edge'
