"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, DollarSign, TrendingUp, Leaf, AlertTriangle } from "lucide-react"
import { calculateCustomROI } from "../actions/calculate-roi"

interface ROIResult {
  initialInvestment: number
  annualSavings: number
  paybackPeriod: number
  twentyYearSavings: number
  netPresentValue: number
  internalRateOfReturn: number
  incentivesAvailable: string[]
  financingOptions: string[]
  yearByYearAnalysis?: Array<{
    year: number
    production: number
    savings: number
    cumulativeSavings: number
  }>
  assumptions?: string[]
}

export default function ROICalculator() {
  const [systemSize, setSystemSize] = useState(8.5)
  const [systemCost, setSystemCost] = useState(25500)
  const [electricityRate, setElectricityRate] = useState(0.13)
  const [annualUsage, setAnnualUsage] = useState(12000)
  const [location, setLocation] = useState("")
  const [selectedIncentives, setSelectedIncentives] = useState<string[]>(["Federal Tax Credit (30%)"])
  const [isCalculating, setIsCalculating] = useState(false)
  const [roiResult, setROIResult] = useState<ROIResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const availableIncentives = [
    "Federal Tax Credit (30%)",
    "State Tax Credit",
    "Utility Rebate",
    "Net Metering",
    "SREC Program",
    "Property Tax Exemption",
    "Sales Tax Exemption",
  ]

  const handleIncentiveChange = (incentive: string, checked: boolean) => {
    if (checked) {
      setSelectedIncentives([...selectedIncentives, incentive])
    } else {
      setSelectedIncentives(selectedIncentives.filter((i) => i !== incentive))
    }
  }

  const handleCalculate = async () => {
    if (!location.trim()) {
      setError("Please enter a location")
      return
    }

    setIsCalculating(true)
    setError(null)

    try {
      const result = await calculateCustomROI({
        systemSize,
        systemCost,
        electricityRate,
        annualUsage,
        location,
        incentives: selectedIncentives,
      })
      setROIResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed")
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Custom ROI Calculator
          </CardTitle>
          <CardDescription>Enter your specific system parameters for detailed financial analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="systemSize">System Size (kW)</Label>
              <Input
                id="systemSize"
                type="number"
                step="0.1"
                min="1"
                max="50"
                value={systemSize}
                onChange={(e) => setSystemSize(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="systemCost">Total System Cost ($)</Label>
              <Input
                id="systemCost"
                type="number"
                step="100"
                min="1000"
                value={systemCost}
                onChange={(e) => setSystemCost(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Usage & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="electricityRate">Electricity Rate ($/kWh)</Label>
              <Input
                id="electricityRate"
                type="number"
                step="0.01"
                min="0.05"
                max="0.50"
                value={electricityRate}
                onChange={(e) => setElectricityRate(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="annualUsage">Annual Usage (kWh)</Label>
              <Input
                id="annualUsage"
                type="number"
                step="100"
                min="1000"
                value={annualUsage}
                onChange={(e) => setAnnualUsage(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Incentives */}
          <div>
            <Label className="text-base font-medium">Available Incentives</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {availableIncentives.map((incentive) => (
                <div key={incentive} className="flex items-center space-x-2">
                  <Checkbox
                    id={incentive}
                    checked={selectedIncentives.includes(incentive)}
                    onCheckedChange={(checked) => handleIncentiveChange(incentive, checked as boolean)}
                  />
                  <Label htmlFor={incentive} className="text-sm font-normal">
                    {incentive}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleCalculate} disabled={isCalculating || !location.trim()} className="w-full" size="lg">
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Calculating ROI...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate ROI
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

      {/* ROI Results */}
      {roiResult && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <Label className="text-sm font-medium text-gray-600">Initial Investment</Label>
                  <p className="text-2xl font-bold text-blue-600">${roiResult.initialInvestment.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">after incentives</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <Label className="text-sm font-medium text-gray-600">Payback Period</Label>
                  <p className="text-2xl font-bold text-green-600">{roiResult.paybackPeriod}</p>
                  <p className="text-xs text-gray-500">years</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Leaf className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <Label className="text-sm font-medium text-gray-600">Annual Savings</Label>
                  <p className="text-2xl font-bold text-purple-600">${roiResult.annualSavings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">per year</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <Label className="text-sm font-medium text-gray-600">20-Year Savings</Label>
                  <p className="text-2xl font-bold text-yellow-600">${roiResult.twentyYearSavings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">total</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="text-center p-4 border rounded-lg">
                  <Label className="text-sm font-medium text-gray-600">Net Present Value</Label>
                  <p className="text-3xl font-bold text-green-600">${roiResult.netPresentValue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">at 6% discount rate</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Label className="text-sm font-medium text-gray-600">Internal Rate of Return</Label>
                  <p className="text-3xl font-bold text-blue-600">{roiResult.internalRateOfReturn}%</p>
                  <p className="text-sm text-gray-500">annual return</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incentives & Financing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Applied Incentives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roiResult.incentivesAvailable.map((incentive, index) => (
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
                <CardTitle>Financing Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roiResult.financingOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{option}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Year-by-Year Analysis */}
          {roiResult.yearByYearAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle>Year-by-Year Analysis (First 10 Years)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Year</th>
                        <th className="text-right p-2">Production (kWh)</th>
                        <th className="text-right p-2">Annual Savings</th>
                        <th className="text-right p-2">Cumulative Savings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roiResult.yearByYearAnalysis.slice(0, 10).map((year) => (
                        <tr key={year.year} className="border-b">
                          <td className="p-2 font-medium">{year.year}</td>
                          <td className="p-2 text-right">{year.production.toLocaleString()}</td>
                          <td className="p-2 text-right text-green-600">${year.savings.toLocaleString()}</td>
                          <td className="p-2 text-right font-medium">${year.cumulativeSavings.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assumptions */}
          {roiResult.assumptions && (
            <Card>
              <CardHeader>
                <CardTitle>Calculation Assumptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {roiResult.assumptions.map((assumption, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{assumption}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
