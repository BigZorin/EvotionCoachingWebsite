import AssignProgramClient from "./AssignProgramClient"

export default function AssignProgramPage({
  params,
}: {
  params: { id: string }
}) {
  return <AssignProgramClient programId={params.id} />
}
