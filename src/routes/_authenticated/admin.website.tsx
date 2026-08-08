import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { CalendarEditor } from "@/components/admin/website/CalendarEditor";
import { ClubInfoEditor } from "@/components/admin/website/ClubInfoEditor";
import { EventsEditor } from "@/components/admin/website/EventsEditor";
import { ExamStepsEditor } from "@/components/admin/website/ExamStepsEditor";
import { HeroEditor } from "@/components/admin/website/HeroEditor";
import { MembersEditor } from "@/components/admin/website/MembersEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin/website")({
  head: () => ({
    meta: [
      { title: "Website Editor — Code&Creativity" },
      {
        name: "description",
        content:
          "Edit every section of the Code & Creative Club website: hero, club info, events, calendar and team.",
      },
    ],
  }),
  component: WebsiteEditorPage,
});

function WebsiteEditorPage() {
  return (
    <AdminShell
      title="Website editor"
      description="Change any content on the public website — no code needed."
    >
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="hero">Home hero</TabsTrigger>
          <TabsTrigger value="steps">Exam steps</TabsTrigger>
          <TabsTrigger value="club">Club info</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="glass rounded-2xl p-6">
          <HeroEditor />
        </TabsContent>
        <TabsContent value="steps" className="glass rounded-2xl p-6">
          <ExamStepsEditor />
        </TabsContent>
        <TabsContent value="club" className="glass rounded-2xl p-6">
          <ClubInfoEditor />
        </TabsContent>
        <TabsContent value="calendar" className="glass rounded-2xl p-6">
          <CalendarEditor />
        </TabsContent>
        <TabsContent value="events" className="glass rounded-2xl p-6">
          <EventsEditor />
        </TabsContent>
        <TabsContent value="team" className="glass rounded-2xl p-6">
          <MembersEditor />
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}