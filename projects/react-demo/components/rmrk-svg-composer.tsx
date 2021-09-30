import React, { memo, useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import SVG from 'react-inlinesvg';
import {
  ConsolidatorReturnType,
  NFTConsolidated,
} from 'rmrk-tools/dist/tools/consolidator/consolidator';
import { getBaseParts } from '../lib/get-base-parts';
import { IBasePart } from 'rmrk-tools/dist/classes/base';
import { arePropsEqual } from '../lib/are-props-equal';

interface IProps {
  nft: NFTConsolidated;
}

export const getEquippedInventoryItems = async (
  setInventory: (basePart: Partial<IBasePart>[]) => void,
  resources_parts?: IBasePart[],
  children?: NFTConsolidated['children'],
) => {
  const payload = await fetch('/chunky-dump.json');
  const data: ConsolidatorReturnType = await payload.json();

  const equippedChildren = (children || []).map((child) => {
    const nft = data?.nfts[child.id];
    const matchingResource = nft.resources.find((resource) => resource.slot === child.equipped);

    return matchingResource;
  });

  const slotParts = (resources_parts || []).map((resources_part) => {
    // Find base slot for each equipped children
    const matchingResource = equippedChildren.find(
      (resource) => resource?.slot && resource.slot.split('.')[1] === resources_part.id,
    );

    if (resources_part.type !== 'slot') {
      return null;
    }

    return {
      z: resources_part.z,
      src: matchingResource?.src || resources_part.src,
      id: resources_part.id,
    };
  });

  const filteredParts = slotParts.filter((part): part is { z: number; src: string; id: string } =>
    Boolean(part),
  );

  setInventory(filteredParts);
};

const SvgResourceComposer = ({ nft }: IProps) => {
  const [baseParts, setBaseParts] = useState<IBasePart[]>();
  const [equippedInventory, setEquippedInventory] = useState<Partial<IBasePart>[]>();

  useEffect(() => {
    getBaseParts(
      setBaseParts,
      nft.resources.find((resource) => Boolean(resource.base)),
    );
  }, []);

  useEffect(() => {
    if (baseParts) {
      getEquippedInventoryItems(setEquippedInventory, baseParts, nft.children);
    }
  }, [baseParts]);

  const fixedParts = (baseParts || []).filter((resources_part) => resources_part.type === 'fixed');

  const parts = [...(equippedInventory || []), ...fixedParts].sort(
    (first, second) => first?.z! - second.z!,
  );

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-end"
      h={'100%'}
      data-name={'svg-resource-composer'}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={'0 0 1080 1512'}
        id="bird">
        {parts.map(
          (part) =>
            part.src && (
              <SVG
                key={`svg-resource-composer-part-${part.src}`}
                style={{ zIndex: part.z }}
                src={part.src.replace('ipfs://', 'https://rmrk.mypinata.cloud/')}
                width={'100%'}
                height={'100%'}
                cacheRequests={false}
                uniquifyIDs={true}
              />
            ),
        )}
      </svg>
    </Flex>
  );
};

export default memo(SvgResourceComposer, arePropsEqual);
