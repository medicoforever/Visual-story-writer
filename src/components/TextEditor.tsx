import React, { useMemo, useCallback } from 'react';
import { createEditor, Descendant, Editor, Element, Range, Node as SlateNode } from 'slate';
import { Slate, Editable, withReact, RenderLeafProps } from 'slate-react';
import { useAppStore, useAppActions } from '../hooks/useAppStore';

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.highlight) {
    children = <span className="bg-purple-500/30 rounded">{children}</span>;
  }
  return <span {...attributes}>{children}</span>;
};

export default function TextEditor() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const { textState, text, actionEdges, filteredActionsSegment, highlightedActionsSegment, selectedEdges, selectedNodes } = useAppStore();
  const { setTextState, setFilteredActionsSegment, setHighlightedActionsSegment } = useAppActions();
  const isLoading = useAppStore(state => state.isLoading);

  const textActionMatches = useMemo(() => actionEdges.map(edge => ({
    source: edge.source.replace(/^entity-/, ''),
    target: edge.target.replace(/^entity-/, ''),
    passage: edge.data?.passage || '',
  })), [actionEdges]);

  const decorate = useCallback(([node, path]: [SlateNode, number[]]) => {
    const ranges: Range[] = [];
    if (!Element.isElement(node) || !Editor.isEditor(editor)) return ranges;

    const textOfNode = SlateNode.string(node);
    if (!textOfNode) return ranges;

    let actionIndicesToHighlight: Set<number> = new Set();
    const activeSegment = highlightedActionsSegment || filteredActionsSegment;

    if (activeSegment) {
        for (let i = activeSegment.start; i <= activeSegment.end; i++) {
            actionIndicesToHighlight.add(i);
        }
    }
    
    selectedEdges.forEach(edgeId => {
        const index = textActionMatches.findIndex((_, i) => `action-${i}-${textActionMatches[i].source}-${textActionMatches[i].target}` === edgeId);
        if(index > -1) actionIndicesToHighlight.add(index);
    });

    if (actionIndicesToHighlight.size === 0 && selectedNodes.length > 0) {
      textActionMatches.forEach((match, index) => {
        const sourceNodeId = `entity-${match.source}`;
        const targetNodeId = `entity-${match.target}`;
        if (selectedNodes.includes(sourceNodeId) || selectedNodes.includes(targetNodeId)) {
          actionIndicesToHighlight.add(index);
        }
      });
    }

    actionIndicesToHighlight.forEach(index => {
        const match = textActionMatches[index];
        if(!match) return;

        const { passage } = match;
        let start = textOfNode.indexOf(passage);
        while (start !== -1) {
            const end = start + passage.length;
            const range = {
                anchor: { path, offset: start },
                focus: { path, offset: end },
                highlight: true,
            };
            ranges.push(range);
            start = textOfNode.indexOf(passage, end);
        }
    });

    return ranges;
  }, [editor, textActionMatches, filteredActionsSegment, highlightedActionsSegment, selectedEdges, selectedNodes]);
  
  const handleSelectionChange = useCallback(() => {
    if (editor.selection && Range.isExpanded(editor.selection)) {
        const [start, end] = Range.edges(editor.selection);
        const editorStartPoint = Editor.start(editor, []);
        const startIndex = Editor.string(editor, { anchor: editorStartPoint, focus: start }).length;
        const endIndex = Editor.string(editor, { anchor: editorStartPoint, focus: end }).length;
        
        const matchingActions = textActionMatches.map((action, index) => ({...action, index}))
            .filter(action => text.indexOf(action.passage) >= startIndex && text.indexOf(action.passage) + action.passage.length <= endIndex);
        
        if (matchingActions.length > 0) {
            const first = matchingActions[0].index;
            const last = matchingActions[matchingActions.length - 1].index;
            setFilteredActionsSegment(first, last);
        } else {
            setFilteredActionsSegment(null, null);
        }
    } else {
        setFilteredActionsSegment(null, null);
    }
  }, [editor, text, textActionMatches, setFilteredActionsSegment]);

  return (
    <div className={`h-full w-full p-6 sm:p-8 overflow-y-auto text-lg leading-relaxed text-gray-300 font-serif relative ${isLoading ? 'opacity-50' : ''}`}>
        <Slate 
            editor={editor}
            {/* FIX: The `value` prop is not available in this version of Slate.
            Using `initialValue` to set the editor's content, and `key` to force
            a re-render when the text is updated programmatically, which mimics
            the behavior of a controlled component. */}
            initialValue={textState}
            key={text}
            onChange={(value) => {
                const isAstChange = editor.operations.some(op => 'set_selection' !== op.type);
                if (isAstChange) {
                    setTextState(value);
                }
                if (editor.operations.some(op => op.type === 'set_selection')) {
                    handleSelectionChange();
                }
            }}
        >
            <Editable
                decorate={decorate}
                renderLeaf={props => <Leaf {...props} />}
                placeholder="Once upon a time..."
                className="prose prose-invert focus:outline-none"
                onMouseLeave={() => setHighlightedActionsSegment(null, null)}
            />
        </Slate>
        {isLoading && <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div></div>}
    </div>
  );
}