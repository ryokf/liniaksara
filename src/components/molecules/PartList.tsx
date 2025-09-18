import dynamic from 'next/dynamic';

const PartList = dynamic(
  () => import('./PartListClient'),
  { ssr: false }
);

export default PartList;
export type { Part } from './PartListClient';