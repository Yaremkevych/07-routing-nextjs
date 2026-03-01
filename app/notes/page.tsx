import {
    QueryClient,
    HydrationBoundary,
    dehydrate,
} from "@tanstack/react-query";

import { fetchNotes } from "../../lib/api";
import NotesClient from "./Notes.client";

import css from "./page.module.css";

export default async function Notes() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["notes", 1, ""],
        queryFn: () => fetchNotes({ page: 1, search: "", perPage: 12 }),
    });

    return (
        <main className={css.main}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <NotesClient />
            </HydrationBoundary>
        </main>
    );
}
