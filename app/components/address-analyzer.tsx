"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Sun, DollarSign, Leaf, AlertTriangle } from "lucide-react"
import { analyzeByAddress } from "../actions/analyze-address"

interface AddressAnalysisResult {
  analysis: any
  systemRecommendation: any
  roiAnalysis: any
  locationFactors: any
}

export default function AddressAnalyzer() {
  const [address, setAddress] = useState("")
  const [electricityRate, setElectricityRate] = useState(0.13)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AddressAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!address.trim()) {
      setError("Please enter a valid address")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeByAddress(address, electricityRate)
      setAnalysisResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address-Based Solar Analysis
          </CardTitle>
          <CardDescription>
            Enter any address to get location-specific solar potential analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address">Property Address</Label>
              <Input
                id="address"
                placeholder="123 Main St, City, State, ZIP"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>
            <div>
              <Label htmlFor="rate">Electricity Rate ($/kWh)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={electricityRate}
                onChange={(e) => setElectricityRate(Number.parseFloat(e.target.value) || 0.13)}
              />
            </div>
          </div>

          <Button onClick={handleAnalyze} disabled={isAnalyzing || !address.trim()} className="w-full" size="lg">
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Analyzing Location...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze Solar Potential
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Location Analysis Progress</span>
                <span className="text-sm text-gray-500">Processing...</span>
              </div>
              <Progress value={60} className="w-full" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Location Data
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Climate Analysis
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  Solar Potential
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  ROI Calculation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Location Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Location Solar Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-600">Average Sun Hours</Label>
                  <p className="text-3xl font-bold text-yellow-600">{analysisResult.locationFactors.averageSunHours}</p>
                  <p className="text-sm text-gray-500">hours/day</p>
                </div>
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-600">Suitability Score</Label>
                  <p className="text-3xl font-bold text-green-600">{analysisResult.analysis.suitabilityScore}%</p>
                  <p className="text-sm text-gray-500">potential</p>
                </div>
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-600">Estimated Area</Label>
                  <p className="text-3xl font-bold text-blue-600">
                    {analysisResult.analysis.suitableArea.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">sq ft</p>
                </div>
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-600">Panel Capacity</Label>
                  <p className="text-3xl font-bold text-purple-600">{analysisResult.analysis.estimatedPanels}</p>
                  <p className="text-sm text-gray-500">panels</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Seasonal Variation</Label>
                  <p className="text-sm mt-1">{analysisResult.locationFactors.seasonalVariation}</p>
                </div>

                {analysisResult.locationFactors.weatherFactors.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Climate Considerations</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysisResult.locationFactors.weatherFactors.map((factor: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System & ROI Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Recommendation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Recommended System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">System Size</Label>
                    <p className="text-2xl font-bold">{analysisResult.systemRecommendation.systemSize} kW</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Annual Production</Label>
                    <p className="text-2xl font-bold text-green-600">
                      {analysisResult.systemRecommendation.annualProduction.toLocaleString()} kWh
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Panel Type</Label>
                  <p className="text-lg font-medium capitalize">{analysisResult.systemRecommendation.panelType}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">System Cost</Label>
                  <p className="text-2xl font-bold text-blue-600">
                    ${analysisResult.systemRecommendation.estimatedCost.toLocaleString()}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">CO₂ Reduction</Label>
                  <p className="text-lg font-medium text-green-600">
                    {analysisResult.systemRecommendation.co2Offset.toLocaleString()} lbs/year
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ROI Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Payback Period</Label>
                    <p className="text-2xl font-bold text-blue-600">{analysisResult.roiAnalysis.paybackPeriod} years</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Annual Savings</Label>
                    <p className="text-2xl font-bold text-green-600">
                      ${analysisResult.roiAnalysis.annualSavings.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">20-Year Savings</Label>
                  <p className="text-2xl font-bold text-green-600">
                    ${analysisResult.roiAnalysis.twentyYearSavings.toLocaleString()}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Net Present Value</Label>
                  <p className="text-lg font-medium text-purple-600">
                    ${analysisResult.roiAnalysis.netPresentValue.toLocaleString()}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Internal Rate of Return</Label>
                  <p className="text-lg font-medium text-purple-600">
                    {analysisResult.roiAnalysis.internalRateOfReturn}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Local Programs & Regulations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Incentives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisResult.roiAnalysis.incentivesAvailable.map((incentive: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{incentive}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Local Regulations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisResult.locationFactors.localRegulations.map((regulation: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{regulation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Location-Specific Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.analysis.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Sun className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
