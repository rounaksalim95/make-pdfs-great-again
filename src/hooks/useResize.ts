import { useState, useCallback, useEffect } from 'react';
import { MIN_TABLE_WIDTH, MIN_TABLE_HEIGHT } from '../lib/constants';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type Size = { width: number; height: number };
type Position = { x: number; y: number };

interface UseResizeProps {
  initialSize: Size;
  initialPosition: Position;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onResize?: (size: Size, position: Position) => void;
}

export function useResize({
  initialSize,
  initialPosition,
  minWidth = MIN_TABLE_WIDTH,
  minHeight = MIN_TABLE_HEIGHT,
  maxWidth,
  maxHeight,
  onResize,
}: UseResizeProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [activeCorner, setActiveCorner] = useState<Corner | null>(null);
  const [startPosition, setStartPosition] = useState<Position | null>(null);
  const [startSize, setStartSize] = useState<Size | null>(null);
  const [startTablePosition, setStartTablePosition] = useState<Position | null>(null);

  const handleResizeStart = useCallback((corner: Corner, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setActiveCorner(corner);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setStartSize(initialSize);
    setStartTablePosition(initialPosition);
  }, [initialSize, initialPosition]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !startPosition || !startSize || !activeCorner || !startTablePosition) return;

    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;

    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newX = startTablePosition.x;
    let newY = startTablePosition.y;

    // Calculate new dimensions based on which corner is being dragged
    switch (activeCorner) {
      case 'top-left': {
        // For top-left, the bottom-right corner is fixed
        const proposedWidth = Math.max(minWidth, startSize.width - deltaX);
        const proposedHeight = Math.max(minHeight, startSize.height - deltaY);
        
        // Calculate new position based on size changes
        const widthDiff = startSize.width - proposedWidth;
        const heightDiff = startSize.height - proposedHeight;
        
        newWidth = proposedWidth;
        newHeight = proposedHeight;
        newX = startTablePosition.x + widthDiff;
        newY = startTablePosition.y + heightDiff;
        break;
      }
      case 'top-right': {
        // For top-right, the bottom-left corner is fixed
        const proposedWidth = Math.max(minWidth, startSize.width + deltaX);
        const proposedHeight = Math.max(minHeight, startSize.height - deltaY);
        
        // Only Y position changes
        const heightDiff = startSize.height - proposedHeight;
        
        newWidth = proposedWidth;
        newHeight = proposedHeight;
        newY = startTablePosition.y + heightDiff;
        break;
      }
      case 'bottom-left': {
        // For bottom-left, the top-right corner is fixed
        const proposedWidth = Math.max(minWidth, startSize.width - deltaX);
        const proposedHeight = Math.max(minHeight, startSize.height + deltaY);
        
        // Only X position changes
        const widthDiff = startSize.width - proposedWidth;
        
        newWidth = proposedWidth;
        newHeight = proposedHeight;
        newX = startTablePosition.x + widthDiff;
        break;
      }
      case 'bottom-right': {
        // For bottom-right, the top-left corner is fixed
        newWidth = Math.max(minWidth, startSize.width + deltaX);
        newHeight = Math.max(minHeight, startSize.height + deltaY);
        break;
      }
    }

    // Apply maximum constraints if specified
    if (maxWidth) {
      if (activeCorner.includes('right')) {
        newWidth = Math.min(newWidth, maxWidth);
      } else {
        const maxX = startTablePosition.x + startSize.width - maxWidth;
        if (newX < maxX) {
          newX = maxX;
          newWidth = maxWidth;
        }
      }
    }

    if (maxHeight) {
      if (activeCorner.includes('bottom')) {
        newHeight = Math.min(newHeight, maxHeight);
      } else {
        const maxY = startTablePosition.y + startSize.height - maxHeight;
        if (newY < maxY) {
          newY = maxY;
          newHeight = maxHeight;
        }
      }
    }

    if (onResize) {
      onResize(
        { width: newWidth, height: newHeight },
        { x: newX, y: newY }
      );
    }
  }, [isResizing, startPosition, startSize, activeCorner, startTablePosition, minWidth, minHeight, maxWidth, maxHeight, onResize]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setActiveCorner(null);
    setStartPosition(null);
    setStartSize(null);
    setStartTablePosition(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);

      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return {
    handleResizeStart,
    isResizing,
    activeCorner,
  };
} 