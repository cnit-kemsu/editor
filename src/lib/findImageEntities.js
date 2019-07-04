export function findImageEntities(contentBlock, callback, contentState) {

  contentBlock.findEntityRanges(
    ({ entity }) => {
      if (entity == null) return;
      return contentState.getEntity(entity).getType() === 'IMAGE';
    },
    callback
  );
}