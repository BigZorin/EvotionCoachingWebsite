import ExerciseLibraryClient from "./exercises/ExerciseLibraryClient"

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Oefeningen</h1>
        <p className="text-muted-foreground">
          Beheer je oefeningenbibliotheek
        </p>
      </div>

      <ExerciseLibraryClient />
    </div>
  )
}
