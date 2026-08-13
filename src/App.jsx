import { useState, useEffect } from "react";
import LoginScreen from "./LoginScreen";
import ProfileForm from "./ProfileForm";
import RecordScreen from "./RecordScreen";
import {
  loginAsSpeaker,
  speakerProfileExists,
  watchAuth,
  getChannelFromUrl,
  getSplitFromUrl,
} from "./firebase";
import { LangProvider, useLang } from "./i18n";
import "./app.css";

function AppInner() {
  const { dir } = useLang();
  const [authReady, setAuthReady] = useState(false);
  const [speaker, setSpeaker] = useState(() => {
    const saved = localStorage.getItem("dmtarl_speaker");
    return saved ? JSON.parse(saved) : null;
  });
  // Holds {name, pin} while we're between "entered name+PIN" and
  // "finished the one-time profile form" — null the rest of the time.
  const [pendingLogin, setPendingLogin] = useState(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  // Read once per page load from `?set=test` — see getSplitFromUrl.
  const [datasetSplit] = useState(getSplitFromUrl);

  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  useEffect(() => {
    // We still need an active Firebase auth session for security rules,
    // even though the SPEAKER identity (name+PIN) is independent of it.
    const unsub = watchAuth((user) => {
      setAuthReady(!!user);
    });
    return unsub;
  }, []);

  const finishLogin = async (name, pin, profileFields) => {
    const result = await loginAsSpeaker(name, pin, {
      ...profileFields,
      recruitmentChannel: getChannelFromUrl(),
    });
    setSpeaker(result);
    localStorage.setItem("dmtarl_speaker", JSON.stringify(result));
    setPendingLogin(null);
  };

  const handleNameSubmit = async (name, pin) => {
    const exists = await speakerProfileExists(name, pin);
    if (exists) {
      // Returning speaker — skip the profile form entirely.
      await finishLogin(name, pin, {});
    } else {
      // First time we've seen this name+PIN — collect the short profile
      // before creating the speaker record.
      setPendingLogin({ name, pin });
    }
  };

  const handleProfileSubmit = async (profileFields) => {
    setProfileSubmitting(true);
    try {
      await finishLogin(pendingLogin.name, pendingLogin.pin, profileFields);
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleSwitchSpeaker = () => {
    localStorage.removeItem("dmtarl_speaker");
    setSpeaker(null);
    setPendingLogin(null);
  };

  if (pendingLogin) {
    return (
      <ProfileForm onSubmit={handleProfileSubmit} submitting={profileSubmitting} />
    );
  }

  if (!speaker) {
    return <LoginScreen onLogin={handleNameSubmit} />;
  }

  return (
    <RecordScreen
      speakerName={speaker.speakerName}
      speakerId={speaker.speakerId}
      languageComfort={speaker.languageComfort}
      datasetSplit={datasetSplit}
      onSwitchSpeaker={handleSwitchSpeaker}
    />
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  );
}

