"use client";

export function AuthPage({ isSignin }: {
    isSignin: boolean;
}) {
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
            <div className="p-6 m-2 bg-white rounded-lg shadow-md flex flex-col gap-4 w-80">
                <h1 className="text-2xl font-bold text-center">
                    {isSignin ? "Sign In" : "Sign Up"}
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 rounded"
                />

                <button className="bg-black text-white p-2 rounded hover:bg-gray-800">
                    {isSignin ? "Sign In" : "Sign Up"}
                </button>
            </div>
        </div>
    );
}