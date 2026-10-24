'use client';

import ConstructionIcon from '@mui/icons-material/Construction';
import EmptyState from './EmptyState';
import PageHeader from './PageHeader';
import Panel from './Panel';

// Shown on pages that are not built yet. Replace the page file when you build the feature.
export default function ComingSoon({ title, milestone }) {
  return (
    <>
      <PageHeader title={title} subtitle={milestone} />
      <Panel>
        <EmptyState
          icon={<ConstructionIcon />}
          title="This page is coming soon"
          description={`It will be built in ${milestone}.`}
        />
      </Panel>
    </>
  );
}
