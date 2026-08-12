import { useMemo, useState } from "react";

import { Clock3, Plus, Trash2 } from "lucide-react";

import ExerciseHistoryModal from "./ExerciseHistoryModal";
import ExerciseLibraryModal from "./ExerciseLibraryModal";
import SetRow from "./SetRow";

import type {
  MuscleGroup,
  ExerciseLibrary,
} from "../../types/Gym/ExerciseLibrary";

import type { GymSession } from "../../types/GymSession";
import type { GymExercise } from "../../types/Gym/GymExercise";

import { addExercise } from "../../services/exerciseLibraryService";
import { resolveExerciseIdentity } from "../../utils/gymExerciseHistory";

type Props = {
  exercise: GymExercise;

  historySessions: GymSession[];

  exerciseLibrary: ExerciseLibrary[];

  refreshExercises: () => Promise<void>;

  index: number;

  onExerciseSelectionChange: (
    exerciseIndex: number,
    libraryExerciseId: string | null,
    exerciseName: string
  ) => void;

  onSetChange: (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number
  ) => void;

  onAddSet: (
    exerciseIndex: number
  ) => void;

  onDeleteSet: (
    exerciseIndex: number,
    setIndex: number
  ) => void;

  onDeleteExercise: (
    exerciseIndex: number
  ) => void;
};

const muscleGroups: MuscleGroup[] = [
  "Pectoraux",
  "Dos",
  "Épaules",
  "Biceps",
  "Triceps",
  "Avant-bras",
  "Jambes",
  "Abdos",
];

export default function ExerciseCard({
  exercise,
  historySessions,
  exerciseLibrary,
  refreshExercises,
  index,
  onExerciseSelectionChange,
  onSetChange,
  onAddSet,
  onDeleteSet,
  onDeleteExercise,
}: Props) {
  const [showHistory, setShowHistory] =
    useState(false);

  const [showLibraryModal, setShowLibraryModal] =
    useState(false);

  const resolution = useMemo(
    () => resolveExerciseIdentity(exercise, exerciseLibrary),
    [exercise, exerciseLibrary]
  );

  const resolvedLibraryExercise = useMemo(
    () => exerciseLibrary.find((item) => item.id === resolution.exerciseId) ?? null,
    [exerciseLibrary, resolution.exerciseId]
  );

  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup>(
    resolvedLibraryExercise?.muscleGroup ?? "Pectoraux"
  );

  const filteredExercises =
    useMemo(
      () =>
        exerciseLibrary.filter(
          (exercise) =>
            exercise.muscleGroup ===
            selectedGroup
        ),
      [
        exerciseLibrary,
        selectedGroup,
      ]
    );

  async function handleCreateExercise(
    value: string,
    muscleGroup: MuscleGroup
  ) {
    const createdExercise = await addExercise(
      value,
      muscleGroup
    );

    await refreshExercises();

    if (createdExercise) {
      setSelectedGroup(createdExercise.muscleGroup);
      onExerciseSelectionChange(index, createdExercise.id, createdExercise.name);
    }

    setShowLibraryModal(false);
  }

  return (
    <>
      <section className="gym-exercise-card">
        <div className="gym-exercise-card__header">
          <h2>Exercice {index + 1}</h2>
          <div>
            <button type="button" onClick={() => setShowHistory(true)} aria-label="Historique de l'exercice">
              <Clock3 size={18} />
            </button>
            <button type="button" className="gym-exercise-card__delete" onClick={() => onDeleteExercise(index)} aria-label="Supprimer l'exercice">
              <Trash2 size={17} />
            </button>
          </div>
        </div>
        <div className="gym-exercise-card__fields">
          <label>
            <span>Groupe musculaire</span>
            <select
              value={selectedGroup}
              onChange={(event) => {
                const nextGroup = event.target.value as MuscleGroup;
                setSelectedGroup(nextGroup);

                if (resolvedLibraryExercise?.muscleGroup !== nextGroup) {
                  onExerciseSelectionChange(index, null, "");
                }
              }}
            >
                {muscleGroups.map(
                  (group) => (
                    <option
                      key={group}
                      value={group}
                    >
                      {group}
                    </option>
                  )
                )}
            </select>
          </label>
          <label>
            <span>Exercice</span>
            <select
              value={resolution.exerciseId ?? ""}
              onChange={(event) => {
                const selectedExercise = exerciseLibrary.find(
                  (item) => item.id === event.target.value
                );
                onExerciseSelectionChange(
                  index,
                  selectedExercise?.id ?? null,
                  selectedExercise?.name ?? ""
                );
              }}
            >
                <option value="">
                  Choisir un exercice
                </option>

                {filteredExercises.map(
                  (exercise) => (
                    <option
                      key={
                        exercise.id
                      }
                      value={exercise.id}
                    >
                      {exercise.name}
                    </option>
                  )
                )}
            </select>
          </label>
        </div>
        <button type="button" className="gym-exercise-card__new" onClick={() => setShowLibraryModal(true)}>
          <Plus size={15} /> Nouvel exercice
        </button>
        <div className="gym-exercise-card__sets">
          <div className="gym-exercise-card__sets-header"><span>Série</span><span>Répétitions</span><span>Poids</span><span /></div>
          {exercise.sets.map(
              (set, setIndex) => (
                <SetRow
                  key={setIndex}
                  index={setIndex}
                  set={set}
                  onChange={(
                    row,
                    field,
                    value
                  ) =>
                    onSetChange(
                      index,
                      row,
                      field,
                      value
                    )
                  }
                  onDelete={(row) =>
                    onDeleteSet(
                      index,
                      row
                    )
                  }
                />
              )
          )}
        </div>
        <button type="button" className="gym-exercise-card__add-set" onClick={() => onAddSet(index)}>
          <Plus size={16} /> Ajouter une série
        </button>
      </section>

      <ExerciseHistoryModal
        isOpen={showHistory}
        onClose={() =>
          setShowHistory(false)
        }
        exerciseName={exercise.name}
        exerciseId={resolution.exerciseId}
        exerciseLibrary={exerciseLibrary}
        sessions={historySessions}
      />

      <ExerciseLibraryModal
        isOpen={showLibraryModal}
        title="Nouvel exercice"
        initialMuscleGroup={
          selectedGroup
        }
        onClose={() =>
          setShowLibraryModal(false)
        }
        onSave={
          handleCreateExercise
        }
      />
    </>
  );
}
