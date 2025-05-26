"use client"

interface ContentItem {
  id: string
  name: string
  value: number
}

export function ContentEngagement() {
  const contentItems: ContentItem[] = [
    { id: "creation", name: "Création startup", value: 65 },
    { id: "financement", name: "Financement et Aides", value: 55 },
    { id: "gestion", name: "Gestion et Développement", value: 45 },
    { id: "propriete", name: "Propriété intellectuelle", value: 35 },
    { id: "reglementation", name: "Réglementation et Législation", value: 25 },
    { id: "ecosysteme", name: "Écosystème et Networking", value: 15 },
  ]

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="space-y-4">
        {contentItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="text-sm text-gray-700">{item.name}</div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-24 rounded-full bg-gray-200">
                <div className="h-1 rounded-full bg-[#92bfff]" style={{ width: `${item.value}%` }} />
              </div>
              <div className="w-8 text-right text-xs text-gray-500">{item.value}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
