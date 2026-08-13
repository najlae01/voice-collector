import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref as dbRef,
  get,
  set,
  serverTimestamp,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZ7Uy3n7no6aEWt-mYPgPxkf9UF32wYdk",
  authDomain: "tarl-voice-collector.firebaseapp.com",
  databaseURL:
    "https://tarl-voice-collector-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tarl-voice-collector",
  storageBucket: "tarl-voice-collector.firebasestorage.app",
  messagingSenderId: "821390635940",
  appId: "1:821390635940:web:9f1b79dd0119726a558731",
  measurementId: "G-5GG63YQRHR",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// --- Stable speaker identity -------------------------------------------
// Anonymous Firebase auth gives a NEW uid every time someone signs in from
// a different device or clears their cache — so we can't use auth.uid as
// the speaker identity, only as a security-rules mechanism.
//
// Instead, the speaker identity is derived from (name + 4-digit PIN),
// normalized into a stable slug. Same name+PIN -> same speakerId, forever,
// on any device. The PIN is just a simple way to tell apart two people who
// happen to share a first name (e.g. two "Karim"s) — it is NOT a security
// password, just a disambiguator the speaker picks and remembers.

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents (é -> e, etc.)
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "_") // keep latin + arabic chars
    .replace(/^_+|_+$/g, "");
}

export function deriveSpeakerId(name, pin) {
  return `${slugify(name)}_${pin}`;
}

// --- Recruitment channel tracking -----------------------------------
// Read silently from a URL query param, e.g. sharing different links:
//   https://yourapp.com/?channel=family
//   https://yourapp.com/?channel=upwork
// This is NOT shown to the speaker or asked as a form question — it's
// set by YOU, by which link you hand out to which group, so the data
// stays separable later (volunteer vs paid contributor) without making
// the contributor self-report something awkward. Defaults to
// "unspecified" if no link param is present (e.g. direct/local testing).
export function getChannelFromUrl() {
  if (typeof window === "undefined") return "unspecified";
  const params = new URLSearchParams(window.location.search);
  return params.get("channel") || "unspecified";
}

// --- Dataset split (train vs. test vs. benchmark) ----------------------
// Same idea as getChannelFromUrl, and meant to be combined with it, e.g.:
//   https://yourapp.com/?set=test&channel=speakerA
//   https://yourapp.com/?set=benchmark&channel=speakerB
// Read once per session from `?set=`, defaulting to "train" so every
// existing/shared link keeps behaving exactly as before.
//   - "test" routes to the split:"test" pool (utterances.js forSplit),
//     weighted by language comfort like training.
//   - "benchmark" routes to the fixed 20-utterance BENCHMARK_IDS list
//     (utterances.js forBenchmark/pickBenchmarkUtterance) — every
//     benchmark speaker gets the EXACT SAME utterances, unweighted, for
//     the paper's paired cross-speaker statistics. See the "Phase 2b:
//     fixed benchmark subset" section of the README.
// Whichever value this resolves to also gets stamped onto every
// recording (datasetSplit) so export can separate the sets without
// guesswork.
export function getSplitFromUrl() {
  if (typeof window === "undefined") return "train";
  const params = new URLSearchParams(window.location.search);
  const val = params.get("set");
  return val === "test" || val === "benchmark" ? val : "train";
}

export async function speakerProfileExists(name, pin) {
  const speakerId = deriveSpeakerId(name, pin);
  const snap = await get(dbRef(db, `speakers/${speakerId}`));
  return snap.exists();
}

export async function loginAsSpeaker(name, pin, profileFields = {}) {
  const speakerId = deriveSpeakerId(name, pin);
  const cred = await signInAnonymously(auth);

  const profileRef = dbRef(db, `speakers/${speakerId}`);
  const existing = await get(profileRef);

  let storedProfile;
  if (!existing.exists()) {
    // First time we've seen this speakerId — write the profile once.
    storedProfile = {
      name: name.trim(),
      ageRange: profileFields.ageRange || null,
      languageComfort: profileFields.languageComfort || null,
      gender: profileFields.gender || null,
      region: profileFields.region || null,
      recruitmentChannel: profileFields.recruitmentChannel || "unspecified",
      createdAt: serverTimestamp(),
    };
    await set(profileRef, storedProfile);
  } else {
    // Returning speaker — leave their stored profile untouched, but read
    // it back so the caller knows their languageComfort for phrase routing.
    storedProfile = existing.val();
  }

  return {
    uid: cred.user.uid,
    speakerId,
    speakerName: name.trim(),
    languageComfort: storedProfile.languageComfort || null,
  };
}

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// Returns the set of utteranceIds this speaker has already recorded at
// least once. Used to avoid re-prompting the same phrase to the same
// person until the whole pool has been covered.
export async function getRecordedUtteranceIds(speakerId) {
  const snap = await get(dbRef(db, `recordings/${speakerId}`));
  if (!snap.exists()) return [];
  return Object.keys(snap.val());
}

// --- Recordings ----------------------------------------------------------
// File + RTDB key naming: {speakerId}__{utteranceId}__{seq}
// e.g. "karim_4821__num_5__01.wav"
// This makes every file self-describing — you can tell who said what,
// and how many times, just by reading the filename, with no DB join
// needed when building the export manifest.

async function nextSequenceNumber(speakerId, utteranceId) {
  const snap = await get(dbRef(db, `recordings/${speakerId}/${utteranceId}`));
  if (!snap.exists()) return 1;
  const existingKeys = Object.keys(snap.val());
  return existingKeys.length + 1;
}

export async function submitRecording({
  audioBlob,
  utteranceId,
  utteranceText,
  utteranceTextArabic,
  spokenText,
  speakerName,
  speakerId,
  durationSeconds,
  noiseTag,
  datasetSplit,
}) {
  const seq = await nextSequenceNumber(speakerId, utteranceId);
  const seqStr = String(seq).padStart(2, "0");
  const baseName = `${speakerId}__${utteranceId}__${seqStr}`;
  const filePath = `recordings/${speakerId}/${baseName}.webm`;
  const fileRef = storageRef(storage, filePath);

  await uploadBytes(fileRef, audioBlob, { contentType: "audio/webm" });
  const audioUrl = await getDownloadURL(fileRef);

  await set(dbRef(db, `recordings/${speakerId}/${utteranceId}/${seqStr}`), {
    fileName: baseName,
    utteranceId,
    utteranceText,
    utteranceTextArabic: utteranceTextArabic || "",
    spokenText,
    speakerName,
    speakerId,
    audioUrl,
    audioPath: filePath,
    durationSeconds,
    noiseTag: noiseTag || "quiet",
    datasetSplit: datasetSplit || "train",
    createdAt: serverTimestamp(),
  });

  return baseName;
}
