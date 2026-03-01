export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
    content: string;
    id: string;
    tag: NoteTag;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface NewNote {
    title: string;
    content: string;
    tag: NoteTag;
}
