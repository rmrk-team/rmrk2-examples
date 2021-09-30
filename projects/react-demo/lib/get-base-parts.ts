import { IBasePart } from 'rmrk-tools/dist/classes/base';
import { ConsolidatorReturnType } from 'rmrk-tools/dist/tools/consolidator/consolidator';
import { IResourceConsolidated } from 'rmrk-tools/dist/classes/nft';

export const getBaseParts = async (
  setBaseParts: (baseParts: IBasePart[]) => void,
  baseResource?: IResourceConsolidated,
) => {
  if (baseResource) {
    const payload = await fetch('/chunky-dump.json');
    const data: ConsolidatorReturnType = await payload.json();
    const base = data.bases?.[baseResource.base || ''];
    const baseParts = base?.parts
      ? base.parts.filter((part) => (baseResource.parts || []).includes(part.id))
      : [];

    setBaseParts(baseParts);
  }
};
