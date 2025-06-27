"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Wallet, Shield, CheckCircle, AlertCircle, Upload, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletVerificationDialogProps {
  children: React.ReactNode
}

export function WalletVerificationDialog({ children }: WalletVerificationDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [verificationData, setVerificationData] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    idNumber: "",
    idType: "passport",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState("pending")
  const { toast } = useToast()

  const steps = [
    { id: 1, title: "Personal Information", icon: Shield },
    { id: 2, title: "Identity Verification", icon: Upload },
    { id: 3, title: "Address Verification", icon: Camera },
    { id: 4, title: "Review & Submit", icon: CheckCircle },
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/wallet-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationData),
      })

      if (response.ok) {
        setVerificationStatus("completed")
        toast({
          title: "Verification submitted!",
          description: "Your wallet verification has been submitted for review.",
        })
      } else {
        throw new Error("Verification failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit verification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={verificationData.fullName}
                  onChange={(e) => setVerificationData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={verificationData.dateOfBirth}
                  onChange={(e) => setVerificationData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={verificationData.phoneNumber}
                onChange={(e) => setVerificationData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={verificationData.address}
                onChange={(e) => setVerificationData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your full address"
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="idType">ID Type</Label>
              <select
                id="idType"
                value={verificationData.idType}
                onChange={(e) => setVerificationData((prev) => ({ ...prev, idType: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            <div>
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                value={verificationData.idNumber}
                onChange={(e) => setVerificationData((prev) => ({ ...prev, idNumber: e.target.value }))}
                placeholder="Enter your ID number"
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">Upload front side of your ID</p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">Upload back side of your ID</p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">Upload proof of address</p>
              <p className="text-xs text-gray-500 mb-4">
                Utility bill, bank statement, or government document (not older than 3 months)
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Acceptable Documents:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Utility bill (electricity, water, gas)</li>
                <li>• Bank statement</li>
                <li>• Government correspondence</li>
                <li>• Rental agreement</li>
              </ul>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Name:</span>
                  <span className="font-medium">{verificationData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span className="font-medium">{verificationData.dateOfBirth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{verificationData.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium">{verificationData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Type:</span>
                  <span className="font-medium capitalize">{verificationData.idType.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Number:</span>
                  <span className="font-medium">{verificationData.idNumber}</span>
                </div>
              </CardContent>
            </Card>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Important Notice</p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Verification typically takes 1-3 business days. You'll receive an email notification once your
                    verification is complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (verificationStatus === "completed") {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">Verification Submitted!</h3>
            <p className="text-muted-foreground">
              Your wallet verification has been submitted successfully. We'll review your documents and notify you
              within 1-3 business days.
            </p>
            <Badge className="bg-green-100 text-green-800">Under Review</Badge>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Verification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Step {currentStep} of {steps.length}
              </span>
              <span>{Math.round((currentStep / steps.length) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / steps.length) * 100} />
          </div>

          {/* Steps */}
          <div className="flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center space-y-2 ${
                    step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.id <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-center">{step.title}</span>
                </div>
              )
            })}
          </div>

          <Separator />

          {/* Step Content */}
          <div className="min-h-[300px]">
            <h3 className="text-lg font-semibold mb-4">{steps[currentStep - 1].title}</h3>
            {renderStepContent()}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              Previous
            </Button>
            {currentStep === steps.length ? (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Verification"}
              </Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
