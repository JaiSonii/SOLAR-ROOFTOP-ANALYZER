"use server"

import { solarAI } from "@/lib/ai-service"

export async function analyzeRooftopImage(imageData: string) {
  try {
    const result = await solarAI.analyzeRooftopImage(imageData)
    return result
  } catch (error) {
    console.error("Error in analyzeRooftopImage action:", error)
    throw new Error("Failed to analyze rooftop image")
  }
}
