import { useState } from "react";
import { useLang } from "./i18n";

export default function ProfileForm({ onSubmit, submitting }) {
  const { t } = useLang();
  const [ageRange, setAgeRange] = useState("");
  const [languageComfort, setLanguageComfort] = useState("");
  const [gender, setGender] = useState("");
  const [region, setRegion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ageRange, languageComfort, gender, region });
  };

  return (
    <div className="screen center">
      <div className="card login-card">
        <h1>{t.profileTitle}</h1>
        <p className="subtle">{t.profileSubtitle}</p>

        <form onSubmit={handleSubmit}>
          <fieldset className="field-group">
            <legend>{t.ageRangeLabel}</legend>
            {[
              ["18_25", t.age18_25],
              ["26_40", t.age26_40],
              ["41_60", t.age41_60],
              ["60_plus", t.age60plus],
              ["prefer_not", t.agePrefer],
            ].map(([value, label]) => (
              <label key={value} className="choice-option">
                <input
                  type="radio"
                  name="ageRange"
                  value={value}
                  checked={ageRange === value}
                  onChange={() => setAgeRange(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>

          <fieldset className="field-group">
            <legend>{t.languageComfortLabel}</legend>
            {[
              ["darija", t.langDarija],
              ["french", t.langFrench],
              ["both", t.langBoth],
            ].map(([value, label]) => (
              <label key={value} className="choice-option">
                <input
                  type="radio"
                  name="languageComfort"
                  value={value}
                  checked={languageComfort === value}
                  onChange={() => setLanguageComfort(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>

          <fieldset className="field-group">
            <legend>{t.regionLabel}</legend>
            {[
              ["north", t.regionNorth],
              ["center_west", t.regionCenterWest],
              ["east", t.regionEast],
              ["south", t.regionSouth],
              ["prefer_not", t.regionPrefer],
            ].map(([value, label]) => (
              <label key={value} className="choice-option">
                <input
                  type="radio"
                  name="region"
                  value={value}
                  checked={region === value}
                  onChange={() => setRegion(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>

          <fieldset className="field-group">
            <legend>{t.genderLabel}</legend>
            {[
              ["female", t.genderFemale],
              ["male", t.genderMale],
              ["prefer_not", t.genderPrefer],
            ].map(([value, label]) => (
              <label key={value} className="choice-option">
                <input
                  type="radio"
                  name="gender"
                  value={value}
                  checked={gender === value}
                  onChange={() => setGender(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>

          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? t.loadingButton : t.continueButton}
          </button>
        </form>
      </div>
    </div>
  );
}
