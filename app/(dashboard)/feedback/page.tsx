"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import Input from "@/components/ui/Input";


type FeedbackForm = {
  content: string;
  channel: string;
  sourceRef: string;
  customerLabel: string;
};

type Feedback = {
  id: string;
  content: string;
  channel: string;
  sourceRef: string | null;
  customerLabel: string | null;
  status: string;
  createdAt: string;
};

export default function FeedbackPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FeedbackForm>();

  const { data: session } = useSession();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [analysis, setAnalysis] = useState<any>(null);
const [analyzingId, setAnalyzingId] = useState<string | null>(null);

const [editForm, setEditForm] = useState({
  content: "",
  channel: "",
  sourceRef: "",
  customerLabel: "",
});


  async function loadFeedbacks() {
    const response = await fetch("/api/feedback");
    const result = await response.json();

    if (result.success) {
      setFeedbacks(result.feedbacks);
    }
  }

  async function handleDelete(id: string) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this feedback?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/feedback/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);

    await loadFeedbacks();
  } catch {
    setError("Something went wrong.");
  }
}

async function handleUpdate() {
  if (!editingId) return;

  setError("");
  setSuccess("");

  try {
    const response = await fetch(`/api/feedback/${editingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    });

    const result = await response.json();

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);

    setEditingId(null);

    await loadFeedbacks();
  } catch {
    setError("Something went wrong.");
  }
}

async function handleAnalyze(id: string, content: string) {
  setAnalyzingId(id);
  setError("");

  try {
    const response = await fetch("/api/ai/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  id,
  feedback: content,
}),
    });

    const result = await response.json();

    if (!result.success) {
      setError(result.message);
      return;
    }

    setAnalysis(result.analysis);
  } catch {
    setError("AI analysis failed.");
  } finally {
    setAnalyzingId(null);
  }
}
  useEffect(() => {
    loadFeedbacks();
  }, []);

  async function onSubmit(data: FeedbackForm) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(result.message);
      reset();

      await loadFeedbacks();
    } catch {
      setError("Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        {session?.user.role !== "VIEWER" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-xl bg-white p-8 shadow"
        >
          <h1 className="text-3xl font-bold">
            Add Feedback
          </h1>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Feedback
            </label>

            <textarea
              rows={5}
              className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              {...register("content")}
            />
          </div>

          <Input
            label="Channel"
            {...register("channel")}
          />

          <Input
            label="Source Reference"
            {...register("sourceRef")}
          />

          <Input
            label="Customer Label"
            {...register("customerLabel")}
          />

          {error && (
            <p className="text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-600">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Feedback"}
          </button>
        </form>
)}

        <div className="mb-4 flex items-end gap-4">

  <div className="flex-1">
    <Input
      label="Search Feedback"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search by feedback content..."
    />
  </div>

  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">
      Status
    </label>

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="rounded-lg border border-gray-300 px-4 py-2"
    >
      <option value="ALL">All</option>
      <option value="NEW">New</option>
      <option value="IN_REVIEW">In Review</option>
      <option value="RESOLVED">Resolved</option>
    </select>
  </div>

</div>

        <div className="rounded-xl bg-white p-8 shadow">
          <h2 className="mb-4 text-2xl font-bold">
            Feedback History
          </h2>

          {feedbacks.length === 0 ? (
            <p className="text-gray-500">
              No feedback available.
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
  <tr className="border-b text-left">
    <th className="py-2">Content</th>
    <th>Channel</th>
    <th>Status</th>
    <th>Actions</th>
  </tr>
</thead>
              <tbody>
                {feedbacks
  .filter((feedback) => {
  const matchesSearch = feedback.content
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "ALL" ||
    feedback.status === statusFilter;

  return matchesSearch && matchesStatus;
})
  .map((feedback) => (
                 <tr
  key={feedback.id}
  className="border-b"
>
  <td className="py-3">
    {feedback.content}
  </td>

  <td>{feedback.channel}</td>

  <td>{feedback.status}</td>

 <td className="space-x-2">
  {session?.user.role !== "VIEWER" && (
    <>
      <button
        type="button"
        onClick={() => {
          setEditingId(feedback.id);

          setEditForm({
            content: feedback.content,
            channel: feedback.channel,
            sourceRef: feedback.sourceRef ?? "",
            customerLabel: feedback.customerLabel ?? "",
          });
        }}
        className="rounded bg-yellow-500 px-3 py-1 text-white"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={() => handleDelete(feedback.id)}
        className="rounded bg-red-600 px-3 py-1 text-white"
      >
        Delete
      </button>

      <button
        type="button"
        onClick={() => handleAnalyze(feedback.id, feedback.content)}
        disabled={analyzingId === feedback.id}
        className="rounded bg-blue-600 px-3 py-1 text-white"
      >
        {analyzingId === feedback.id ? "Analyzing..." : "Analyze"}
      </button>
    </>
  )}
</td>
</tr>

                ))}
              </tbody>
            </table>
          )}
          
        </div>
        
      </div>
      {editingId && session?.user.role !== "VIEWER" && (
  <div className="rounded-xl bg-white p-8 shadow">
    <h2 className="mb-4 text-2xl font-bold">
      Edit Feedback
    </h2>

    <div className="flex flex-col gap-4">

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Feedback
        </label>

        <textarea
          rows={5}
          value={editForm.content}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              content: e.target.value,
            })
          }
          className="rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>

      <Input
        label="Channel"
        value={editForm.channel}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            channel: e.target.value,
          })
        }
      />

      <Input
        label="Source Reference"
        value={editForm.sourceRef}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            sourceRef: e.target.value,
          })
        }
      />

      <Input
        label="Customer Label"
        value={editForm.customerLabel}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            customerLabel: e.target.value,
          })
        }
      />

      <div className="flex gap-3">
        <button
  type="button"
  onClick={handleUpdate}
  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
>
  Save Changes
</button>

        <button
          onClick={() => setEditingId(null)}
          className="rounded bg-gray-500 px-4 py-2 text-white"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}
{analysis && (
  <div className="rounded-xl bg-white p-6 shadow">
    <h2 className="mb-4 text-xl font-bold">
      AI Analysis
    </h2>

    <p>
      <strong>Sentiment:</strong> {analysis.sentiment}
    </p>

    <p>
      <strong>Category:</strong> {analysis.category}
    </p>

    <p>
      <strong>Summary:</strong> {analysis.summary}
    </p>
  </div>
)}
    </main>
  );
}