"use client";

export default function ErrorPage({ error }: { error: Error }) {
  console.error("Error occurred:", error);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="text-lg mb-2">Please try again later.</p>
      <pre className="bg-gray-100 p-4 rounded-md text-sm text-red-600">
        {error.message}
      </pre>
    </main>
  );
}