"use client";

import { useMemo, useState } from "react";

type Course = {
  id: number;
  name: string;
  credits: number;
  weight: number;
  score: number;
};

const initialCourses: Course[] = [
  { id: 1, name: "Mathematics", credits: 3, weight: 25, score: 84 },
  { id: 2, name: "Programming", credits: 4, weight: 30, score: 91 },
  { id: 3, name: "Database Systems", credits: 3, weight: 20, score: 78 },
  { id: 4, name: "Communication Skills", credits: 2, weight: 15, score: 88 },
];

function gradePoint(score: number) {
  if (score >= 85) return 4;
  if (score >= 80) return 3.7;
  if (score >= 75) return 3.3;
  if (score >= 70) return 3;
  if (score >= 65) return 2.7;
  if (score >= 61) return 2.3;
  if (score >= 58) return 2;
  if (score >= 55) return 1.7;
  if (score >= 50) return 1;
  return 0;
}

function gradeLetter(score: number) {
  if (score >= 85) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "B-";
  if (score >= 61) return "C+";
  if (score >= 58) return "C";
  if (score >= 55) return "C-";
  if (score >= 50) return "D";
  return "F";
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  const totals = useMemo(() => {
    const totalWeight = courses.reduce((sum, course) => sum + course.weight, 0);
    const weightedScore = courses.reduce(
      (sum, course) => sum + (course.score * course.weight) / 100,
      0,
    );
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const weightedGradePoints = courses.reduce(
      (sum, course) => sum + gradePoint(course.score) * course.credits,
      0,
    );
    const gpa = totalCredits ? weightedGradePoints / totalCredits : 0;
    const progress = Math.min((totalWeight / 100) * 100, 100);

    return {
      totalWeight,
      weightedScore,
      totalCredits,
      gpa,
      progress,
      remainingWeight: Math.max(100 - totalWeight, 0),
    };
  }, [courses]);

  const updateCourse = (
    id: number,
    field: keyof Omit<Course, "id">,
    value: string,
  ) => {
    setCourses((current) =>
      current.map((course) => {
        if (course.id !== id) return course;

        if (field === "name") {
          return { ...course, name: value };
        }

        const parsed = Number(value);
        return {
          ...course,
          [field]: Number.isNaN(parsed) ? 0 : parsed,
        };
      }),
    );
  };

  const addCourse = () => {
    setCourses((current) => [
      ...current,
      {
        id: Date.now(),
        name: `Course ${current.length + 1}`,
        credits: 3,
        weight: 10,
        score: 0,
      },
    ]);
  };

  const removeCourse = (id: number) => {
    setCourses((current) => current.filter((course) => course.id !== id));
  };

  return (
    <main className="mobile-safe min-h-screen px-4 py-4 sm:px-6 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
        <header className="entry-rise glass-panel rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <span className="inline-flex w-fit rounded-full bg-[#14324a] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                  Semester Tool
                </span>
                <h1 className="headline-font text-3xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  Semester Grade Calculator
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Weighted grades, live GPA, and semester progress in one simple layout.
                </p>
              </div>

              <button
                type="button"
                onClick={addCourse}
                className="rounded-2xl bg-[#ef7d57] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e16e48]"
              >
                Add Course
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <TopMetric
                tone="bg-[#14324a] text-white"
                label="Live GPA"
                value={totals.gpa.toFixed(2)}
              />
              <TopMetric
                tone="bg-white text-slate-900"
                label="Average"
                value={`${totals.weightedScore.toFixed(1)}%`}
              />
              <TopMetric
                tone="bg-white text-slate-900"
                label="Courses"
                value={`${courses.length}`}
              />
              <TopMetric
                tone="bg-white text-slate-900"
                label="Progress"
                value={`${totals.progress.toFixed(0)}%`}
              />
            </div>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.95fr]">
          <aside className="order-1 space-y-5 xl:sticky xl:top-5 xl:self-start">
            <div className="entry-rise glass-panel rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Semester Progress
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    {totals.progress.toFixed(0)}% complete
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {totals.totalWeight.toFixed(0)} / 100
                </span>
              </div>

              <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#14324a_0%,#3c8dbc_55%,#69b88d_100%)] transition-all duration-500"
                  style={{ width: `${totals.progress}%` }}
                />
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {totals.totalWeight > 100
                  ? "Weights are over 100%. Reduce one or more courses to bring the semester back into balance."
                  : totals.totalWeight === 100
                    ? "Your semester weighting is fully allocated."
                    : `You still have ${totals.remainingWeight.toFixed(0)}% of grading weight left to assign.`}
              </p>
            </div>

            <div className="entry-rise grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
              <StatCard label="Current GPA" value={totals.gpa.toFixed(2)} />
              <StatCard
                label="Weighted Average"
                value={`${totals.weightedScore.toFixed(1)}%`}
              />
              <StatCard label="Total Credits" value={`${totals.totalCredits}`} />
              <StatCard
                label="Remaining Weight"
                value={`${totals.remainingWeight.toFixed(0)}%`}
              />
            </div>

            <div className="entry-rise glass-panel rounded-[2rem] p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">Calculator Logic</h2>
              <div className="mt-4 space-y-3">
                <InfoRow
                  title="Weighted Grades"
                  text="Each course score contributes according to the percentage weight you assign."
                />
                <InfoRow
                  title="Live GPA"
                  text="Every score converts to grade points, then updates GPA using course credits."
                />
                <InfoRow
                  title="Progress Bar"
                  text="The bar fills as your course weights approach a complete 100% semester plan."
                />
              </div>
            </div>
          </aside>

          <section className="order-2 entry-rise glass-panel rounded-[2rem] p-4 sm:p-5 lg:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Course Inputs
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Weighted grades
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Mobile cards on small screens, denser editing layout on larger screens.
                </p>
              </div>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {courses.length} active entries
              </span>
            </div>

            <div className="soft-scrollbar space-y-4 overflow-auto">
              {courses.map((course, index) => (
                <article
                  key={course.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-4 shadow-[0_10px_30px_rgba(19,33,47,0.05)] sm:p-5"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Course {index + 1}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        {course.name || `Course ${index + 1}`}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      className="rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-600 transition hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
                    <Field
                      label="Course Name"
                      value={course.name}
                      onChange={(value) => updateCourse(course.id, "name", value)}
                    />
                    <NumberField
                      label="Credits"
                      value={course.credits}
                      onChange={(value) => updateCourse(course.id, "credits", value)}
                    />
                    <NumberField
                      label="Weight %"
                      value={course.weight}
                      onChange={(value) => updateCourse(course.id, "weight", value)}
                    />
                    <NumberField
                      label="Score %"
                      value={course.score}
                      onChange={(value) => updateCourse(course.id, "score", value)}
                    />
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <Tag label={`Letter ${gradeLetter(course.score)}`} tone="bg-[#14324a] text-white" />
                    <Tag
                      label={`Grade Point ${gradePoint(course.score).toFixed(1)}`}
                      tone="bg-[#f6eee5] text-[#7a4d2f]"
                    />
                    <Tag
                      label={`Contribution ${((course.score * course.weight) / 100).toFixed(1)}%`}
                      tone="bg-[#ecf5f0] text-[#2f7a68]"
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
      />
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel rounded-[1.5rem] p-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{value}</p>
    </div>
  );
}

function Tag({ label, tone }: { label: string; tone: string }) {
  return (
    <span className={`rounded-full px-3 py-2 text-center text-xs font-semibold ${tone}`}>
      {label}
    </span>
  );
}

function TopMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={`rounded-[1.5rem] p-4 shadow-[0_10px_24px_rgba(19,33,47,0.08)] ${tone}`}>
      <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function InfoRow({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
