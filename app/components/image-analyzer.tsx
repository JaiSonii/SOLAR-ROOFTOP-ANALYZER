"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon, Zap, DollarSign, AlertTriangle } from "lucide-react"
import { analyzeRooftopImage } from "../actions/analyze-image"

interface AnalysisResult {
  analysis: any
  systemRecommendation: any
  roiAnalysis: any
}

export default function ImageAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("Image size must be less than 10MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeRooftopImage(selectedImage)
      setAnalysisResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Rooftop Image Analysis
          </CardTitle>
          <CardDescription>
            Upload a satellite or aerial image of a rooftop for AI-powered solar potential analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!selectedImage ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  Drop your rooftop image here or click to browse
                </p>
                <p className="text-sm text-gray-500">Supports JPG, PNG, WebP (max 10MB)</p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected rooftop"
                    className="w-full max-h-96 object-contain rounded-lg border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedImage(null)
                      setAnalysisResult(null)
                      setError(null)
                    }}
                  >
                    Remove
                  </Button>
                </div>

                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full" size="lg">
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing Rooftop...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze Solar Potential
                    </>
                  )}
                </Button>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Analysis Progress</span>
                <span className="text-sm text-gray-500">Processing...</span>
              </div>
              <Progress value={75} className="w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Image Processing
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Rooftop Detection
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  Solar Analysis
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rooftop Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Rooftop Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Total Roof Area</Label>
                  <p className="text-2xl font-bold">{analysisResult.analysis.rooftopArea.toLocaleString()} sq ft</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Suitable Area</Label>
                  <p className="text-2xl font-bold text-green-600">
                    {analysisResult.analysis.suitableArea.toLocaleString()} sq ft
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Suitability Score</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={analysisResult.analysis.suitabilityScore} className="flex-1" />
                  <span className="text-sm font-medium">{analysisResult.analysis.suitabilityScore}%</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Roof Orientation</Label>
                <p className="text-lg font-medium">{analysisResult.analysis.roofOrientation}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Estimated Panels</Label>
                <p className="text-lg font-medium">{analysisResult.analysis.estimatedPanels} panels</p>
              </div>

              {analysisResult.analysis.obstacles.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Obstacles Detected</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysisResult.analysis.obstacles.map((obstacle: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {obstacle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-600">Confidence Level</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={analysisResult.analysis.confidence} className="flex-1" />
                  <span className="text-sm font-medium">{analysisResult.analysis.confidence}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                System Recommendation
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
                <Label className="text-sm font-medium text-gray-600">Recommended Panel Type</Label>
                <p className="text-lg font-medium capitalize">{analysisResult.systemRecommendation.panelType}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Inverter Type</Label>
                <p className="text-lg font-medium capitalize">{analysisResult.systemRecommendation.inverterType}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Estimated Cost</Label>
                <p className="text-2xl font-bold text-blue-600">
                  ${analysisResult.systemRecommendation.estimatedCost.toLocaleString()}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">CO₂ Offset</Label>
                <p className="text-lg font-medium text-green-600">
                  {analysisResult.systemRecommendation.co2Offset.toLocaleString()} lbs/year
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Installation Complexity</Label>
                <Badge
                  variant={
                    analysisResult.systemRecommendation.installationComplexity === "low"
                      ? "default"
                      : analysisResult.systemRecommendation.installationComplexity === "medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {analysisResult.systemRecommendation.installationComplexity}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* ROI Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                ROI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-600">Payback Period</Label>
                  <p className="text-3xl font-bold text-blue-600">{analysisResult.roiAnalysis.paybackPeriod}</p>
                  <p className="text-sm text-gray-500">years</p>
                </div>
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-600">Annual Savings</Label>
                  <p className="text-3xl font-bold text-green-600">
                    ${analysisResult.roiAnalysis.annualSavings.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">per year</p>
                </div>
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-600">20-Year Savings</Label>
                  <p className="text-3xl font-bold text-green-600">
                    ${analysisResult.roiAnalysis.twentyYearSavings.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">total</p>
                </div>
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-600">IRR</Label>
                  <p className="text-3xl font-bold text-purple-600">
                    {analysisResult.roiAnalysis.internalRateOfReturn}%
                  </p>
                  <p className="text-sm text-gray-500">return</p>
                </div>
              </div>

              {analysisResult.roiAnalysis.incentivesAvailable.length > 0 && (
                <div className="mt-6">
                  <Label className="text-sm font-medium text-gray-600">Available Incentives</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysisResult.roiAnalysis.incentivesAvailable.map((incentive: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {incentive}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Professional Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.analysis.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
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
