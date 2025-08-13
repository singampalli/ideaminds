import React, { useState, useEffect } from "react";

interface Locator {
  id: string;
  accessibilityLabel: string;
  xpath?: string;
}

interface TestItem {
  id: string;
  category: string;
  title: string;
  expected: string;
  priority: string;
  sampleData: string;
  preconditions: string;
  locators: Locator;
  platforms: string[];
}

interface InteractiveTestSuiteManagerProps {
  initialData: TestItem[];
}

interface ModalProps {
  onClose: () => void;
  onSave: (test: TestItem) => void;
  existing?: TestItem | null;
  defaultCategory?: string;
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  onSave,
  existing = null,
  defaultCategory = "Functionality",
}) => {
  const [form, setForm] = useState<TestItem>(
    existing || {
      id: "",
      category: defaultCategory,
      title: "",
      expected: "",
      priority: "P2 - Medium",
      sampleData: "",
      preconditions: "",
      locators: { id: "", accessibilityLabel: "", xpath: "" },
      platforms: ["Android"],
    }
  );

  const save = () => {
    if (!form.title) return alert("Title required");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow p-4 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{existing ? "Edit Test" : "Add Test"}</h2>
          <button onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border px-2 py-1 rounded"
          >
            <option>Layout</option>
            <option>Functionality</option>
            <option>Accessibility</option>
            <option>Styling & Branding</option>
            <option>Security & Privacy</option>
            <option>Edge Cases & Reliability</option>
            <option>Observability & Automation</option>
          </select>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="border px-2 py-1 rounded"
          >
            <option>P0 - Critical</option>
            <option>P1 - High</option>
            <option>P2 - Medium</option>
            <option>P3 - Low</option>
          </select>
          <textarea
            placeholder="Expected Result"
            value={form.expected}
            onChange={(e) => setForm({ ...form, expected: e.target.value })}
            className="border px-2 py-1 rounded h-24"
          />
          <input
            placeholder="Sample Data / Condition"
            value={form.sampleData}
            onChange={(e) => setForm({ ...form, sampleData: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            placeholder="Preconditions"
            value={form.preconditions}
            onChange={(e) => setForm({ ...form, preconditions: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              placeholder="Locator ID"
              value={form.locators.id}
              onChange={(e) =>
                setForm({
                  ...form,
                  locators: { ...form.locators, id: e.target.value },
                })
              }
              className="border px-2 py-1 rounded"
            />
            <input
              placeholder="Accessibility Label"
              value={form.locators.accessibilityLabel}
              onChange={(e) =>
                setForm({
                  ...form,
                  locators: { ...form.locators, accessibilityLabel: e.target.value },
                })
              }
              className="border px-2 py-1 rounded"
            />
            <input
              placeholder="XPath (if needed)"
              value={form.locators.xpath || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  locators: { ...form.locators, xpath: e.target.value },
                })
              }
              className="border px-2 py-1 rounded"
            />
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button onClick={onClose} className="px-3 py-1 rounded">Cancel</button>
            <button onClick={save} className="px-3 py-1 rounded bg-emerald-100">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InteractiveTestSuiteManager: React.FC<InteractiveTestSuiteManagerProps> = ({ initialData }) => {
  const [tests, setTests] = useState<TestItem[]>(initialData);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<TestItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<TestItem | null>(null);

  const addTest = (newTest: TestItem) => {
    const id = `${newTest.category.toLowerCase()}-${Date.now()}`;
    setTests((prev) => [{ ...newTest, id }, ...prev]);
    setShowAdd(false);
  };

  const updateTest = (updated: TestItem) => {
    setTests((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditing(null);
  };

  const deleteTest = (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
    setConfirmDelete(null);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(tests, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test-suite.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = ["All", ...Array.from(new Set(tests.map((t) => t.category)))];
  const priorities = ["All", ...Array.from(new Set(tests.map((t) => t.priority)))];

  const visible = tests.filter((t) => {
    if (filterCategory !== "All" && t.category !== filterCategory) return false;
    if (filterPriority !== "All" && t.priority !== filterPriority) return false;
    if (
      search &&
      !(`${t.title} ${t.expected} ${t.sampleData}`.toLowerCase().includes(search.toLowerCase()))
    )
      return false;
    return true;
  });

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Interactive Test Suite Manager</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded shadow-sm bg-slate-100" onClick={() => setShowAdd(true)}>Add Test</button>
          <button className="px-3 py-1 rounded shadow-sm bg-slate-100" onClick={exportJSON}>Export JSON</button>
        </div>
      </header>

      <section className="flex gap-2 mb-4 items-center">
        <input
          aria-label="search"
          placeholder="Search tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {priorities.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
              </section>

      <main>
        {visible.length === 0 && (
          <div className="text-center text-sm text-slate-500">
            No tests found. Add one or change filters.
          </div>
        )}
        <ul className="space-y-3">
          {visible.map((t) => (
            <li key={t.id} className="border rounded p-3 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{t.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100">{t.priority}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-50 text-slate-500">{t.category}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{t.expected}</p>
                  <p className="mt-1 text-xs text-slate-500">Sample: {t.sampleData}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setEditing(t)} className="px-2 py-1 rounded bg-amber-100">Edit</button>
                  <button onClick={() => setConfirmDelete(t)} className="px-2 py-1 rounded bg-red-100">Delete</button>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                <div>Preconditions: {t.preconditions}</div>
                <div>Locators: id={t.locators?.id} label={t.locators?.accessibilityLabel}</div>
                <div>Platforms: {t.platforms?.join(", ")}</div>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* Add Modal */}
      {showAdd && (
        <Modal
          onClose={() => setShowAdd(false)}
          onSave={addTest}
          defaultCategory="Functionality"
        />
      )}

      {/* Edit Modal */}
      {editing && (
        <Modal
          onClose={() => setEditing(null)}
          onSave={updateTest}
          existing={editing}
        />
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow max-w-sm w-full">
            <div className="font-medium mb-2">
              Delete test "{confirmDelete.title}"?
            </div>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="px-3 py-1 rounded bg-red-100" onClick={() => deleteTest(confirmDelete.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveTestSuiteManager;