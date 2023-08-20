// IconSVGs.js
import React from 'react';

const UnverifiedIcon = ({size="10"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 10 10" fill="none">
    <circle cx="5" cy="5" r="4" fill="#667085" />
  </svg>
);

const VerifiedIcon = ({size="10"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 10 10" fill="none">
    <circle cx="5" cy="5" r="4" fill="#17B26A" />
  </svg>
);

const DeferredIcon = ({size="10"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 10 10" fill="none">
    <circle cx="5" cy="5" r="4" fill="#F79009" />
  </svg>
);

const LostIcon = ({size="10"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 10 10" fill="none">
    <circle cx="5" cy="5" r="4" fill="#F04438" />
  </svg>
);

const JunkIcon = ({size="10"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="4" fill="#F04438" />
    </svg>
);

export const Unverified = (props) => <UnverifiedIcon {...props} />;
export const Verified = (props) => <VerifiedIcon {...props} />;
export const Deferred = (props) => <DeferredIcon {...props} />;
export const Lost = (props) => <LostIcon {...props} />;
export const Junk = (props) => <JunkIcon {...props} />;