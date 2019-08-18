import { EditorState, CompositeDecorator, convertFromRaw, ContentState } from 'draft-js';
import { findImageEntities } from './findImageEntities';
import Image from '../components/Image';

export function createEditorStateFromContent(contentState) {

  const decorator = new CompositeDecorator([{
    strategy: findImageEntities,
    component: Image
  }]);

  return (contentState == null
    ? EditorState.createEmpty(decorator)
    : (contentState instanceof ContentState ? contentState : convertFromRaw(contentState))
  ) |> EditorState.createWithContent(#, decorator);
}