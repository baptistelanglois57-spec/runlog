# Process event reminders

Cette fonction Edge est le planificateur réel des rappels Agenda : elle écrit d'abord
la notification persistante dans le centre RunLog, puis envoie le Web Push aux appareils
inscrits. Elle est volontairement séparée du React client : elle fonctionne lorsque la PWA
est fermée.

## Étapes Supabase à effectuer après déploiement

1. Appliquer `supabase/migrations/202608130001_event_reminders_and_push.sql`.
2. Déployer la fonction : `supabase functions deploy process-event-reminders --no-verify-jwt`.
3. Ajouter les secrets : `SCHEDULER_SECRET`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` et
   `VAPID_SUBJECT` (par exemple `mailto:vous@example.com`). La même clé publique doit être
   exposée au front sous `VITE_VAPID_PUBLIC_KEY`.
4. Créer un cron Supabase ou externe toutes les cinq minutes qui exécute :

   ```sh
   curl -X POST "https://<project-ref>.supabase.co/functions/v1/process-event-reminders" \
     -H "x-scheduler-secret: <SCHEDULER_SECRET>"
   ```

Sans ces quatre étapes externes, les rappels restent correctement planifiés dans la table
mais ne peuvent pas être livrés lorsque l'application est fermée.
