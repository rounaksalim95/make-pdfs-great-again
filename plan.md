# Overview

The goal of this project is to create a proof of concept for a web application that allows users to drag and drop tables in a canvas. The user gets to work with a page and the left panel of the web app shows the list of all pages similar to how Preview shows the list of pages for a PDF.

The user can create new pages and add tables to these new pages. Each page is an empty canvas of letter size that the user can drag and drop tables on.

# Requirements

- [x] The user can create new pages
- [x] The user can delete pages
- [x] The app has its own simple pixel based layout system
- [x] The user can drag and drop tables on a page
- [x] The user can resize tables
- [ ] The user can delete tables
- [x] The user can move tables around the page
- [x] The user can have multiple tables on a page
- [x] There is no backend so all state can be stored and handled in the client

# Technologies

The following technologies are being used in this project:

- React (with Vite)
- Typescript
- Shadcn UI
- TailwindCSS
- DND Kit for drag and drop functionality

# Implementation Details

## Completed Features
1. Basic project setup with Vite, React, and TypeScript
2. TailwindCSS configuration and basic styling
3. Page management system (create/delete pages)
4. Basic layout with sidebar and main content area
5. Letter-size page canvas setup
6. Table drag and drop with bounds checking
7. Page preview thumbnails in sidebar
8. Pixel-based layout system with proper page dimensions
9. Table resizing functionality:
   - Corner-based resizing with fixed opposite corners
   - Minimum size constraints
   - Maximum size constraints based on page bounds
   - Proper bounds checking to keep tables within the page
   - Smooth resize interactions with proper cursor feedback

## In Progress
1. Implementing table deletion functionality

## Next Steps
1. Add table content/data management
2. Add table styling options
3. Implement undo/redo functionality
4. Additional resize features:
   - Aspect ratio preservation (holding shift)
   - Grid snapping
   - Size indicators during resize
