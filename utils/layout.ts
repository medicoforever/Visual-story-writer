import { type Node } from '@xyflow/react';
import {
  forceSimulation,
  forceManyBody,
  forceX,
  forceY,
  forceCollide,
  type Simulation,
  type SimulationNodeDatum,
} from 'd3-force';

const simulations: Record<string, Simulation<SimulationNodeDatum, undefined>> = {};
let animationFrameId: number | null = null;

export const stopLayout = (name: string) => {
  if (simulations[name]) {
    simulations[name].stop();
    delete simulations[name];
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

export const stopAllLayouts = () => {
    Object.keys(simulations).forEach(stopLayout);
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

export const runLayout = <T extends Record<string, unknown>,>(
  name: string,
  flowNodes: Node<T>[],
  setNodes: (nodes: Node<T>[]) => void,
  center: { x: number; y: number },
  nodeRadius: number
) => {
    stopLayout(name);

    if (flowNodes.length === 0) return;

    // Create a copy for the simulation
    const simulationNodes = flowNodes.map(node => ({
        ...node,
        x: node.position.x,
        y: node.position.y,
    }));

    const simulation = forceSimulation(simulationNodes)
        .force('repel', forceManyBody().strength(-1000))
        .force('x', forceX(center.x).strength(0.1))
        .force('y', forceY(center.y).strength(0.1))
        .force('collide', forceCollide(nodeRadius))
        .stop();

    // Run the simulation to completion to get the final positions
    simulation.tick(300);
    
    const finalPositions = simulationNodes.map(n => ({ x: n.x, y: n.y }));

    const transitionDuration = 750; // ms
    const startTime = Date.now();

    const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / transitionDuration, 1);

        // Ease in-out function for smoother animation
        const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);

        const newNodes = flowNodes.map((node, index) => {
            const startPos = node.position;
            const endPos = finalPositions[index];
            return {
                ...node,
                position: {
                    x: startPos.x + (endPos.x - startPos.x) * easedProgress,
                    y: startPos.y + (endPos.y - startPos.y) * easedProgress,
                },
            };
        });
        
        setNodes(newNodes);

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            animationFrameId = null;
            // Ensure final positions are set exactly
            const finalNodes = flowNodes.map((node, index) => ({
                ...node,
                position: finalPositions[index],
            }));
            setNodes(finalNodes);
        }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    simulations[name] = simulation;
};
