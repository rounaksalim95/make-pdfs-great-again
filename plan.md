# Overview

The goal of this project is to create a proof of concept for a web application that allows users to drag and drop tables in a canvas. The user gets to work with a page and the left panel of the web app shows the list of all pages similar to how Preview shows the list of pages for a PDF.

The user can create new pages and add tables to these new pages. Each page is an empty canvas of letter size that the user can drag and drop tables on.

# Requirements

- [x] The user can create new pages
- [x] The user can delete pages
- [ ] The app has its own simple pixel based layout system
- [ ] The user can drag and drop tables on a page
- [ ] The user can resize tables
- [ ] The user can delete tables
- [ ] The user can move tables around the page
- [ ] The user can have multiple tables on a page
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

## In Progress
1. Implementing drag and drop system for tables
2. Table management system (create/delete/resize)

## Next Steps
1. Implement table drag and drop functionality using DND Kit
2. Add table resizing capabilities
3. Create table deletion feature
4. Implement table movement within pages
