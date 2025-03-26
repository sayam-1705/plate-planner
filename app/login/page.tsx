import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Next.js Google OAuth</h1>
      <LoginButton />
    </main>
  );
}
