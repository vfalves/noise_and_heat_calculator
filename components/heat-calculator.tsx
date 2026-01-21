"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Thermometer, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Tabela NR-15 Anexo III - Limites de Tolerância para Exposição ao Calor
const heatLimitsLight = [
  { ibutg: 30, continuous: 100, heavy: 0, light: 0 },
  { ibutg: 30.1, continuous: 75, heavy: 20, light: 5 },
  { ibutg: 30.7, continuous: 50, heavy: 35, light: 15 },
  { ibutg: 31.5, continuous: 25, heavy: 50, light: 30 },
  { ibutg: 32.3, continuous: 0, heavy: 65, light: 45 },
]

type WorkType = "light" | "moderate" | "heavy"

export function HeatCalculator() {
  const [ibutg, setIbutg] = useState<string>("")
  const [workType, setWorkType] = useState<WorkType>("moderate")
  const [result, setResult] = useState<{
    workMinutes: number
    restMinutes: number
    isUnhealthy: boolean
    additionalPercentage: number
    message: string
  } | null>(null)

  const calculateHeat = (ibutgValue: number, type: WorkType) => {
    // Regime de trabalho leve
    if (type === "light") {
      if (ibutgValue <= 30) {
        return {
          workMinutes: 60,
          restMinutes: 0,
          isUnhealthy: false,
          additionalPercentage: 0,
          message: "Temperatura dentro do limite de tolerância",
        }
      } else if (ibutgValue <= 30.1) {
        return {
          workMinutes: 45,
          restMinutes: 15,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Insalubridade de grau médio",
        }
      } else if (ibutgValue <= 30.7) {
        return {
          workMinutes: 30,
          restMinutes: 30,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Insalubridade de grau médio",
        }
      } else if (ibutgValue <= 31.5) {
        return {
          workMinutes: 15,
          restMinutes: 45,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Insalubridade de grau médio",
        }
      } else {
        return {
          workMinutes: 0,
          restMinutes: 60,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Não é permitido trabalho contínuo",
        }
      }
    }

    // Regime de trabalho moderado
    if (type === "moderate") {
      if (ibutgValue <= 26.7) {
        return {
          workMinutes: 60,
          restMinutes: 0,
          isUnhealthy: false,
          additionalPercentage: 0,
          message: "Temperatura dentro do limite de tolerância",
        }
      } else if (ibutgValue <= 28) {
        return {
          workMinutes: 45,
          restMinutes: 15,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Insalubridade de grau médio",
        }
      } else if (ibutgValue <= 29.5) {
        return {
          workMinutes: 30,
          restMinutes: 30,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Insalubridade de grau médio",
        }
      } else if (ibutgValue <= 31) {
        return {
          workMinutes: 15,
          restMinutes: 45,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Insalubridade de grau médio",
        }
      } else {
        return {
          workMinutes: 0,
          restMinutes: 60,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Não é permitido trabalho contínuo",
        }
      }
    }

    // Regime de trabalho pesado
    if (type === "heavy") {
      if (ibutgValue <= 25) {
        return {
          workMinutes: 60,
          restMinutes: 0,
          isUnhealthy: false,
          additionalPercentage: 0,
          message: "Temperatura dentro do limite de tolerância",
        }
      } else if (ibutgValue <= 25.9) {
        return {
          workMinutes: 45,
          restMinutes: 15,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Insalubridade de grau médio",
        }
      } else if (ibutgValue <= 27.9) {
        return {
          workMinutes: 30,
          restMinutes: 30,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Insalubridade de grau médio",
        }
      } else if (ibutgValue <= 30) {
        return {
          workMinutes: 15,
          restMinutes: 45,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Insalubridade de grau médio",
        }
      } else {
        return {
          workMinutes: 0,
          restMinutes: 60,
          isUnhealthy: true,
          additionalPercentage: 25,
          message: "Não é permitido trabalho contínuo",
        }
      }
    }

    return {
      workMinutes: 0,
      restMinutes: 0,
      isUnhealthy: false,
      additionalPercentage: 0,
      message: "",
    }
  }

  const handleCalculate = () => {
    const value = Number.parseFloat(ibutg)
    if (isNaN(value) || value <= 0) {
      setResult(null)
      return
    }

    const calculated = calculateHeat(value, workType)
    setResult(calculated)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-accent" />
          <CardTitle>Calculadora de Calor</CardTitle>
        </div>
        <CardDescription>Informe o IBUTG medido e o tipo de atividade</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ibutg">IBUTG (°C)</Label>
            <Input
              id="ibutg"
              type="number"
              placeholder="Ex: 28.5"
              value={ibutg}
              onChange={(e) => {
                setIbutg(e.target.value)
                handleCalculate()
              }}
              onBlur={handleCalculate}
              step="0.1"
              min="0"
              max="50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="work-type">Tipo de Atividade</Label>
            <Select
              value={workType}
              onValueChange={(value: WorkType) => {
                setWorkType(value)
                handleCalculate()
              }}
            >
              <SelectTrigger id="work-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Leve</SelectItem>
                <SelectItem value="moderate">Moderada</SelectItem>
                <SelectItem value="heavy">Pesada</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                      Trabalho: {result.workMinutes} min/hora
                    </Badge>
                    <Badge variant="outline" className="text-sm font-medium">
                      Descanso: {result.restMinutes} min/hora
                    </Badge>
                    {result.isUnhealthy && result.additionalPercentage > 0 && (
                      <Badge variant="destructive" className="text-sm font-medium">
                        Adicional: {result.additionalPercentage}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.workMinutes === 0
                      ? "Condições extremas. Medidas de controle são obrigatórias antes de realizar qualquer atividade."
                      : result.isUnhealthy
                        ? "É obrigatório o cumprimento do regime de trabalho/descanso e fornecimento de água fresca."
                        : "Ambiente dentro dos padrões estabelecidos pela NR-15 para este tipo de atividade."}
                  </p>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <h4 className="font-semibold text-sm">Referência NR-15 (Anexo III)</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • <strong>Leve:</strong> Trabalho sentado com movimentos leves
            </li>
            <li>
              • <strong>Moderada:</strong> Trabalho em pé com caminhadas
            </li>
            <li>
              • <strong>Pesada:</strong> Trabalho com esforço físico intenso
            </li>
            <li>• Insalubridade: Grau médio (25%)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
