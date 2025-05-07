"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const formPageHandler = (e) => {
    e.preventDefault();
    router.push("/MeetingForm");
  };

  return (
    <>
      <h1 className="text-center text-7xl text-red-400 font-semibold">
        Welcome To Meeting Scheduler
      </h1>
      <div className="mt-3 flex justify-center items-center">
        <h1
          className="text-center text-4xl text-emerald-400 font-semibold cursor-pointer"
          onClick={formPageHandler}
        >
          Meeting Form
        </h1>
      </div>
    </>
  );
}
