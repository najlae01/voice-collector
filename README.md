# DM-TaRL Voice Collector

A tiny tool for gathering the fine-tuning dataset: family/friends record
themselves saying short Darija/French math-tutoring phrases. Each recording
saves audio + the exact transcript to Firebase, ready to export as a dataset.

## How it works

1. Contributor opens the link, picks French or Arabic from the language
   switcher, types their name **and a 4-digit PIN they choose themselves**.
2. **First time only**, they're shown a short optional profile form: age
   range, which language they're more comfortable speaking (Darija /
   French / both equally), which region of Morocco they're from (North /
   Center-West / East / South), and gender. All are skippable — this is
   metadata for describing the dataset later, not something to gate
   participation on.
3. That name+PIN combination is how the app recognizes "this is the same
   person" — on any device, even after clearing cache (see "Speaker
   identity" below for why this matters). Returning speakers skip straight
   past the profile form to recording.
4. The app shows a random phrase from the seed pool (`src/utterances.js`).
5. They tap **Record**, say the phrase naturally, tap **Stop**.
6. They can play it back, re-record if unhappy, or accept and save it,
   moving to the next random phrase.
7. If they actually said something slightly different from the suggested
   text, they correct the transcript inline before saving — this is what
   makes the saved transcript the *ground truth*, not just the prompt.
8. The phrase pool is shared and random, so popular/important words
   naturally get covered by multiple speakers over time.

## Speaker identity — why name + PIN, not just a typed name

Firebase's anonymous auth gives a **new random user ID every time someone
signs in from a different device, or the same device after clearing
cache/cookies**. If we'd used that as the speaker identity, the same person
recording from their phone one day and a laptop the next would silently
show up as two different "speakers" in the data — which quietly corrupts
the most important metadata field (how many distinct people actually
contributed).

The fix: speaker identity is derived from **name + a 4-digit PIN the
person picks themselves** (e.g. "Karim" + "4821" → speaker id
`karim_4821`). Same name+PIN always maps to the same speaker, on any
device, forever. The PIN isn't a security password — it's just there so
two contributors who happen to share a first name don't collide. Tell
contributors to remember their PIN if they plan to come back and record
more later.

## File and database naming

Every recording's filename and database key follow:

```
{speakerId}__{utteranceId}__{sequenceNumber}
```

e.g. `karim_4821__num_5__01.webm` — Karim's first recording of the "5"
utterance. If he records that same phrase again later, it becomes `__02`.

This is deliberate: when you export the dataset later, you can read who
said what and how many times directly from the filename, with no need to
join against the database first.

## Phrase repetition logic

Each speaker won't be re-prompted with a phrase they've already recorded
until they've covered **every** phrase in the pool at least once — this is
checked against their actual recording history in Firebase (loaded once
when they start a session), not just what happened earlier in the current
browser tab. Once the whole pool is covered, repeats start being offered
again — at that point a second take of the same phrase is genuinely useful
variety (different read, slightly different delivery) rather than wasted
near-term repetition.

## 1. Set up Firebase

Either reuse your existing DM-TaRL Firebase project, or create a new free
one just for this (recommended — keeps test data separate from production
learner data):

1. https://console.firebase.google.com → Add project
2. Enable **Authentication → Anonymous** sign-in method
3. Enable **Realtime Database** (start in locked mode)
4. Enable **Storage**
5. Project settings → General → add a Web App → copy the config object
6. Paste that config into `src/firebase.js`, replacing the placeholder
   `firebaseConfig` object

Deploy the included security rules (or paste them manually in console):

```bash
npm install -g firebase-tools
firebase login
firebase init   # select Realtime Database + Storage, point to existing project
firebase deploy --only database,storage
```

## 2. Run locally

```bash
npm install
npm run dev
```

Open the local URL on your phone (same wifi network) or on desktop to test
the recording flow before sharing with contributors.

## 3. Deploy so contributors can use it remotely

```bash
npm run build
vercel deploy   # or vercel --prod
```

Share the deployed link with your mother, siblings, friends — anyone
contributing. They just open it, type their name, and start recording.
Works on phone browsers (Chrome/Safari) since it uses the standard
`getUserMedia` + `MediaRecorder` browser APIs — no app install needed.

## 4. Editing the phrase pool

Edit `src/utterances.js` directly. The pool currently has **84 training
phrases plus 24 test-set phrases** (see "Phase 2: building a proper test
set" below), split across:

- **Domain**: `math` (numbers, operations, spoken answers — tied directly
  to the DM-TaRL use case) vs `general` (confirmations, navigation,
  requests, expressions of understanding/confusion — reusable by any
  learning-assistant project, not math-specific)
- **Language lane** (`langProfile`): `darija`, `french`, or `mixed`
  (code-switched) — used to route which phrases a speaker sees based on
  what they said they're comfortable speaking (see below)
- **Split** (`split`): `"train"` (default, unset on the original 84) or
  `"test"` — which dataset the phrase belongs to
- **Length** (`length`): `"short"` (default, unset on the original 84)
  or `"long"` — isolated phrase vs. multi-clause conversational

Each entry needs a unique `id`, `category`, `domain`, `langProfile`, and
`text` (the suggested phrasing — contributors can correct it inline if
they naturally say it differently). Content is deliberately restricted to
math/numbers and short learning-session phrases — nothing about
relationships or personal topics, by design.

### Language-comfort routing

A speaker who said they're more comfortable in Darija sees mostly Darija
phrases (about 70%), with a smaller share of French (10%) and mixed (20%)
— and the reverse for a French-comfortable speaker. Someone who said
"both equally" sees a roughly even split across all three lanes. This
means every speaker still contributes *some* cross-lane coverage, just
weighted toward what's natural for them, so recordings sound genuine
rather than effortful. The weighting lives in `LANG_WEIGHTS` in
`src/utterances.js` if you want to adjust the ratios.

## Dual-script display (Latin + Arabic)

Each utterance can include a `textArabic` field — the same phrase
hand-written in Arabic script, shown directly under the Latin prompt.
This serves three purposes: lets contributors read whichever script
they're more comfortable with, gives you genuine Arabic-script ground
truth for free (useful when comparing against any STT model that
outputs Arabic script, like Vosk), and avoids the accuracy ceiling of
automated Latin→Arabic reverse-transliteration (testing showed this has
real structural limits — short vowels and root-letter ordering don't
reverse cleanly).

**All 85 utterances now have this field filled in** for Darija/mixed
entries (French-only entries correctly have an empty string — there's
no meaningful Arabic-script rendering for a French word). If you add
new utterances later, fill in `textArabic` by hand (or leave it `""`
for French-only entries) — don't auto-generate it from the Latin text,
for the reason above.

The recorded data now also stores `utteranceTextArabic` alongside each
take, so this ground truth travels with the export for future benchmark
comparisons.

## Region field — where the categories come from

The 4-region split (North / Center-West / East / South) isn't arbitrary —
it loosely follows how Moroccan Darija dialect variation is commonly
described in linguistic literature: North (Tangier/Tetouan, pre-Hilalian,
Spanish/Mediterranean influence), Center-West (Casablanca/Rabat, the
"standard" variety most Moroccans understand), East (Oujda, closer to
western Algerian dialect), and South (Marrakech/Agadir/Sahara, Hilali/
Bedouin-influenced, more Amazigh substrate). City-level granularity would
be more accurate but isn't practical to design around without dedicated
linguistic fieldwork — 4 regions is a reasonable resolution for this pilot.

This is collected as **metadata only**, not used to route which phrases a
speaker sees (only `languageComfort` does that). Real regional vocabulary
differences are expected to surface naturally through the inline
transcript-correction feature, not through a separately-designed phrase
list per region.

## Recruitment channel tracking

If you're recruiting from multiple sources — family/friends as
volunteers, plus possibly paid contributors via a freelance platform
later — share **different links** with a `channel` URL parameter so the
data stays separable without asking contributors an awkward question
about how they were recruited or whether they're being paid:

```
https://your-deployed-app.vercel.app/?channel=family
https://your-deployed-app.vercel.app/?channel=upwork
```

This is captured silently at login and stored on the speaker's profile —
nothing shown in the UI, nothing the contributor has to answer. If no
`channel` param is present (e.g. testing locally), it's recorded as
`"unspecified"`.

## Phase 2: building a proper test set

The original 84-phrase pool was designed for **fine-tuning** data: short,
isolated phrases, open to any volunteer, no constraint on who records
what. That's the wrong shape for a **held-out benchmark set**, for three
separate reasons:

1. **Pure-Darija-only isn't representative.** Real Moroccan speech
   code-switches with French (and often MSA) constantly, including
   inside a single sentence. A test set that's all pure Darija
   overstates accuracy relative to how the model will actually be used.
2. **Short phrases only test isolated-word recognition.** They say
   nothing about how a model handles continuous, multi-clause speech —
   self-corrections, hesitations, a longer reasoned answer — which is
   the harder and more realistic case.
3. **Single-speaker data can't support a fine-tuning claim** (see "On
   single-speaker data" below), and a benchmark run on too few voices is
   similarly weak: it mostly measures how well the model handles those
   particular vocal tracts, not Darija generally. Male/female pitch
   range alone is a meaningful axis of acoustic variation for ASR.

**What was added for this:** every utterance now carries a `split`
(`"train"` | `"test"`) and a `length` (`"short"` | `"long"`) field —
see the header comment in `src/utterances.js`. Utterances with no
`split` default to `"train"`, so nothing in the original pool needed
touching. 24 test-only phrases were added: a mix of pure-Darija and
code-switched (`mixed`), 8 short and 16 long/conversational (a learner
reasoning aloud, self-correcting, asking a multi-part question — see the
`test_long_*` entries). The long ones lean pure-Darija on purpose (11
Darija vs. 5 mixed) — longer utterances are exactly where you want to
check the model isn't just relying on French/MSA words to anchor
recognition.

**How the split is selected:** open the app with `?set=test` (combine
with `channel` as usual, e.g. `?set=test&channel=speakerA`). That
session only ever sees `split: "test"` phrases, and every recording it
produces is stamped `datasetSplit: "test"` in Firebase — so at export
time you filter on that field instead of guessing from who recorded it.
A **TEST SET** badge appears next to the speaker name in that mode so
you can visually confirm you're testing the right link before sending it
out. Any link without `?set=test` behaves exactly as before (routes to
`split: "train"`, unaffected by any of this).

**Recruiting the test-set panel:** unlike the training pool, don't open
this to every volunteer — recruit **3-4 dedicated speakers**, with at
least one male and one female voice (ideally 2+2), so the test set
covers a real pitch/vocal-tract range rather than one register. Give
each their own `channel` value so results stay attributable per speaker,
e.g.:

```
https://your-deployed-app.vercel.app/?set=test&channel=test_karim
https://your-deployed-app.vercel.app/?set=test&channel=test_salma
https://your-deployed-app.vercel.app/?set=test&channel=test_youssef
https://your-deployed-app.vercel.app/?set=test&channel=test_imane
```

Each speaker should record the **entire** `test` pool at least once
before you rely on it for benchmark numbers (the pool is small enough —
24 phrases — that this is quick per speaker).

**Before sharing these links:** the seed phrasing for the 24 new
utterances (especially the 16 long/conversational ones) was written for
this task, not pulled from an already-vetted source the way the original
84 were — give it a native-speaker read-through and adjust wording in
`src/utterances.js` if anything sounds unnatural. This matters less than
it would elsewhere in the app, since contributors correct the transcript
inline to match what they actually said either way — but a better seed
still means a better first take.

## Phase 2b: fixed benchmark subset for paired cross-speaker stats

The `test` split above (24 utterances, randomly sampled per speaker) is
good for general benchmark coverage, but it doesn't support the paper's
cross-speaker comparisons (Wilcoxon signed-rank etc.) as cleanly as it
could: if speaker A and speaker B each get a different random draw from
those 24, any difference in error rate is confounded with content
difficulty — you can't tell whether it's the speaker or the utterance
that was harder. A **paired** design needs every speaker reading the
*exact same* utterances.

**What was added:** `BENCHMARK_IDS` in `src/utterances.js` — a fixed list
of 20 utterance ids, stratified across the difficulty range rather than
skewed toward short/easy: 9 darija-short, 5 mixed-short, 4 darija-long,
2 mixed-long. Picked from both the train and test pools (not the same
thing as `split: "test"`), and deliberately only from entries with a
filled-in `textArabic`, so the benchmark set has complete ground truth.
`forBenchmark()` / `pickBenchmarkUtterance()` serve this list unweighted
by language comfort — everyone reads all 20 regardless of what they said
they're comfortable in, since the whole point is the same fixed set for
everyone.

**How to use it:** open with `?set=benchmark` (e.g.
`?set=benchmark&channel=speaker2`). Behaves like test mode — a
**BENCHMARK SET** badge, and a completion screen once all 20 are
covered — but draws only from the fixed 20, in random per-speaker order
(pairing is by utterance id, not by sequence, so order doesn't need to
match across speakers). Recordings are stamped `datasetSplit:
"benchmark"`.

**Do not reword these utterances when reading them out.** Reading the
exact same text is what makes the comparison paired — even small wording
differences between speakers reintroduce the content-difficulty confound
this list exists to eliminate. The usual "correct the transcript if you
said something different" behavior still applies (that's about ground
truth, not about changing what's *asked*), but try to read these as
written rather than paraphrasing.

**Your existing recordings already cover this** — checked against the
Firebase export, speaker `F1_1234` has already recorded all 20
`BENCHMARK_IDS` (tagged `datasetSplit: "test"` from before this mode
existed, not `"benchmark"` — that's fine, don't re-record them). For
export/analysis, pair speakers by `utteranceId ∈ BENCHMARK_IDS`
directly, not by `datasetSplit`, since that field only reflects which
mode a *particular* recording session was opened in, not a durable
property of the utterance. New speakers (2 onward) should use the
`?set=benchmark` link so their sessions are scoped to just these 20 and
they get the completion screen once done.

## 5. Exporting the dataset for fine-tuning

Recordings are stored nested as `recordings/{speakerId}/{utteranceId}/{seq}`,
each holding the transcript, audio URL, and metadata. Once you've collected
enough, export from the Firebase console (Realtime Database → Export JSON)
or write a small script using the Firebase Admin SDK to:

1. Walk `recordings/` (speaker → utterance → sequence) and flatten into one
   list of records
2. Download each `audioUrl` (or pull directly from Storage by `audioPath`)
3. Convert `.webm` → `.wav` (16kHz mono) using `ffmpeg`:
   ```bash
   ffmpeg -i input.webm -ar 16000 -ac 1 output.wav
   ```
4. Write a manifest CSV/JSON:
   `fileName,spokenText,speakerId,noiseTag,datasetSplit`
   — since `fileName` already encodes speaker/utterance/sequence, this
   manifest plus the `.wav` files is your training corpus, in the
   standard format most ASR fine-tuning frameworks (HuggingFace
   `datasets`, ESPnet, etc.) expect. **Filter on `datasetSplit` first**
   and export the two splits separately — records saved before Phase 2
   won't have this field; treat those as `"train"` (that's what the app
   itself defaults to for `?set=test`-less sessions).

I'm happy to write that export script when you're ready to pull the data —
just ask.

## Notes on what this dataset is (and isn't) for

This collects **adult speaker** recordings only, by design — it
deliberately sidesteps the consent/ethics overhead of recording children's
speech. Treat this as pilot/feasibility data: enough to check whether
fine-tuning moves accuracy at all on your specific Darija/French
math-vocabulary domain. Extending to real child speakers is a separate,
later effort requiring proper ethics approval.

**On single-speaker data**: recordings from only one speaker are genuinely
useful for *benchmarking* existing STT models (choosing which base model
to build on) — that doesn't need speaker diversity. They are **not**
sufficient for fine-tuning conclusions, since a model fine-tuned on one
voice mostly just learns that voice. Treat single-speaker fine-tuning runs
as a pipeline smoke-test, not a reportable result — wait for at least 2-3
speakers before drawing any conclusions from fine-tuning.

**On the profile fields**: if you collected any recordings before this
profile-form step was added, those speaker records simply won't have
`ageRange` / `languageComfort` / `gender` set (they'll be `null`) — that's
expected, not a bug, and doesn't need backfilling unless you want to ask
that speaker directly later.
