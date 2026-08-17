-- Un achievement Musculation est unique pour une performance donnée d'une
-- séance. Cette contrainte complète la vérification applicative et protège
-- contre un double enregistrement concurrent sans toucher aux notifications
-- existantes.
create unique index if not exists notifications_gym_record_dedupe_idx
  on public.notifications (entity, "entityId")
  where entity = 'gym-record';
