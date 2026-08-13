import { useState, useEffect, useCallback } from "react";
import { useRecorder } from "./useRecorder";
import {
  pickUtteranceForSpeaker,
  pickBenchmarkUtterance,
  forSplit,
  forBenchmark,
} from "./utterances";
import { submitRecording, getRecordedUtteranceIds } from "./firebase";
import { useLang } from "./i18n";

export default function RecordScreen({
  speakerName,
  speakerId,
  languageComfort,
  datasetSplit = "train",
  onSwitchSpeaker,
}) {
  const { t, lang, setLang } = useLang();
  const isBenchmark = datasetSplit === "benchmark";
  // The fixed-pool splits (test's 24, benchmark's 20) both stop and show
  // a completion screen once fully covered, instead of the training
  // pool's endless repeat-for-variety cycling — see nextUtterance.
  const isFixedPool = isBenchmark || datasetSplit === "test";
  const splitPool = isBenchmark ? forBenchmark() : forSplit(datasetSplit);
  const pickNext = isBenchmark
    ? (comfort, excludeIds) => pickBenchmarkUtterance(excludeIds)
    : (comfort, excludeIds) =>
        pickUtteranceForSpeaker(comfort, excludeIds, datasetSplit);

  // coveredIds = every utteranceId this speaker has EVER recorded
  // (loaded from Firebase on mount, then grown locally as they record more
  // in this session — no rolling window, so nothing gets re-prompted until
  // the whole pool has actually been covered at least once).
  const [coveredIds, setCoveredIds] = useState(null); // null = still loading
  const [utterance, setUtterance] = useState(null);
  const [spokenText, setSpokenText] = useState("");
  const [editingText, setEditingText] = useState(false);
  const [noiseTag, setNoiseTag] = useState("quiet");
  const [submitting, setSubmitting] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [toast, setToast] = useState(null);
  // Set once a test-mode speaker has covered every utterance in the test
  // split — see nextUtterance. Repeats are still fine for the training
  // pool (that's genuinely useful multi-take variety), but for a
  // benchmark set extra takes from the same speaker don't add much, so
  // we stop and ask rather than silently cycling back to a "repeat" the
  // speaker will assume is a bug (see the "keeps looping" report this
  // was added for).
  const [testComplete, setTestComplete] = useState(false);

  const NOISE_OPTIONS = [
    { value: "quiet", label: t.noiseQuiet },
    { value: "home_noise", label: t.noiseHome },
    { value: "other", label: t.noiseOther },
  ];

  const recorder = useRecorder();

  // Load this speaker's full recording history once, then pick the first
  // utterance to show — weighted toward their stated language comfort.
  useEffect(() => {
    let cancelled = false;
    getRecordedUtteranceIds(speakerId).then((ids) => {
      if (cancelled) return;
      setCoveredIds(ids);
      setUtterance(pickNext(languageComfort, ids));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speakerId, languageComfort, datasetSplit]);

  useEffect(() => {
    if (!utterance) return;
    setSpokenText(utterance.text);
    setEditingText(false);
  }, [utterance]);

  const nextUtterance = useCallback(
    (forceContinue = false) => {
      setCoveredIds((prev) => {
        const updated = [...prev, utterance.id];
        // Once every utterance in this split has been covered at least
        // once, repeats are genuinely useful (multi-take variety) rather
        // than wasted — start a fresh coverage cycle instead of locking
        // everything out. Checked against splitPool (not the combined
        // pool) so a test/benchmark session's "covered everything"
        // doesn't wait on phrases outside its own fixed pool.
        const stillUncovered = splitPool.some((u) => !updated.includes(u.id));

        if (!stillUncovered && isFixedPool && !forceContinue) {
          // Test/benchmark pool fully covered — stop and show the
          // completion screen instead of silently starting a repeat
          // cycle. Extra takes are still available via that screen's
          // button, which calls nextUtterance(true) to bypass this.
          setTestComplete(true);
          return updated;
        }

        const nextExclusion = stillUncovered ? updated : [];
        setUtterance(pickNext(languageComfort, nextExclusion));
        return stillUncovered ? updated : [];
      });
      recorder.reset();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [utterance, recorder, languageComfort, datasetSplit, splitPool, isFixedPool]
  );

  const handleExtraTake = () => {
    setTestComplete(false);
    nextUtterance(true);
  };

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      const blob = recorder.getBlob();
      await submitRecording({
        audioBlob: blob,
        utteranceId: utterance.id,
        utteranceText: utterance.text,
        utteranceTextArabic: utterance.textArabic || "",
        spokenText,
        speakerName,
        speakerId,
        durationSeconds: recorder.durationSeconds,
        noiseTag,
        datasetSplit,
      });
      setSessionCount((c) => c + 1);
      setToast(t.savedToast);
      setTimeout(() => setToast(null), 1800);
      nextUtterance();
    } catch (err) {
      setToast(t.errorToast);
      setTimeout(() => setToast(null), 2500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => nextUtterance();

  if (!utterance) {
    return (
      <div className="screen center">
        <p className="subtle">{t.loading}</p>
      </div>
    );
  }

  if (testComplete) {
    return (
      <div className="screen center">
        <div className="card login-card">
          <p className="eyebrow">
            {t.recordingAs} {speakerName}
            <span className="split-badge">
              {isBenchmark ? "BENCHMARK SET" : "TEST SET"}
            </span>
          </p>
          <h1>{t.testCompleteTitle}</h1>
          <p className="subtle">{t.testCompleteBody}</p>
          <p className="subtle">
            {sessionCount} {t.savedCount}
          </p>
          <div className="test-complete-actions">
            <button className="ghost" onClick={handleExtraTake}>
              {t.extraTakeButton}
            </button>
            <button className="primary" onClick={onSwitchSpeaker}>
              {lang === "ar" ? "بدل" : "changer"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <header className="topbar">
        <span className="eyebrow">
          {t.recordingAs} {speakerName}
          <button className="link-button inline" onClick={onSwitchSpeaker}>
            ({lang === "ar" ? "بدل" : "changer"})
          </button>
          {isFixedPool && (
            <span className="split-badge">
              {isBenchmark ? "BENCHMARK SET" : "TEST SET"}
            </span>
          )}
        </span>
        <div className="topbar-right">
          <span className="count">
            {sessionCount} {t.savedCount}
          </span>
          <div className="lang-switch small">
            <button
              className={lang === "fr" ? "lang-active" : ""}
              onClick={() => setLang("fr")}
            >
              FR
            </button>
            <button
              className={lang === "ar" ? "lang-active" : ""}
              onClick={() => setLang("ar")}
            >
              AR
            </button>
          </div>
        </div>
      </header>

      <main className="card record-card">
        <p className="category-tag">{utterance.category.replace("_", " ")}</p>

        {/* translate="no" + notranslate class: belt-and-suspenders
            against browser auto-translate corrupting the ground-truth
            prompt mid-word (e.g. Darija "had" -> French "avait") —
            index.html's <meta name="google" content="notranslate">
            is the primary fix, this covers browsers that only honor
            the per-element signal. */}
        <h1 className="prompt notranslate" translate="no">
          {utterance.text}
        </h1>
        {utterance.textArabic && (
          <p className="prompt-arabic notranslate" translate="no">
            {utterance.textArabic}
          </p>
        )}
        <p className="subtle">{t.sayThis}</p>

        {editingText ? (
          <input
            className="spoken-edit"
            value={spokenText}
            onChange={(e) => setSpokenText(e.target.value)}
            onBlur={() => setEditingText(false)}
            autoFocus
          />
        ) : (
          <button
            type="button"
            className="link-button"
            onClick={() => setEditingText(true)}
          >
            {t.correctPrompt} "{spokenText}"
          </button>
        )}

        <div className="recorder-area">
          {recorder.status === "idle" && (
            <button className="record-button" onClick={recorder.start}>
              {t.record}
            </button>
          )}

          {recorder.status === "recording" && (
            <button className="record-button recording" onClick={recorder.stop}>
              {t.stop}
            </button>
          )}

          {recorder.status === "recorded" && (
            <div className="playback-row">
              <audio controls src={recorder.audioUrl} />
              <button className="ghost" onClick={recorder.reset}>
                {t.recordAgain}
              </button>
            </div>
          )}

          {recorder.error && <p className="error">{t.micError}</p>}
        </div>

        <div className="noise-row">
          <span className="subtle">{t.backgroundNow}</span>
          {NOISE_OPTIONS.map((opt) => (
            <label key={opt.value} className="noise-option">
              <input
                type="radio"
                name="noise"
                value={opt.value}
                checked={noiseTag === opt.value}
                onChange={() => setNoiseTag(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>

        <div className="action-row">
          <button className="ghost" onClick={handleSkip}>
            {t.skip}
          </button>
          <button
            className="primary"
            disabled={recorder.status !== "recorded" || submitting}
            onClick={handleAccept}
          >
            {submitting ? t.saving : t.accept}
          </button>
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
