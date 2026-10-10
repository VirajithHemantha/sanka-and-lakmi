import React, { useState, useEffect } from "react";

export default function WishesForm() {
  const endpoint = "https://script.google.com/macros/s/AKfycbyyjbyEKiO4y5fC__3Knx-2SXTWQN7eW1Nha8Z9SxL-LMZnKgg3qWU75vxCsKC5mG8C/exec";

  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  
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

    if (!message.trim()) {
      setErrorMessage("Please enter your message.");
      return;
    }

    // Since we don't have a backend yet, we'll just mock the success state if no endpoint is defined.
    // If you add a real endpoint to .env, it will use that.
    if (!endpoint) {
      setSubmitting(true);
      setTimeout(() => {
        setSuccessMessage("Your wishes have been saved. Thank you!");
        setMessage(""); // Clear the message on success
        setSubmitting(false);
      }, 1000);
      return;
    }

    const payload = {
      name: name.trim(),
      message: message.trim(),
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
      setSuccessMessage("Your wishes have been saved. Thank you!");
      setMessage(""); // Clear the message on success
    } catch {
      setErrorMessage("Could not submit wishes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={submit} className="space-y-4 px-2">
        <div>
          <input
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Your Name"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-[#3D2B1F] font-serif outline-none focus:border-[#C8B29E] focus:ring-1 focus:ring-[#C8B29E]"
          />
        </div>

        <div>
          <textarea
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
            placeholder="Write your wishes for the couple..."
            rows={4}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-[#3D2B1F] font-serif outline-none focus:border-[#C8B29E] focus:ring-1 focus:ring-[#C8B29E] resize-none"
          />
        </div>

        {errorMessage && <p className="text-[12px] text-red-600 font-semibold">{errorMessage}</p>}
        {successMessage && <p className="text-[12px] text-[#8B7355] font-bold">{successMessage}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#3D2B1F] text-white py-3.5 rounded-xl text-[12px] uppercase tracking-widest font-bold disabled:opacity-60 shadow-md transition-colors hover:bg-black mt-2"
        >
          {submitting ? "Sending..." : "Send Wishes"}
        </button>
      </form>
    </div>
  );
}
