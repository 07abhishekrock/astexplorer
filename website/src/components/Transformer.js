import Editor from './Editor';
import JSCodeshiftEditor from './JSCodeshiftEditor';
import PropTypes from 'prop-types';
import {publish} from '../utils/pubsub.js';
import * as React from 'react';
import SplitPane from './SplitPane';
import TransformOutput from './TransformOutput';
import PrettierButton from './buttons/PrettierButton';
import RemoteEditorConnectInput from './RemoteEditorInput';

function resize() {
  publish('PANEL_RESIZE');
}

export default function Transformer(props) {
  const [editorValue, setEditorValue] = React.useState('');
  const plainEditor = React.createElement(
    props.transformer.id === 'jscodeshift' ? JSCodeshiftEditor : Editor,
    {
      highlight: false,
      value: editorValue,
      onContentChange: props.onContentChange,
      enableFormatting: props.enableFormatting,
      keyMap: props.keyMap,
    },
  );

  const formattingEditor = (<div style={{flex: 1, minHeight: 0, minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column'}}>
    <PrettierButton toggleFormatting={props.toggleFormatting} enableFormatting={props.enableFormatting}/>
    <RemoteEditorConnectInput onCodePush={setEditorValue}/>
    {plainEditor}
  </div>)

  return (
    <SplitPane
      className="splitpane"
      onResize={resize}>
      {formattingEditor}
      <TransformOutput
        transformResult={props.transformResult}
        mode={props.mode}
      />
    </SplitPane>
  );
}

Transformer.propTypes = {
  defaultTransformCode: PropTypes.string,
  transformCode: PropTypes.string,
  transformer: PropTypes.object,
  mode: PropTypes.string,
  keyMap: PropTypes.string,
  onContentChange: PropTypes.func,
  toggleFormatting: PropTypes.func,
  enableFormatting: PropTypes.bool,
  transformResult: PropTypes.object,
};
