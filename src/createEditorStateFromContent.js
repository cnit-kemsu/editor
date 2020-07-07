import { EditorState, CompositeDecorator, convertFromRaw, ContentState } from 'draft-js';
import { findImageEntities } from './internals/findImageEntities';
import Image from './components/Image';
import Video from './components/Video';

function findVideoEntities(contentBlock, callback, contentState) {

  contentBlock.findEntityRanges(
    ({ entity }) => {
      if (entity == null) return;
      return contentState.getEntity(entity).getType() === 'VIDEO';
    },
    callback
  );
}

export function createEditorStateFromContent(contentState) {

  const decorator = new CompositeDecorator([{
    strategy: findImageEntities,
    component: Image
  }, {
    strategy: findVideoEntities,
    component: Video
  }]);

  return contentState == null
    ? EditorState.createEmpty(decorator)
    : (
      (contentState instanceof ContentState ? contentState : convertFromRaw(contentState))
      |> EditorState.createWithContent(#, decorator)
    );
}