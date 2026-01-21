import { NoiseCalculator } from "@/components/noise-calculator"
import { HeatCalculator } from "@/components/heat-calculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground text-balance">Calculadora NR-15</h1>
          </div>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Calcule os limites de exposição ao ruído e calor conforme a Norma Regulamentadora 15
          </p>
        </header>

        {/* Main Calculator */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="noise" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="noise" className="text-base">
                Ruído
              </TabsTrigger>
              <TabsTrigger value="heat" className="text-base">
                Calor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="noise">
              <NoiseCalculator />
            </TabsContent>

            <TabsContent value="heat">
              <HeatCalculator />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Baseado na NR-15 - Atividades e Operações Insalubres</p>
          <p className="mt-2">Os resultados são informativos. Consulte um profissional de segurança do trabalho.</p>
        </footer>
      </div>
    </main>
  )
}
