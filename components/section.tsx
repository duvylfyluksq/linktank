const Section = ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div className="mb-8 pb-8 border-b">
      <div className="py-4">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )

export default Section;