"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import dayjs from "dayjs";

import { Calendar } from "@/components/ui/calendar";

function formatDate(date: Date) {
  return dayjs(date).format("YYYY-MM-DD");
}

function getFullAge(birthDate: Date) {
  return dayjs().diff(dayjs(birthDate), "year");
}

type CommonCalendarProps = {
  onAgeChange?: (age: number) => void;
  onDateChange?: (date: Date) => void;
  value?: Date | null;
  initialDate?: Date;
  label?: string;
  showAge?: boolean;
  isInvalid?: boolean;
  ariaDescribedBy?: string;
  minDate?: Date;
  maxDate?: Date;
  disableFuture?: boolean;
  wrapperClassName?: string;
  buttonHeightClassName?: string;
  buttonWidthClassName?: string;
  buttonClassName?: string;
};

export function CommonCalendar({
  onAgeChange,
  onDateChange,
  value,
  initialDate,
  label = "생년월일",
  showAge = true,
  isInvalid = false,
  ariaDescribedBy,
  minDate,
  maxDate,
  disableFuture = true,
  wrapperClassName = "",
  buttonHeightClassName = "h-[42px]",
  buttonWidthClassName = "w-[120px]",
  buttonClassName = "",
}: CommonCalendarProps) {
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | undefined>(() => initialDate);
  const selectedDate = value === undefined ? internalSelectedDate : value ?? undefined;
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
    <div className={`flex items-center gap-2 ${wrapperClassName}`} ref={containerRef}>
      <div className={`relative ${buttonHeightClassName} ${buttonWidthClassName}`}>
        <button
          type="button"
          aria-label={label}
          aria-expanded={isOpen}
          aria-describedby={ariaDescribedBy}
          onClick={() => setIsOpen((open) => !open)}
          className={`flex h-full w-full items-center justify-between rounded-xl border bg-white px-3 py-2.5 text-left text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100 ${isInvalid ? 'border-[#c4483d]' : 'border-slate-200'} ${buttonClassName}`}
        >
          <span>{selectedDate ? formatDate(selectedDate) : label}</span>
          <CalendarDays className="size-4 shrink-0 text-slate-500" strokeWidth={2} aria-hidden="true" />
        </button>
        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 z-50 rounded-xl bg-white shadow-lg">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              startMonth={minDate ?? dayjs("1900-01-01").toDate()}
              endMonth={maxDate ?? (disableFuture ? dayjs().toDate() : dayjs().add(10, "year").toDate())}
              disabled={(date) => (
                (minDate !== undefined && dayjs(date).isBefore(dayjs(minDate), "day")) ||
                (maxDate !== undefined && dayjs(date).isAfter(dayjs(maxDate), "day")) ||
                (disableFuture && maxDate === undefined && dayjs(date).isAfter(dayjs(), "day"))
              )}
              selected={selectedDate}
              defaultMonth={selectedDate}
              onSelect={(date) => {
                if (date) {
                  if (value === undefined) setInternalSelectedDate(date);
                  onAgeChange?.(getFullAge(date));
                  onDateChange?.(date);
                  setIsOpen(false);
                }
              }}
              className="rounded-xl border border-slate-200 bg-white p-3"
            />
          </div>
        )}
      </div>
      {showAge && selectedDate && (
        <span className="whitespace-nowrap text-sm text-slate-600">
          (만 {getFullAge(selectedDate)}세)
        </span>
      )}
    </div>
  );
}
