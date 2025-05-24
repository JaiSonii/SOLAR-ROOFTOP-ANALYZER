"use server"

import { solarAI } from "@/lib/ai-service"

export async function calculateCustomROI(params: {
  systemSize: number
  systemCost: number
  electricityRate: number
  annualUsage: number
  location: string
  incentives: string[]
}) {
  try {
    const result = await solarAI.calculateCustomROI(params)
    return result
  } catch (error) {
    console.error("Error in calculateCustomROI action:", error)
    throw new Error("Failed to calculate ROI")
  }
}
