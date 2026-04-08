import { useState } from 'react';

import ArticleWrapper from '../../../components/ui/ContentWrapper/_components/ArticleWrapper';
import ContentWrapper from '../../../components/ui/ContentWrapper/ContentWrapper';
import MainProfileSection from '../pages/MainProfileSection/MainProfileSection';
import PerGroupProfilesSection from '../pages/PerGroupProfilesSection/PerGroupProfilesSection';

type ProfileSection = 'main' | 'per-group';

export default function CurrentUserProfile() {
  const [section, setSection] = useState<ProfileSection>('main');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [flashWarning, setFlashWarning] = useState(false);

  function handleSectionChange(next: ProfileSection) {
    if (unsavedChanges) {
      setFlashWarning(true);
      setTimeout(() => setFlashWarning(false), 1500);
      return;
    }
    setSection(next);
  }

  return (
    <ContentWrapper>
      <ArticleWrapper>
        <div className="flex items-center gap-4">
          <SectionButton
            title="Main Profile"
            onClick={() => handleSectionChange('main')}
            active={section === 'main'}
          />
          <SectionButton
            title="Per-group Profiles"
            onClick={() => handleSectionChange('per-group')}
            active={section === 'per-group'}
          />
        </div>

        {section === 'main' && (
          <MainProfileSection
            unsavedChanges={unsavedChanges}
            setUnsavedChanges={setUnsavedChanges}
            flashWarning={flashWarning}
          />
        )}
        {section === 'per-group' && (
          <PerGroupProfilesSection
            unsavedChanges={unsavedChanges}
            setUnsavedChanges={setUnsavedChanges}
            flashWarning={flashWarning}
            setFlashWarning={setFlashWarning}
          />
        )}
      </ArticleWrapper>
    </ContentWrapper>
  );
}

function SectionButton({
  title,
  onClick,
  active,
}: {
  title: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-lg px-4 py-2 ${active ? 'bg-dark-500' : 'bg-dark-600 hover:bg-dark-400'}`}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
    </button>
  );
}
