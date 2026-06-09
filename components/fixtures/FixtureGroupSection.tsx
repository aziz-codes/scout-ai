import type { FixtureGroup } from "@/types";
import { SectionHeader } from "@/components/ui";
import { FixtureRow } from "./FixtureRow";

interface FixtureGroupSectionProps {
  group: FixtureGroup;
}

export function FixtureGroupSection({ group }: FixtureGroupSectionProps) {
  return (
    <div className="mb-5">
      <SectionHeader>{group.name}</SectionHeader>
      {group.fixtures.map((fixture, i) => (
        <FixtureRow key={i} fixture={fixture} />
      ))}
    </div>
  );
}
