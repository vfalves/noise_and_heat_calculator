"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Volume2, AlertTriangle, CheckCircle2 } from "lucide-react"

// Tabela NR-15 Anexo I - Limites de Tolerância para Ruído Contínuo ou Intermitente
const noiseLimits = [
  { db: 85, hours: 8 },
  { db: 86, hours: 7 },
  { db: 87, hours: 6 },
  { db: 88, hours: 5 },
  { db: 89, hours: 4.5 },
  { db: 90, hours: 4 },
  { db: 91, hours: 3.5 },
  { db: 92, hours: 3 },
  { db: 93, hours: 2.5 },
  { db: 94, hours: 2.25 },
  { db: 95, hours: 2 },
  { db: 96, hours: 1.75 },
  { db: 98, hours: 1.25 },
  { db: 100, hours: 1 },
  { db: 102, hours: 0.75 },
  { db: 104, hours: 0.5 },
  { db: 105, hours: 0.42 },
  { db: 106, hours: 0.35 },
  { db: 108, hours: 0.25 },
  { db: 110, hours: 0.17 },
  { db: 112, hours: 0.125 },
  { db: 114, hours: 0.083 },
  { db: 115, hours: 0.067 },
]

export function NoiseCalculator() {
  const [noiseLevel, setNoiseLevel] = useState<string>("")
  const [result, setResult] = useState<{
    maxExposure: number
    isUnhealthy: boolean
    additionalPercentage: number
    message: string
  } | null>(null)

  const calculateNoise = (db: number) => {
    // Acima de 115 dB não é permitido
    if (db > 115) {
      return {
        maxExposure: 0,
        isUnhealthy: true,
        additionalPercentage: 40,
        message: "Exposição não permitida sem proteção adequada",
      }
    }

    // Abaixo de 85 dB não é considerado insalubre
    if (db < 85) {
      return {
        maxExposure: 8,
        isUnhealthy: false,
        additionalPercentage: 0,
        message: "Nível de ruído dentro do limite de tolerância",
      }
    }

    // Encontra o limite mais próximo
    let limit = noiseLimits[0]
    for (const l of noiseLimits) {
      if (db >= l.db) {
        limit = l
      } else {
        break
      }
    }

    // De 85 a 115 dB - Insalubridade de grau médio (20%)
    return {
      maxExposure: limit.hours,
      isUnhealthy: true,
      additionalPercentage: 20,
      message: `Insalubridade de grau médio - Adicional de ${20}%`,
    }
  }

  const handleCalculate = () => {
    const db = Number.parseFloat(noiseLevel)
    if (isNaN(db) || db <= 0) {
      setResult(null)
      return
    }

    const calculated = calculateNoise(db)
    setResult(calculated)
  }

  const formatTime = (hours: number): string => {
    if (hours >= 1) {
      const h = Math.floor(hours)
      const m = Math.round((hours - h) * 60)
      return m > 0 ? `${h}h ${m}min` : `${h}h`
    } else {
      const minutes = Math.round(hours * 60)
      return `${minutes} minutos`
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          <CardTitle>Calculadora de Ruído</CardTitle>
        </div>
        <CardDescription>Informe o nível de ruído medido em decibéis (dB)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="noise-level">Nível de Ruído (dB)</Label>
          <Input
            id="noise-level"
            type="number"
            placeholder="Ex: 90"
            value={noiseLevel}
            onChange={(e) => {
              setNoiseLevel(e.target.value)
              handleCalculate()
            }}
            onBlur={handleCalculate}
            min="0"
            max="130"
          />
        </div>

        {result && (
          <Alert className={result.isUnhealthy ? "border-destructive bg-destructive/5" : "border-primary bg-primary/5"}>
            <div className="flex items-start gap-3">
              {result.isUnhealthy ? (
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              )}
              <div className="flex-1 space-y-3">
                <AlertTitle className="text-lg font-semibold">{result.message}</AlertTitle>
                <AlertDescription className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-sm font-medium">
                      Tempo máximo: {formatTime(result.maxExposure)}
                    </Badge>
                    {result.isUnhealthy && result.additionalPercentage > 0 && (
                      <Badge variant="destructive" className="text-sm font-medium">
                        Adicional: {result.additionalPercentage}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.maxExposure === 0
                      ? "É obrigatório o uso de EPI adequado (protetor auricular) e medidas de controle coletivo."
                      : result.isUnhealthy
                        ? "Recomenda-se o uso de EPI (protetor auricular) e avaliação de medidas de controle."
                        : "Ambiente dentro dos padrões de segurança estabelecidos pela NR-15."}
                  </p>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <h4 className="font-semibold text-sm">Referência NR-15 (Anexo I)</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Até 85 dB: Não insalubre</li>
            <li>• 85 a 115 dB: Insalubridade grau médio (20%)</li>
            <li>• Acima de 115 dB: Não permitido sem proteção</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
