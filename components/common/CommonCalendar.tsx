"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import dayjs from "dayjs";

import { Calendar } from "@/components/ui/calendar";

function formatDate(date: Date) {
  return dayjs(date).format("YYYY-MM-DD");
}

function getFullAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }
  return age;
}

export function CommonCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="flex items-center gap-2" ref={containerRef}>
      <div className="relative w-full max-w-56">
        <button
          type="button"
          aria-label="생년월일 선택"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-[42px] w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
        >
          <span>{selectedDate ? formatDate(selectedDate) : "생년월일 선택"}</span>
          <CalendarDays className="size-4 shrink-0 text-slate-500" strokeWidth={2} aria-hidden="true" />
        </button>
        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 z-50 rounded-xl bg-white shadow-lg">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              startMonth={new Date(1900, 0)}
              endMonth={new Date()}
              disabled={{ after: new Date() }}
              selected={selectedDate}
              defaultMonth={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setIsOpen(false);
                }
              }}
              className="rounded-xl border border-slate-200 bg-white p-3"
            />
          </div>
        )}
      </div>
      {selectedDate && (
        <span className="whitespace-nowrap text-sm text-slate-600">
          (보험나이 만 {getFullAge(selectedDate)}세)
        </span>
      )}
    </div>
  );
}
