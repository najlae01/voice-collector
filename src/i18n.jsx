import { createContext, useContext, useState, useMemo } from "react";

const STRINGS = {
  fr: {
    dir: "ltr",
    appName: "DM-TaRL · Collecte de voix",
    loginGreeting: "Bonjour, quel est votre nom ?",
    loginSubtitle:
      "Vos enregistrements seront classés sous ce nom. Entrez aussi un code à 4 chiffres de votre choix — cela permet de vous retrouver si deux personnes ont le même prénom.",
    namePlaceholder: "ex. Naj, Maman, Karim…",
    pinPlaceholder: "Code à 4 chiffres (ex. 1234)",
    pinHint: "Choisissez 4 chiffres et retenez-les — vous les retaperez la prochaine fois.",
    startButton: "Commencer",
    loadingButton: "Un instant…",
    recordingAs: "Vous enregistrez en tant que",
    savedCount: "enregistrements sauvegardés",
    sayThis: "Dites cette phrase à voix haute, naturellement — pas comme si vous lisiez un mot isolé.",
    correctPrompt: "Vous avez dit autre chose ? Appuyez pour corriger :",
    record: "● Enregistrer",
    stop: "■ Arrêter",
    recordAgain: "Réenregistrer",
    backgroundNow: "Bruit de fond actuel :",
    noiseQuiet: "Pièce calme",
    noiseHome: "Un peu de bruit (TV, famille…)",
    noiseOther: "Autre / bruyant",
    skip: "Passer cette phrase",
    accept: "Valider et phrase suivante",
    saving: "Enregistrement…",
    savedToast: "Sauvegardé — merci !",
    errorToast: "Un problème est survenu — réessayez.",
    micError:
      "Impossible d'accéder au microphone. Vérifiez l'autorisation du micro pour ce site.",
    loading: "Chargement…",
    profileTitle: "Encore deux ou trois questions",
    profileSubtitle:
      "Juste pour mieux décrire qui a participé — tout est facultatif, répondez seulement si vous êtes à l'aise.",
    ageRangeLabel: "Tranche d'âge",
    agePrefer: "Je préfère ne pas dire",
    age18_25: "18–25 ans",
    age26_40: "26–40 ans",
    age41_60: "41–60 ans",
    age60plus: "60 ans et plus",
    languageComfortLabel: "Vous êtes plus à l'aise pour parler en…",
    langDarija: "Darija (arabe marocain)",
    langFrench: "Français",
    langBoth: "Les deux, autant l'un que l'autre",
    genderLabel: "Genre",
    genderFemale: "Femme",
    genderMale: "Homme",
    genderPrefer: "Je préfère ne pas dire",
    continueButton: "Continuer",
    regionLabel: "Vous venez de quelle région ?",
    regionNorth: "Nord (Tanger, Tétouan, région du Rif…)",
    regionCenterWest: "Centre / Ouest (Casablanca, Rabat…)",
    regionEast: "Est (Oujda et environs)",
    regionSouth: "Sud (Marrakech, Agadir, Souss…)",
    regionPrefer: "Je préfère ne pas dire",
    testCompleteTitle: "Ensemble de test terminé !",
    testCompleteBody:
      "Merci — vous avez enregistré chaque phrase de l'ensemble de test au moins une fois. C'est suffisant, vous pouvez vous arrêter ici.",
    extraTakeButton: "Enregistrer quand même une prise de plus",
  },
  ar: {
    dir: "rtl",
    appName: "دي إم تارل · جمع الصوت",
    loginGreeting: "السلام، شنو هو سميتك؟",
    loginSubtitle:
      "التسجيلات ديالك غادي يتسجلو بهاد السمية. دخل زيد رمز ديال 4 أرقام لي تختارها بنفسك — هادشي كيخلينا نفرقو بين جوج ناس عندهم نفس السمية.",
    namePlaceholder: "مثلا: نجاة، الماما، كريم…",
    pinPlaceholder: "رمز ديال 4 أرقام (مثلا 1234)",
    pinHint: "ختار 4 أرقام وحفظهم — غادي تكتبهم المرة الجاية.",
    startButton: "بدا",
    loadingButton: "شوية فقط…",
    recordingAs: "كاتسجل بسمية",
    savedCount: "تسجيلات محفوظة",
    sayThis: "قول هاد الجملة بصوت عالي، بطبيعتك — ماشي كيف كاتقرا كلمة وحدها.",
    correctPrompt: "قلتي شي حاجة خرى؟ ضغط باش تصحح:",
    record: "● سجل",
    stop: "■ وقف",
    recordAgain: "سجل من جديد",
    backgroundNow: "الضجة دابا:",
    noiseQuiet: "بيت ساكت",
    noiseHome: "شوية ضجة (تيفي، العائلة…)",
    noiseOther: "خرى / فيها ضجة بزاف",
    skip: "تخطى هاد الجملة",
    accept: "وافق ومر للجملة الجاية",
    saving: "كاتسجل…",
    savedToast: "تسجل — شكرا!",
    errorToast: "كاين شي مشكل — عاود من فضلك.",
    micError: "ما قدرنا نوصلو للميكروفون. تحقق من إذن الميكروفون لهاد الموقع.",
    loading: "كاتلوضي…",
    profileTitle: "بقا غير شي سؤالين أو ثلاثة",
    profileSubtitle:
      "غير باش نعرفو كثر شكون لي ساهم — كلشي اختياري، جاوب غير إلا كنتي مرتاح.",
    ageRangeLabel: "العمر",
    agePrefer: "نفضل ما نجاوبش",
    age18_25: "18–25 سنة",
    age26_40: "26–40 سنة",
    age41_60: "41–60 سنة",
    age60plus: "60 سنة وفوق",
    languageComfortLabel: "كنتهضر بالراحة أكثر ب…",
    langDarija: "الدارجة",
    langFrench: "الفرنسية",
    langBoth: "بالجوج، بحال بحال",
    genderLabel: "الجنس",
    genderFemale: "مرا",
    genderMale: "راجل",
    genderPrefer: "نفضل ما نجاوبش",
    continueButton: "كمل",
    regionLabel: "منين نتا/نتي؟",
    regionNorth: "الشمال (طنجة، تطوان، الريف…)",
    regionCenterWest: "الوسط / الغرب (الدار البيضاء، الرباط…)",
    regionEast: "الشرق (وجدة والمناطق المجاورة)",
    regionSouth: "الجنوب (مراكش، أكادير، سوس…)",
    regionPrefer: "نفضل ما نجاوبش",
    testCompleteTitle: "سجلتي جميع الجمل!",
    testCompleteBody:
      "شكرا بزاف — سجلتي كل جملة فهاد المجموعة مرة وحدة على الأقل. هادشي كافي، ماشي خاصك تكمل.",
    extraTakeButton: "سجل مرة خرى زيادة إلا بغيتي",
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("dmtarl_lang") || "fr"
  );

  const setLanguage = (next) => {
    setLang(next);
    localStorage.setItem("dmtarl_lang", next);
  };

  const value = useMemo(
    () => ({ lang, setLang: setLanguage, t: STRINGS[lang], dir: STRINGS[lang].dir }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
