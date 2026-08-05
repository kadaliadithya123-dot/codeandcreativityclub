import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Faculty workspace — Code&Creativity" },
      {
        name: "description",
        content: "Manage question banks, tests, students and results for diploma coding assessments.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminShell,
});