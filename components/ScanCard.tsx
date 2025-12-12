"use client";

import { useState, useEffect, useRef } from "react";
import { cafeApi } from "@/services/cafeApi";
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

  useEffect(() => {
    nfcScannerRef.current = new NFCScanner();

    const checkNFCSupport = async () => {
      const supported = await nfcScannerRef.current?.checkNFCSupport();
      setIsNFCEnabled(!!supported);
    };

    checkNFCSupport();

    return () => {
      nfcScannerRef.current?.stopScanning();
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
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        "Scan failed";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const startNFCScanning = async () => {
    if (!nfcScannerRef.current || !isNFCEnabled) {
      setNfcError("NFC not supported or disabled.");
      return;
    }

    setIsNFCScanning(true);
    setNfcStatus("scanning");
    setNfcError("");

    try {
      await nfcScannerRef.current.startScanning(async (result) => {
        if (result.data) await processScan(result.data);
      });
    } catch (error: any) {
      setNfcStatus("error");
      setNfcError(error.message);
      setIsNFCScanning(false);
    }
  };

  const stopNFCScanning = async () => {
    await nfcScannerRef.current?.stopScanning();
    setIsNFCScanning(false);
    setNfcStatus("idle");
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          NFC Scanner
        </h2>

        {isNFCEnabled && nfcError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mb-4">
            {nfcError}
          </div>
        )}

        <button
          onClick={isNFCScanning ? stopNFCScanning : startNFCScanning}
          disabled={!isNFCEnabled}
          className={`w-full py-8 px-6 rounded-xl text-white font-bold shadow-lg ${
            isNFCScanning
              ? "bg-red-600 animate-pulse"
              : isNFCEnabled
              ? "bg-green-600"
              : "bg-gray-300"
          }`}
        >
          {isNFCScanning ? "Stop Scanning" : "Start NFC Scan"}
        </button>

        {!isNFCEnabled && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm text-center">
            NFC not available on this device.
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
