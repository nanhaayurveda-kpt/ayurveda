"use client";

import { useState, useMemo } from "react";

const FIXED_TYPES = [
  { value: "tuition", label: "Tuition Fee" },
  { value: "admission", label: "Admission Fee" },
  { value: "practical", label: "Practical Fee" },
  { value: "hostel", label: "Hostel Fee" },
  { value: "library", label: "Library Fee" },
  { value: "misc", label: "Miscellaneous" },
];

const FIXED_SLUGS = new Set([
  "tuition", "admission", "practical", "hostel", "library", "misc",
]);

export default function FeeAddForm({
  allStudents, packages, duesMap, concessions, today, currentAcademicYear,
}) {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [semesterItems, setSemesterItems] = useState({});
  const [semesterChecked, setSemesterChecked] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [paidDate, setPaidDate] = useState("");
  const [amountPaidNow, setAmountPaidNow] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const studentPackages = useMemo(() => {
    if (!selectedStudentId) return [];
    const student = allStudents.find((s) => s.id === selectedStudentId);
    if (!student) return [];
    return packages.filter((p) => p.course === student.course);
  }, [selectedStudentId, allStudents, packages]);

  function handleStudentChange(e) {
    const id = parseInt(e.target.value);
    setSelectedStudentId(id);
    setSelectedSem("");
    setSemesterItems({});
    setSemesterChecked({});
    setCustomItems([]);
    setAmountPaidNow("");
  }

  function handleSemChange(e) {
    const semVal = e.target.value;
    setSelectedSem(semVal);
    setSemesterChecked({});
    setCustomItems([]);

    if (!semVal) { setSemesterItems({}); return; }

    const pkg = packages.find(
      (p) => p.semester === semVal &&
        p.course === allStudents.find((s) => s.id === selectedStudentId)?.course,
    );

    if (pkg && pkg.items) {
      const items = {};
      const custom = [];
      for (const item of pkg.items) {
        if (FIXED_SLUGS.has(item.fee_type)) {
          items[item.fee_type] = String(item.amount);
        } else {
          custom.push({
            semester: semVal,
            name: item.label || item.fee_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            slug: item.fee_type,
            amount: String(item.amount),
          });
        }
      }
      setSemesterItems({ [semVal]: items });
      setCustomItems(custom);
    } else {
      setSemesterItems({});
    }
  }

  function toggleItem(feeType) {
    setSemesterChecked((sc) => ({ ...sc, [feeType]: !sc[feeType] }));
  }

  function addCustomItem() {
    setCustomItems((prev) => [...prev, { semester: selectedSem, name: "", slug: "", amount: "" }]);
  }

  function updateCustom(index, field, val) {
    setCustomItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: val } : it)));
  }

  function removeCustom(index) {
    setCustomItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSemesterAmount(feeType, val) {
    setSemesterItems((prev) => ({ ...prev, [selectedSem]: { ...prev[selectedSem], [feeType]: val } }));
  }

  const items = semesterItems[selectedSem] || {};

  const grossTotal = useMemo(() => {
    let total = 0;
    for (const ft of FIXED_TYPES) {
      if (semesterChecked[ft.value] && items[ft.value]) {
        total += parseInt(items[ft.value] || 0) || 0;
      }
    }
    total += customItems.reduce((s, it) => s + (parseInt(it.amount) || 0), 0);
    return total;
  }, [semesterChecked, items, customItems]);

  const concessionInfo = concessions.find((c) => c.student_id === selectedStudentId);
  const concessionAmt = concessionInfo
    ? concessionInfo.discount_type === "percent"
      ? Math.round((grossTotal * concessionInfo.discount_value) / 100)
      : concessionInfo.discount_value
    : 0;
  const netDue = Math.max(0, grossTotal - concessionAmt);
  const selectedSemesters = selectedSem ? [selectedSem] : [];

  return (
    <form method="POST" action="/api/fees/add" onSubmit={() => setSubmitting(true)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Student <span className="text-red-500">*</span>
        </label>
        <select name="student_id" required value={selectedStudentId} onChange={handleStudentChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Select Student...</option>
          {allStudents.map((s) => (
            <option key={s.id} value={s.id}>{s.name} — {s.course} {s.semester || ""}</option>
          ))}
        </select>
      </div>

      {selectedStudentId !== "" && studentPackages.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professional Year <span className="text-red-500">*</span>
          </label>
          <select value={selectedSem} onChange={handleSemChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="">Select Year...</option>
            {studentPackages.map((pkg) => (
              <option key={pkg.id} value={pkg.semester || "General"}>
                {pkg.semester || "General"} — ₹{pkg.total_amount}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedStudentId !== "" && studentPackages.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
          <p className="text-xs text-yellow-700">No fee package found. Add a package first from Fee Structure.</p>
        </div>
      )}

      {selectedSem && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fee Items</label>
          <div className="space-y-1.5">
            {FIXED_TYPES.map((ft) => {
              if (!items[ft.value]) return null;
              const isChecked = !!semesterChecked[ft.value];
              return (
                <div key={ft.value} className={`border rounded-lg px-3 py-2.5 flex items-center gap-3 ${isChecked ? "border-green-400 bg-green-50" : "border-gray-200"}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggleItem(ft.value)} className="w-4 h-4 accent-green-600" />
                  {isChecked && <input type="hidden" name={`sem_${selectedSem}_fee_type_${ft.value}`} value={ft.value} />}
                  <span className="flex-1 text-sm text-gray-700">{ft.label}</span>
                  <input
                    type="number"
                    name={`sem_${selectedSem}_amount_${ft.value}`}
                    value={items[ft.value] || ""}
                    onChange={(e) => updateSemesterAmount(ft.value, e.target.value)}
                    min="1"
                    placeholder="₹"
                    disabled={!isChecked}
                    className={`w-24 border rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500 ${!isChecked ? "bg-gray-100 border-gray-200 text-gray-400" : "border-gray-300"}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Custom Items <span className="text-gray-400 text-xs font-normal">(exam fee, uniform, etc.)</span>
          </label>
          <button type="button" onClick={addCustomItem} className="text-xs text-green-600 font-medium">+ Add</button>
        </div>
        {customItems.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No custom items.</p>
        ) : (
          <div className="space-y-2">
            {customItems.map((it, i) => (
              <div key={i} className="border border-amber-200 bg-amber-50 rounded-lg px-3 py-2 flex items-center gap-2">
                <input type="text" name={`custom_name_${i}`} value={it.name} onChange={(e) => updateCustom(i, "name", e.target.value)} placeholder="Item name" required className="flex-1 border border-amber-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                <input type="number" name={`custom_amount_${i}`} value={it.amount} onChange={(e) => updateCustom(i, "amount", e.target.value)} min="1" required placeholder="₹" className="w-24 border border-amber-300 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-amber-400" />
                <button type="button" onClick={() => removeCustom(i)} className="text-red-500 text-lg font-bold w-6">×</button>
              </div>
            ))}
          </div>
        )}
        <input type="hidden" name="custom_count" value={customItems.length} />
      </div>

      {concessionInfo && grossTotal > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
          <p className="text-xs font-semibold text-green-700">💸 Concession: ₹{concessionAmt} off</p>
          <p className="text-xs text-green-600 mt-0.5">Net Payable: ₹{netDue}</p>
        </div>
      )}

      {grossTotal > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex justify-between">
          <span className="text-sm font-medium text-green-700">Total</span>
          <span className="text-lg font-bold text-green-700">₹{netDue || grossTotal}</span>
        </div>
      )}

      <input type="hidden" name="concession_amount" value={concessionAmt} />
      <input type="hidden" name="selected_semesters" value={JSON.stringify(selectedSemesters)} />
      <input type="hidden" name="semester_items" value={JSON.stringify(semesterItems)} />
      <input type="hidden" name="semester_checked" value={JSON.stringify(semesterChecked)} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
          <input type="text" name="academic_year" defaultValue={currentAcademicYear}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
          <input type="date" name="due_date" required defaultValue={today}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paid Date <span className="text-gray-400 text-xs">(empty = pending)</span>
          </label>
          <input type="date" name="paid_date" value={paidDate} onChange={(e) => setPaidDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        {paidDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Paid Now <span className="text-gray-400 text-xs">(empty = full)</span>
            </label>
            <input type="number" name="amount_paid_now" value={amountPaidNow} onChange={(e) => setAmountPaidNow(e.target.value)}
              min="0" placeholder={`₹${netDue || grossTotal}`}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit"
          disabled={submitting || !selectedSem || grossTotal === 0 || !selectedStudentId}
          className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? "Saving..." : "Save Fee"}
        </button>
        <a href="/fees" className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium text-center">Cancel</a>
      </div>
    </form>
  );
}