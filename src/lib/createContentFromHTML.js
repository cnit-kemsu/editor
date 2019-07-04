import { convertFromHTML, convertToRaw, convertFromRaw, ContentState } from 'draft-js';

function replaceImageEntitiesData(entityMap) {

  return Object.values(entityMap).map(entity => {

    if (entity.type === 'IMAGE') return {
      type: 'IMAGE',
      mutability: 'IMMUTABLE',
      data: {
        ...entity.data,
        symmetric: true
      }
    };
    return entity;
  });
}

export function createContentFromHTML(html) {

  return convertFromHTML(html)
  |> ContentState.createFromBlockArray(#.contentBlocks, #.entityMap)
  |> convertToRaw(#)
  |> convertFromRaw({
      blocks: #.blocks,
      entityMap: replaceImageEntitiesData(#.entityMap)
    });
}