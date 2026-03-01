"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes, type FetchNotesResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./Notes.client.module.css";
import type { NoteTag } from "@/types/note";

const perPage = 12;

const VALID_TAGS: readonly NoteTag[] = [
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
] as const;

function isNoteTag(tag: string): tag is NoteTag {
    return (VALID_TAGS as readonly string[]).includes(tag);
}

interface NotesClientProps {
    initialTag: string;
}

export default function NotesClient({ initialTag }: NotesClientProps) {
    const [page, setPage] = useState(1);

    // 1) те, що змінюється на кожну клавішу
    const [searchInput, setSearchInput] = useState("");

    // 2) те, що реально використовуємо в запиті (debounced)
    const [debouncedSearch] = useDebounce(searchInput, 500);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const activeTag: NoteTag | "" = isNoteTag(initialTag) ? initialTag : "";

    const { data, isLoading, isError, isFetching } =
        useQuery<FetchNotesResponse>({
            queryKey: ["notes", activeTag, page, debouncedSearch],
            queryFn: () =>
                fetchNotes({
                    tag: activeTag,
                    page,
                    perPage,
                    search: debouncedSearch,
                }),
            placeholderData: (prev) => prev,
            staleTime: 60_000,
        });

    const handleSearch = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onSearch={handleSearch} />

                {data && data.totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                    />
                )}

                <button
                    className={css.button}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create note +
                </button>
            </header>

            {isLoading && <p>Loading...</p>}
            {!isLoading && isError && <p>Something went wrong.</p>}

            {!isLoading && !isError && data && data.notes.length > 0 && (
                <>
                    <NoteList noteList={data.notes} />
                    {isFetching && (
                        <div className={css.fetchingLoader}>Updating...</div>
                    )}
                </>
            )}

            {!isLoading && !isError && data && data.notes.length === 0 && (
                <p>
                    {debouncedSearch
                        ? "No notes match your search"
                        : "No notes in this category"}
                </p>
            )}

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm onClose={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}
