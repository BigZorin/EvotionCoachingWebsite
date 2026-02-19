import ProgramDetailClient from "./ProgramDetailClient"

export default function ProgramDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return <ProgramDetailClient programId={params.id} />
}
