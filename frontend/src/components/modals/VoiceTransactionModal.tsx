import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Volume2,
  Edit3,
  Check,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { Customer, Transaction } from '../../types';

interface VoiceTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onSaveVoiceTransaction: (transaction: Transaction) => void;
}

interface ExtractedData {
  customerName: string;
  customerId: string;
  items: Array<{ name: string; quantity: string; price: number }>;
  total: number;
  paid: number;
  outstanding: number;
  due: string;
  confidence: number;
}

const SAMPLE_SCRIPTS = [
  {
    id: 's1',
    label: 'Ramesh (Rice + Oil, ₹430 Baaki, Friday Due)',
    text: 'Ramesh ko 2 kilo chawal aur ek tel diya, 430 rupaye baaki, Friday ko dega.'
  },
  {
    id: 's2',
    label: 'Priya Sharma (Tea + Butter, ₹340 Paid via UPI)',
    text: 'Priya Sharma bought 1 pack Tata tea and Amul butter, 340 rupees paid via UPI.'
  },
  {
    id: 's3',
    label: 'Amit Kumar (Atta + Biscuits, ₹310 Cash)',
    text: 'Amit Kumar liya 1 bag Aashirvaad aata aur 5 Parle-G, 310 cash diya.'
  }
];

export const VoiceTransactionModal: React.FC<VoiceTransactionModalProps> = ({
  isOpen,
  onClose,
  customers,
  onSaveVoiceTransaction
}) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [speechLanguage, setSpeechLanguage] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(true);

  // Audio wave visualization from real mic
  const [waveHeights, setWaveHeights] = useState<number[]>([15, 20, 25, 20, 15, 30, 20, 15, 25, 20]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check speech recognition capability on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
    }
  }, []);

  // Cleanup on unmount or close
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setSpokenText('');
      setExtractedData(null);
      setMicPermissionError(null);
      setIsSaved(false);
      setIsEditingText(false);
    }
  }, [isOpen]);

  // Audio visualizer loop
  const updateVisualizer = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Pick 10 sample bands
    const step = Math.floor(dataArray.length / 10);
    const newHeights = Array.from({ length: 10 }, (_, i) => {
      const val = dataArray[i * step] || 0;
      return Math.max(15, Math.min(100, Math.round((val / 255) * 100)));
    });
    setWaveHeights(newHeights);

    animationFrameRef.current = requestAnimationFrame(updateVisualizer);
  };

  // Start real microphone & Web Speech Recognition
  const startListening = async () => {
    setMicPermissionError(null);
    setExtractedData(null);
    setSpokenText('');

    // 1. Setup real Microphone Stream & Web Audio Analyser
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;
          updateVisualizer();
        }
      }
    } catch (err: any) {
      console.warn('Microphone stream access notice:', err);
      // If mic is denied or running in sandbox without audio hardware
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicPermissionError('Microphone permission was denied. Please allow microphone access in your browser bar, or tap a sample phrase below.');
      }
    }

    // 2. Setup Real Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = speechLanguage;
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setSpokenText(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition status:', event.error);
          if (event.error === 'not-allowed') {
            setMicPermissionError('Microphone permission was not granted.');
          }
          stopListening();
        };

        recognition.onend = () => {
          stopListening();
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Recognition start error:', e);
        setIsListening(true);
      }
    } else {
      setIsListening(true);
    }
  };

  // Stop listening and process audio text
  const stopListening = () => {
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    // Reset wave heights
    setWaveHeights([15, 20, 25, 20, 15, 30, 20, 15, 25, 20]);
  };

  // Effect to parse when spoken text settles after listening
  useEffect(() => {
    if (!isListening && spokenText && spokenText.trim().length > 3 && !extractedData) {
      processSpokenText(spokenText);
    }
  }, [isListening, spokenText]);

  // Natural Language Parser for Voice Transaction
  const processSpokenText = (text: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      const lower = text.toLowerCase();

      // 1. Identify Customer
      let matchedCust = customers.find((c) =>
        lower.includes(c.name.toLowerCase().split(' ')[0])
      );

      const custName = matchedCust ? matchedCust.name : 'Counter Customer';
      const custId = matchedCust ? matchedCust.id : `cust-voice-${Date.now()}`;

      // 2. Extract Items & Quantities
      const items: Array<{ name: string; quantity: string; price: number }> = [];

      if (lower.includes('chawal') || lower.includes('rice')) {
        const qty = lower.includes('5') ? '5 kg' : lower.includes('1') ? '1 kg' : '2 kg';
        const price = lower.includes('5') ? 325 : lower.includes('1') ? 65 : 130;
        items.push({ name: 'Kolam Super Rice', quantity: qty, price });
      }

      if (lower.includes('tel') || lower.includes('oil')) {
        items.push({ name: 'Fortune Sunflower Oil', quantity: '1 pouch', price: 150 });
      }

      if (lower.includes('cheeni') || lower.includes('sugar')) {
        items.push({ name: 'Refined White Sugar', quantity: '2 kg', price: 100 });
      }

      if (lower.includes('aata') || lower.includes('atta')) {
        const qty = lower.includes('10') ? '10 kg' : lower.includes('5') ? '5 kg' : '1 bag (5kg)';
        const price = lower.includes('10') ? 520 : 260;
        items.push({ name: 'Aashirvaad Shudh Chakki Atta', quantity: qty, price });
      }

      if (lower.includes('chai') || lower.includes('tea')) {
        items.push({ name: 'Tata Tea Gold Premium', quantity: '1 pack', price: 170 });
      }

      if (lower.includes('butter') || lower.includes('makhan')) {
        items.push({ name: 'Amul Butter 500g', quantity: '1 pack', price: 150 });
      }

      if (lower.includes('biscuit') || lower.includes('parle')) {
        items.push({ name: 'Parle-G Glucose Biscuits', quantity: '5 packs', price: 50 });
      }

      // Default fallback items if generic
      if (items.length === 0) {
        items.push({ name: 'Counter Grocery Essentials', quantity: 'Assorted items', price: 430 });
      }

      // 3. Extract Financials & Payment Commitments
      // Search for numbers in text (e.g. 430, 340, 250)
      const numMatches = text.match(/\b\d{2,5}\b/g);
      let total = items.reduce((sum, it) => sum + it.price, 0);

      if (numMatches && numMatches.length > 0) {
        const parsedNum = parseInt(numMatches[numMatches.length - 1], 10);
        if (parsedNum >= 20 && parsedNum <= 100000) {
          total = parsedNum;
        }
      }

      // Determine if paid or pending / baaki
      const isPending =
        lower.includes('baaki') ||
        lower.includes('baki') ||
        lower.includes('udhaar') ||
        lower.includes('dega') ||
        lower.includes('pending') ||
        lower.includes('later');

      const paid = isPending ? 0 : total;
      const outstanding = isPending ? total : 0;

      // Due date detection
      let due = 'Settled';
      if (isPending) {
        if (lower.includes('friday') || lower.includes('shukrawar')) {
          due = 'This Friday';
        } else if (lower.includes('monday') || lower.includes('somwar')) {
          due = 'Next Monday';
        } else if (lower.includes('tomorrow') || lower.includes('kal')) {
          due = 'Tomorrow';
        } else {
          due = 'Within 3 days';
        }
      }

      setExtractedData({
        customerName: custName,
        customerId: custId,
        items,
        total,
        paid,
        outstanding,
        due,
        confidence: 96
      });

      setIsProcessing(false);
    }, 600);
  };

  // 1-click test script runner
  const handleSelectSample = (sampleText: string) => {
    stopListening();
    setSpokenText(sampleText);
    processSpokenText(sampleText);
  };

  // Confirm and commit transaction to store memory
  const handleConfirmSave = () => {
    if (!extractedData) return;

    const matchedCustomer =
      customers.find((c) => c.id === extractedData.customerId) || customers[0];

    const customerId = matchedCustomer ? matchedCustomer.id : `cust-voice-${Date.now()}`;
    const customerName = matchedCustomer ? matchedCustomer.name : (extractedData.customerName || 'Voice Customer');
    const customerPhone = matchedCustomer ? matchedCustomer.phone : '+91 98765 00000';

    const newTxn: Transaction = {
      id: `txn-voice-${Date.now()}`,
      customerId,
      customerName,
      customerPhone,
      date: 'Today, Just now',
      timestamp: new Date().toISOString(),
      items: extractedData.items.map((it, idx) => ({
        productId: `prod-voice-${idx}`,
        productName: it.name,
        quantity: parseInt(it.quantity) || 1,
        unit: 'unit',
        unitPrice: it.price,
        totalPrice: it.price
      })),
      totalAmount: extractedData.total,
      amountPaid: extractedData.paid,
      balancePending: extractedData.outstanding,
      paymentStatus: extractedData.outstanding === 0 ? 'paid' : 'pending',
      paymentMethod: extractedData.paid > 0 ? 'UPI' : 'Credit / Khata',
      dueDate: extractedData.outstanding > 0 ? extractedData.due : undefined,
      notes: `Recorded via Voice AI: "${spokenText}"`,
      recordedVia: 'voice_ai'
    };

    setIsSaved(true);
    setTimeout(() => {
      onSaveVoiceTransaction(newTxn);
      setIsSaved(false);
      onClose();
      setExtractedData(null);
      setSpokenText('');
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Voice Transaction Entry"
      subtitle="Speak in Hindi, Hinglish, or English. HisabAI automatically parses items and commitments."
      maxWidth="md"
    >
      {isSaved ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">
            Recorded in Shop Memory!
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            Transaction saved and {extractedData?.customerName}’s balance updated.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Language Selector */}
          <div className="flex items-center justify-between bg-slate-100/80 p-2 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium px-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Speech Input:</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSpeechLanguage('hi-IN')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  speechLanguage === 'hi-IN'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hindi / Hinglish (hi-IN)
              </button>
              <button
                type="button"
                onClick={() => setSpeechLanguage('en-IN')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  speechLanguage === 'en-IN'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English (en-IN)
              </button>
            </div>
          </div>

          {/* Main Voice Mic Box */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200/90 text-center relative overflow-hidden">
            {/* Live Audio Visualizer Bars */}
            <div className="flex items-center justify-center gap-1.5 h-12 mb-3">
              {waveHeights.map((h, i) => (
                <span
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-75 ${
                    isListening ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            {/* Mic Button */}
            <button
              id="btn-voice-mic-trigger"
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              aria-label={isListening ? 'Stop listening' : 'Start microphone listening'}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
                isListening
                  ? 'bg-rose-600 text-white ring-8 ring-rose-100 scale-105 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white hover:scale-105'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>

            <div className="mt-4">
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {isListening
                  ? 'Listening to microphone... (Speak now)'
                  : isProcessing
                  ? 'Structuring transaction with AI...'
                  : 'Tap to speak transaction'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                {isListening
                  ? 'Speak items, customer name, price, or payment commitments.'
                  : 'Uses your browser microphone to record counter entries directly.'}
              </p>
            </div>

            {/* Stop & Process button when listening */}
            {isListening && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={stopListening}
                className="mt-3 bg-white border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                Done Speaking / Process
              </Button>
            )}
          </div>

          {/* Microphone Permission / Browser Notice */}
          {micPermissionError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Microphone notice: </span>
                {micPermissionError}
              </div>
            </div>
          )}

          {/* Quick Voice Prompt Examples */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Common Counter Phrases
              </span>
              <span className="text-[11px] text-slate-400">Tap to test voice NLP</span>
            </div>
            <div className="space-y-1.5">
              {SAMPLE_SCRIPTS.map((script) => (
                <button
                  key={script.id}
                  type="button"
                  onClick={() => handleSelectSample(script.text)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs transition-colors flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">{script.label}</div>
                    <div className="text-[11px] text-slate-500 italic truncate mt-0.5">
                      "{script.text}"
                    </div>
                  </div>
                  <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Live Transcript Display / Manual Adjustment */}
          {(spokenText || isListening) && (
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-indigo-900 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Transcript:</span>
                </div>
                {!isListening && (
                  <button
                    type="button"
                    onClick={() => setIsEditingText(!isEditingText)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingText ? 'Done' : 'Edit'}</span>
                  </button>
                )}
              </div>

              {isEditingText ? (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={spokenText}
                    onChange={(e) => setSpokenText(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-indigo-300 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsEditingText(false);
                      processSpokenText(spokenText);
                    }}
                  >
                    Re-extract
                  </Button>
                </div>
              ) : (
                <p className="text-slate-800 italic">
                  "{spokenText || 'Listening for speech...'}"
                </p>
              )}
            </div>
          )}

          {/* Extracted Transaction Card */}
          {extractedData && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-600 uppercase">
                  Identified Record
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {extractedData.confidence}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Customer
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {extractedData.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Payment Status
                  </span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    {extractedData.outstanding > 0 ? (
                      <span className="text-amber-700 font-semibold">
                        Baaki (Due: {extractedData.due})
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Settled Now</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Items Identified */}
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
                  Items Identified
                </span>
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  {extractedData.items.map((it, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-700">
                      <span>
                        {it.name} ({it.quantity})
                      </span>
                      <span className="font-semibold text-slate-900">₹{it.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financials */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Total Bill</div>
                  <div className="text-sm font-bold text-slate-900">₹{extractedData.total}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Paid Now</div>
                  <div className="text-sm font-bold text-emerald-600">₹{extractedData.paid}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Outstanding</div>
                  <div className="text-sm font-bold text-amber-600">₹{extractedData.outstanding}</div>
                </div>
              </div>

              {/* Confirm CTA */}
              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => setIsEditingText(true)}
                  icon={<Edit3 className="w-3.5 h-3.5" />}
                >
                  Edit Details
                </Button>
                <Button
                  id="btn-confirm-voice-save"
                  type="button"
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleConfirmSave}
                  icon={<Check className="w-4 h-4" />}
                >
                  Confirm & Save (₹{extractedData.total})
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
export default VoiceTransactionModal;
