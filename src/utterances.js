// Utterance pool for DM-TaRL voice data collection.
//
// Each entry: a short phrase a learner might SAY as a spoken answer,
// question, or confirmation while using a mobile learning/remediation
// game (avatar asks, learner responds).
//
// Fields:
//  - id: unique identifier
//  - category: numbers | operation | answer | confirm | instruction | feeling
//  - domain: "math" (tied directly to the math-tutoring use case) or
//            "general" (generic learning-assistant phrases, reusable
//            beyond this specific project)
//  - langProfile: "darija" | "french" | "mixed" — which language lane
//            this phrase belongs to, used to route speakers toward
//            phrases that match how they say they're more comfortable
//            speaking (see pickUtteranceForSpeaker below)
//  - text: a SUGGESTED phrasing, not a script to read robotically —
//            contributors should say it the way they'd naturally say it,
//            and correct the transcript inline if they say it differently
//  - textArabic: the SAME phrase written in Arabic script, shown
//            alongside `text` so contributors can read whichever script
//            they're more comfortable with. Hand-written, NOT generated
//            by automated Latin->Arabic reversal — testing showed that
//            reversal has a real structural ceiling (Arabic spelling
//            doesn't map 1:1 positionally from Latin transliteration,
//            especially around short vowels and root-letter ordering),
//            so getting this right requires a native speaker writing it
//            directly rather than algorithmically reconstructing it.
//            Left as "" for entries not yet filled in — UI should hide
//            the Arabic line gracefully when empty, not show a blank box.
//  - split: "train" | "test" — which dataset this phrase belongs to.
//            Omitted on older/original entries, which defaults to
//            "train" everywhere this is read (see randomUtterance /
//            pickUtteranceForSpeaker below) — so nothing needed to be
//            back-filled when this field was introduced in Phase 2.
//            "test" phrases are routed only to sessions started with a
//            `?set=test` link (see getSplitFromUrl in firebase.js) and
//            are meant to be recorded by a small, deliberately
//            diverse panel of held-out speakers for benchmarking, not
//            by every contributor — see the Phase 2 section of the
//            README for why the test set needs different properties
//            than the training pool (code-switching, longer/more
//            conversational utterances, multi-speaker gender balance).
//  - length: "short" | "long" — omitted on older entries, defaults to
//            "short". "long" marks multi-clause, conversational-register
//            utterances (a learner reasoning aloud, self-correcting,
//            asking a multi-part question) as opposed to the isolated
//            word/short-phrase style of the original pool. Real spoken
//            interaction isn't only short commands, so the test set
//            needs some utterances long enough to exercise continuous
//            recognition, not just isolated-phrase recognition.

export const UTTERANCES = [
  // ============================================================
  // MATH DOMAIN
  // ============================================================

  // --- Numbers — Darija ---
  {
    id: "num_d_0",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "zero",
    textArabic: "زيرو",
  },
  {
    id: "num_d_1",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "wa7ed",
    textArabic: "واحد",
  },
  {
    id: "num_d_2",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "jouj",
    textArabic: "جوج",
  },
  {
    id: "num_d_3",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "tlata",
    textArabic: "تلاتة",
  },
  {
    id: "num_d_4",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "reb3a",
    textArabic: "ربعة",
  },
  {
    id: "num_d_5",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "khamsa",
    textArabic: "خمسة",
  },
  {
    id: "num_d_6",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "stta",
    textArabic: "ستة",
  },
  {
    id: "num_d_7",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "sb3a",
    textArabic: "سبعة",
  },
  {
    id: "num_d_8",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "tmnya",
    textArabic: "تمنية",
  },
  {
    id: "num_d_9",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "ts3oud",
    textArabic: "تسعود",
  },
  {
    id: "num_d_10",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "3achra",
    textArabic: "عشرة",
  },
  {
    id: "num_d_11",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "7dach",
    textArabic: "حداش",
  },
  {
    id: "num_d_12",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "tnach",
    textArabic: "طناش",
  },
  {
    id: "num_d_15",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "khmstach",
    textArabic: "خمسطاش",
  },
  {
    id: "num_d_20",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    text: "3echrin",
    textArabic: "عشرين",
  },

  // --- Numbers — French (no Arabic-script rendering needed) ---
  {
    id: "num_f_0",
    category: "numbers",
    domain: "math",
    langProfile: "french",
    text: "zéro",
    textArabic: "",
  },
  {
    id: "num_f_3",
    category: "numbers",
    domain: "math",
    langProfile: "french",
    text: "trois",
    textArabic: "",
  },
  {
    id: "num_f_5",
    category: "numbers",
    domain: "math",
    langProfile: "french",
    text: "cinq",
    textArabic: "",
  },
  {
    id: "num_f_7",
    category: "numbers",
    domain: "math",
    langProfile: "french",
    text: "sept",
    textArabic: "",
  },
  {
    id: "num_f_10",
    category: "numbers",
    domain: "math",
    langProfile: "french",
    text: "dix",
    textArabic: "",
  },
  {
    id: "num_f_12",
    category: "numbers",
    domain: "math",
    langProfile: "french",
    text: "douze",
    textArabic: "",
  },
  {
    id: "num_f_15",
    category: "numbers",
    domain: "math",
    langProfile: "french",
    text: "quinze",
    textArabic: "",
  },
  {
    id: "num_f_20",
    category: "numbers",
    domain: "math",
    langProfile: "french",
    text: "vingt",
    textArabic: "",
  },

  // --- Operations — Darija ---
  {
    id: "op_d_add",
    category: "operation",
    domain: "math",
    langProfile: "darija",
    text: "zid",
    textArabic: "زيد",
  },
  {
    id: "op_d_sub",
    category: "operation",
    domain: "math",
    langProfile: "darija",
    text: "n9es",
    textArabic: "نقص",
  },
  {
    id: "op_d_div",
    category: "operation",
    domain: "math",
    langProfile: "darija",
    text: "qsem 3la",
    textArabic: "قسم على",
  },
  {
    id: "op_d_1",
    category: "operation",
    domain: "math",
    langProfile: "darija",
    text: "khamsa za2id tlata",
    textArabic: "خمسة زائد تلاتة",
  },
  {
    id: "op_d_2",
    category: "operation",
    domain: "math",
    langProfile: "darija",
    text: "3achra na9is jouj",
    textArabic: "عشرة ناقص جوج",
  },

  // --- Operations — French (no Arabic-script rendering needed) ---
  {
    id: "op_f_add",
    category: "operation",
    domain: "math",
    langProfile: "french",
    text: "plus",
    textArabic: "",
  },
  {
    id: "op_f_sub",
    category: "operation",
    domain: "math",
    langProfile: "french",
    text: "moins",
    textArabic: "",
  },
  {
    id: "op_f_mul",
    category: "operation",
    domain: "math",
    langProfile: "french",
    text: "fois",
    textArabic: "",
  },
  {
    id: "op_f_div",
    category: "operation",
    domain: "math",
    langProfile: "french",
    text: "divisé par",
    textArabic: "",
  },
  {
    id: "op_f_1",
    category: "operation",
    domain: "math",
    langProfile: "french",
    text: "cinq plus trois",
    textArabic: "",
  },
  {
    id: "op_f_2",
    category: "operation",
    domain: "math",
    langProfile: "french",
    text: "dix moins deux",
    textArabic: "",
  },

  // --- Operations — Mixed (code-switched) ---
  {
    id: "op_m_1",
    category: "operation",
    domain: "math",
    langProfile: "mixed",
    text: "khamsa plus tlata",
    textArabic: "خمسة بلوس تلاتة",
  },
  {
    id: "op_m_2",
    category: "operation",
    domain: "math",
    langProfile: "mixed",
    text: "3achra moins jouj",
    textArabic: "عشرة موان جوج",
  },
  {
    id: "op_m_3",
    category: "operation",
    domain: "math",
    langProfile: "mixed",
    text: "trois fois jouj",
    textArabic: "تخوا فوا جوج",
  },
  {
    id: "op_m_4",
    category: "operation",
    domain: "math",
    langProfile: "mixed",
    text: "khamsa divisé 3la jouj",
    textArabic: "خمسة ديفيزي على جوج",
  },

  // --- Spoken answers — Darija ---
  {
    id: "ans_d_1",
    category: "answer",
    domain: "math",
    langProfile: "darija",
    text: "khamsa, ana mota2ked",
    textArabic: "خمسة، أنا متأكد",
  },
  {
    id: "ans_d_2",
    category: "answer",
    domain: "math",
    langProfile: "darija",
    text: "ghaliban 3achra",
    textArabic: "غالبا عشرة",
  },
  {
    id: "ans_d_3",
    category: "answer",
    domain: "math",
    langProfile: "darija",
    text: "kayna khamsa o jouj",
    textArabic: "كاينة خمسة وجوج",
  },
  {
    id: "ans_d_4",
    category: "answer",
    domain: "math",
    langProfile: "darija",
    text: "hadi hiya tmnya",
    textArabic: "هادي هي تمنية",
  },

  // --- Spoken answers — French ---
  {
    id: "ans_f_1",
    category: "answer",
    domain: "math",
    langProfile: "french",
    text: "je pense que c'est sept",
    textArabic: "",
  },
  {
    id: "ans_f_2",
    category: "answer",
    domain: "math",
    langProfile: "french",
    text: "c'est trois",
    textArabic: "",
  },
  {
    id: "ans_f_3",
    category: "answer",
    domain: "math",
    langProfile: "french",
    text: "non, c'est deux",
    textArabic: "",
  },
  {
    id: "ans_f_4",
    category: "answer",
    domain: "math",
    langProfile: "french",
    text: "la réponse est dix",
    textArabic: "",
  },

  // --- Spoken answers — Mixed ---
  {
    id: "ans_m_1",
    category: "answer",
    domain: "math",
    langProfile: "mixed",
    text: "la réponse hiya tmnya",
    textArabic: "la réponse هي تمنية",
  },
  {
    id: "ans_m_2",
    category: "answer",
    domain: "math",
    langProfile: "mixed",
    text: "je pense que c'est sb3a",
    textArabic: "je pense que c'est سبعة",
  },
  {
    id: "ans_m_3",
    category: "answer",
    domain: "math",
    langProfile: "mixed",
    text: "non, c'est jouj",
    textArabic: "non, c'est جوج",
  },

  // ============================================================
  // GENERAL LEARNING-ASSISTANT DOMAIN
  // (confirmations, navigation, requests, feelings — usable by any
  //  learning-assistant project, not specific to math)
  // ============================================================

  // --- Confirm / navigate — Darija ---
  {
    id: "conf_d_yes",
    category: "confirm",
    domain: "general",
    langProfile: "darija",
    text: "safi",
    textArabic: "صافي",
  },
  {
    id: "conf_d_yes2",
    category: "confirm",
    domain: "general",
    langProfile: "darija",
    text: "wakha",
    textArabic: "واخا",
  },
  {
    id: "conf_d_no",
    category: "confirm",
    domain: "general",
    langProfile: "darija",
    text: "la, machi hadchi",
    textArabic: "لا، ماشي هادشي",
  },
  {
    id: "conf_d_again",
    category: "confirm",
    domain: "general",
    langProfile: "darija",
    text: " 3awd tani",
    textArabic: "عاود تاني",
  },
  {
    id: "conf_d_ready",
    category: "confirm",
    domain: "general",
    langProfile: "darija",
    text: "ana wajed",
    textArabic: "أنا واجد",
  },

  {
    id: "conf_d_help",
    category: "confirm",
    domain: "general",
    langProfile: "darija",
    text: "bghit n3awn",
    textArabic: "بغيت نعاون",
  },
  {
    id: "conf_d_wait",
    category: "confirm",
    domain: "general",
    langProfile: "darija",
    text: "tsna chwiya",
    textArabic: "تسنا شوية",
  },
  {
    id: "conf_d_start",
    category: "confirm",
    domain: "general",
    langProfile: "darija",
    text: "bda",
    textArabic: "بدا",
  },

  // --- Confirm / navigate — French ---
  {
    id: "conf_f_yes",
    category: "confirm",
    domain: "general",
    langProfile: "french",
    text: "oui c'est ça",
    textArabic: "",
  },
  {
    id: "conf_f_no",
    category: "confirm",
    domain: "general",
    langProfile: "french",
    text: "non, pas ça",
    textArabic: "",
  },
  {
    id: "conf_f_again",
    category: "confirm",
    domain: "general",
    langProfile: "french",
    text: "encore une fois",
    textArabic: "",
  },
  {
    id: "conf_f_ready",
    category: "confirm",
    domain: "general",
    langProfile: "french",
    text: "je suis prêt",
    textArabic: "",
  },
  {
    id: "conf_f_done",
    category: "confirm",
    domain: "general",
    langProfile: "french",
    text: "j'ai fini",
    textArabic: "",
  },
  {
    id: "conf_f_help",
    category: "confirm",
    domain: "general",
    langProfile: "french",
    text: "j'ai besoin d'aide",
    textArabic: "",
  },
  {
    id: "conf_f_wait",
    category: "confirm",
    domain: "general",
    langProfile: "french",
    text: "attends un peu",
    textArabic: "",
  },
  {
    id: "conf_f_start",
    category: "confirm",
    domain: "general",
    langProfile: "french",
    text: "on commence",
    textArabic: "",
  },
  {
    id: "conf_f_repeat",
    category: "confirm",
    domain: "general",
    langProfile: "french",
    text: "tu peux répéter ?",
    textArabic: "",
  },

  // --- Instructions / simple requests — Darija ---
  {
    id: "instr_d_1",
    category: "instruction",
    domain: "general",
    langProfile: "darija",
    text: "wrini chi haja khra",
    textArabic: "وريني شي حاجة خرى",
  },
  {
    id: "instr_d_2",
    category: "instruction",
    domain: "general",
    langProfile: "darija",
    text: "bghit nrj3 lor",
    textArabic: "بغيت نرجع لور",
  },
  {
    id: "instr_d_3",
    category: "instruction",
    domain: "general",
    langProfile: "darija",
    text: "9oliha b chwiya b chwiya",
    textArabic: "قوليها بشوية بشوية",
  },

  // --- Instructions / simple requests — French ---
  {
    id: "instr_f_1",
    category: "instruction",
    domain: "general",
    langProfile: "french",
    text: "montre-moi autre chose",
    textArabic: "",
  },
  {
    id: "instr_f_2",
    category: "instruction",
    domain: "general",
    langProfile: "french",
    text: "je veux revenir en arrière",
    textArabic: "",
  },
  {
    id: "instr_f_3",
    category: "instruction",
    domain: "general",
    langProfile: "french",
    text: "dis-le plus lentement",
    textArabic: "",
  },

  // --- Instructions — Mixed ---
  {
    id: "instr_m_1",
    category: "instruction",
    domain: "general",
    langProfile: "mixed",
    text: "wrini exercice akhor",
    textArabic: "وريني exercice آخر",
  },
  {
    id: "instr_m_2",
    category: "instruction",
    domain: "general",
    langProfile: "mixed",
    text: "bghit nbda niveau jdid",
    textArabic: "بغيت نبدا نيفو جديد",
  },

  // --- Feelings / understanding-confusion — Darija ---
  {
    id: "feel_d_1",
    category: "feeling",
    domain: "general",
    langProfile: "darija",
    text: "fhmt",
    textArabic: "فهمت",
  },
  {
    id: "feel_d_2",
    category: "feeling",
    domain: "general",
    langProfile: "darija",
    text: "ma fhmtch",
    textArabic: "ما فهمتش",
  },
  {
    id: "feel_d_3",
    category: "feeling",
    domain: "general",
    langProfile: "darija",
    text: "hada sahel",
    textArabic: "هادا ساهل",
  },
  {
    id: "feel_d_4",
    category: "feeling",
    domain: "general",
    langProfile: "darija",
    text: "hada chwiya s3ib",
    textArabic: "هادا شوية صعيب",
  },

  // --- Feelings / understanding-confusion — French ---
  {
    id: "feel_f_1",
    category: "feeling",
    domain: "general",
    langProfile: "french",
    text: "j'ai compris",
    textArabic: "",
  },
  {
    id: "feel_f_2",
    category: "feeling",
    domain: "general",
    langProfile: "french",
    text: "je n'ai pas compris",
    textArabic: "",
  },
  {
    id: "feel_f_3",
    category: "feeling",
    domain: "general",
    langProfile: "french",
    text: "c'est facile",
    textArabic: "",
  },
  {
    id: "feel_f_4",
    category: "feeling",
    domain: "general",
    langProfile: "french",
    text: "c'est un peu difficile",
    textArabic: "",
  },

  // --- Feelings — Mixed ---
  {
    id: "feel_m_1",
    category: "feeling",
    domain: "general",
    langProfile: "mixed",
    text: "fhmt bien, c'est clair",
    textArabic: "فهمت bien, c'est clair",
  },
  {
    id: "feel_m_2",
    category: "feeling",
    domain: "general",
    langProfile: "mixed",
    text: "non ma fhmtch mzyan",
    textArabic: "non ما فهمتش مزيان",
  },

  // ============================================================
  // TEST-SET UTTERANCES (Phase 2) — split: "test"
  // ============================================================
  // Only served to sessions opened with a `?set=test` link (see
  // getSplitFromUrl in firebase.js), and meant for a small panel of
  // dedicated benchmark speakers rather than every contributor — see
  // the "Phase 2: test set" section of the README.
  //
  // These are SEED phrasing, same as the rest of the pool: contributors
  // correct the transcript inline if they'd naturally say it differently,
  // and that correction *is* the ground truth. Written to reuse
  // already-used-above vocabulary where possible, but review/adjust
  // wording (especially the "long" ones, which are novel sentences, not
  // reused short phrases) before sharing the test-set link — worth a
  // native-speaker pass since these directly shape benchmark quality.

  // --- Short — Darija ---
  {
    id: "test_d_1",
    category: "numbers",
    domain: "math",
    langProfile: "darija",
    split: "test",
    length: "short",
    text: "wa7ed o 3achrin",
    textArabic: "واحد وعشرين",
  },
  {
    id: "test_d_2",
    category: "answer",
    domain: "math",
    langProfile: "darija",
    split: "test",
    length: "short",
    text: "machi akid, ymken tse3a",
    textArabic: "ماشي أكيد، يمكن تسعة",
  },
  {
    id: "test_d_3",
    category: "feeling",
    domain: "general",
    langProfile: "darija",
    split: "test",
    length: "short",
    text: "bghit nfhem mezyan",
    textArabic: "بغيت نفهم مزيان",
  },

  // --- Short — Mixed ---
  {
    id: "test_m_1",
    category: "operation",
    domain: "math",
    langProfile: "mixed",
    split: "test",
    length: "short",
    text: "quatre fois tlata",
    textArabic: "quatre فوا تلاتة",
  },
  {
    id: "test_m_2",
    category: "answer",
    domain: "math",
    langProfile: "mixed",
    split: "test",
    length: "short",
    text: "peut-être hiya stta",
    textArabic: "peut-être هي ستة",
  },
  {
    id: "test_m_3",
    category: "confirm",
    domain: "general",
    langProfile: "mixed",
    split: "test",
    length: "short",
    text: "d'accord, safi",
    textArabic: "d'accord، صافي",
  },

  // --- Short — French ---
  {
    id: "test_f_1",
    category: "answer",
    domain: "math",
    langProfile: "french",
    split: "test",
    length: "short",
    text: "je crois que c'est neuf",
    textArabic: "",
  },
  {
    id: "test_f_2",
    category: "feeling",
    domain: "general",
    langProfile: "french",
    split: "test",
    length: "short",
    text: "je ne suis pas sûr",
    textArabic: "",
  },

  // --- Long / conversational — Darija ---
  {
    id: "test_long_d_1",
    category: "answer",
    domain: "math",
    langProfile: "darija",
    split: "test",
    length: "long",
    text: "ana khasni ndir 3amaliya dyal ljam3, choft khamsa za2id tlata hiya tmnya, haka t3alemt f l9isem lyouma",
    textArabic:
      "أنا خاصني ندير عملية ديال جمع، شفت خمسة زيد تلاتة، كايجي تمنية، حيت هاكاك تعلمت فالقسم ديال ليوم",
  },
  {
    id: "test_long_d_2",
    category: "feeling",
    domain: "general",
    langProfile: "darija",
    split: "test",
    length: "long",
    text: "fhamt chwiya, walakin mnin wselna l so2al li fih l9isma ma3reftch mnin nbda, bghit t3awdo liya b chwiya b chwiya",
    textArabic:
      "فهمت شوية، ولكن منين وصلنا للسؤال اللي فيه قسمة بديت ما عرفتش فين نبدا، بغيت تعاودو ليا بشوية بشوية",
  },
  {
    id: "test_long_d_3",
    category: "answer",
    domain: "math",
    langProfile: "darija",
    split: "test",
    length: "long",
    text: "ljawab howa seb3a, khdemtha jouj marat bach nt2aked beli ma kayench ghalat",
    textArabic: "",
  },
  {
    id: "test_long_d_4",
    category: "instruction",
    domain: "general",
    langProfile: "darija",
    split: "test",
    length: "long",
    text: "wrini chi exercice akhor 3afak, hada li 3titini sahel bezaf, bghit chi haja fiha ta7adi chwiya",
    textArabic:
      "وريني شي exercice آخر عافاك، هادا لي عطيتيني ساهل بزاف، بغيت شي حاجة فيها تحدي شوية",
  },
  {
    id: "test_long_d_5",
    category: "feeling",
    domain: "general",
    langProfile: "darija",
    split: "test",
    length: "long",
    text: "daba fhmt mezyan kifach ndir l9isma, 9bel kont kanghlet bezaf, walakin daba wla 3andi tari9a wad7a nemchi biha khotwa b khotwa",
    textArabic: "",
  },
  {
    id: "test_long_d_6",
    category: "operation",
    domain: "math",
    langProfile: "darija",
    split: "test",
    length: "long",
    text: "khesni ndir jouj 3amaliyat, awalan nzid tlata 3la reb3a, w mn ba3d n9es wa7ed, bach nwsal l jawab li s7i7",
    textArabic:
      "خصني ندير جوج عمليات، أولا نزيد تلاتة مع ربعة، ومنبعد نقص واحد، باش نوصل للجواب لي صحيح",
  },
  {
    id: "test_long_d_7",
    category: "confirm",
    domain: "general",
    langProfile: "darija",
    split: "test",
    length: "long",
    text: "wakha, fhamt li 9olti, walakin 3afak 3awedli so2al mara akhra bach nt2aked mzyan 9bel ma njawb",
    textArabic:
      "واخا، فهمت لي قلتي، ولكين عافاك عاود لي السؤال مرة خرى باش نتيقن مزيان قبل ما نجاوب",
  },
  {
    id: "test_long_d_8",
    category: "instruction",
    domain: "general",
    langProfile: "darija",
    split: "test",
    length: "long",
    text: "bghit nrj3 l so2al li fat, hit ghlet fih, o bghit ndir l3amaliya mara akhra bach nchouf wach ljawab dyali ghadi ykoun s7i7 had lmara",
    textArabic:
      "بغيت نرجع للسؤال لي فات، حيت غلطت فيه، وبغيت ندير عملية خرى باش نشوف واش جوابي غادي يكون صحيح هادي لمرة",
  },
  {
    id: "test_long_d_9",
    category: "feeling",
    domain: "general",
    langProfile: "darija",
    split: "test",
    length: "long",
    text: "ghir daba bdit nfham tabi3a dyal had lmasa2il, 9bel kont kan7ess bli s3iba bezaf, walakin daba rej3at 3andi tiqa f nefsi",
    textArabic:
      "غير دابا بديت نفهم طبيعة ديال هاد لمسائل، قبل كنت كنحس بلي صعيبة بزاف، ولكين دابا ولا عندي ثقة فنفسي",
  },
  {
    id: "test_long_d_10",
    category: "answer",
    domain: "math",
    langProfile: "darija",
    split: "test",
    length: "long",
    text: "khasni nfekar chwiya 9bel ma njawb, 7it had so2al fih jouj khotowat, awalan nqsem 3achra 3la jouj, mn ba3d nzid natija 3la tlata",
    textArabic:
      "خاصني نفكر شوية قبل ما نجاوب، حيت هاد السؤال فيه جوج خطوات، أولا نقسم عشرة على جوج، ومنبعد نزيد النتيجة مع تلاتة",
  },
  {
    id: "test_long_d_11",
    category: "instruction",
    domain: "general",
    langProfile: "darija",
    split: "test",
    length: "long",
    text: "3afak tsna chwiya, bghit nekteb l3amaliya b yedi 9bel ma ngolek ljawab, hit haka kanfham mzyan o ma kanghletch",
    textArabic:
      "عافاك تسنى شوية، بغيت نكتب العملية بيدي قبل ما نقولك جوابي، حيت هاكا كنفهم مزيان وما كنغلطش",
  },

  // --- Long / conversational — Mixed ---
  {
    id: "test_long_m_1",
    category: "answer",
    domain: "math",
    langProfile: "mixed",
    split: "test",
    length: "long",
    text: "je pense que la réponse hiya 3achra, parce que jouj fois khamsa ymken tkoun 3achra, walakin momkin nkoun ghalta",
    textArabic:
      "je pense que la réponse هي عشرة, parce que جوج فوا خمسة يمكن يكون عشرة, walakin ممكن نكون غالط",
  },
  {
    id: "test_long_m_2",
    category: "instruction",
    domain: "general",
    langProfile: "mixed",
    split: "test",
    length: "long",
    text: "s'il te plaît, bghit nrje3 l'exercice li 9bel, 7it ma sejeltch mezyan chno 9alo, o bghit nchouf les étapes b l'ordre",
    textArabic:
      "s'il te plaît, بغيت نرجع لexercice اللي قبل، حيت ما سجلتش مزيان شنو قالو، وبغيت نشوف les étapes بالوردر",
  },
  {
    id: "test_long_m_3",
    category: "feeling",
    domain: "general",
    langProfile: "mixed",
    split: "test",
    length: "long",
    text: "honnêtement, had l'exercice s3ib chwiya, ma fhmtch mzyan l9isma, walakin ghadi n3awd njareb bach nfhem",
    textArabic:
      "honnêtement, هادا lexercice صعيب شوية, ما فهمتش مزيان القسمة, ولكين غادي نعاود نجرب باش نفهم",
  },
  {
    id: "test_long_m_4",
    category: "answer",
    domain: "math",
    langProfile: "mixed",
    split: "test",
    length: "long",
    text: "attends, khasni n3awed l7sab, parce que 9olt trois fois quatre o ljawab li 3tit machi s7i7, ghadi nbda mn jdid",
    textArabic:
      "attends, خاصني نعاود لحساب, parce que قلت trois fois quatre وجواب لي عطيت ماشي صحيح, غادي نبدا من جديد",
  },
  {
    id: "test_long_m_5",
    category: "instruction",
    domain: "general",
    langProfile: "mixed",
    split: "test",
    length: "long",
    text: "d'accord, on continue, walakin bghit ghi tsna chwiya bach nkteb ljawab dyali 9bel ma tzid l so2al li men ba3d",
    textArabic:
      "d'accord, on continue, ولكين بغيت غي نتسنى شوية باش نكتب لجواب ديالي قبل ما تزيد السؤال لي من بعد",
  },
];

// --- Selection -------------------------------------------------------

// Filters the full pool down to one dataset split. Entries with no
// `split` field are treated as "train" — this is what let split get
// introduced in Phase 2 without back-filling the original 85 phrases.
// Exported so callers doing their own coverage-tracking (e.g.
// RecordScreen's "has this speaker covered the whole pool yet" check)
// compare against the right split, not the combined pool.
export function forSplit(split) {
  return UTTERANCES.filter((u) => (u.split || "train") === split);
}

// Plain random pick excluding given ids, with full-pool fallback once
// everything's been covered. Used when we have no language-comfort
// preference to route by (e.g. speaker skipped that profile question).
export function randomUtterance(excludeIds = [], split = "train") {
  const excludeSet = new Set(excludeIds);
  const splitPool = forSplit(split);
  const pool = splitPool.filter((u) => !excludeSet.has(u.id));
  const source = pool.length > 0 ? pool : splitPool;
  return source[Math.floor(Math.random() * source.length)];
}

// Weighted pick that biases toward the speaker's stated language comfort,
// without fully excluding the other lanes — e.g. a Darija-comfortable
// speaker should mostly see Darija phrases, with just a few French/mixed
// ones, rather than none at all (we still want some cross-lane coverage
// from every speaker).
//
// languageComfort: "darija" | "french" | "both" | null/undefined
const LANG_WEIGHTS = {
  darija: { darija: 0.7, mixed: 0.2, french: 0.1 },
  french: { french: 0.7, mixed: 0.2, darija: 0.1 },
  both: { darija: 0.34, french: 0.33, mixed: 0.33 },
};

// --- Fixed benchmark subset (paired cross-speaker comparison) --------
//
// For the paper's cross-speaker statistics (Wilcoxon signed-rank etc.),
// every benchmark speaker needs to read the EXACT SAME 20 utterances —
// not a random draw from train/test — so error rates are paired by
// content and any difference is attributable to the speaker, not to one
// utterance being harder than another. Picked from BOTH the train and
// test pools (this is intentionally not the same thing as split:"test"),
// stratified to keep the difficulty range represented rather than
// skewing short/easy:
//   9 darija-short, 5 mixed-short, 4 darija-long, 2 mixed-long
// Every entry here has a filled-in textArabic (deliberately avoided the
// two long-Darija test entries that don't, e.g. test_long_d_3/5, so the
// benchmark set has complete ground truth). Do not paraphrase/reword
// these when a new speaker records them — that would reintroduce the
// content-difficulty confound this list exists to eliminate. See the
// "Phase 2b: fixed benchmark subset" section of the README.
export const BENCHMARK_IDS = [
  // darija — short (9)
  "num_d_1",
  "num_d_5",
  "num_d_10",
  "op_d_add",
  "op_d_1",
  "ans_d_1",
  "ans_d_3",
  "conf_d_yes",
  "instr_d_1",
  // mixed — short (5)
  "op_m_1",
  "op_m_3",
  "ans_m_1",
  "instr_m_1",
  "feel_m_1",
  // darija — long (4)
  "test_long_d_1",
  "test_long_d_6",
  "test_long_d_7",
  "test_long_d_9",
  // mixed — long (2)
  "test_long_m_1",
  "test_long_m_3",
];

// The 20 full utterance objects, in BENCHMARK_IDS order.
export function forBenchmark() {
  const idSet = new Set(BENCHMARK_IDS);
  return UTTERANCES.filter((u) => idSet.has(u.id));
}

// Plain random pick within the fixed benchmark set — no language-comfort
// weighting, unlike pickUtteranceForSpeaker, because every benchmark
// speaker must eventually cover all 20 regardless of what they said
// they're comfortable in. Order can vary per speaker (pairing is by
// utterance id, not by sequence), only the SET has to stay fixed.
export function pickBenchmarkUtterance(excludeIds = []) {
  const excludeSet = new Set(excludeIds);
  const pool = forBenchmark();
  const remaining = pool.filter((u) => !excludeSet.has(u.id));
  const source = remaining.length > 0 ? remaining : pool;
  return source[Math.floor(Math.random() * source.length)];
}

export function pickUtteranceForSpeaker(
  languageComfort,
  excludeIds = [],
  split = "train",
) {
  const excludeSet = new Set(excludeIds);
  const splitPool = forSplit(split);
  let pool = splitPool.filter((u) => !excludeSet.has(u.id));
  if (pool.length === 0) pool = splitPool; // full-pool fallback, as above

  const weights = LANG_WEIGHTS[languageComfort] || LANG_WEIGHTS.both;

  // Roll which lane to draw from according to the weights, then pick
  // randomly within that lane (falling back to the full remaining pool
  // if that lane happens to be empty right now).
  const roll = Math.random();
  let cumulative = 0;
  let chosenLane = "darija";
  for (const lane of ["darija", "french", "mixed"]) {
    cumulative += weights[lane];
    if (roll <= cumulative) {
      chosenLane = lane;
      break;
    }
  }

  const laneOptions = pool.filter((u) => u.langProfile === chosenLane);
  const finalOptions = laneOptions.length > 0 ? laneOptions : pool;
  return finalOptions[Math.floor(Math.random() * finalOptions.length)];
}
