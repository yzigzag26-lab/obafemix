import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
export const metadata: Metadata = { title: "Privacy" };
export default function Privacy() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/" className="flex items-center gap-2"><Logo size={36} /><span className="font-display font-extrabold">OBAFEMIX</span></Link>
      <h1 className="font-display mt-10 text-4xl font-extrabold">Privacy <span className="text-gradient">Policy</span></h1>
      <div className="mt-8 space-y-5 leading-relaxed text-white/70">
        <p>This is a static portfolio. It runs no trackers, no analytics and no advertising cookies.</p>
        <h2 className="font-display text-xl font-bold text-white">Contact form</h2>
        <p>When you submit the contact form, your name, email address, subject and message are sent to this site's own API and stored in its database so the site owner can read and reply to them. They are not sold or shared with advertisers. If the API is unreachable, the form instead opens your own mail app (mailto:) with the message pre-filled.</p>
        <h2 className="font-display text-xl font-bold text-white">Browser storage</h2>
        <p>The public site sets no tracking cookies. The admin area uses one httpOnly session cookie (issued by the API after login, lasting 60 minutes) and keeps a local draft labelled <code>obafemix.adminDraft</code> in the admin's own browser as a backup.</p>
        <h2 className="font-display text-xl font-bold text-white">External links</h2>
        <p>Links to GitHub, Google Maps and WAZOBIA are governed by those services&apos; own policies.</p>
        <h2 className="font-display text-xl font-bold text-white">Contact</h2>
        <p>Questions: <a className="text-violet-300 underline" href="mailto:yzigzag26@gmail.com">yzigzag26@gmail.com</a></p>
      </div>
      <Link href="/" className="mt-10 inline-block text-violet-300">← Back to portfolio</Link>
    </main>
  );
}
