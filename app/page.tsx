import { redirect } from 'next/navigation'

// The approved CNC portal design is served as a static file from /public/portal.html.
// We send the site root straight there instead of the old /dashboard scaffold.
export default function Home() {
  redirect('/index.html')
}
