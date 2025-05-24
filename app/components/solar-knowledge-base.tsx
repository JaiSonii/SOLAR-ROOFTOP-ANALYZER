"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Search, Zap, Wrench, DollarSign, Shield, TrendingUp, AlertTriangle } from "lucide-react"
import { getSolarKnowledge } from "../actions/get-solar-knowledge"
import Markdown from 'react-markdown'

const knowledgeCategories = [
  {
    title: "Solar Panel Technology",
    icon: Zap,
    topics: [
      "Monocrystalline vs Polycrystalline panels",
      "Thin-film solar technology",
      "Panel efficiency ratings",
      "Bifacial solar panels",
      "Panel degradation rates",
      "Temperature coefficients",
    ],
  },
  {
    title: "Installation Process",
    icon: Wrench,
    topics: [
      "Roof mounting systems",
      "Electrical connections and inverters",
      "Permit requirements",
      "Grid interconnection process",
      "System commissioning",
      "Safety protocols",
    ],
  },
  {
    title: "Cost & ROI Analysis",
    icon: DollarSign,
    topics: [
      "System pricing trends",
      "Federal and state incentives",
      "Net metering policies",
      "Financing options",
      "Payback period calculations",
      "LCOE analysis",
    ],
  },
  {
    title: "Maintenance & Warranties",
    icon: Shield,
    topics: [
      "Panel cleaning requirements",
      "System monitoring",
      "Inverter maintenance",
      "Warranty types and coverage",
      "Performance guarantees",
      "Troubleshooting common issues",
    ],
  },
  {
    title: "Regulations & Codes",
    icon: AlertTriangle,
    topics: [
      "NEC electrical codes",
      "Building code requirements",
      "Fire safety setbacks",
      "Utility interconnection standards",
      "Local permitting processes",
      "HOA considerations",
    ],
  },
  {
    title: "Market Trends",
    icon: TrendingUp,
    topics: [
      "Solar adoption rates",
      "Technology advances",
      "Policy changes",
      "Storage integration",
      "Grid modernization",
      "Industry forecasts",
    ],
  },
]

export default function SolarKnowledgeBase() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a question")
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const result = await getSolarKnowledge(query)
      setSearchResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
    } finally {
      setIsSearching(false)
    }
  }

  const handleTopicClick = (topic: string) => {
    setQuery(topic)
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Solar Industry Knowledge Base
          </CardTitle>
          <CardDescription>
            Get expert answers on solar technology, installation, costs, regulations, and market trends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask any solar-related question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Knowledge Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeCategories.map((category) => (
          <Card key={category.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <category.icon className="h-5 w-5" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.topics.map((topic) => (
                  <Button
                    key={topic}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-2"
                    onClick={() => handleTopicClick(topic)}
                  >
                    <span className="text-sm">{topic}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Results */}
      {searchResult && (
        <Card>
          <CardHeader>
            <CardTitle>Expert Answer</CardTitle>
            <CardDescription>Question: {query}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed"><Markdown>{searchResult}</Markdown></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Facts */}
      <Card>
        <CardHeader>
          <CardTitle>Solar Industry Quick Facts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">30%</p>
              <p className="text-sm text-gray-600">Federal Tax Credit (2024)</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">25+ years</p>
              <p className="text-sm text-gray-600">Panel Warranty Period</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">20-22%</p>
              <p className="text-sm text-gray-600">Modern Panel Efficiency</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">6-10 years</p>
              <p className="text-sm text-gray-600">Typical Payback Period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
