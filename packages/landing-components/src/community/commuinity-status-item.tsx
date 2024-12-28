'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const StatusItem = dynamic(() =>
    import('../intro/status-item').then(m => m.StatusItem), {
    ssr: false,
  },
);

export const CommunityStatusItem = () => {
  return (
    <Suspense>
      <StatusItem />
    </Suspense>
  );
};