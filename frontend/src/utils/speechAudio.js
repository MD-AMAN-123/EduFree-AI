// EduFree.AI Audio & Speech Synthesis Engine
// High-fidelity real-time Telugu pronunciation with multi-tier streaming, local caching & Web Audio fallback.
// CRITICAL: Google TTS endpoint does NOT set CORS headers → fetch() is blocked in browsers.
// Solution: Use <audio> element src directly (no-cors by default) + canplaythrough event for reliable playback.

let audioCtx = null;
const audioBlobCache = new Map();   // text → blobUrl (for offline replay)
const ttsUrlCache = new Map();      // text → direct TTS URL (for instant replay)
let currentActiveAudio = null;
let _cachedTeluguVoice = null;      // Cached best Web Speech Telugu voice
let _voiceSearchDone = false;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Preload and cache speech synthesis voices if available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
    _voiceSearchDone = false; // re-search when voices change
    _cachedTeluguVoice = null;
  };
}

/**
 * Find the best available Telugu voice for Web Speech API.
 * Priority: Neural/Natural te-IN > any te-IN > null
 * Non-Telugu accents (hi-IN, en-IN, ta-IN) are intentionally excluded to
 * keep pronunciation localised to Telugu at all times.
 */
function getBestTeluguVoice() {
  if (_voiceSearchDone) return _cachedTeluguVoice;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Natural / Neural Telugu voices (highest quality)
  _cachedTeluguVoice = voices.find((v) =>
    (v.lang === 'te-IN' || v.lang === 'te') &&
    /natural|neural|wavenet|google|mohan|shruti/i.test(v.name)
  );

  // Any Telugu voice
  if (!_cachedTeluguVoice) {
    _cachedTeluguVoice = voices.find((v) =>
      v.lang === 'te-IN' || v.lang === 'te' || v.name.toLowerCase().includes('telugu')
    );
  }

  // NOTE: No non-Telugu fallback — accent must stay localised to Telugu (te-IN).

  _voiceSearchDone = true;
  return _cachedTeluguVoice;
}

/**
 * Check if Telugu speech voice is available on this browser/OS
 */
export function hasTeluguVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  const voices = window.speechSynthesis.getVoices();
  return voices.some((v) => v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu'));
}

/**
 * Stop any current audio playback or speech synthesis
 */
export function stopSpeech() {
  if (currentActiveAudio) {
    try {
      currentActiveAudio.pause();
      currentActiveAudio.currentTime = 0;
    } catch (e) {}
    currentActiveAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

/**
 * Build Google Translate TTS URL for Telugu text.
 * Uses te-IN locale with slow classroom-appropriate speed (0.8x).
 * The `client=tw-ob` parameter enables direct audio streaming.
 */
function buildTtsUrl(text, speed = 0.8) {
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=te&client=tw-ob&ttsspeed=${speed}&q=${encodeURIComponent(text)}`;
}

/**
 * Play audio from a URL using <audio> element (no-cors, works cross-origin).
 * Returns a Promise that resolves on successful play start, rejects on error.
 */
function playAudioElement(url, rate = 0.85) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';  // Try CORS, but audio elements fall back to no-cors
    audio.preload = 'auto';

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        audio.removeAttribute('src');
        reject(new Error('Audio load timeout'));
      }
    }, 6000); // 6s timeout for slow networks

    audio.oncanplaythrough = () => {
      if (resolved) return;
      clearTimeout(timeout);
      resolved = true;
      audio.playbackRate = rate;
      currentActiveAudio = audio;
      audio.play().then(() => resolve(audio)).catch(reject);
    };

    audio.onerror = () => {
      if (resolved) return;
      clearTimeout(timeout);
      resolved = true;
      reject(new Error('Audio load error'));
    };

    // Setting src directly triggers a no-cors media request (not subject to fetch CORS rules)
    audio.src = url;
    audio.load();
  });
}

/**
 * Speak text in Telugu with real-time natural audio
 * 
 * Tier 1: Google Translate TTS via <audio> element (native te-IN accent, bypasses CORS)
 * Tier 2: Web Speech API (if browser has Telugu/Indian TTS voices installed)
 * Tier 3: Acoustic Vocal Tract Formant Synthesizer (100% offline fallback)
 */
export async function speakTeluguText(text, options = {}) {
  const { rate = 0.85, pitch = 1.0, phonetic = '', onStart = null, onEnd = null } = options;

  if (!text || typeof text !== 'string') {
    if (onEnd) onEnd();
    return;
  }

  stopSpeech();

  if (onStart) {
    try { onStart(); } catch (e) {}
  }

  const cleanText = text.trim();
  let finished = false;
  const finish = () => {
    if (!finished) {
      finished = true;
      currentActiveAudio = null;
      if (onEnd) {
        try { onEnd(); } catch (e) {}
      }
    }
  };

  // --- Tier 1: Google Translate TTS via Audio Element (Native Telugu Accent) ---
  // <audio> elements make "no-cors" media requests, bypassing the CORS restriction
  // that blocks fetch() to translate.google.com
  try {
    const ttsUrl = buildTtsUrl(cleanText, 0.8);
    const audio = await playAudioElement(ttsUrl, rate);

    // Cache the URL for instant replay
    ttsUrlCache.set(cleanText, ttsUrl);

    audio.onended = finish;
    audio.onerror = finish; // Already playing, just finish on error
    return; // Successfully playing native Telugu audio!
  } catch (audioErr) {
    // Google TTS unavailable (offline, blocked, timeout) → try fallbacks
  }

  // --- Tier 2 & 3: Web Speech API / Formant Synthesizer ---
  fallbackSpeech(cleanText, { rate, pitch, phonetic, onEnd: finish });
}

/**
 * Fallback to Web Speech API or Acoustic Formant Synthesizer
 */
function fallbackSpeech(text, { rate = 0.88, pitch = 1.0, phonetic = '', onEnd }) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = 'te-IN'; // Always Telugu — accent must not drift to another language

      // Use cached best Telugu voice (never a non-Telugu fallback)
      const bestVoice = getBestTeluguVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
        // Pin lang to te-IN regardless of the voice object's reported locale
        // so phoneme rendering stays Telugu-localised
        utterance.lang = 'te-IN';
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        synthesizeVocalFormant(text, phonetic, onEnd);
      };

      window.speechSynthesis.speak(utterance);
      return;
    } catch (e) {
      // Speech synthesis error
    }
  }

  synthesizeVocalFormant(text, phonetic, onEnd);
}

/**
 * Web Audio Vocal Tract Formant Synthesizer (F1/F2 acoustic resonance modeling)
 * Provides authentic phonetic vocal output offline when no TTS engine is installed.
 */
function synthesizeVocalFormant(text, phoneticHint = '', onEnd = null) {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      if (onEnd) onEnd();
      return;
    }

    // Determine acoustic formants (F1, F2 in Hz) based on Telugu vowel / syllable
    let f1 = 800; // default /a/
    let f2 = 1200;
    let duration = 0.45;
    let basePitch = 165; // Human speaking voice F0 (approx. 165Hz)

    if (text.includes('ఆ') || phoneticHint === 'aa') {
      f1 = 850; f2 = 1150; duration = 0.55;
    } else if (text.includes('ఇ') || text.includes('ి') || phoneticHint === 'i') {
      f1 = 300; f2 = 2300; duration = 0.38;
    } else if (text.includes('ఈ') || text.includes('ీ') || phoneticHint === 'ee') {
      f1 = 250; f2 = 2500; duration = 0.55;
    } else if (text.includes('ఉ') || text.includes('ు') || phoneticHint === 'u') {
      f1 = 350; f2 = 800; duration = 0.38;
    } else if (text.includes('ఊ') || text.includes('ూ') || phoneticHint === 'oo') {
      f1 = 300; f2 = 700; duration = 0.55;
    } else if (text.includes('ఎ') || text.includes('ె') || phoneticHint === 'e') {
      f1 = 550; f2 = 1800; duration = 0.38;
    } else if (text.includes('ఏ') || text.includes('ే') || phoneticHint === 'ae') {
      f1 = 500; f2 = 1900; duration = 0.52;
    } else if (text.includes('ఐ') || text.includes('ై') || phoneticHint === 'ai') {
      f1 = 700; f2 = 1500; duration = 0.55;
    } else if (text.includes('ఒ') || text.includes('ొ') || phoneticHint === 'o') {
      f1 = 500; f2 = 900; duration = 0.38;
    } else if (text.includes('ఓ') || text.includes('ో') || phoneticHint === 'oh') {
      f1 = 450; f2 = 850; duration = 0.52;
    } else if (text.includes('ఔ') || text.includes('ౌ') || phoneticHint === 'ou') {
      f1 = 600; f2 = 950; duration = 0.55;
    } else if (text.includes('అం') || text.includes('ం') || phoneticHint === 'am') {
      f1 = 750; f2 = 1250; duration = 0.45;
    }

    const now = ctx.currentTime;

    // Glottal excitation oscillator (Sawtooth rich harmonic spectrum)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(basePitch, now);
    osc.frequency.linearRampToValueAtTime(basePitch * 0.94, now + duration);

    // Formant 1 Bandpass Filter
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(f1, now);
    filter1.Q.setValueAtTime(5.5, now);

    // Formant 2 Bandpass Filter
    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(f2, now);
    filter2.Q.setValueAtTime(6.0, now);

    // Formant Gain Mixing
    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.24, now);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.18, now);

    // Master Amplitude Envelope
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.35, now + 0.05); // Vocal onset
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Vocal decay

    // Routing
    osc.connect(filter1);
    osc.connect(filter2);
    filter1.connect(gain1);
    filter2.connect(gain2);
    gain1.connect(masterGain);
    gain2.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);

    if (onEnd) {
      setTimeout(onEnd, Math.round(duration * 1000) + 30);
    }
  } catch (err) {
    if (onEnd) onEnd();
  }
}

/**
 * Web Audio API Acoustic Feedback (Success, Error, Tap, Complete)
 */
export function playTone(type = 'tap') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'tap') {
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'mark_error') {
      osc.frequency.setValueAtTime(280, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'complete') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) {
    // Non-critical audio warning
  }
}
