import { attrToDataProp } from '@lib/attrToDataProp';

export function replaceImageEntities(entityMap, html) {
  const findImgTag = /<img.+?>/g;
  const findAttributes = /(\S+?)="(\S+?)"/g;

  return Object.values(entityMap).map(entity => {

    if (entity.type !== 'IMAGE') return entity;
    const { 'data-symmetric': symmetric, ...data } = findImgTag.exec(html)[0]
        .match(findAttributes)
        .reduce(attrToDataProp, {});

    return {
      type: 'IMAGE',
      mutability: 'IMMUTABLE',
      data: {
        ...data,
        symmetric: symmetric === undefined ? true : symmetric
      }
    };
  });
}