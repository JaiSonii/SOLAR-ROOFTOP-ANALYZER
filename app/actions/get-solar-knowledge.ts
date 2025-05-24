"use server"

import { solarAI } from "@/lib/ai-service"

export async function getSolarKnowledge(query: string) {
  try {
    const result = await solarAI.getSolarKnowledge(query)
    return result
  } catch (error) {
    console.error("Error in getSolarKnowledge action:", error)
    throw new Error("Failed to get solar knowledge")
  }
}
