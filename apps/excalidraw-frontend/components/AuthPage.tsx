
"use client";

import { HTTP_BACKEND } from "@/config";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const endpoint = isSignin ? "/signin" : "/signup";

            const body = isSignin
                ? { username: email, password }
                : { name, username: email, password };

            const response = await fetch(`${HTTP_BACKEND}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            if (isSignin) {
                if (!data.token) {
                    throw new Error("Token was not returned by the server");
                }

                localStorage.setItem("token", data.token);
                router.push("/");
            } else {
                router.push("/signin");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to connect to the server"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="m-2 flex w-full max-w-sm flex-col gap-4 rounded-xl bg-white p-6 shadow-md"
            >
                <h1 className="text-center text-2xl font-bold">
                    {isSignin ? "Sign In" : "Sign Up"}
                </h1>

                {!isSignin && (
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded border p-3"
                        required
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded border p-3"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded border p-3"
                    required
                />

                {error && (
                    <p role="alert" className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded bg-black p-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Please wait..."
                        : isSignin
                          ? "Sign In"
                          : "Sign Up"}
                </button>

                <p className="text-center text-sm text-gray-500">
                    {isSignin
                        ? "Don't have an account? "
                        : "Already have an account? "}
                    <button
                        type="button"
                        className="font-medium text-black underline"
                        onClick={() =>
                            router.push(isSignin ? "/signup" : "/signin")
                        }
                    >
                        {isSignin ? "Sign Up" : "Sign In"}
                    </button>
                </p>
            </form>
        </div>
    );
}
