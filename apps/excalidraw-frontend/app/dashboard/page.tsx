
"use client";

import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
    const router = useRouter();

    const [roomName, setRoomName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function createRoom(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const name = roomName.trim();

        if (!name) {
            setError("Please enter a room name.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/signin");
            return;
        }

        setLoading(true);

        try {
            console.log("hi 1");
            const response = await fetch(`${HTTP_BACKEND}/room`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });
            console.log("hi 2");

            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                throw new Error(data.message || "Unable to create room.");
            }

            router.push(`/canvas/${data.roomId}`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    async function joinRoom(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const id = roomId.trim();

        if (!/^\d+$/.test(id) || Number(id) <= 0) {
            setError("Please enter a valid numeric room ID.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/signin");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${HTTP_BACKEND}/room/id/${encodeURIComponent(id)}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Room not found.");
            }

            router.push(`/canvas/${data.room.id}`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to join room."
            );
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        router.push("/signin");
    }

    return (
        <main className="min-h-screen bg-[#f8f9fc] text-gray-900">
            {/* Navbar */}
            <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 sm:px-12">
                <button
                    onClick={() => router.push("/")}
                    className="text-2xl font-bold tracking-tight"
                >
                    <span className="text-violet-600">Draw</span>Space
                </button>

                <button
                    onClick={logout}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
                >
                    Sign out
                </button>
            </nav>

            {/* Main content */}
            <section className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
                <div className="mb-12 text-center">
                    <span className="inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
                        Your creative workspace
                    </span>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
                        Let's bring your ideas to life.
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-500">
                        Create a new whiteboard to start drawing or join an
                        existing room to collaborate with your team in real
                        time.
                    </p>
                </div>

                <div className="grid gap-7 md:grid-cols-2">
                    {/* Create room card */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-9">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-3xl font-light text-violet-700">
                            +
                        </div>

                        <h2 className="mt-6 text-2xl font-semibold">
                            Create a room
                        </h2>

                        <p className="mt-3 min-h-12 leading-6 text-gray-500">
                            Start with a fresh canvas and turn your ideas
                            into something amazing.
                        </p>

                        <form onSubmit={createRoom} className="mt-7">
                            <label
                                htmlFor="roomName"
                                className="mb-2 block text-sm font-medium"
                            >
                                Room name
                            </label>

                            <input
                                id="roomName"
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="e.g. Project brainstorming"
                                maxLength={100}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full rounded-xl bg-violet-600 px-5 py-3.5 font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Please wait..." : "Create room →"}
                            </button>
                        </form>
                    </div>

                    {/* Join room card */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-9">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-3xl text-blue-700">
                            ↗
                        </div>

                        <h2 className="mt-6 text-2xl font-semibold">
                            Join a room
                        </h2>

                        <p className="mt-3 min-h-12 leading-6 text-gray-500">
                            Have a room ID from a friend? Enter it below
                            and continue on the same canvas.
                        </p>

                        <form onSubmit={joinRoom} className="mt-7">
                            <label
                                htmlFor="roomId"
                                className="mb-2 block text-sm font-medium"
                            >
                                Room ID
                            </label>

                            <input
                                id="roomId"
                                type="text"
                                inputMode="numeric"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Enter room ID"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-5 py-3.5 font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Please wait..." : "Join room →"}
                            </button>
                        </form>
                    </div>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mx-auto mt-7 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                <p className="mt-10 text-center text-sm text-gray-400">
                    One canvas. Many ideas. Real-time collaboration.
                </p>
            </section>
        </main>
    );
}
