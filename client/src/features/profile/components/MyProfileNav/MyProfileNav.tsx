import FriendsIcon from '../../../../components/icons/FriendsIcon';
import NavSectionItem from '../../../../components/ui/NavSection/_components/NavSectionItem';
import NavSectionWrapper from '../../../../components/ui/NavSection/NavSectionWrapper';

import BlocklistIcon from './_components/BlocklistIcon';
import ProfileIcon from './_components/ProfileIcon';

export default function MyProfileNav() {
  return (
    <NavSectionWrapper title="My Profile">
      <NavSectionItem link="/users/me" text="Profile" icon={<ProfileIcon />} />
      <NavSectionItem link="/users/me/friends" text="Friends" icon={<FriendsIcon />} />
      <NavSectionItem link="/users/me/blocks" text="Blocklist" icon={<BlocklistIcon />} />
    </NavSectionWrapper>
  );
}
