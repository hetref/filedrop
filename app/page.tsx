import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-120px)]">
      <h1 className="text-3xl font-bold mb-6">Welcome to FileDrop</h1>
      <Link
        href="/dashboard"
        className="flex items-center justify-center bg-emerald-700 text-white dark:bg-emerald-600/40 p-3 px-6 rounded-full font-semibold"
      >
        Lets GO <ArrowRight className="ml-4" />
      </Link>
    </div>
  );
}
