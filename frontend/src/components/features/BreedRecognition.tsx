'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Sparkles, Camera, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  recognizeBreed,
  formatBreedName,
  validateImageFile,
  type BreedPrediction,
} from '@/services/breedRecognition';

interface BreedRecognitionProps {
  className?: string;
}

export function BreedRecognition({ className = '' }: BreedRecognitionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<BreedPrediction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (file: File) => {
    // Reset states
    setError(null);
    setPredictions([]);

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Analyze image
    setIsAnalyzing(true);
    try {
      const result = await recognizeBreed(file);
      
      if (result.predictions && result.predictions.length > 0) {
        // Sort by confidence
        const sortedPredictions = result.predictions.sort(
          (a, b) => b.confidence - a.confidence
        );
        setPredictions(sortedPredictions.slice(0, 3)); // Show top 3
      } else {
        setError('No breed detected. Please try another image with a clear view of the dog.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPredictions([]);
    setError(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500/20 border-green-500/30';
    if (confidence >= 0.6) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-orange-500/20 border-orange-500/30';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-neutral-900/60 backdrop-blur-sm rounded-3xl border border-purple-400/20 overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-purple-200 font-inter">
                AI-Powered Feature
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-200 mb-3 font-urbanist">
              Dog Breed Recognition
            </h3>
            <p className="text-purple-300 font-inter max-w-2xl mx-auto">
              Upload a photo of your dog and our AI will identify the breed with advanced computer vision technology
            </p>
          </div>

          {/* Upload Area or Image Preview */}
          {!selectedImage ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-purple-400 bg-purple-500/10 scale-[1.02]'
                  : 'border-purple-400/30 bg-neutral-800/40 hover:border-purple-400/50 hover:bg-neutral-800/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="breed-upload"
              />

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 border border-purple-400/20">
                  <Camera className="w-10 h-10 text-purple-400" />
                </div>

                <h4 className="text-lg font-semibold text-purple-200 mb-2 font-urbanist">
                  Upload a Dog Photo
                </h4>
                <p className="text-sm text-purple-300 mb-6 font-inter max-w-md">
                  Drag and drop an image here, or click to browse
                </p>

                <label htmlFor="breed-upload">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-full text-white font-inter font-medium shadow-lg shadow-purple-500/20"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                </label>

                <p className="text-xs text-purple-400 mt-4 font-inter">
                  Supports: JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative">
                <div className="relative aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-2xl border border-purple-400/20">
                  <Image
                    src={selectedImage}
                    alt="Selected dog"
                    fill
                    className="object-contain bg-neutral-800"
                  />
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="absolute top-4 right-4 w-10 h-10 bg-neutral-900/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-400/20 hover:bg-neutral-800 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-5 h-5 text-purple-300" />
                </button>
              </div>

              {/* Loading State */}
              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 bg-purple-400/20 rounded-full blur-xl animate-pulse" />
                  </div>
                  <p className="text-purple-200 font-medium mt-4 font-inter">
                    Analyzing breed...
                  </p>
                  <p className="text-purple-300 text-sm mt-1 font-inter">
                    This may take a few seconds
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && !isAnalyzing && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-200 font-medium font-inter">Analysis Failed</p>
                    <p className="text-red-300 text-sm mt-1 font-inter">{error}</p>
                  </div>
                </div>
              )}

              {/* Results */}
              {predictions.length > 0 && !isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-400 mr-2" />
                    <h4 className="text-xl font-bold text-purple-200 font-urbanist">
                      Breed Analysis Complete!
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {predictions.map((prediction, index) => (
                      <div
                        key={index}
                        className={`bg-neutral-800/60 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02] ${
                          index === 0
                            ? 'border-purple-400/40 ring-2 ring-purple-400/20'
                            : 'border-purple-400/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {index === 0 && (
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">1</span>
                              </div>
                            )}
                            <div>
                              <h5 className="text-lg font-bold text-purple-200 font-urbanist">
                                {formatBreedName(prediction.class)}
                              </h5>
                              {index === 0 && (
                                <p className="text-xs text-purple-400 font-inter">
                                  Most likely match
                                </p>
                              )}
                            </div>
                          </div>

                          <div
                            className={`px-3 py-1.5 rounded-full border ${getConfidenceBgColor(
                              prediction.confidence
                            )}`}
                          >
                            <span
                              className={`text-sm font-bold font-inter ${getConfidenceColor(
                                prediction.confidence
                              )}`}
                            >
                              {(prediction.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* Confidence Bar */}
                        <div className="w-full bg-neutral-700/50 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${prediction.confidence * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Try Another Button */}
                  <div className="text-center pt-4">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-full font-inter font-medium"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Try Another Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="bg-neutral-900/40 border-t border-purple-400/10 px-6 py-4">
          <p className="text-xs text-purple-300 text-center font-inter">
            <Sparkles className="w-3 h-3 inline-block mr-1" />
            Powered by advanced AI and computer vision technology. Results are for entertainment and informational purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
