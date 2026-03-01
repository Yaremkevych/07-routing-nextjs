"use client";

import css from "./NoteList.module.css";

import { deleteNote } from "@/lib/api";
import { type Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

interface NoteListProps {
    noteList: Note[];
}

export default function NoteList({ noteList }: NoteListProps) {
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { mutate } = useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onMutate: (id: string) => {
            setDeletingId(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
        onSettled: () => {
            setDeletingId(null);
        },
    });

    return (
        <ul className={css.list}>
            {noteList.map((note) => (
                <li key={note.id} className={css.listItem}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>

                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>

                        <Link className={css.link} href={`/notes/${note.id}`}>
                            View details
                        </Link>

                        <button
                            type="button"
                            onClick={() => mutate(note.id)}
                            className={css.button}
                            disabled={deletingId === note.id}
                        >
                            {deletingId === note.id ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
