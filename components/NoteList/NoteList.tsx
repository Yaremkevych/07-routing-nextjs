"use client";

import css from "./NoteList.module.css";

import { deleteNote } from "@/lib/api";
import { type Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface NoteListProps {
    noteList: Note[];
}

export default function NoteList({ noteList }: NoteListProps) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onSuccess: async () => {
            // важливо: у тебе ключі типу ["notes", page, word]
            // тому інвалідимо ВСІ запити, що починаються з "notes"
            await queryClient.invalidateQueries({ queryKey: ["notes"] });
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
                            disabled={isPending}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
