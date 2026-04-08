import NavSectionItem from '../../../../components/ui/NavSection/_components/NavSectionItem';
import NavSectionWrapper from '../../../../components/ui/NavSection/NavSectionWrapper';

import ReportIcon from './_components/ReportIcon';
import UsersIcon from './_components/UsersIcon';

export default function AdminNav() {
  return (
    <NavSectionWrapper title="Admin">
      <NavSectionItem link="/admin/users" text="Users" icon={<UsersIcon />} />
      <NavSectionItem
        link="/admin/reports"
        text="Reports"
        icon={<ReportIcon className="size-8" />}
      />
    </NavSectionWrapper>
  );
}
