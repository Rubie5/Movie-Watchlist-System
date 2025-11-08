"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditTopicForm({ id, title, description }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update topic");
      }

      router.refresh(); // refresh page data
      router.push("/");  // navigate back to home/list
    } catch (error) {
      setErrorMsg(error.message);
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-8">
      {errorMsg && <p className="text-red-600 font-semibold">{errorMsg}</p>}

      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Movie Title"
        required
        className="border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <input
        type="text"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        placeholder="Movie Description"
        required
        className="border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        type="submit"
        disabled={loading}
        className={`bg-green-600 text-white font-bold py-2 px-6 rounded w-fit hover:bg-green-700 transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Updating..." : "Update Movie"}
      </button>
    </form>
  );
}
