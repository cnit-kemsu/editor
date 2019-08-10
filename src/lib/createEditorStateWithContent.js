import { EditorState, CompositeDecorator, convertFromRaw } from 'draft-js';
import { findImageEntities } from './findImageEntities';
import Image from '../components/Image';

export function createEditorStateWithContent(contentState) {

  const decorator = new CompositeDecorator([{
    strategy: findImageEntities,
    component: Image
  }]);

  return contentState == null
    ? EditorState.createEmpty(decorator)
    : convertFromRaw(contentState) |> EditorState.createWithContent(#, decorator);
}