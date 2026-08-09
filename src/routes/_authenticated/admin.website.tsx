import { createFileRoute } from "@tanstack/react-router";

import { CalendarEditor } from "@/components/admin/website/CalendarEditor";
import { ClubInfoEditor } from "@/components/admin/website/ClubInfoEditor";
import { EventsEditor } from "@/components/admin/website/EventsEditor";
import { MembersEditor } from "@/components/admin/website/MembersEditor";
import { UpdatesEditor } from "@/components/admin/website/UpdatesEditor";
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
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold">Website editor</h1>
        <p className="text-sm text-muted-foreground">
          Change any content on the public website — no code needed.
        </p>
      </header>
      <Tabs defaultValue="club" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="club">Club info &amp; hero</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="club" className="glass rounded-2xl p-6">
          <ClubInfoEditor />
        </TabsContent>
        <TabsContent value="calendar" className="glass rounded-2xl p-6">
          <CalendarEditor />
        </TabsContent>
        <TabsContent value="updates" className="glass rounded-2xl p-6">
          <UpdatesEditor />
        </TabsContent>
        <TabsContent value="events" className="glass rounded-2xl p-6">
          <EventsEditor />
        </TabsContent>
        <TabsContent value="team" className="glass rounded-2xl p-6">
          <MembersEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}