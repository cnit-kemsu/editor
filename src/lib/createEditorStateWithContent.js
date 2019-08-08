import { EditorState, CompositeDecorator } from 'draft-js';
import { findImageEntities } from './findImageEntities';
import Image from '../components/Image';

export function createEditorStateWithContent(contentState) {

  const decorator = new CompositeDecorator([{
    strategy: findImageEntities,
    component: Image
  }]);

  return contentState == null
    ? EditorState.createEmpty(decorator)
    : EditorState.createWithContent(contentState, decorator);
}