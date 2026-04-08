import NavSectionItem from '../../../../components/ui/NavSection/_components/NavSectionItem';
import NavSectionWrapper from '../../../../components/ui/NavSection/NavSectionWrapper';

import AllGroupsIcon from './_components/AllGroupsIcon';
import MyGroupsIcon from './_components/MyGroupsIcon';

export default function GroupNav() {
  return (
    <NavSectionWrapper title="Groups">
      <NavSectionItem link="/groups" text="All Groups" icon={<AllGroupsIcon />} />
      <NavSectionItem link="/groups/me" text="My Groups" icon={<MyGroupsIcon />} />
    </NavSectionWrapper>
  );
}
