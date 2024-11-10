type Debug = {
  values: object,
  position?: 'left' | 'right'
}

export const DebugPanel = ({
  values, position = 'left',
}: Debug) => {
  return (
    <div
      className={`absolute top-2
      ${position === 'right' ? 'right-2' : 'left-2'} z-[2]
      text-sm overflow-x-scroll bg-black/90 text-white p-6 max-w-[320px]`}
    >
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </div>
  )
}