"use client"

import type React from "react"

import { useState } from "react"
import { FileIcon, UploadIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  resourceType: string
}

export function FileUploader({ resourceType }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  const acceptedTypes = {
    pdf: ".pdf",
    audio: ".mp3,.wav,.ogg",
  }

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {file ? (
        <div className="flex w-full flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <FileIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div className="mb-2 text-center font-medium">{file.name}</div>
          <div className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={removeFile}
          >
            <XIcon className="mr-1 h-4 w-4" />
            Remove
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <UploadIcon className="h-6 w-6 text-gray-500" />
          </div>
          <div className="mb-2 text-center text-sm">
            <span className="font-medium">Click to upload</span> or drag and drop
          </div>
          <p className="mb-4 text-xs text-gray-500">
            {resourceType === "pdf"
              ? "PDF (max. 10MB)"
              : resourceType === "audio"
                ? "MP3, WAV, or OGG (max. 20MB)"
                : "File (max. 10MB)"}
          </p>
          <input
            type="file"
            className="hidden"
            accept={acceptedTypes[resourceType as keyof typeof acceptedTypes] || "*"}
            onChange={handleFileChange}
            id="file-upload"
          />
          <Button variant="outline" size="sm" asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              Select File
            </label>
          </Button>
        </>
      )}
    </div>
  )
}
