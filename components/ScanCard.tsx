"use client";

import { useState, useEffect, useRef } from "react";
import { cafeApi } from "@/lib/api";
import { CafeScanResponse } from "@/types/cafe";
import ScanResultModal from "./ScanResultModal";
import { NFCScanner } from "@/lib/nfc";

export default function ScanCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<CafeScanResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isNFCEnabled, setIsNFCEnabled] = useState(false);
  const [isNFCScanning, setIsNFCScanning] = useState(false);
  const [nfcStatus, setNfcStatus] = useState<"idle" | "scanning" | "error">(
    "idle"
  );
  const [nfcError, setNfcError] = useState<string>("");

  const nfcScannerRef = useRef<NFCScanner | null>(null);

  // Initialize NFC scanner
  useEffect(() => {
    nfcScannerRef.current = new NFCScanner();

    // Check NFC support on mount
    const checkNFCSupport = async () => {
      const supported = await nfcScannerRef.current?.checkNFCSupport();
      setIsNFCEnabled(!!supported);
    };

    checkNFCSupport();

    // Cleanup on unmount
    return () => {
      if (nfcScannerRef.current) {
        nfcScannerRef.current.stopScanning();
      }
    };
  }, []);

  const processScan = async (code: string) => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const result = await cafeApi.scan(code);
      setScanResult(result);
      setShowModal(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.response?.data || "Scan failed";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const startNFCScanning = async () => {
    if (!nfcScannerRef.current || !isNFCEnabled) {
      setNfcError("NFC is not supported or enabled");
      return;
    }

    setIsNFCScanning(true);
    setNfcStatus("scanning");
    setNfcError("");

    try {
      await nfcScannerRef.current.startScanning(async (result) => {
        if (result.data) {
          // Process the scanned NFC data
          await processScan(result.data);
        }
      });
    } catch (error: any) {
      setNfcStatus("error");
      setNfcError(error.message);
      setIsNFCScanning(false);
    }
  };

  const stopNFCScanning = async () => {
    if (nfcScannerRef.current) {
      await nfcScannerRef.current.stopScanning();
      setIsNFCScanning(false);
      setNfcStatus("idle");
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          NFC Scanner
        </h2>

        {/* Status Indicator */}
        {isNFCEnabled && (
          <div className="mb-6">
            {nfcError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-3">
                {nfcError}
              </div>
            )}

            {isNFCScanning && (
              <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-green-600"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-green-700 font-medium">
                    Ready to scan...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main NFC Button */}
        <button
          onClick={isNFCScanning ? stopNFCScanning : startNFCScanning}
          disabled={!isNFCEnabled}
          className={`w-full font-bold py-8 px-6 rounded-xl transition-all transform active:scale-95 flex flex-col items-center justify-center shadow-lg text-white ${
            isNFCScanning
              ? "bg-red-600 active:bg-red-700 animate-pulse"
              : isNFCEnabled
              ? "bg-linear-to-br from-green-500 to-blue-600 active:from-green-600 active:to-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <svg
            className="w-16 h-16 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <span className="text-xl">
            {isNFCScanning ? "Stop Scanning" : "Start NFC Scan"}
          </span>
        </button>

        {!isNFCEnabled && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 text-center">
            NFC not available. Please use an NFC-enabled device.
          </div>
        )}
      </div>

      <ScanResultModal
        result={scanResult}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
