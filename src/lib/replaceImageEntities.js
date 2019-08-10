import { attributeToProp } from './attributeToProp';

export function replaceImageEntities(entityMap, html) {
  const findImageTag = /<img.+?>/g;
  const findAttributes = /(\S+?)="(\S+?)"/g;

  return Object.values(entityMap).map(entity => {

    if (entity.type !== 'IMAGE') return entity;
    const { 'data-symmetric': symmetric, src, width, height } = 
    findImageTag.exec(html)[0]
      .match(findAttributes)
      .reduce(attributeToProp, {});

    return {
      type: 'IMAGE',
      mutability: 'IMMUTABLE',
      data: {
        src, width, height,
        symmetric: symmetric !== false
      }
    };
  });
}