import { useRef, useState, useCallback } from "react";

// Wraps MediaRecorder with a simple state machine:
// idle -> recording -> recorded (has a blob, can play/redo/accept)
export function useRecorder() {
  const [status, setStatus] = useState("idle"); // idle | recording | recorded
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [durationSeconds, setDurationSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const startTimeRef = useRef(0);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: false, // we WANT realistic home noise, not scrubbed
        },
      });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setDurationSeconds((Date.now() - startTimeRef.current) / 1000);
        setStatus("recorded");
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = recorder;
      startTimeRef.current = Date.now();
      recorder.start();
      setStatus("recording");
    } catch (err) {
      setError(
        "Couldn't access the microphone. Check your browser's mic permission for this site."
      );
      setStatus("idle");
    }
  }, []);

  const stop = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    chunksRef.current = [];
    setAudioUrl(null);
    setDurationSeconds(0);
    setStatus("idle");
    setError(null);
  }, [audioUrl]);

  const getBlob = useCallback(() => {
    const mimeType = chunksRef.current[0]?.type || "audio/webm";
    return new Blob(chunksRef.current, { type: mimeType });
  }, []);

  return { status, audioUrl, error, durationSeconds, start, stop, reset, getBlob };
}
