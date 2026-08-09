import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, NotebookPen, Plus } from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import NoteCard from "../components/Notes/NoteCard";
import NoteDetailsModal from "../components/Notes/NoteDetailsModal";
import NoteModal from "../components/Notes/NoteModal";
import type { Note } from "../types/Note";
import {
  addNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../services/noteService";
import "./Notes.css";

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

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
        importantDate: importantDate || null,
      });
    } else {
      await addNote({
        title,
        content,
        importantDate: importantDate || null,
      });
    }

    setShowModal(false);
    setEditingNote(null);
    loadNotes();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer ce pense-bête ?")) {
      return;
    }

    await deleteNote(id);
    setSelectedNote(null);
    loadNotes();
  }

  function openCreateModal() {
    setEditingNote(null);
    setShowModal(true);
  }

  return (
    <AppContainer>
      <div className="notes-page">
        <Section marginTop={8}>
          <header className="notes-page__header">
            <button
              className="notes-page__back-button"
              type="button"
              aria-label="Retour aux outils"
              onClick={() => navigate("/tools")}
            >
              <ChevronLeft size={22} />
            </button>

            <h1>Pense-bête</h1>

            <span aria-hidden="true" />
          </header>

          <button
            className="notes-page__create-button"
            type="button"
            onClick={openCreateModal}
          >
            <Plus size={20} strokeWidth={2.5} />
            Nouveau pense-bête
          </button>

          {notes.length === 0 ? (
            <div className="notes-empty-state">
              <div className="notes-empty-state__icon" aria-hidden="true">
                <NotebookPen size={26} />
              </div>
              <h2>Aucun pense-bête</h2>
              <p>
                Crée ton premier pense-bête pour noter une idée, une inscription
                ou une information importante.
              </p>
              <button
                className="notes-empty-state__button"
                type="button"
                onClick={openCreateModal}
              >
                <Plus size={18} strokeWidth={2.5} />
                Nouveau pense-bête
              </button>
            </div>
          ) : (
            <div className="notes-page__list">
              {[...notes]
                .sort((a, b) => {
                  if (a.importantDate && b.importantDate) {
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
                    onClick={() => setSelectedNote(note)}
                  />
                ))}
            </div>
          )}

          <NoteModal
            isOpen={showModal}
            title={
              editingNote ? "Modifier le pense-bête" : "Nouveau pense-bête"
            }
            defaultTitle={editingNote?.title}
            defaultContent={editingNote?.content}
            defaultImportantDate={editingNote?.importantDate || ""}
            onClose={() => {
              setShowModal(false);
              setEditingNote(null);
            }}
            onSave={handleSave}
          />

          <NoteDetailsModal
            isOpen={selectedNote !== null}
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
            onEdit={() => {
              if (!selectedNote) {
                return;
              }

              setEditingNote(selectedNote);
              setSelectedNote(null);
              setShowModal(true);
            }}
            onDelete={() => {
              if (!selectedNote) {
                return;
              }

              handleDelete(selectedNote.id);
            }}
          />
        </Section>
      </div>
    </AppContainer>
  );
}
