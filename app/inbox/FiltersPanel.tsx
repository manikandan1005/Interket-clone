"use client";

import {
  Badge,
  Box,
  Button,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Checkbox, Menu } from "@chakra-ui/react";
import {
  ChevronDownIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { useEffect, useMemo, useState } from "react";
import type { Channel, ChatStatus, SortField } from "@/lib/types";
import { useInboxStore } from "@/lib/store";
import { toggleDirection } from "@/lib/utils";

const ALL_CHANNELS: Channel[] = ["WhatsApp", "Instagram", "Facebook"];
const ALL_STATUSES: (ChatStatus | "All")[] = ["All", "Open", "Closed", "Resolved"];
const ALL_LABELS = ["Support", "Sales", "VIP"];
const SORT_FIELDS: { label: string; value: SortField }[] = [
  { label: "Last Activity", value: "lastActivity" },
  { label: "Name", value: "name" },
  { label: "Status", value: "status" },
  { label: "Assignee", value: "assignee" },
];
interface Props {

  setCreateContact: React.Dispatch<React.SetStateAction<boolean>>,
  setListContact: React.Dispatch<React.SetStateAction<boolean>>,

}


export default function FiltersPanel({ setCreateContact, setListContact }: Props) {
  const filters = useInboxStore((s) => s.filters);
  const team = useInboxStore((s) => s.team);
  const setFilters = useInboxStore((s) => s.actions.setFilters);
  const clearFilters = useInboxStore((s) => s.actions.clearFilters);


  const [searchDraft, setSearchDraft] = useState(() => filters.search);
  useEffect(() => {
    const handle = setTimeout(() => setFilters({ search: searchDraft }), 180);
    return () => clearTimeout(handle);
  }, [searchDraft, setFilters]);

  const assigneeLabel = useMemo(() => {
    if (filters.assigneeId === "All") return "All";
    if (filters.assigneeId === "Unassigned") return "Unassigned";
    return team.find((t) => t.id === filters.assigneeId)?.name ?? "Assignee";
  }, [filters.assigneeId, team]);

  return (
    <Stack gap="4">
      <Box>
        <Text fontSize="sm" fontWeight="600" mb="2">
          Search
        </Text>

        <HStack
          key={filters.search}
          gap="2"
          px="3"
          py="2"
          borderWidth="1px"
          borderRadius="md"
          bg="canvas"
        >
          <MagnifyingGlassIcon aria-hidden />
          <Input
            aria-label="Search chats"
            variant="outline"
            borderWidth={0}
            boxShadow="none"
            placeholder="Search chats..."
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
          />

          {searchDraft.trim().length > 0 && (
            <Button
              aria-label="Clear search"
              variant="ghost"
              size="xs"
              onClick={() => setSearchDraft("")}
            >
              <Cross2Icon />
            </Button>
          )}
        </HStack>
      </Box>
      <Box>
        <Text fontSize="sm" fontWeight="600" mb="2">
          Contact
        </Text>
        <div className="!flex !gap-4 w-full">
          <Button className="!bg-green-500" onClick={() => setCreateContact(true)}> Add</Button>
          <Button className="!bg-blue-500" onClick={() => setListContact(true)}>List</Button>
        </div>

      </Box>
      <Box>
        <Text fontSize="sm" fontWeight="600" mb="2">
          Status
        </Text>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              variant="outline"
              w="full"
              justifyContent="space-between"
              aria-label="Select status"
            >
              {filters.status}
              <ChevronDownIcon />
            </Button>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content>
              {ALL_STATUSES.map((s) => (
                <Menu.Item
                  key={s}
                  value={s}
                  onClick={() => setFilters({ status: s })}
                >
                  {s}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Box>

      <Box>
        <Text fontSize="sm" fontWeight="600" mb="2">
          Channels
        </Text>
        <VStack align="stretch" gap="2">
          {ALL_CHANNELS.map((ch) => {
            const checked = filters.channels.includes(ch);
            return (
              <Checkbox.Root
                key={ch}
                checked={checked}
                onCheckedChange={() => {
                  const next = checked
                    ? filters.channels.filter((c) => c !== ch)
                    : [...filters.channels, ch];
                  setFilters({ channels: next });
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>{ch}</Checkbox.Label>
              </Checkbox.Root>
            );
          })}
        </VStack>
      </Box>

      <Box>
        <Text fontSize="sm" fontWeight="600" mb="2">
          Assignee
        </Text>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              variant="outline"
              w="full"
              justifyContent="space-between"
              aria-label="Select assignee"
            >
              {assigneeLabel}
              <ChevronDownIcon />
            </Button>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="All" onClick={() => setFilters({ assigneeId: "All" })}>
                All
              </Menu.Item>
              <Menu.Item
                value="Unassigned"
                onClick={() => setFilters({ assigneeId: "Unassigned" })}
              >
                Unassigned
              </Menu.Item>
              <Menu.Separator />
              {team.map((m) => (
                <Menu.Item
                  key={m.id}
                  value={m.id}
                  onClick={() => setFilters({ assigneeId: m.id })}
                >
                  {m.name}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Box>

      <Box>
        <Text fontSize="sm" fontWeight="600" mb="2">
          Labels
        </Text>
        <HStack wrap="wrap" gap="2">
          {ALL_LABELS.map((l) => {
            const active = filters.labels.includes(l);
            return (
              <Button
                key={l}
                size="xs"
                variant={active ? "solid" : "outline"}
                colorPalette={active ? "brand" : undefined}
                onClick={() => {
                  setFilters({
                    labels: active
                      ? filters.labels.filter((x) => x !== l)
                      : [...filters.labels, l],
                  });
                }}
                aria-pressed={active}
              >
                {l}
              </Button>
            );
          })}
        </HStack>
      </Box>

      <TagsEditor />

      <Box>
        <Text fontSize="sm" fontWeight="600" mb="2">
          Sort
        </Text>
        <Stack gap="2">
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="outline"
                w="full"
                justifyContent="space-between"
                aria-label="Select sort field"
              >
                {
                  SORT_FIELDS.find((f) => f.value === filters.sort.field)
                    ?.label
                }
                <ChevronDownIcon />
              </Button>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content>
                {SORT_FIELDS.map((f) => (
                  <Menu.Item
                    key={f.value}
                    value={f.value}
                    onClick={() =>
                      setFilters({
                        sort: { ...filters.sort, field: f.value },
                      })
                    }
                  >
                    {f.label}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          <Button
            variant="outline"
            w="full"
            onClick={() =>
              setFilters({
                sort: {
                  ...filters.sort,
                  direction: toggleDirection(filters.sort.direction),
                },
              })
            }
            aria-label="Toggle sort direction"
          >
            <MixerHorizontalIcon />
            {filters.sort.direction.toUpperCase()}
          </Button>
        </Stack>
      </Box>

      <HStack gap="2">
        <Button variant="ghost" w="full" onClick={clearFilters}>
          Clear Filters
        </Button>
        <Button variant="solid" colorPalette="brand" w="full">
          Apply Filters
        </Button>
      </HStack>

      {(filters.labels.length > 0 || filters.tags.length > 0) && (
        <Box>
          <Text fontSize="xs" color="muted" mb="2">
            Active
          </Text>
          <HStack wrap="wrap" gap="2">
            {filters.labels.map((l) => (
              <Badge key={`label_${l}`} colorPalette="brand" variant="subtle">
                {l}
              </Badge>
            ))}
            {filters.tags.map((t) => (
              <Badge key={`tag_${t}`} variant="outline">
                {t}
              </Badge>
            ))}
          </HStack>
        </Box>
      )}
    </Stack>
  );
}

function TagsEditor() {
  const filters = useInboxStore((s) => s.filters);
  const setFilters = useInboxStore((s) => s.actions.setFilters);
  const [draft, setDraft] = useState("");

  return (
    <Box>
      <Text fontSize="sm" fontWeight="600" mb="2">
        Tags
      </Text>

      <HStack wrap="wrap" gap="2" mb="2">
        {filters.tags.map((t) => (
          <Button
            key={t}
            size="xs"
            variant="outline"
            onClick={() => setFilters({ tags: filters.tags.filter((x) => x !== t) })}
            aria-label={`Remove tag ${t}`}
          >
            {t} <Cross2Icon />
          </Button>
        ))}
      </HStack>

      <HStack
        gap="2"
        px="3"
        py="2"
        borderWidth="1px"
        borderRadius="md"
        bg="canvas"
      >
        <Input
          aria-label="Add tag"
          variant="outline"
          borderWidth={0}
          boxShadow="none"
          placeholder="Add tag"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const value = draft.trim();
              if (!value) return;
              if (filters.tags.includes(value)) return;
              setFilters({ tags: [...filters.tags, value] });
              setDraft("");
            }
          }}
        />
        <Button
          aria-label="Add tag"
          size="xs"
          variant="outline"
          onClick={() => {
            const value = draft.trim();
            if (!value) return;
            if (filters.tags.includes(value)) return;
            setFilters({ tags: [...filters.tags, value] });
            setDraft("");
          }}
        >
          <PlusIcon />
        </Button>
      </HStack>
    </Box>
  );
}
