import { create } from 'zustand';
import { type Node, type Edge, MarkerType } from '@xyflow/react';
import { type Descendant, Node as SlateNode } from 'slate';
import { type AppState, type SampleStory, type EntityNode, type LocationNode, type ActionEdge, type Entity, type Action, type Location } from '../types';
import { extractVisualsFromText, rewriteStoryFromVisuals } from '../services/geminiService';

const getInitialState = () => ({
  textState: [{ type: 'paragraph', children: [{ text: '' }] }] as Descendant[],
  text: '',
  entityNodes: [] as EntityNode[],
  locationNodes: [] as LocationNode[],
  actionEdges: [] as ActionEdge[],
  isLoading: false,
  isStale: false,
  selectedTab: 'entities' as 'entities' | 'locations',
  selectedNodes: [] as string[],
  selectedEdges: [] as string[],
  highlightedActionsSegment: null,
  filteredActionsSegment: null,
});

export const useAppStore = create<AppState>((set, get) => ({
  ...getInitialState(),
  
  actions: {
    reset: () => set(getInitialState()),
    
    loadSample: (sample: SampleStory) => {
      const textState: Descendant[] = [{ type: 'paragraph', children: [{ text: sample.text }] }];
      set({
        ...getInitialState(),
        textState,
        text: sample.text,
      });
      get().actions.setVisuals(sample);
    },

    setTextState: (newState, fromAI = false) => {
      const newText = newState.map(n => SlateNode.string(n)).join('\n');
      set(state => {
        const textChanged = state.text !== newText;
        return {
          textState: newState,
          text: newText,
          isStale: textChanged && !fromAI,
        };
      });
    },

    setVisuals: ({ entities, locations, actions }) => {
      const entityNodes: EntityNode[] = entities.map((entity, i) => ({
        id: `entity-${entity.name}`,
        type: 'entityNode',
        dragHandle: '.drag-handle',
        position: { x: 100 + (i % 3) * 250, y: 100 + Math.floor(i / 3) * 200 },
        data: entity,
      }));

      const locationNodes: LocationNode[] = locations.map((loc, i) => ({
        id: `location-${loc.name}`,
        type: 'locationNode',
        dragHandle: '.drag-handle',
        position: { x: 150 + (i % 4) * 200, y: 150 + Math.floor(i / 4) * 200 },
        data: loc,
      }));
      
      const entityNameSet = new Set(entities.map(e => e.name));
      const validActions = actions.filter(a => entityNameSet.has(a.source) && entityNameSet.has(a.target));

      const actionEdges: ActionEdge[] = validActions.map((action, i) => ({
        id: `action-${i}-${action.source}-${action.target}`,
        type: 'actionEdge',
        source: `entity-${action.source}`,
        target: `entity-${action.target}`,
        label: action.name,
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
        data: {
          name: action.name,
          passage: action.passage,
          sourceLocation: action.location,
          targetLocation: action.location,
        },
      }));
      
      set({ entityNodes, locationNodes, actionEdges, isStale: false, isLoading: false });
    },

    refreshVisualsFromText: async () => {
      set({ isLoading: true });
      const text = get().text;
      if (!text.trim()) {
        set({ entityNodes: [], locationNodes: [], actionEdges: [], isLoading: false, isStale: false });
        return;
      }
      const visuals = await extractVisualsFromText(text);
      get().actions.setVisuals(visuals);
    },

    rewriteFromVisuals: async () => {
        set({ isLoading: true });
        const { entityNodes, actionEdges } = get();
        
        const entities: Entity[] = entityNodes.map(n => n.data);
        const actions: Action[] = actionEdges.map(e => ({
            name: e.data?.name ?? '',
            source: get().entityNodes.find(n => n.id === e.source)?.data.name ?? '',
            target: get().entityNodes.find(n => n.id === e.target)?.data.name ?? '',
            location: e.data?.sourceLocation ?? 'unknown',
            passage: e.data?.passage ?? ''
        }));
        
        const newText = await rewriteStoryFromVisuals(entities, actions);
        const newTextState: Descendant[] = [{ type: 'paragraph', children: [{ text: newText }] }];
        get().actions.setTextState(newTextState, true);
        set({ isLoading: false, isStale: false });
    },
    
    // FIX: Ensure dragging nodes marks the state as stale
    setEntityNodes: (nodes) => set(state => ({ entityNodes: typeof nodes === 'function' ? nodes(state.entityNodes) : nodes, isStale: true })),
    // FIX: Ensure dragging nodes marks the state as stale
    setLocationNodes: (nodes) => set(state => ({ locationNodes: typeof nodes === 'function' ? nodes(state.locationNodes) : nodes, isStale: true })),
    setActionEdges: (edges) => set(state => ({ actionEdges: typeof edges === 'function' ? edges(state.actionEdges) : edges, isStale: true })),

    setSelectedTab: (tab) => set({ selectedTab: tab }),
    setSelectedNodes: (nodes) => set({ selectedNodes: nodes }),
    setSelectedEdges: (edges) => set({ selectedEdges: edges }),

    setHighlightedActionsSegment: (start, end) => {
        if (start === null || end === null) {
            set({ highlightedActionsSegment: null });
        } else {
            set({ highlightedActionsSegment: { start, end } });
        }
    },
    setFilteredActionsSegment: (start, end) => {
        if (start === null || end === null) {
            set({ filteredActionsSegment: null });
        } else {
            set({ filteredActionsSegment: { start, end } });
        }
    },
  },
}));

export const useAppActions = () => useAppStore((state) => state.actions);