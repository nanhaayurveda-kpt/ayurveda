export const dynamic = "force-dynamic";

import Link from "next/link";

const SECTIONS = [
  {
    icon: "🎓",
    title: "छात्र जोड़ना",
    steps: [
      "Home से Students tile पर जाएं",
      "+ Add बटन दबाएं",
      "छात्र का नाम, Professional Year, Roll Number, Phone भरें",
      "Admission No अपने आप भर जाएगा",
      "Save Student दबाएं",
    ],
  },
  {
    icon: "👨‍🏫",
    title: "प्रोफेसर जोड़ना",
    steps: [
      "Home से Professors tile पर जाएं",
      "+ Add बटन दबाएं",
      "नाम, Designation, Qualification, Phone भरें",
      "6 अंकों का PIN अपने आप Phone से बनेगा",
      "Save करने के बाद Profile पर जाकर Subject Assign करें",
    ],
  },
  {
    icon: "✅",
    title: "छात्रों की उपस्थिति",
    steps: [
      "Home से Student Attendance tile पर जाएं",
      "Date select करें और Show दबाएं",
      "BAMS के सामने Mark → दबाएं",
      "हर छात्र के लिए P (Present), A (Absent), N/A चुनें",
      "Save Attendance दबाएं",
      "अनुपस्थित छात्रों के अभिभावकों को WhatsApp भेजें",
    ],
  },
  {
    icon: "👨‍🏫",
    title: "प्रोफेसरों की उपस्थिति",
    steps: [
      "Home से Professor Attendance tile पर जाएं",
      "Date select करें",
      "हर प्रोफेसर के लिए Present, Absent, N/A चुनें",
      "Save Attendance दबाएं",
    ],
  },
  {
    icon: "💰",
    title: "फीस रिकॉर्ड करना",
    steps: [
      "सबसे पहले Fee Structure में Fee Package बनाएं",
      "Home से Fees tile पर जाएं",
      "+ Record बटन दबाएं",
      "Faculty और Student select करें",
      "Professional Year dropdown से year चुनें",
      "Fee items manually checkbox से select करें",
      "Paid Date भरें तो paid होगा, खाली रहे तो pending",
      "Save Fee दबाएं",
    ],
  },
  {
    icon: "🏷️",
    title: "Fee Structure बनाना",
    steps: [
      "Home से Fee Structure tile पर जाएं",
      "+ Add Package बटन दबाएं",
      "Professional Year और Academic Year भरें",
      "Fee types select करें और amount भरें",
      "Save Package दबाएं",
    ],
  },
  {
    icon: "🏥",
    title: "Clinical Logbook",
    steps: [
      "Home से Clinical Logbook tile पर जाएं",
      "+ Add Entry दबाएं",
      "Student, Date, Department, Case Type चुनें",
      "Diagnosis और Procedures भरें",
      "Save Entry दबाएं",
      "Professor Verify कर सकते हैं Mark Verified से",
    ],
  },
  {
    icon: "🩺",
    title: "Internship Tracking",
    steps: [
      "Home से Internship tile पर जाएं",
      "+ Add Posting दबाएं",
      "Student, Department, Start/End Date भरें",
      "Supervisor select करें",
      "Save Posting दबाएं",
      "पूरा होने पर Mark Complete दबाएं",
    ],
  },
  {
    icon: "📑",
    title: "NCISM Compliance Report",
    steps: [
      "Home से NCISM Report tile पर जाएं",
      "सभी modules में data भरने के बाद checklist ✓ होगी",
      "Print बटन से report print करें",
      "Inspection के समय यह report दिखाएं",
    ],
  },
  {
    icon: "📝",
    title: "परीक्षा और परिणाम",
    steps: [
      "Home से Exams & Results tile पर जाएं",
      "+ Add Exam दबाएं — Subject, Date, Max Marks भरें",
      "Results tab पर जाकर हर छात्र के marks भरें",
      "Marksheet tile से Professional Year wise marksheet print करें",
    ],
  },
  {
    icon: "🏅",
    title: "Certificate बनाना",
    steps: [
      "Home से Certificates tile पर जाएं",
      "+ Issue Certificate दबाएं",
      "Student और Certificate Type चुनें (TC, Character, Bonafide)",
      "Issue Date और विवरण भरें",
      "Save करने के बाद Print करें",
    ],
  },
  {
    icon: "⚙️",
    title: "Settings (पहली बार जरूर करें)",
    steps: [
      "Home से Settings tile पर जाएं",
      "College Name, University Name भरें",
      "Principal का नाम भरें",
      "NCISM Affiliation Number भरें",
      "Logo upload करें",
      "Save Settings दबाएं",
    ],
  },
  {
    icon: "👨‍🎓",
    title: "Student Portal",
    steps: [
      "Home से Student Login tile पर जाएं",
      "छात्र Admission No और Phone Number से login करें",
      "Password = Phone के आखिरी 6 अंक",
      "छात्र अपनी fees, attendance, results देख सकता है",
    ],
  },
  {
    icon: "🔑",
    title: "Professor Portal",
    steps: [
      "Home से Professor Login tile पर जाएं",
      "Professor अपना 6 अंकों का PIN डालें",
      "PIN = Phone के आखिरी 6 अंक",
      "Professor अपनी class की attendance mark कर सकते हैं",
    ],
  },
];

export default function HelpPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/home" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
          ← Home
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">सहायता केंद्र</h1>
          <p className="text-gray-500 text-xs mt-0.5">Ayurveda College ERP — उपयोग की जानकारी</p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
        <p className="text-sm font-semibold text-green-800">📌 शुरुआत करने से पहले</p>
        <p className="text-xs text-green-700 mt-1">सबसे पहले Settings में जाकर College का नाम, Principal का नाम और NCISM Affiliation Number भरें। इसके बाद Professors और Students add करें।</p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((sec, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-green-600 px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">{sec.icon}</span>
              <h2 className="text-white font-bold text-sm">{sec.title}</h2>
            </div>
            <ol className="px-4 py-3 space-y-2">
              {sec.steps.map((step, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="shrink-0 w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {j + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 mt-5 text-center">
        <p className="text-xs text-gray-500">किसी समस्या के लिए संपर्क करें</p>
        <a href="https://wa.me/919996865069" target="_blank" rel="noopener noreferrer"
          className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          📲 WhatsApp Support
        </a>
      </div>
    </div>
  );
}