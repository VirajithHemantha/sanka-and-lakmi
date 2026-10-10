import React, { useState, useEffect } from "react";

export default function RSVPForm() {
  const endpoint = "https://script.google.com/macros/s/AKfycbyyjbyEKiO4y5fC__3Knx-2SXTWQN7eW1Nha8Z9SxL-LMZnKgg3qWU75vxCsKC5mG8C/exec";

  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [name, setName] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Auto-detect name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('guest');
    if (guestName) {
      setName(guestName);
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!endpoint) {
      setErrorMessage("RSVP saving is not configured yet.");
      return;
    }

    const payload = {
      name: name.trim(),
      attendance,
      submittedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      setSuccessMessage("RSVP saved. Thank you!");
    } catch {
      setErrorMessage("Could not submit RSVP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={submit} className="space-y-4 px-2">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAttendance("yes")}
            className={`py-3 rounded-xl text-[12px] uppercase tracking-widest font-bold border transition-colors ${attendance === "yes" ? "bg-[#C8B29E] text-white border-[#C8B29E]" : "bg-white text-zinc-400 border-zinc-200"
              }`}
          >
            Yes, I will attend
          </button>
          <button
            type="button"
            onClick={() => setAttendance("no")}
            className={`py-3 rounded-xl text-[12px] uppercase tracking-widest font-bold border transition-colors ${attendance === "no" ? "bg-zinc-700 text-white border-zinc-700" : "bg-white text-zinc-400 border-zinc-200"
              }`}
          >
            No, I cannot
          </button>
        </div>

        <div>
          <input
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Guest Name"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-[#3D2B1F] font-serif outline-none focus:border-[#C8B29E] focus:ring-1 focus:ring-[#C8B29E]"
          />
        </div>

        {errorMessage && <p className="text-[12px] text-red-600 font-semibold">{errorMessage}</p>}
        {successMessage && <p className="text-[12px] text-[#8B7355] font-bold">{successMessage}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#3D2B1F] text-white py-3.5 rounded-xl text-[12px] uppercase tracking-widest font-bold disabled:opacity-60 shadow-md transition-colors hover:bg-black mt-2"
        >
          {submitting ? "Submitting..." : "Submit RSVP"}
        </button>
      </form>
    </div>
  );
}
