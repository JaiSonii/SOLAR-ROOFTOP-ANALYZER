import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("GOOGLE_AI_API_KEY environment variable is required")
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

export interface RooftopAnalysis {
  rooftopArea: number
  suitableArea: number
  suitabilityScore: number
  obstacles: string[]
  roofOrientation: string
  estimatedPanels: number
  shadingIssues: string[]
  structuralAssessment: string
  recommendations: string[]
  confidence: number
}

export interface SolarSystemRecommendation {
  systemSize: number
  panelType: string
  panelCount: number
  inverterType: string
  estimatedCost: number
  annualProduction: number
  co2Offset: number
  installationComplexity: string
  maintenanceRequirements: string[]
}

export interface ROIAnalysis {
  initialInvestment: number
  annualSavings: number
  paybackPeriod: number
  twentyYearSavings: number
  netPresentValue: number
  internalRateOfReturn: number
  incentivesAvailable: string[]
  financingOptions: string[]
}

export class SolarAIService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  async analyzeRooftopImage(imageData: string): Promise<{
    analysis: RooftopAnalysis
    systemRecommendation: SolarSystemRecommendation
    roiAnalysis: ROIAnalysis
  }> {
    const prompt = `
    You are an expert solar energy analyst. Analyze this rooftop satellite/aerial image for solar panel installation potential.

    Provide a detailed JSON response with the following structure:
    {
      "analysis": {
        "rooftopArea": number (in square feet),
        "suitableArea": number (in square feet, accounting for obstacles),
        "suitabilityScore": number (0-100),
        "obstacles": ["list of obstacles like chimneys, vents, trees"],
        "roofOrientation": "primary roof direction (N/S/E/W/NE/NW/SE/SW)",
        "estimatedPanels": number (based on 17.5 sq ft per panel),
        "shadingIssues": ["list of potential shading sources"],
        "structuralAssessment": "assessment of roof condition and suitability",
        "recommendations": ["specific recommendations for this roof"],
        "confidence": number (0-100, confidence in analysis)
      },
      "systemRecommendation": {
        "systemSize": number (in kW),
        "panelType": "monocrystalline/polycrystalline/thin-film recommendation",
        "panelCount": number,
        "inverterType": "string/power optimizers/microinverters",
        "estimatedCost": number (total system cost in USD),
        "annualProduction": number (kWh per year),
        "co2Offset": number (pounds of CO2 per year),
        "installationComplexity": "low/medium/high",
        "maintenanceRequirements": ["list of maintenance needs"]
      },
      "roiAnalysis": {
        "initialInvestment": number (total cost after incentives),
        "annualSavings": number (USD per year),
        "paybackPeriod": number (years),
        "twentyYearSavings": number (total savings over 20 years),
        "netPresentValue": number (NPV at 6% discount rate),
        "internalRateOfReturn": number (IRR as percentage),
        "incentivesAvailable": ["federal tax credit", "state incentives", "utility rebates"],
        "financingOptions": ["cash", "solar loan", "lease", "PPA"]
      }
    }

    Consider these factors:
    - Solar panel efficiency: 20-22% for monocrystalline, 15-17% for polycrystalline
    - Average solar irradiance: 4-6 kWh/m²/day depending on location
    - System degradation: 0.5% per year
    - Federal tax credit: 30% (2024)
    - Average electricity rate: $0.12-0.15 per kWh
    - Installation costs: $2.50-3.50 per watt before incentives
    - Roof pitch and orientation impact on efficiency
    - Local building codes and setback requirements

    Provide realistic, conservative estimates based on industry standards.
    `

    try {
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData.split(",")[1],
          },
        },
      ])

      const response = await result.response
      const text = response.text()

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No valid JSON found in AI response")
      }

      const analysisData = JSON.parse(jsonMatch[0])
      return analysisData
    } catch (error) {
      console.error("Error analyzing rooftop:", error)
      throw new Error("Failed to analyze rooftop image")
    }
  }

  async analyzeByAddress(
    address: string,
    electricityRate = 0.13,
  ): Promise<{
    analysis: RooftopAnalysis
    systemRecommendation: SolarSystemRecommendation
    roiAnalysis: ROIAnalysis
    locationFactors: any
  }> {
    const prompt = `
    You are an expert solar energy analyst. Analyze the solar potential for this address: "${address}"

    Provide a detailed JSON response with location-specific solar analysis:
    {
      "analysis": {
        "rooftopArea": number (estimated based on typical home size),
        "suitableArea": number (accounting for typical obstacles),
        "suitabilityScore": number (0-100, based on location factors),
        "obstacles": ["typical obstacles for this region"],
        "roofOrientation": "optimal orientation for this location",
        "estimatedPanels": number,
        "shadingIssues": ["potential shading sources in this area"],
        "structuralAssessment": "typical roof conditions for this region",
        "recommendations": ["location-specific recommendations"],
        "confidence": number (0-100)
      },
      "systemRecommendation": {
        "systemSize": number (in kW),
        "panelType": "best type for this climate",
        "panelCount": number,
        "inverterType": "recommended for this location",
        "estimatedCost": number (regional pricing),
        "annualProduction": number (based on local solar irradiance),
        "co2Offset": number,
        "installationComplexity": "complexity for this region",
        "maintenanceRequirements": ["climate-specific maintenance"]
      },
      "roiAnalysis": {
        "initialInvestment": number,
        "annualSavings": number (using rate: $${electricityRate}/kWh),
        "paybackPeriod": number,
        "twentyYearSavings": number,
        "netPresentValue": number,
        "internalRateOfReturn": number,
        "incentivesAvailable": ["location-specific incentives"],
        "financingOptions": ["available in this area"]
      },
      "locationFactors": {
        "averageSunHours": number,
        "seasonalVariation": "description",
        "weatherFactors": ["climate considerations"],
        "localRegulations": ["relevant codes and requirements"],
        "utilityPrograms": ["net metering and utility programs"],
        "marketTrends": ["local solar adoption trends"]
      }
    }

    Consider location-specific factors:
    - Regional solar irradiance data
    - Local electricity rates (use $${electricityRate}/kWh)
    - State and local incentives
    - Climate conditions affecting performance
    - Local building codes and regulations
    - Regional installation costs
    - Utility net metering policies

    Note : Do not include any other text except the json in the response
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No valid JSON found in AI response")
      }

      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error("Error analyzing address:", error)
      throw new Error("Failed to analyze address")
    }
  }

  async getSolarKnowledge(query: string): Promise<string> {
    const prompt = `
    You are a solar energy expert with comprehensive knowledge of:
    - Solar panel technology (monocrystalline, polycrystalline, thin-film)
    - Installation processes (mounting systems, electrical, permits)
    - Maintenance requirements (monitoring, cleaning, warranties)
    - Cost & ROI analysis (pricing trends, incentives, payback calculations)
    - Industry regulations (NEC codes, net metering, safety standards)
    - Market trends (technology advances, adoption rates, policy changes)

    Question: ${query}

    Provide a comprehensive, accurate answer based on current industry knowledge and best practices. Include specific technical details, current market data, and practical recommendations where applicable.
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error("Error getting solar knowledge:", error)
      throw new Error("Failed to get solar knowledge")
    }
  }

  async calculateCustomROI(params: {
    systemSize: number
    systemCost: number
    electricityRate: number
    annualUsage: number
    location: string
    incentives: string[]
  }): Promise<ROIAnalysis> {
    const prompt = `
    Calculate detailed ROI analysis for a solar system with these parameters:
    - System Size: ${params.systemSize} kW
    - System Cost: $${params.systemCost}
    - Electricity Rate: $${params.electricityRate}/kWh
    - Annual Usage: ${params.annualUsage} kWh
    - Location: ${params.location}
    - Incentives: ${params.incentives.join(", ")}

    Provide JSON response:
    {
      "initialInvestment": number (after incentives),
      "annualSavings": number,
      "paybackPeriod": number,
      "twentyYearSavings": number,
      "netPresentValue": number (6% discount rate),
      "internalRateOfReturn": number,
      "incentivesAvailable": ["detailed list"],
      "financingOptions": ["available options with terms"],
      "yearByYearAnalysis": [
        {"year": 1, "production": number, "savings": number, "cumulativeSavings": number}
      ],
      "assumptions": ["list of calculation assumptions"]
    }

    Use industry-standard calculations and current market data.
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No valid JSON found in AI response")
      }

      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error("Error calculating ROI:", error)
      throw new Error("Failed to calculate ROI")
    }
  }
}

export const solarAI = new SolarAIService()
