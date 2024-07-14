import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-120px)]">
      <h1 className="text-3xl font-bold mb-6">Welcome to FileDrop</h1>
      <Link
        href="/dashboard"
        className="flex items-center justify-center bg-black/90 dark:bg-yellow-400 text-white dark:text-black p-3 px-6 rounded-full font-semibold"
      >
        Lets Go <ArrowRight className="ml-4" />
      </Link>
    </div>
  );
}
