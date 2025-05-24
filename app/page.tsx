"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, MapPin, Calculator, FileText, Zap } from "lucide-react"
import ImageAnalyzer from "./components/image-analyzer"
import AddressAnalyzer from "./components/address-analyzer"
import ROICalculator from "./components/roi-calculator"
import SolarKnowledgeBase from "./components/solar-knowledge-base"
import DocumentationViewer from "./components/documentation-viewer"

export default function SolarAnalysisDashboard() {
  const [activeTab, setActiveTab] = useState("image-analysis")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Zap className="h-10 w-10 text-yellow-500" />
            Solar AI Rooftop Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced AI-powered satellite imagery analysis for solar installation potential assessment, ROI
            calculations, and professional recommendations.
          </p>
        </div>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="image-analysis" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Image Analysis
            </TabsTrigger>
            <TabsTrigger value="address-analysis" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address Analysis
            </TabsTrigger>
            <TabsTrigger value="roi-calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              ROI Calculator
            </TabsTrigger>
            <TabsTrigger value="knowledge-base" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Solar Knowledge
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image-analysis">
            <ImageAnalyzer />
          </TabsContent>

          <TabsContent value="address-analysis">
            <AddressAnalyzer />
          </TabsContent>

          <TabsContent value="roi-calculator">
            <ROICalculator />
          </TabsContent>

          <TabsContent value="knowledge-base">
            <SolarKnowledgeBase />
          </TabsContent>

          <TabsContent value="documentation">
            <DocumentationViewer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
