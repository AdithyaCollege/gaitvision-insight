import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, FileText, Folder, FolderOpen, ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { TemporalAttentionChart } from "@/components/TemporalAttentionChart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Analytical History Tree — GaitVision AI" },
      {
        name: "description",
        content:
          "Browse historical gait analyses in a hierarchical tree by year, quarter and patient with quick explainability previews.",
      },
      { property: "og:title", content: "Analytical History Tree — GaitVision AI" },
      {
        property: "og:description",
        content: "Hierarchical archive of past gait scans with temporal attention previews.",
      },
    ],
  }),
  component: HistoryPage,
});

type Leaf = {
  id: string;
  label: string;
  patient: string;
  date: string;
  dx: string;
  confidence: number;
  tone: "normal" | "warn" | "risk";
  localization: string;
  summary: string;
};

const tree: { year: string; quarters: { name: string; scans: Leaf[] }[] }[] = [
  {
    year: "2026",
    quarters: [
      {
        name: "Q3 (July – Sept)",
        scans: [
          {
            id: "s1",
            label: "Patient #80492 — Spastic Gait",
            patient: "#PX-80492 · Arthur Bennett",
            date: "12 Jul 2026 · 09:41",
            dx: "Spastic",
            confidence: 0.78,
            tone: "risk",
            localization: "Right knee & ankle dorsiflexion",
            summary:
              "Sustained attention peaks during terminal stance with reduced knee flexion amplitude on the right limb. Circumduction pattern detected across 3 consecutive cycles.",
          },
          {
            id: "s2",
            label: "Patient #80493 — Normal",
            patient: "#PX-80493 · Marta Oyelaran",
            date: "12 Jul 2026 · 11:05",
            dx: "Normal",
            confidence: 0.94,
            tone: "normal",
            localization: "Symmetric bilateral loading",
            summary:
              "Attention distributed evenly across heel strike and midstance. Step length variance within normative range (CV 2.8%).",
          },
          {
            id: "s3",
            label: "Patient #80488 — Parkinsonian",
            patient: "#PX-80488 · Henrik Sørensen",
            date: "11 Jul 2026 · 15:22",
            dx: "Parkinsonian",
            confidence: 0.69,
            tone: "warn",
            localization: "Trunk & hip flexion, reduced arm swing",
            summary:
              "Shortened shuffling steps with high-frequency attention on the pelvis. Festination observed in the last 2 seconds of the walk test.",
          },
        ],
      },
      {
        name: "Q2 (Apr – Jun)",
        scans: [
          {
            id: "s4",
            label: "Patient #80471 — Ataxic",
            patient: "#PX-80471 · Claudia Ferrer",
            date: "28 Jun 2026 · 10:12",
            dx: "Ataxic",
            confidence: 0.63,
            tone: "warn",
            localization: "Lateral trunk sway, wide base",
            summary:
              "Irregular step width with attention concentrated on the shoulders during swing phase, consistent with cerebellar involvement.",
          },
          {
            id: "s5",
            label: "Patient #80465 — Normal",
            patient: "#PX-80465 · Ravi Chandrasekar",
            date: "14 May 2026 · 08:30",
            dx: "Normal",
            confidence: 0.91,
            tone: "normal",
            localization: "No focal abnormality",
            summary: "Baseline post-operative assessment. Cadence 108 steps/min, symmetry index 0.97.",
          },
        ],
      },
    ],
  },
  {
    year: "2025",
    quarters: [
      {
        name: "Q4 (Oct – Dec)",
        scans: [
          {
            id: "s6",
            label: "Patient #80402 — Hemiplegic",
            patient: "#PX-80402 · Eileen Park",
            date: "02 Dec 2025 · 13:47",
            dx: "Hemiplegic",
            confidence: 0.74,
            tone: "risk",
            localization: "Left hip hike & foot drop",
            summary:
              "Asymmetric attention weighting favouring the left limb during swing. Compensatory pelvic elevation detected.",
          },
        ],
      },
    ],
  },
];

const toneClass = {
  normal: "bg-normal text-normal-foreground",
  warn: "bg-warn text-warn-foreground",
  risk: "bg-risk text-risk-foreground",
};

function HistoryPage() {
  const [openYears, setOpenYears] = useState<string[]>(["2026"]);
  const [openQuarters, setOpenQuarters] = useState<string[]>(["2026Q3 (July – Sept)"]);
  const [selected, setSelected] = useState<Leaf>(tree[0]!.quarters[0]!.scans[0]!);

  const toggle = (arr: string[], set: (v: string[]) => void, key: string) =>
    set(arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key]);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
        <div className="mb-6">
          <p className="text-xs font-medium tracking-wide text-primary uppercase">Archive</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Analytical History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            6 archived sessions across 2 years · organised by acquisition period
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(300px,380px)_1fr]">
          <section className="clinical-card p-3">
            <p className="px-2 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Session tree
            </p>
            <div className="space-y-0.5">
              {tree.map((y) => {
                const yOpen = openYears.includes(y.year);
                return (
                  <div key={y.year}>
                    <button
                      onClick={() => toggle(openYears, setOpenYears, y.year)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <ChevronRight
                        className={cn("size-3.5 text-muted-foreground transition-transform", yOpen && "rotate-90")}
                      />
                      {yOpen ? (
                        <FolderOpen className="size-4 text-primary" />
                      ) : (
                        <Folder className="size-4 text-primary" />
                      )}
                      {y.year}
                    </button>

                    {yOpen &&
                      y.quarters.map((q) => {
                        const qKey = y.year + q.name;
                        const qOpen = openQuarters.includes(qKey);
                        return (
                          <div key={qKey} className="ml-4 border-l border-border pl-2">
                            <button
                              onClick={() => toggle(openQuarters, setOpenQuarters, qKey)}
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted"
                            >
                              <ChevronRight
                                className={cn(
                                  "size-3.5 text-muted-foreground transition-transform",
                                  qOpen && "rotate-90",
                                )}
                              />
                              {qOpen ? (
                                <FolderOpen className="size-4 text-muted-foreground" />
                              ) : (
                                <Folder className="size-4 text-muted-foreground" />
                              )}
                              <span className="truncate">{q.name}</span>
                              <span className="ml-auto text-[11px] text-muted-foreground">
                                {q.scans.length}
                              </span>
                            </button>

                            {qOpen && (
                              <div className="ml-4 border-l border-border pl-2">
                                {q.scans.map((s) => (
                                  <button
                                    key={s.id}
                                    onClick={() => setSelected(s)}
                                    className={cn(
                                      "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-muted",
                                      selected.id === s.id &&
                                        "bg-primary-soft font-medium text-accent-foreground",
                                    )}
                                  >
                                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                                    <span className="truncate">{s.label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="clinical-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">{selected.patient}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{selected.date}</p>
              </div>
              <span
                className={cn("rounded-full px-3 py-1 text-xs font-medium", toneClass[selected.tone])}
              >
                {selected.dx} · {(selected.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="mt-5 rounded-xl border border-border bg-muted/30 p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Temporal attention preview
              </p>
              <TemporalAttentionChart />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs font-medium text-muted-foreground">Clinical localization</p>
                <p className="mt-1.5 text-sm font-medium">{selected.localization}</p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs font-medium text-muted-foreground">Model</p>
                <p className="mt-1.5 text-sm font-medium">GaitVision v2.4 · 120 frames @ 30 fps</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border p-4">
              <p className="text-xs font-medium text-muted-foreground">Quick summary</p>
              <p className="mt-1.5 text-sm leading-relaxed">{selected.summary}</p>
            </div>

            <div className="mt-5 flex gap-2">
              <Button size="sm">
                Open full analysis <ArrowUpRight className="size-4" />
              </Button>
              <Button size="sm" variant="outline">
                Export report
              </Button>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
