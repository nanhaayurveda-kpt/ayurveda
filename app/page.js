export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";

const features = [
  {
    icon: "🎓",
    title: "Student Management",
    desc: "Name, professional year, roll number, father's name, phone — all records in one place. Add one by one or import in bulk.",
  },
  {
    icon: "💰",
    title: "Fee Collection & Receipt",
    desc: "Record fees, print receipt instantly. See who paid and who didn't at a glance. Send WhatsApp reminders to defaulters in one click.",
  },
  {
    icon: "✅",
    title: "Daily Attendance",
    desc: "Mark attendance professional year-wise every day. See present and absent count instantly. WhatsApp alert to guardians of absent students.",
  },
  {
    icon: "🔑",
    title: "Professor PIN Login",
    desc: "Every professor gets a 6-digit PIN. They login from their mobile and mark attendance only for their subjects. Principal sees it instantly.",
  },
  {
    icon: "📝",
    title: "Exams & Results",
    desc: "Schedule internal, mid-term and annual exams. Enter marks — grade and pass/fail decided automatically. Print result sheets.",
  },
  {
    icon: "📄",
    title: "Marksheet",
    desc: "Internal, mid-term and annual marksheet for the entire course together. Print directly.",
  },
  {
    icon: "🏅",
    title: "Certificates",
    desc: "Transfer, character, bonafide and migration certificates — in one click. College name, logo and principal name added automatically.",
  },
  {
    icon: "📋",
    title: "Exam Forms",
    desc: "Track exam form submission and exam fee payment status for every student each semester.",
  },
  {
    icon: "📊",
    title: "Reports — NAAC Ready",
    desc: "Student count, fee collection, attendance percentage and exam results — all on one page. All data required for NAAC accreditation available.",
  },
  {
    icon: "📣",
    title: "Notice Board",
    desc: "Post college notices with priority. Urgent notices appear with a red badge.",
  },
  {
    icon: "📱",
    title: "Mobile & Desktop",
    desc: "Works like an Android app on mobile and a Windows application on computer. One purchase — works on both.",
  },
];

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? await getSession(token) : null;
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-5">
            🌿 Ayurvedic College Management Software — BAMS
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Every Need of Your Ayurvedic College
            <br />
            <span className="text-green-600">
              In One Software — On Mobile
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-3">
            Students · Fees · Attendance · Exams · Certificates · Exam Forms —
            all in one place.
          </p>
          <p className="text-sm text-green-600 font-medium mb-8">
            Keep all records digital for NAAC accreditation and NCISM compliance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
            <Link
              href="/login"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium text-sm shadow-sm"
            >
              Admin Login →
            </Link>
            <Link
              href="/professor-login"
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg hover:bg-yellow-600 font-medium text-sm shadow-sm"
            >
              🔑 Professor Login
            </Link>
            <Link
              href="/student/login"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium text-sm shadow-sm"
            >
              🎓 Student Login
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Install on Android: Chrome → ⋮ → Add to Home Screen
          </p>
        </div>

        {/* Features */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            What's Included?
          </h2>
          <p className="text-center text-gray-400 text-sm mb-8">
            {features.length} features — one software, one price
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="text-3xl mb-2">{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-green-900 rounded-2xl p-10 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Start Today — 7 Days Free
          </h2>
          <p className="text-green-300 mb-6 text-sm">
            No card. No setup fees. Direct support from developer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm text-green-300">
            <a href="tel:+919996865069" className="hover:text-white">
              📞 9996865069
            </a>
            <span className="hidden sm:inline">|</span>
            <a
              href="https://wa.me/919996865069"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              💬 WhatsApp
            </a>
            <span className="hidden sm:inline">|</span>
            <a
              href="mailto:prasad.kamta@gmail.com"
              className="hover:text-white"
            >
              ✉️ prasad.kamta@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}