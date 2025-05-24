"use server"

import { solarAI } from "@/lib/ai-service"

export async function analyzeByAddress(address: string, electricityRate = 0.13) {
  try {
    const result = await solarAI.analyzeByAddress(address, electricityRate)
    return result
  } catch (error) {
    console.error("Error in analyzeByAddress action:", error)
    throw new Error("Failed to analyze address")
  }
}
