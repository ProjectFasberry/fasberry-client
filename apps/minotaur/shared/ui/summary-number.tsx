export const SummaryNumber = ({ value }: { value: number }) => {
  return (
    <div className="flex items-center justify-center bg-neutral-800 h-8 aspect-square rounded-xl p-0.5">
      <span className="font-semibold text-sm">{value}</span>
    </div>
  )
}
