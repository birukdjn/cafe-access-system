export interface NFCScanResult {
  id: string;
  type: string;
  data?: string;
  timestamp: Date;
}

export class NFCScanner {
  private reader: any = null;
  private isSupported: boolean = false;

  constructor() {
    // Check if Web NFC is available
    this.isSupported = 'NDEFReader' in window;
  }

  async checkNFCSupport(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Web NFC is not supported in this browser.');
      return false;
    }
    return true;
  }

  async startScanning(onScan: (result: NFCScanResult) => void): Promise<void> {
    if (!this.isSupported) {
      throw new Error('Web NFC is not supported');
    }

    try {
      // @ts-ignore - NDEFReader is not in TypeScript by default
      this.reader = new NDEFReader();

      await this.reader.scan();

      this.reader.addEventListener('reading', ({ message, serialNumber }: any) => {
        const records = message.records;
        let scannedData = '';

        // Try to read text records
        for (const record of records) {
          if (record.recordType === 'text') {
            const textDecoder = new TextDecoder(record.encoding);
            scannedData = textDecoder.decode(record.data);
          } else if (record.recordType === 'url') {
            const textDecoder = new TextDecoder();
            scannedData = textDecoder.decode(record.data);
          }
        }

        const result: NFCScanResult = {
          id: serialNumber || 'unknown',
          type: 'NFC',
          data: scannedData || serialNumber,
          timestamp: new Date()
        };

        onScan(result);
      });

      this.reader.addEventListener('readingerror', (error: any) => {
        console.error('NFC reading error:', error);
      });

    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        throw new Error('NFC permission denied. Please allow NFC access.');
      } else if (error.name === 'NotSupportedError') {
        throw new Error('NFC is not supported by this device.');
      } else {
        throw new Error(`NFC scanning failed: ${error.message}`);
      }
    }
  }

  async stopScanning(): Promise<void> {
    if (this.reader) {
      try {
        // Some browsers don't have abort method, so we handle it gracefully
        if (typeof this.reader.abort === 'function') {
          await this.reader.abort();
        }
      } catch (error) {
        console.warn('Error stopping NFC scanner:', error);
      }
      this.reader = null;
    }
  }

  // Simulate NFC scan for development/testing
  simulateNFCScan(code: string): NFCScanResult {
    return {
      id: `simulated-${Date.now()}`,
      type: 'NFC',
      data: code,
      timestamp: new Date()
    };
  }
}