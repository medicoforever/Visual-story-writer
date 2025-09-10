
import { type Node, type Edge } from '@xyflow/react';
import { type Descendant } from 'slate';

export interface EntityProperty {
  name: string;
  value: number;
}

export interface Entity {
  name: string;
  emoji: string;
  properties: EntityProperty[];
}

export interface Location {
  name: string;
  emoji: string;
}

export interface Action {
  name: string;
  source: string;
  target: string;
  location: string;
  passage: string;
}

export type EntityNodeData = Entity;
export type LocationNodeData = Location;

export type EntityNode = Node<EntityNodeData, 'entityNode'>;
export type LocationNode = Node<LocationNodeData, 'locationNode'>;

export interface ActionEdgeData {
  name:string;
  passage: string;
  sourceLocation: string;
  targetLocation: string;
}

export type ActionEdge = Edge<ActionEdgeData>;

export interface AppState {
  textState: Descendant[];
  text: string;
  entityNodes: EntityNode[];
  locationNodes: LocationNode[];
  actionEdges: ActionEdge[];

  isLoading: boolean;
  isStale: boolean;

  selectedTab: 'entities' | 'locations';
  selectedNodes: string[];
  selectedEdges: string[];
  
  highlightedActionsSegment: { start: number; end: number } | null;
  filteredActionsSegment: { start: number; end: number } | null;
  
  actions: {
    reset: () => void;
    loadSample: (sample: SampleStory) => void;
    setTextState: (newState: Descendant[], fromAI?: boolean) => void;
    setVisuals: (visuals: { entities: Entity[]; locations: Location[]; actions: Action[] }) => void;
    refreshVisualsFromText: () => Promise<void>;
    rewriteFromVisuals: () => Promise<void>;
    setEntityNodes: (nodes: EntityNode[] | ((prev: EntityNode[]) => EntityNode[])) => void;
    setLocationNodes: (nodes: LocationNode[] | ((prev: LocationNode[]) => LocationNode[])) => void;
    setActionEdges: (edges: ActionEdge[] | ((prev: ActionEdge[]) => ActionEdge[])) => void;
    
    setSelectedTab: (tab: 'entities' | 'locations') => void;
    setSelectedNodes: (nodes: string[]) => void;
    setSelectedEdges: (edges: string[]) => void;

    setHighlightedActionsSegment: (start: number | null, end: number | null) => void;
    setFilteredActionsSegment: (start: number | null, end: number | null) => void;
  };
}

export interface SampleStory {
    text: string;
    entities: Entity[];
    locations: Location[];
    actions: Action[];
}
