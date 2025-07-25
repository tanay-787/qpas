# QPAS Future Implementation Plan

This document outlines the plan for implementing new features requested based on user feedback and potential enhancements.

---

## 1. Student Favorite Feature

**Goal:** Allow students to mark question papers as favorites and view their favorited papers.

### Frontend Tasks:
- **UI Integration:** Add a clickable "star" icon (filled/outlined state) to question paper cards/list items in the student dashboard.
- **State Management:** Implement local state to track the favorite status of papers. This state should be initialized based on data from the backend.
- **Interaction Logic:** Add an `onClick` handler to the star icon to toggle the favorite status. This should trigger an optimistic UI update and call a backend API.
- **Fetching Favorite Status:** Modify the frontend logic that fetches question papers for the student dashboard to include whether each paper is favorited by the current user.
- **Favorite List View (Optional but Recommended):**
    - Add a new route or filter option in the student dashboard to display only favorited papers.
    - Create/modify a component to render the list of favorited papers.

### Backend Tasks:
- **Data Model Update:** Update the user data model (e.g., in Firestore or your chosen database) to include a field (e.g., `favoritedPapers: string[]`) to store IDs of favorited question papers for each user.
- **New API Endpoint:** Create a new API endpoint (e.g., `POST /api/users/:userId/favorites` or `PUT /api/question-papers/:qpId/favorite`) to handle adding or removing a question paper ID from a user's favorites list.
- **Backend Logic:** Implement the necessary logic in the backend controller/service to update the database based on favorite/unfavorite requests, ensuring proper user authentication and authorization.
- **Modify Fetch Endpoint:** Update the existing endpoint for fetching question papers (`GET /api/question-papers/:institutionId`) to query the user's favorites and include a boolean flag (e.g., `isFavorited: boolean`) for each paper in the response.

---

## 2. Advanced Search & Filtering

**Goal:** Enhance the ability to search and filter question papers with more criteria and potentially more complex queries.

### Frontend Tasks:
- **Expand Filter UI:** Add new form controls (inputs, selects, date pickers) to the filter bar (Sheet/Popover) for additional filter criteria (e.g., date ranges, specific metadata).
- **Enhance Search Input (Related to Feature 4):** If implementing custom search syntax, modify the search input component.
- **State Management:** Update frontend state to hold values for new advanced filters and the advanced search query.
- **API Request Update:** Modify the API call to fetch question papers to pass the new filter and search parameters to the backend.

### Backend Tasks:
- **Modify Fetch Endpoint:** Update the backend endpoint for fetching question papers (`GET /api/question-papers/:institutionId`).
- **Advanced Filtering Logic:** Implement backend logic to process the new filter parameters and construct database queries that apply these filters.
- **Advanced Search Logic:** Implement backend logic to parse and interpret the advanced search query string (if a custom syntax is used) and integrate it into the database or search index query.
- **Indexing (Potential Future Step):** Consider implementing or leveraging a database search index for efficient full-text and complex faceted search.

---

## 3. Access & Distribution

**Goal:** Provide more granular control over who can access specific question papers and implement distribution mechanisms.

### Frontend Tasks:
- **Access Management UI:** Create UI components (e.g., modals, forms) in Admin/Teacher dashboards to manage access control lists for question papers (add/remove users, roles, groups).
- **Display Access Details:** Update question paper views to show detailed access settings.
- **Distribution UI (If applicable):** Add UI elements (e.g., buttons, workflows) to trigger distribution actions like assigning papers to classes or individual students.
- **Permission Checks:** Implement frontend logic to conditionally display access management/distribution UI based on user roles and permissions.

### Backend Tasks:
- **Data Model Update:** Modify the question paper data model to store detailed access permissions (e.g., lists of authorized user/role/group IDs, explicit access types).
- **Enforce Access Control:** Crucially, update the backend endpoint for fetching question papers to strictly filter results based on the requesting user's permissions.
- **New API Endpoints:** Create backend API endpoints for managing question paper access (`PUT /api/question-papers/:qpId/access`).
- **Backend Logic for Distribution (If applicable):** Implement backend logic to process distribution requests, potentially updating user records or triggering notifications.

---

## 4. "Search Like a Pro" (Github-like search)

**Goal:** Provide a powerful search experience with a custom syntax for querying question papers.

### Frontend Tasks:
- **Custom Search Input Component:** Implement or integrate a search input that can handle and potentially provide visual cues for the custom search syntax.
- **Query Formatting:** Ensure the frontend sends the search query to the backend in a consistent format.

### Backend Tasks:
- **Query Parsing:** Implement robust backend logic to parse the custom search syntax string, identifying operators (e.g., `subject:`, `year:`) and terms.
- **Integrate with Search/DB:** Translate the parsed query into a format that your database or search index can execute effectively. This is closely linked to the Advanced Search Backend tasks.

---

## 5. Keyboard Shortcuts

**Goal:** Improve user efficiency by allowing common actions to be performed via keyboard shortcuts.

### Frontend Tasks:
- **Identify Shortcuts:** Determine key actions that would benefit from shortcuts.
- **Choose Key Combinations:** Select appropriate and non-conflicting key combinations.
- **Implement Listeners:** Use a library or native browser APIs to listen for keyboard events globally or within specific components.
- **Map Shortcuts to Actions:** Connect detected key combinations to corresponding frontend functions (e.g., opening search, favoriting a paper).
- **Documentation:** Add a visible list of keyboard shortcuts within the application UI (e.g., in a help modal or a dedicated page).

### Backend Tasks:
- No backend changes are required for this feature, as it is purely a frontend interaction.
