import { Trash2 } from "lucide-react";

import type { GymSet } from "../../types/Gym/GymSet";

type Props = {
  index: number;
  set: GymSet;
  onChange: (
    index: number,
    field: "reps" | "weight",
    value: number
  ) => void;

  onDelete: (index: number) => void;
};

export default function SetRow({
  index,
  set,
  onChange,
  onDelete,
}: Props) {
  return (
    <div className="gym-set-row">
      <span className="gym-set-row__number">
        {index + 1}
      </span>
      <div>
        <input
          type="number"
          min={0}
          value={set.reps ?? ""}
          placeholder="-"
          onChange={(e) =>
            onChange(
              index,
              "reps",
              e.target.value === ""
                ? undefined!
                : Number(
                    e.target.value
                  )
            )
          }
        />
      </div>
      <div>
        <input
          type="number"
          min={0}
          step="0.5"
          value={set.weight ?? ""}
          placeholder="-"
          onChange={(e) =>
            onChange(
              index,
              "weight",
              e.target.value === ""
                ? undefined!
                : Number(
                    e.target.value.replace(
                      ",",
                      "."
                    )
                  )
            )
          }
        />
      </div>
      <div>
        <button
          type="button"
          onClick={() =>
            onDelete(index)
          }
          aria-label={`Supprimer la série ${index + 1}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
