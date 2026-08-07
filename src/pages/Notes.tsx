import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  NotebookPen,
  Plus,
} from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";

import NoteCard from "../components/Notes/NoteCard";
import NoteModal from "../components/Notes/NoteModal";
import NoteDetailsModal from "../components/Notes/NoteDetailsModal";

import { theme } from "../styles/theme";
import { UI } from "../styles/ui";

import type { Note } from "../types/Note";

import {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
} from "../services/noteService";
import "./Tools/ToolSubpages.css";

export default function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] =
    useState<Note[]>([]);

  const [selectedNote, setSelectedNote] =
    useState<Note | null>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [editingNote, setEditingNote] =
    useState<Note | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    const data = await getNotes();

    setNotes(data);
  }

  async function handleSave(
    title: string,
    content: string,
    importantDate: string
  ) {
    if (editingNote) {
      await updateNote({
        ...editingNote,

        title,

        content,

        importantDate:
          importantDate || null,
      });
    } else {
      await addNote({
        title,

        content,

        importantDate:
          importantDate || null,
      });
    }

    setShowModal(false);

    setEditingNote(null);

    loadNotes();
  }

  async function handleDelete(
    id: string
  ) {
    if (
      !window.confirm(
        "Supprimer ce pense-bête ?"
      )
    ) {
      return;
    }

    await deleteNote(id);

    setSelectedNote(null);

    loadNotes();
  }

  return (
    <AppContainer>
      <div className="tools-subpage"><Section marginTop={8}>
        {/* HEADER */}

        <div className="tools-subpage__header"
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <button
            onClick={() =>
              navigate("/tools")
            }
            style={{
              width: 44,
              height: 44,

              borderRadius: 14,

              border: `1px solid ${theme.colors.border}`,

              background:
                theme.colors.card,

              display: "flex",
              justifyContent:
                "center",
              alignItems: "center",

              cursor: "pointer",
            }}
          >
            <ChevronLeft
              size={22}
              color={
                theme.colors.primary
              }
            />
          </button>

          <div className="tools-subpage__empty"
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <NotebookPen
              size={24}
              color={
                theme.colors.primary
              }
            />

            <h1
              style={{
                margin: 0,

                color:
                  theme.colors.primary,

                fontSize:
                  UI.FONT_H1,
              }}
            >
              Pense-bête
            </h1>
          </div>

          <div
            style={{
              width: 44,
            }}
          />
        </div>

        <button
          className="tools-subpage__primary"
          onClick={() => {
            setEditingNote(null);

            setShowModal(true);
          }}
          style={{
            width: "100%",

            background:
              theme.colors.primary,

            color: "#000",

            border: "none",

            borderRadius: 18,

            padding: "16px",

            fontWeight: 700,

            fontSize: 17,

            cursor: "pointer",

            marginBottom: 26,

            display: "flex",

            justifyContent:
              "center",

            alignItems: "center",

            gap: 10,
          }}
        >
          <Plus size={20} />

          Nouveau pense-bête
        </button>
                {notes.length === 0 ? (
          <div
            style={{
              background: theme.colors.card,

              border: `1px solid ${theme.colors.border}`,

              borderRadius: 22,

              padding: 40,

              textAlign: "center",
            }}
          >
            <NotebookPen
              size={52}
              color={theme.colors.primary}
            />

            <h2
              style={{
                color: theme.colors.primary,

                marginTop: 18,

                marginBottom: 12,
              }}
            >
              Aucun pense-bête
            </h2>

            <p
              style={{
                color:
                  theme.colors.textSecondary,

                margin: 0,

                lineHeight: 1.6,
              }}
            >
              Crée ton premier pense-bête
              pour noter une idée,
              une inscription ou une
              information importante.
            </p>
          </div>
       ) : (
  [...notes]
    .sort((a, b) => {
      if (
        a.importantDate &&
        b.importantDate
      ) {
        return (
          new Date(a.importantDate).getTime() -
          new Date(b.importantDate).getTime()
        );
      }

      if (a.importantDate) return -1;
      if (b.importantDate) return 1;

      return 0;
    })
    .map((note) => (
      <NoteCard
        key={note.id}
        note={note}
        onClick={() =>
          setSelectedNote(note)
        }
      />
    ))
)}

        <NoteModal
          isOpen={showModal}
          title={
            editingNote
              ? "Modifier le pense-bête"
              : "Nouveau pense-bête"
          }
          defaultTitle={
            editingNote?.title
          }
          defaultContent={
            editingNote?.content
          }
          defaultImportantDate={
            editingNote
              ?.importantDate || ""
          }
          onClose={() => {
            setShowModal(false);

            setEditingNote(null);
          }}
          onSave={handleSave}
        />

        <NoteDetailsModal
          isOpen={
            selectedNote !== null
          }
          note={selectedNote}
          onClose={() =>
            setSelectedNote(null)
          }
          onEdit={() => {
            if (!selectedNote) {
              return;
            }

            setEditingNote(
              selectedNote
            );

            setSelectedNote(null);

            setShowModal(true);
          }}
          onDelete={() => {
            if (!selectedNote) {
              return;
            }

            handleDelete(
              selectedNote.id
            );
          }}
        />
      </Section></div>
    </AppContainer>
  );
}
